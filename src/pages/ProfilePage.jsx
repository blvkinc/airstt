import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Briefcase,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Globe2,
  HelpCircle,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Pencil,
  Plus,
  Settings,
  SlidersHorizontal,
  Star,
  User,
} from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'
import { useBooking } from '../shared/context/BookingContext'
import { fetchCustomerBookings } from '../shared/api/customerCheckoutApi'
import { Button } from '../shared/ui/button'
import { Input } from '../shared/ui/input'
import { cn } from '../shared/lib/utils'

const TAB_ALIASES = {
  bookings: 'activity',
  cancellations: 'activity',
  receipts: 'activity',
  rewards: 'profile',
}

const profileTabs = ['profile', 'favorites', 'tell-us', 'activity', 'settings', 'support']

const profileNavItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'tell-us', label: 'Tell Us About You', icon: SlidersHorizontal },
  { id: 'activity', label: 'Activity', icon: CalendarDays },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'support', label: 'Support', icon: HelpCircle },
]

const getProfileNavItem = (id) => profileNavItems.find((item) => item.id === id) || profileNavItems[0]

const locationOptions = ['Palm Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'Dubai Harbour', 'Jumeirah', 'Business Bay']
const eventTypeOptions = ['Brunch', 'Pool Party', 'Ladies Night', 'Fine Dining', 'Beach Club', 'Rooftop']

const normalizeTab = (value) => {
  const mapped = TAB_ALIASES[value] || value || 'profile'
  return profileTabs.includes(mapped) ? mapped : 'profile'
}

const getProfile = (user) => user?.profile || {}

const getDisplayName = (user) => {
  const profile = getProfile(user)
  return [profile.firstName || user?.firstName, profile.lastName || user?.lastName].filter(Boolean).join(' ') || user?.name || 'Guest'
}

const getInitials = (name) => {
  const initials = String(name || 'Guest')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || 'DG'
}

function DetailRow({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-gray-800">{value || '-'}</dd>
    </div>
  )
}

function DesktopNav({ activeTab, onTabChange, onLogout, displayName }) {
  return (
    <aside className="hidden min-h-[calc(100vh-86px)] border-r border-gray-200 bg-white px-4 py-6 md:block">
      <h1 className="mb-4 px-2 text-lg font-extrabold tracking-tight text-gray-950">{displayName}</h1>
      <nav className="space-y-2">
        {profileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold transition',
                isActive ? 'bg-brand-purple/10 text-brand-purple' : 'text-gray-950 hover:bg-gray-50'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.9} />
              {item.label}
            </button>
          )
        })}
        <button
          type="button"
          onClick={onLogout}
          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold text-gray-950 transition hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.9} />
          Log Out
        </button>
      </nav>
    </aside>
  )
}

function ProfileIdentityCard({ user, profileForm, displayName, initials }) {
  return (
    <section className="relative min-h-[calc(100vh-86px)] border-r border-gray-200 bg-white px-6 py-6">
      <button type="button" className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-bold text-brand-purple transition hover:border-gray-950">
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </button>

      <div className="flex flex-col items-center">
        <div className="relative mt-2 flex h-24 w-24 items-center justify-center rounded-full bg-brand-purple/10 text-3xl font-extrabold text-brand-purple">
          {initials}
          <span className="absolute bottom-1 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-950">
            <Pencil className="h-3.5 w-3.5" />
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-gray-950">{displayName}</h2>
      </div>

      <div className="mx-auto mt-7 h-px w-full max-w-[260px] bg-gray-200" />

      <dl className="mx-auto mt-7 max-w-[260px] space-y-4">
        <DetailRow label="First name" value={profileForm.firstName} />
        <DetailRow label="Last name" value={profileForm.lastName} />
        <DetailRow label="Mobile number" value={profileForm.phone || user?.phone} />
        <DetailRow label="Email" value={profileForm.email || user?.email} />
        <DetailRow label="Date of birth" value={profileForm.dateOfBirth} />
        <DetailRow label="Gender" value={profileForm.gender} />
      </dl>
    </section>
  )
}

function AddressCard() {
  const addresses = [
    { label: 'Home', helper: 'Add a home address', icon: Home },
    { label: 'Work', helper: 'Add a work address', icon: Briefcase },
  ]

  return (
    <section className="rounded-lg border border-gray-200 bg-white px-4 py-5 md:px-6 md:py-6">
      <h2 className="text-xl font-extrabold tracking-tight text-gray-950">My addresses</h2>
      <div className="mt-6 space-y-5">
        {addresses.map((address) => {
          const Icon = address.icon
          return (
            <button key={address.label} type="button" className="flex h-20 w-full items-center gap-4 rounded-lg border border-gray-200 px-4 text-left transition hover:border-gray-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
                <Icon className="h-4 w-4 fill-current" />
              </span>
              <span>
                <span className="block text-sm font-bold text-gray-950">{address.label}</span>
                <span className="mt-0.5 block text-xs font-medium text-gray-500">{address.helper}</span>
              </span>
            </button>
          )
        })}
      </div>
      <button type="button" className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-gray-300 px-4 text-sm font-bold text-gray-950 transition hover:border-gray-950">
        <Plus className="h-4 w-4" />
        Add
      </button>
    </section>
  )
}

function FavoritesPanel({ favorites }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white px-4 py-5 md:px-6 md:py-6">
      <h2 className="text-xl font-extrabold tracking-tight text-gray-950">Favorites</h2>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {favorites.map((favorite) => {
          const title = favorite.title || favorite.name || 'Saved item'
          const subtitle = favorite.venue || favorite.location || favorite.category || ''

          return (
          <article key={`${favorite.type || 'favorite'}-${favorite.id}`} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            {favorite.image ? <img src={favorite.image} alt={title} className="h-40 w-full object-cover" /> : <div className="h-40 w-full bg-gray-100" />}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-950">{title}</h3>
                  {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
                </div>
                <Heart className="h-5 w-5 fill-brand-purple text-brand-purple" />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                {favorite.rating ? <span className="flex items-center gap-1 font-semibold text-gray-950"><Star className="h-4 w-4 fill-black" />{favorite.rating}</span> : <span />}
                {favorite.price ? <span className="font-bold text-gray-950">AED {favorite.price}</span> : null}
              </div>
            </div>
          </article>
          )
        })}
      </div>
    </section>
  )
}

function ActivityPanel({ bookings, loading }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white px-4 py-5 md:px-6 md:py-6">
      <h2 className="text-xl font-extrabold tracking-tight text-gray-950">Activity</h2>
      <p className="mt-1 text-sm text-gray-500">Bookings and appointments from your account.</p>

      <div className="mt-6 space-y-4">
        {loading && <div className="text-sm text-gray-500">Loading activity...</div>}
        {!loading && bookings.map((booking) => (
          <article key={booking.id} className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center">
            {booking.image ? <img src={booking.image} alt={booking.event} className="h-28 w-full rounded-[14px] object-cover sm:w-36" /> : <div className="h-28 w-full rounded-[14px] bg-gray-100 sm:w-36" />}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-bold text-gray-950">{booking.event}</h3>
              <p className="mt-1 text-sm text-gray-500">{booking.venue}</p>
              <p className="mt-2 text-sm font-semibold text-gray-700">{booking.date} | {booking.time}</p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
              <div className="text-base font-bold text-gray-950">AED {booking.price}</div>
              <span className="mt-1 inline-flex rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-bold text-brand-purple">{booking.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ChipGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              'inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold transition',
              isSelected ? 'border-brand-purple bg-brand-purple/10 text-brand-purple' : 'border-gray-300 bg-white text-gray-800 hover:border-gray-950'
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function TellUsPanel({ tasteProfile, setTasteProfile }) {
  const toggleMulti = (field, option) => {
    setTasteProfile((current) => {
      const list = current[field]
      return {
        ...current,
        [field]: list.includes(option) ? list.filter((item) => item !== option) : [...list, option],
      }
    })
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white px-4 py-5 md:px-6 md:py-6">
      <h2 className="text-xl font-extrabold tracking-tight text-gray-950">Tell Us About You</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">Capture preference data so Set The Table can suggest better venues, events, and experiences in future.</p>

      <div className="mt-7 grid gap-6">
        <label className="space-y-2">
          <span className="text-sm font-bold text-gray-950">Favourite Restaurant</span>
          <Input value={tasteProfile.restaurant} onChange={(event) => setTasteProfile((current) => ({ ...current, restaurant: event.target.value }))} className="h-11 rounded-lg border-gray-200" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-gray-950">Favourite Beach Club</span>
          <Input value={tasteProfile.beachClub} onChange={(event) => setTasteProfile((current) => ({ ...current, beachClub: event.target.value }))} className="h-11 rounded-lg border-gray-200" />
        </label>
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-950">Favourite Locations</h3>
          <ChipGroup options={locationOptions} selected={tasteProfile.locations} onToggle={(option) => toggleMulti('locations', option)} />
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-950">Types of Events You Like</h3>
          <ChipGroup options={eventTypeOptions} selected={tasteProfile.eventTypes} onToggle={(option) => toggleMulti('eventTypes', option)} />
        </div>
      </div>

      <Button className="mt-7 h-11 px-6">Save preferences</Button>
    </section>
  )
}

function SettingsPanel({ profileForm, updateProfileField, handleSaveProfile, profileSaveLoading }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white px-4 py-5 md:px-6 md:py-6">
      <h2 className="text-xl font-extrabold tracking-tight text-gray-950">Settings</h2>
      <p className="mt-1 text-sm text-gray-500">Update your profile details.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          ['firstName', 'First name'],
          ['lastName', 'Last name'],
          ['phone', 'Mobile number'],
          ['email', 'Email'],
        ].map(([field, label]) => (
          <label key={field} className="space-y-2">
            <span className="text-sm font-bold text-gray-950">{label}</span>
            <Input
              value={profileForm[field] || ''}
              readOnly={field === 'email'}
              onChange={(event) => updateProfileField(field, event.target.value)}
              className={cn('h-11 rounded-lg border-gray-200', field === 'email' && 'cursor-not-allowed bg-gray-50 text-gray-500')}
            />
          </label>
        ))}
      </div>
      <Button onClick={handleSaveProfile} disabled={profileSaveLoading} className="mt-7 h-11 px-6">
        {profileSaveLoading ? 'Saving...' : 'Save changes'}
      </Button>
    </section>
  )
}

function SupportPanel() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white px-4 py-5 md:px-6 md:py-6">
      <h2 className="text-xl font-extrabold tracking-tight text-gray-950">Support</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { title: 'Help centre', text: 'Find answers about bookings, payments, and events.', icon: HelpCircle },
          { title: 'Message support', text: 'Start a support conversation.', icon: MessageCircle },
          { title: 'Language', text: 'English (United Arab Emirates)', icon: Globe2 },
        ].map((item) => {
          const Icon = item.icon
          return (
            <button key={item.title} type="button" className="flex items-center gap-4 rounded-xl border border-gray-200 p-5 text-left transition hover:border-gray-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-bold text-gray-950">{item.title}</span>
                <span className="mt-1 block text-sm text-gray-500">{item.text}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function DesktopContent({ activeTab, favorites, bookings, loading, tasteProfile, setTasteProfile, profileForm, updateProfileField, handleSaveProfile, profileSaveLoading }) {
  if (activeTab === 'favorites') return <FavoritesPanel favorites={favorites} />
  if (activeTab === 'tell-us') return <TellUsPanel tasteProfile={tasteProfile} setTasteProfile={setTasteProfile} />
  if (activeTab === 'activity') return <ActivityPanel bookings={bookings} loading={loading} />
  if (activeTab === 'settings') {
    return (
      <SettingsPanel
        profileForm={profileForm}
        updateProfileField={updateProfileField}
        handleSaveProfile={handleSaveProfile}
        profileSaveLoading={profileSaveLoading}
      />
    )
  }
  if (activeTab === 'support') return <SupportPanel />
  return <AddressCard />
}

function MobileActionCard({ children }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      {children}
    </div>
  )
}

function MobileMenuButton({ item, activeTab, onTabChange }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={() => onTabChange(item.id, { forceTabParam: true })}
      className={cn(
        'flex h-12 w-full items-center justify-between px-4 text-left text-sm font-bold text-gray-950',
        activeTab === item.id && 'bg-brand-purple/10 text-brand-purple'
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        {item.label}
      </span>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </button>
  )
}

function MobileProfile({
  activeTab,
  detailOpen,
  onTabChange,
  onBack,
  onLogout,
  displayName,
  initials,
  favorites,
  bookings,
  loading,
  dataError,
  saveError,
  saveSuccess,
  tasteProfile,
  setTasteProfile,
  profileForm,
  updateProfileField,
  handleSaveProfile,
  profileSaveLoading,
}) {
  if (detailOpen) {
    return (
      <MobileDetailScreen
        activeTab={activeTab}
        onBack={onBack}
        favorites={favorites}
        bookings={bookings}
        loading={loading}
        dataError={dataError}
        saveError={saveError}
        saveSuccess={saveSuccess}
        tasteProfile={tasteProfile}
        setTasteProfile={setTasteProfile}
        profileForm={profileForm}
        updateProfileField={updateProfileField}
        handleSaveProfile={handleSaveProfile}
        profileSaveLoading={profileSaveLoading}
      />
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-[390px] bg-gray-50 px-4 pb-28 pt-5 md:hidden">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-950">{displayName}</h1>
          <p className="mt-1 text-xs font-medium text-gray-500">Personal profile</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple text-xl font-bold text-white">
          {initials.slice(0, 1)}
        </div>
      </header>

      <section className="mt-5 rounded-lg gradient-brand p-5 text-white shadow-[0_10px_24px_rgba(171,131,187,0.30)]">
        <p className="text-xs text-white/80">Wallet balance</p>
        <h2 className="mt-1 text-2xl font-bold">AED 0.00</h2>
        <button type="button" className="mt-4 rounded-full border border-white/70 px-4 py-2 text-xs font-bold text-white">
          View wallet
        </button>
      </section>

      <div className="mt-4 space-y-3">
        <MobileActionCard>
          <div className="divide-y divide-gray-100">
            {profileNavItems.map((item) => <MobileMenuButton key={item.id} item={item} activeTab={activeTab} onTabChange={onTabChange} />)}
          </div>
        </MobileActionCard>

        <MobileActionCard>
          <button type="button" className="flex h-12 w-full items-center gap-3 px-4 text-left text-sm font-bold text-gray-950">
            <Globe2 className="h-4 w-4" />
            English (United Arab Emirates)
          </button>
        </MobileActionCard>

        <MobileActionCard>
          <button type="button" onClick={onLogout} className="flex h-12 w-full items-center gap-3 px-4 text-left text-sm font-bold text-gray-950">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </MobileActionCard>
      </div>
    </div>
  )
}

function MobileDetailScreen({ activeTab, onBack, dataError, saveError, saveSuccess, ...props }) {
  const item = getProfileNavItem(activeTab)
  const Icon = item.icon

  return (
    <div className="mx-auto min-h-screen max-w-[390px] bg-gray-50 px-4 pb-28 pt-4 md:hidden">
      <header className="sticky top-0 z-20 -mx-4 flex h-14 items-center gap-3 border-b border-gray-100 bg-white/95 px-4 backdrop-blur">
        <button type="button" onClick={onBack} aria-label="Back to profile menu" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-800">
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
          <Icon className="h-4 w-4" strokeWidth={1.9} />
        </span>
        <h1 className="min-w-0 flex-1 truncate text-base font-extrabold tracking-tight text-gray-950">{item.label}</h1>
      </header>

      <main className="pt-4">
        {dataError && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{dataError}</div>}
        {saveError && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</div>}
        {saveSuccess && <div className="mb-4 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">{saveSuccess}</div>}
        <MobileDetailSection activeTab={activeTab} {...props} />
      </main>
    </div>
  )
}

function MobileDetailSection(props) {
  const { activeTab } = props

  if (activeTab === 'profile') {
    return (
      <MobileActionCard>
        <dl className="space-y-4 p-4">
          <DetailRow label="First name" value={props.profileForm.firstName} />
          <DetailRow label="Last name" value={props.profileForm.lastName} />
          <DetailRow label="Mobile number" value={props.profileForm.phone} />
          <DetailRow label="Email" value={props.profileForm.email} />
        </dl>
      </MobileActionCard>
    )
  }

  if (activeTab === 'favorites') return <FavoritesPanel favorites={props.favorites} />
  if (activeTab === 'tell-us') return <TellUsPanel tasteProfile={props.tasteProfile} setTasteProfile={props.setTasteProfile} />
  if (activeTab === 'activity') return <ActivityPanel bookings={props.bookings} loading={props.loading} />
  if (activeTab === 'settings') return <SettingsPanel {...props} />
  if (activeTab === 'support') return <SupportPanel />
  return null
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, updateUser, logout } = useAuth()
  const { favorites } = useBooking()
  const [activeTab, setActiveTab] = useState(() => normalizeTab(searchParams.get('tab')))
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    residenceCity: '',
    residenceArea: '',
    dateOfBirth: '',
    gender: '',
  })
  const [tasteProfile, setTasteProfile] = useState({
    restaurant: 'Bohemia Beach Club',
    beachClub: 'BeBeach Dubai',
    locations: ['Palm Jumeirah', 'Dubai Marina'],
    eventTypes: ['Brunch', 'Pool Party'],
  })
  const [saveState, setSaveState] = useState({ loading: false, error: '', success: '' })

  useEffect(() => {
    const nextTab = normalizeTab(searchParams.get('tab'))
    if (nextTab !== activeTab) setActiveTab(nextTab)
  }, [activeTab, searchParams])

  useEffect(() => {
    if (!user) return

    const profile = getProfile(user)
    const nameParts = String(user.name || '').split(' ')

    setProfileForm({
      firstName: profile.firstName || user.firstName || nameParts[0] || '',
      lastName: profile.lastName || user.lastName || nameParts.slice(1).join(' ') || '',
      email: profile.email || user.email || '',
      phone: profile.phone || user.phone || '',
      residenceCity: profile.residenceCity || '',
      residenceArea: profile.residenceArea || '',
      dateOfBirth: profile.dateOfBirth || '',
      gender: profile.gender || '',
    })
  }, [user])

  useEffect(() => {
    let ignore = false
    setLoading(true)

    fetchCustomerBookings()
      .then((nextBookings) => {
        if (!ignore) {
          setBookings(nextBookings)
          setDataError('')
        }
      })
      .catch((error) => {
        if (!ignore) setDataError(error?.message || 'Unable to load activity right now.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const displayName = getDisplayName(user)
  const initials = getInitials(displayName)
  const hydratedFavorites = useMemo(() => favorites || [], [favorites])

  const updateProfileField = (field, value) => {
    setProfileForm((current) => ({ ...current, [field]: value }))
  }

  const mobileDetailOpen = searchParams.has('tab')

  const handleTabChange = (value, options = {}) => {
    const nextTab = normalizeTab(value)
    setActiveTab(nextTab)

    const nextParams = new URLSearchParams(searchParams)
    if (nextTab === 'profile' && !options.forceTabParam) {
      nextParams.delete('tab')
    } else {
      nextParams.set('tab', nextTab)
    }
    setSearchParams(nextParams)
  }

  const handleMobileBack = () => {
    setActiveTab('profile')
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('tab')
    setSearchParams(nextParams)
  }

  const handleSaveProfile = async () => {
    setSaveState({ loading: true, error: '', success: '' })

    try {
      await updateUser({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
      })
      setSaveState({ loading: false, error: '', success: 'Profile updated successfully.' })
    } catch (error) {
      setSaveState({ loading: false, error: error?.message || 'Unable to save your profile right now.', success: '' })
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 md:pt-[86px]">
      <MobileProfile
        activeTab={activeTab}
        detailOpen={mobileDetailOpen}
        onTabChange={handleTabChange}
        onBack={handleMobileBack}
        onLogout={handleLogout}
        displayName={displayName}
        initials={initials}
        favorites={hydratedFavorites}
        bookings={bookings}
        loading={loading}
        dataError={dataError}
        saveError={saveState.error}
        saveSuccess={saveState.success}
        tasteProfile={tasteProfile}
        setTasteProfile={setTasteProfile}
        profileForm={profileForm}
        updateProfileField={updateProfileField}
        handleSaveProfile={handleSaveProfile}
        profileSaveLoading={saveState.loading}
      />

      <div className="mx-auto hidden max-w-[1360px] grid-cols-[240px_320px_minmax(0,1fr)] md:grid">
        <DesktopNav activeTab={activeTab} onTabChange={handleTabChange} onLogout={handleLogout} displayName={displayName} />
        <ProfileIdentityCard user={user} profileForm={profileForm} displayName={displayName} initials={initials} />
        <main className="min-h-[calc(100vh-86px)] px-6 py-6">
          {dataError && <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{dataError}</div>}
          {saveState.error && <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{saveState.error}</div>}
          {saveState.success && <div className="mb-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">{saveState.success}</div>}
          <DesktopContent
            activeTab={activeTab}
            favorites={hydratedFavorites}
            bookings={bookings}
            loading={loading}
            tasteProfile={tasteProfile}
            setTasteProfile={setTasteProfile}
            profileForm={profileForm}
            updateProfileField={updateProfileField}
            handleSaveProfile={handleSaveProfile}
            profileSaveLoading={saveState.loading}
          />
        </main>
      </div>
    </div>
  )
}

export default ProfilePage

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../shared/context/AuthContext'
import { useBooking } from '../shared/context/BookingContext'
import { fetchCustomerBookings, fetchCustomerOrders } from '../shared/api/customerCheckoutApi'
import {
  BookingsSection,
  CancellationSection,
  FavoritesSection,
  ProfileHeader,
  ProfileTabsNav,
  ReceiptsSection,
  RewardsSection,
  SettingsSection
} from '../features/profile/ProfileSections'
import { initialCancelRequests, profileRewardHistory } from '../features/profile/profileFixtures'
import { Tabs, TabsContent } from '../shared/ui/tabs'

const allowedTabs = ['bookings', 'favorites', 'rewards', 'receipts', 'cancellations', 'settings']

const isProfileIncomplete = (user) => {
  const profile = user?.profile || {}

  return !profile.firstName?.trim() || !profile.lastName?.trim() || !profile.phone?.trim()
}

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const shouldPromptProfileCompletion = searchParams.get('completeProfile') === '1'
  const initialTab = allowedTabs.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'bookings'
  const [activeTab, setActiveTab] = useState(initialTab)
  const { user, isAuthenticated, updateUser } = useAuth()
  const { favorites } = useBooking()
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    residenceCity: '',
    residenceArea: ''
  })
  const [cancelForm, setCancelForm] = useState({
    bookingId: '',
    reason: '',
    notes: ''
  })
  const [cancelRequests, setCancelRequests] = useState(initialCancelRequests)
  const [saveState, setSaveState] = useState({ loading: false, error: '', success: '' })

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (allowedTabs.includes(tab) && tab !== activeTab) {
      setActiveTab(tab)
    }
    if (!tab && activeTab !== 'bookings') {
      setActiveTab('bookings')
    }
  }, [activeTab, searchParams])

  useEffect(() => {
    if (!user) return

    const profile = user.profile || {}
    const nameParts = String(user.name || '').split(' ')

    setProfileForm({
      firstName: profile.firstName || nameParts[0] || '',
      lastName: profile.lastName || nameParts.slice(1).join(' ') || '',
      email: profile.email || user.email || '',
      phone: profile.phone || user.phone || '',
      residenceCity: profile.residenceCity || '',
      residenceArea: profile.residenceArea || ''
    })
  }, [user])

  useEffect(() => {
    if (!isAuthenticated) return

    const controller = new AbortController()

    const loadProfileData = async () => {
      setLoading(true)

      try {
        const [nextBookings, nextOrders] = await Promise.all([
          fetchCustomerBookings({ signal: controller.signal }),
          fetchCustomerOrders({ signal: controller.signal })
        ])

        setBookings(nextBookings)
        setOrders(nextOrders)
        setDataError('')
      } catch (error) {
        if (error?.name === 'AbortError') return
        setDataError(error?.message || 'Unable to load your bookings right now.')
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()

    return () => controller.abort()
  }, [isAuthenticated])

  const receiptRows = useMemo(
    () => bookings
      .filter((booking) => booking.receiptArtifact)
      .map((booking) => ({
        id: booking.receiptArtifact.file_name || booking.bookingReference || booking.id,
        event: booking.event,
        date: booking.date,
        amount: booking.price,
        status: booking.status,
        downloadUrl: booking.receiptArtifact.download_url,
      })),
    [bookings]
  )

  const hydratedUser = useMemo(() => ({
    ...user,
    totalBookings: bookings.length,
    favoriteVenues: favorites.length,
  }), [bookings.length, favorites.length, user])
  const showProfileCompletionPrompt = isAuthenticated && isProfileIncomplete(user) && (shouldPromptProfileCompletion || activeTab === 'settings')

  const updateProfileField = (field, value) => {
    setProfileForm((current) => ({ ...current, [field]: value }))
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

  const handleCancellationSubmit = (event) => {
    event.preventDefault()
    if (!cancelForm.bookingId || !cancelForm.reason) return

    const booking = bookings.find((item) => String(item.id) === String(cancelForm.bookingId))
    const newRequest = {
      id: `CR-${Math.floor(1000 + Math.random() * 9000)}`,
      event: booking?.event || 'Booking',
      date: booking?.date || 'TBD',
      status: 'Pending Review',
      requestedAt: new Date().toISOString().slice(0, 10)
    }

    setCancelRequests((current) => [newRequest, ...current])
    setCancelForm({ bookingId: '', reason: '', notes: '' })
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'bookings') {
      nextParams.delete('tab')
    } else {
      nextParams.set('tab', value)
    }
    setSearchParams(nextParams)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple/5 via-white to-brand-blue/5">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-purple/5 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 pt-32 pb-12">
        <ProfileHeader user={hydratedUser} />

        {showProfileCompletionPrompt && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
            <div className="font-semibold">Complete your profile</div>
            <div className="mt-1">
              Add your first name, last name, and phone number in Settings so your account details are ready for bookings and support.
            </div>
          </div>
        )}
        {dataError && <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{dataError}</div>}
        {saveState.error && <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{saveState.error}</div>}
        {saveState.success && <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">{saveState.success}</div>}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <ProfileTabsNav />

          <TabsContent value="bookings" className="mt-8">
            {loading ? <div className="text-gray-600">Loading bookings...</div> : <BookingsSection bookings={bookings} />}
          </TabsContent>

          <TabsContent value="favorites" className="mt-8">
            <FavoritesSection favorites={favorites} />
          </TabsContent>

          <TabsContent value="rewards" className="mt-8">
            <RewardsSection user={hydratedUser} rewardHistory={profileRewardHistory} />
          </TabsContent>

          <TabsContent value="receipts" className="mt-8">
            {loading ? <div className="text-gray-600">Loading receipts...</div> : <ReceiptsSection receipts={receiptRows} orders={orders} />}
          </TabsContent>

          <TabsContent value="cancellations" className="mt-8">
            <CancellationSection
              bookings={bookings}
              cancelForm={cancelForm}
              setCancelForm={setCancelForm}
              handleCancellationSubmit={handleCancellationSubmit}
              cancelRequests={cancelRequests}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
            <SettingsSection
              profileForm={profileForm}
              updateProfileField={updateProfileField}
              handleSaveProfile={handleSaveProfile}
              profileSaveLoading={saveState.loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProfilePage

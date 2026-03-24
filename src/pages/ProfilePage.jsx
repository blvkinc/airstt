import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { User, Calendar, Heart, Gift, Star, Clock, Settings, Crown, MapPin, Sparkles, Mail, FileText, XCircle } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Input } from '../shared/ui/input'
import { Textarea } from '../shared/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../shared/ui/card'
import { Badge } from '../shared/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select'
import { useAuth } from '../shared/context/AuthContext'
import { useBooking } from '../shared/context/BookingContext'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('bookings')
  const { user, isAuthenticated, updateUser } = useAuth()
  const { bookings, favorites } = useBooking()
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    gender: '',
    nationality: '',
    stayType: '',
    residenceCountry: '',
    residenceCity: '',
    residenceArea: '',
    addressLine1: '',
    whatsappCode: '',
    whatsappNumber: '',
    classification: ''
  })
  const [cancelForm, setCancelForm] = useState({
    bookingId: '',
    reason: '',
    notes: ''
  })
  const [cancelRequests, setCancelRequests] = useState([
    {
      id: 'CR-1001',
      event: 'Luxury Brunch at Burj Al Arab',
      date: '2024-12-15',
      status: 'Under Review',
      requestedAt: '2024-12-02'
    }
  ])

  useEffect(() => {
    if (!user) return
    const profile = user.profile || {}
    const nameParts = String(user.name || '').split(' ')
    setProfileForm({
      firstName: profile.firstName || nameParts[0] || '',
      lastName: profile.lastName || nameParts.slice(1).join(' ') || '',
      email: profile.email || user.email || '',
      phone: profile.phone || user.phone || '',
      dobDay: profile.dobDay || '',
      dobMonth: profile.dobMonth || '',
      dobYear: profile.dobYear || '',
      gender: profile.gender || '',
      nationality: profile.nationality || '',
      stayType: profile.stayType || '',
      residenceCountry: profile.residenceCountry || '',
      residenceCity: profile.residenceCity || '',
      residenceArea: profile.residenceArea || '',
      addressLine1: profile.addressLine1 || '',
      whatsappCode: profile.whatsappCode || '',
      whatsappNumber: profile.whatsappNumber || '',
      classification: profile.classification || ''
    })
  }, [user])

  // Redirect to auth if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }



  const rewardHistory = [
    { id: 1, action: "Booking Completed", points: 55, date: "2024-11-28" },
    { id: 2, action: "Friend Referral", points: 100, date: "2024-11-20" },
    { id: 3, action: "Booking Completed", points: 30, date: "2024-11-15" },
    { id: 4, action: "Account Upgrade", points: 200, date: "2024-11-01" }
  ]

  const receipts = bookings.map((booking) => ({
    id: `RCT-${booking.id}`,
    event: booking.event,
    date: booking.date,
    amount: booking.price,
    status: booking.status,
    issuedAt: booking.date
  }))

  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'receipts', label: 'Receipts', icon: FileText },
    { id: 'cancellations', label: 'Cancellations', icon: XCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const updateProfileField = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim()
    updateUser({
      name: fullName || user.name,
      email: profileForm.email || user.email,
      phone: profileForm.phone || user.phone,
      profile: { ...profileForm }
    })
  }

  const handleCancellationSubmit = (event) => {
    event.preventDefault()
    if (!cancelForm.bookingId || !cancelForm.reason) return
    const booking = bookings.find(b => String(b.id) === String(cancelForm.bookingId))
    const newRequest = {
      id: `CR-${Math.floor(1000 + Math.random() * 9000)}`,
      event: booking?.event || 'Booking',
      date: booking?.date || 'TBD',
      status: 'Pending Review',
      requestedAt: new Date().toISOString().slice(0, 10)
    }
    setCancelRequests(prev => [newRequest, ...prev])
    setCancelForm({ bookingId: '', reason: '', notes: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple/5 via-white to-brand-blue/5">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-purple/5 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 pt-32 pb-12">
        {/* Profile Header - Airbnb Style with Rich Touches */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-orange" />

          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="relative">
                <div className="w-28 h-28 p-1 rounded-full bg-gradient-brand shadow-xl">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white overflow-hidden">
                    <User strokeWidth={1.5} className="w-12 h-12 text-gray-300" />
                  </div>
                </div>
                {user.accountType === "Premium" && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce-slow">
                    <Crown strokeWidth={1.5} className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-2">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 text-lg mb-2 flex items-center gap-2">
                      <Mail strokeWidth={1.5} className="w-4 h-4 text-brand-purple" /> {user.email}
                    </p>
                    <p className="text-gray-500 text-sm bg-gray-100 inline-block px-3 py-1 rounded-full">
                      Member since {user.memberSince}
                    </p>
                  </div>

                  <div className="mt-6 md:mt-0">
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <Badge variant="outline" className="border-brand-purple text-brand-purple px-4 py-1.5 text-sm font-semibold rounded-full bg-brand-purple/5">
                        {user.accountType} Member
                      </Badge>
                      {user.accountType === "Premium" && (
                        <div className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                          <Sparkles strokeWidth={1.5} className="w-3.5 h-3.5 text-brand-yellow" />
                          <span>{user.pointsToNextTier} points to {user.nextRewardTier}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats - Airbnb Style containing rich icons */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-gray-100">
              <div className="text-center group/stat cursor-pointer p-4 rounded-2xl hover:bg-brand-purple/5 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 bg-brand-purple/10 rounded-full flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <Gift strokeWidth={1.5} className="w-6 h-6 text-brand-purple" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{user.rewardPoints}</div>
                <div className="text-gray-500 font-medium text-sm uppercase tracking-wide">Reward Points</div>
              </div>
              <div className="text-center group/stat cursor-pointer p-4 rounded-2xl hover:bg-brand-blue/5 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 bg-brand-blue/10 rounded-full flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <Calendar strokeWidth={1.5} className="w-6 h-6 text-brand-blue" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{user.totalBookings}</div>
                <div className="text-gray-500 font-medium text-sm uppercase tracking-wide">Bookings</div>
              </div>
              <div className="text-center group/stat cursor-pointer p-4 rounded-2xl hover:bg-brand-red/5 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 bg-brand-red/10 rounded-full flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                  <Heart strokeWidth={1.5} className="w-6 h-6 text-brand-red" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{user.favoriteVenues}</div>
                <div className="text-gray-500 font-medium text-sm uppercase tracking-wide">Favorites</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs - Airbnb Style */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="bookings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
              <Calendar strokeWidth={1.5} className="w-4 h-4 mr-2" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
              <Heart strokeWidth={1.5} className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
              <Gift strokeWidth={1.5} className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="receipts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
              <FileText strokeWidth={1.5} className="w-4 h-4 mr-2" />
              Receipts
            </TabsTrigger>
            <TabsTrigger value="cancellations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
              <XCircle strokeWidth={1.5} className="w-4 h-4 mr-2" />
              Cancellations
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
              <Settings strokeWidth={1.5} className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="mt-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">My Bookings</h2>
                <Link to="/premium">
                  <Button variant="outline">Upgrade to Premium</Button>
                </Link>
              </div>
              {bookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <img
                        src={booking.image}
                        alt={booking.event}
                        className="w-full md:w-40 h-32 object-cover rounded-xl"
                      />

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{booking.event}</h3>
                            <p className="text-gray-600 font-medium mb-3">{booking.venue}</p>
                            <div className="flex items-center gap-6 text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar strokeWidth={1.5} className="w-4 h-4 text-brand-red" />
                                <span className="text-sm">{booking.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock strokeWidth={1.5} className="w-4 h-4 text-brand-red" />
                                <span className="text-sm">{booking.time}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right mt-6 md:mt-0">
                            <div className="text-2xl font-semibold text-brand-red mb-2">AED {booking.price}</div>
                            <Badge className={`${booking.status === 'Confirmed'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/10'
                              }`}>
                              {booking.status}
                            </Badge>
                            {booking.status === 'Completed' && (
                              <div className="mt-3">
                                <Link
                                  to={`/review/${booking.id}`}
                                  className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red/80 font-medium transition-colors text-sm"
                                >
                                  <Star strokeWidth={1.5} className="w-4 h-4" />
                                  <span>Leave Review</span>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="mt-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Favorite Venues</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map((favorite) => (
                  <Card key={favorite.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={favorite.image}
                          alt={favorite.name}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{favorite.name}</h3>
                          <p className="text-gray-600 text-sm">{favorite.venue}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Star strokeWidth={1.5} className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{favorite.rating}</span>
                            </div>
                            <div className="text-brand-red font-semibold">AED {favorite.price}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="mt-8">
            <div className="space-y-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reward Points</h2>
                  <div className="bg-gradient-to-br from-brand-red via-brand-orange to-brand-yellow rounded-3xl p-8 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-5xl font-bold mb-2">{user.rewardPoints}</div>
                        <div className="text-white/80 text-lg">Available Points</div>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Gift strokeWidth={1.5} className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 mb-4">
                      <div className="text-white/80 text-sm mb-1">Progress to {user.nextRewardTier}</div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all duration-500"
                          style={{ width: `${((user.rewardPoints % 1000) / 1000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-white text-sm mt-1">{user.pointsToNextTier} points to go</div>
                    </div>
                    <div className="text-white/80">
                      Redeem points for exclusive discounts and perks
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Redemption Options */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Redeem Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-brand-red/10 to-brand-orange/10 border-brand-red/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">AED 50 Discount</h4>
                          <Badge className="bg-brand-red text-white hover:bg-brand-red">500 pts</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">Get AED 50 off your next booking</p>
                        <Button className="w-full bg-gradient-to-r from-brand-red to-brand-orange hover:from-brand-red/80 hover:to-brand-orange/80">
                          Redeem
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-brand-orange/10 to-brand-yellow/10 border-brand-orange/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">AED 100 Discount</h4>
                          <Badge className="bg-brand-orange text-white hover:bg-brand-orange">900 pts</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">Get AED 100 off your next booking</p>
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                          Redeem
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">Free Dessert</h4>
                          <Badge className="bg-rose-500 text-white hover:bg-rose-500">200 pts</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">Complimentary dessert at participating venues</p>
                        <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                          Redeem
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-rose-50 border-orange-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">Priority Booking</h4>
                          <Badge className="bg-orange-500 text-white hover:bg-orange-500">300 pts</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">Skip the queue for 30 days</p>
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                          Redeem
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Points History</h3>
                  <div className="space-y-4">
                    {rewardHistory.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                        <div>
                          <div className="font-semibold text-gray-900">{item.action}</div>
                          <div className="text-gray-500 text-sm">{item.date}</div>
                        </div>
                        <div className="text-green-600 font-semibold text-lg">+{item.points} pts</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Receipts Tab */}
          <TabsContent value="receipts" className="mt-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Receipts & E-tickets</h2>
                {receipts.length === 0 ? (
                  <div className="text-gray-500 text-sm">No receipts available yet.</div>
                ) : (
                  <div className="space-y-4">
                    {receipts.map((receipt) => (
                      <Card key={receipt.id} className="border-0 shadow-sm">
                        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{receipt.event}</h3>
                            <p className="text-sm text-gray-500">Date: {receipt.date}</p>
                            <p className="text-sm text-gray-500">Receipt ID: {receipt.id}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              {receipt.status}
                            </Badge>
                            <div className="text-lg font-semibold text-gray-900">AED {receipt.amount}</div>
                            <div className="flex gap-2">
                              <Button variant="outline">View E-ticket</Button>
                              <Button>Download Receipt</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cancellations Tab */}
          <TabsContent value="cancellations" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Request Cancellation</h2>
                  <p className="text-sm text-gray-500 mb-6">Submit a cancellation request for review.</p>

                  <form onSubmit={handleCancellationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Booking</label>
                      <Select
                        value={cancelForm.bookingId}
                        onValueChange={(value) => setCancelForm(prev => ({ ...prev, bookingId: value }))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Choose booking" />
                        </SelectTrigger>
                        <SelectContent>
                          {bookings.map((booking) => (
                            <SelectItem key={booking.id} value={String(booking.id)}>
                              {booking.event} - {booking.date}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                      <Select
                        value={cancelForm.reason}
                        onValueChange={(value) => setCancelForm(prev => ({ ...prev, reason: value }))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="schedule_conflict">Schedule conflict</SelectItem>
                          <SelectItem value="illness">Illness or emergency</SelectItem>
                          <SelectItem value="travel_change">Travel change</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <Textarea
                        value={cancelForm.notes}
                        onChange={(e) => setCancelForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Share more details to help review your request."
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cancellation Requests</h2>
                  <p className="text-sm text-gray-500 mb-6">Track the status of your submissions.</p>
                  {cancelRequests.length === 0 ? (
                    <div className="text-sm text-gray-500">No cancellation requests submitted yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {cancelRequests.map((request) => (
                        <div key={request.id} className="p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900">{request.event}</div>
                              <div className="text-sm text-gray-500">{request.date}</div>
                              <div className="text-xs text-gray-400">Request ID: {request.id}</div>
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                              {request.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-400 mt-2">Submitted: {request.requestedAt}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <Input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => updateProfileField('firstName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <Input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => updateProfileField('lastName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <Input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => updateProfileField('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <Input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => updateProfileField('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Day of Birth</label>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          value={profileForm.dobDay}
                          onChange={(e) => updateProfileField('dobDay', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Month of Birth</label>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={profileForm.dobMonth}
                          onChange={(e) => updateProfileField('dobMonth', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year of Birth</label>
                        <Input
                          type="number"
                          min="1900"
                          max="2100"
                          value={profileForm.dobYear}
                          onChange={(e) => updateProfileField('dobYear', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <Select value={profileForm.gender} onValueChange={(value) => updateProfileField('gender', value)}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="non_binary">Non-binary</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                        <Input
                          type="text"
                          value={profileForm.nationality}
                          onChange={(e) => updateProfileField('nationality', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Classification</label>
                        <Select value={profileForm.classification} onValueChange={(value) => updateProfileField('classification', value)}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select classification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="cabin_crew">Cabin Crew</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Residence Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type of Stay</label>
                        <Select value={profileForm.stayType} onValueChange={(value) => updateProfileField('stayType', value)}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select stay type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="resident">Resident</SelectItem>
                            <SelectItem value="tourist">Tourist</SelectItem>
                            <SelectItem value="hotel">Hotel Guest</SelectItem>
                            <SelectItem value="business">Business Traveler</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country of Residence</label>
                        <Input
                          type="text"
                          value={profileForm.residenceCountry}
                          onChange={(e) => updateProfileField('residenceCountry', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City / Emirate</label>
                        <Input
                          type="text"
                          value={profileForm.residenceCity}
                          onChange={(e) => updateProfileField('residenceCity', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                        <Input
                          type="text"
                          value={profileForm.residenceArea}
                          onChange={(e) => updateProfileField('residenceArea', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <Input
                          type="text"
                          value={profileForm.addressLine1}
                          onChange={(e) => updateProfileField('addressLine1', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">WhatsApp Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Area Code</label>
                        <Input
                          type="text"
                          placeholder="+971"
                          value={profileForm.whatsappCode}
                          onChange={(e) => updateProfileField('whatsappCode', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                        <Input
                          type="text"
                          value={profileForm.whatsappNumber}
                          onChange={(e) => updateProfileField('whatsappNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" defaultChecked />
                        <span className="ml-2 text-gray-700">Email notifications for bookings</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" defaultChecked />
                        <span className="ml-2 text-gray-700">SMS notifications for reminders</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <span className="ml-2 text-gray-700">Marketing emails and promotions</span>
                      </label>
                    </div>
                  </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProfilePage



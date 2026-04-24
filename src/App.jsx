import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './shared/context/AuthContext'
import { BookingProvider } from './shared/context/BookingContext'
import { CartProvider } from './shared/context/CartContext'
import { favoriteFixtures } from './features/profile/profileFixtures'
import RequireAuth from './shared/components/RequireAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import VenuesPage from './pages/VenuesPage'
import VenueDetailsPage from './pages/VenueDetailsPage'
import PackagesPage from './pages/PackagesPage'
import PackageDetailPage from './pages/PackageDetailPage'
import ExplorePage from './pages/ExplorePage'
import BookingPage from './pages/BookingPage'
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage'
import PremiumUpgradePage from './pages/PremiumUpgradePage'
import ReviewPage from './pages/ReviewPage'
import CartPage from './pages/CartPage'
import CartCheckoutPage from './pages/CartCheckoutPage'
import BookingConfirmationPage from './pages/BookingConfirmationPage'

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App render failed', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-white px-6 py-24"><div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1><p className="mt-3 text-sm text-gray-600">We hit an unexpected app error while rendering this page. Please refresh and try again.</p><button type="button" className="mt-6 rounded-full bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white" onClick={() => window.location.reload()}>Reload app</button></div></div>
    }

    return this.props.children
  }
}

function AppShell() {
  return <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/venues/:id" element={<VenueDetailsPage />} />
        <Route path="/packages/:eventId" element={<PackagesPage />} />
        <Route path="/packages/detail/:packageId" element={<PackageDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/reset-password" element={<AuthPage />} />
        <Route path="/auth/verify-email" element={<AuthPage />} />
        <Route path="/premium" element={<RequireAuth><PremiumUpgradePage /></RequireAuth>} />
        <Route path="/review/:bookingId" element={<ReviewPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart/checkout" element={<RequireAuth><CartCheckoutPage /></RequireAuth>} />
        <Route path="/orders/:orderId/confirmation" element={<RequireAuth><BookingConfirmationPage /></RequireAuth>} />
      </Routes>
    </main>
    <Footer />
  </div>
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider initialFavorites={favoriteFixtures}>
        <CartProvider>
          <Router>
            <AppErrorBoundary>
              <AppShell />
            </AppErrorBoundary>
          </Router>
        </CartProvider>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App

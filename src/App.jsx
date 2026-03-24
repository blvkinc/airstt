import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './shared/context/AuthContext'
import { BookingProvider } from './shared/context/BookingContext'
import { CartProvider } from './shared/context/CartContext'
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

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
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
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/premium" element={<PremiumUpgradePage />} />
                  <Route path="/review/:bookingId" element={<ReviewPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/cart/checkout" element={<CartCheckoutPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App

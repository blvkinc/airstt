import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Input } from '../shared/ui/input'
import { motion } from 'framer-motion'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    // Mock subscription
    console.log('Subscribed:', email)
    setEmail('')
  }

  return (
    <footer className="relative bg-[#0a0a0a] text-white pt-20 pb-10 overflow-hidden">
      {/* Decorative Brand Gradient Line at Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-orange" />

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand & Newsletter Section (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="inline-block group">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-lg group-hover:shadow-brand-purple/20 transition-all duration-500">
                  <span className="text-white font-bold text-lg font-serif">S</span>
                </div>
                <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:to-white transition-all duration-300">
                  Set The Table
                </span>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed max-w-md text-base">
              Dubai's premier marketplace for curated brunch and party experiences.
              Elevating your social calendar with exclusive venues and unforgettable moments.
            </p>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Stay Updated</h4>
              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl pr-12 h-12 focus:border-brand-purple/50 focus:ring-brand-purple/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300 group"
                >
                  <Send strokeWidth={1.5} className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          {/* Navigation Links (Cols 6-12) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-2">

            {/* Discover */}
            <div className="space-y-6">
              <h4 className="text-base font-semibold text-white tracking-wide">Discover</h4>
              <ul className="space-y-4">
                {['Browse Events', 'Featured Venues', 'Trending Now', 'New Arrivals'].map((item) => (
                  <li key={item}>
                    <Link to="/explore" className="text-gray-400 hover:text-brand-blue hover:pl-1 transition-all duration-300 text-sm flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-6">
              <h4 className="text-base font-semibold text-white tracking-wide">Account</h4>
              <ul className="space-y-4">
                {['My Profile', 'My Bookings', 'Favorites', 'Rewards'].map((item) => (
                  <li key={item}>
                    <Link to="/profile" className="text-gray-400 hover:text-brand-purple hover:pl-1 transition-all duration-300 text-sm flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-brand-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-base font-semibold text-white tracking-wide">Contact</h4>
              <ul className="space-y-5">
                <li className="flex items-start space-x-3 group cursor-pointer hover:bg-white/5 p-2 -ml-2 rounded-xl transition-all">
                  <div className="p-2 bg-white/5 rounded-lg text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                    <MapPin strokeWidth={1.5} className="w-4 h-4" />
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors mt-1.5">
                    Business Bay <br /> Dubai, UAE
                  </span>
                </li>
                <li className="flex items-center space-x-3 group cursor-pointer hover:bg-white/5 p-2 -ml-2 rounded-xl transition-all">
                  <div className="p-2 bg-white/5 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                    <Mail strokeWidth={1.5} className="w-4 h-4" />
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    hello@setthetable.ae
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Set The Table. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            {[
              { icon: Instagram, href: '#', color: 'hover:text-pink-500', bg: 'hover:bg-pink-500/10' },
              { icon: Twitter, href: '#', color: 'hover:text-sky-400', bg: 'hover:bg-sky-400/10' },
              { icon: Facebook, href: '#', color: 'hover:text-blue-500', bg: 'hover:bg-blue-500/10' }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`p-2.5 bg-white/5 text-gray-400 rounded-xl transition-all duration-300 hover:scale-110 ${social.color} ${social.bg}`}
              >
                <social.icon strokeWidth={1.5} className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex space-x-6">
            <Link to="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, MapPin, Send, Twitter } from 'lucide-react'
import sttLogo from '../shared/assets/sttmainlogo.svg'

const brandLogoFilter = {
  filter: 'brightness(0) saturate(100%) invert(59%) sepia(19%) saturate(761%) hue-rotate(238deg) brightness(88%) contrast(87%)',
}

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (event) => {
    event.preventDefault()
    setEmail('')
  }

  return (
    <footer id="footer" className="mt-16 bg-[#080808] text-white md:mt-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-8 py-16 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr] md:gap-16 md:py-20">
        <div>
          <Link to="/" className="inline-flex">
            <img src={sttLogo} alt="Set The Table" className="h-20 w-auto" style={brandLogoFilter} />
          </Link>
          <p className="mt-7 max-w-[410px] text-[17px] leading-8 text-white/40">
            Dubai's premier marketplace for curated brunch and party experiences. Elevating your social calendar with exclusive venues and unforgettable moments.
          </p>

          <form onSubmit={handleSubscribe} className="mt-12 max-w-[380px]">
            <label htmlFor="footer-email" className="block text-base font-extrabold text-white">Stay Updated</label>
            <div className="mt-4 flex h-11 items-center rounded-full border border-brand-purple/70 bg-transparent pl-5 pr-1 shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-0 min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30"
              />
              <button type="submit" aria-label="Subscribe" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-purple">
                <Send className="h-4 w-4" strokeWidth={1.7} />
              </button>
            </div>
          </form>
        </div>

        <div className="md:pt-12">
          <h3 className="text-base font-extrabold text-white">Discover</h3>
          <ul className="mt-7 space-y-5 text-sm text-white/30">
            <li><Link to="/events" className="transition-colors hover:text-brand-purple">Browse Events</Link></li>
            <li><Link to="/venues" className="transition-colors hover:text-brand-purple">Featured Venues</Link></li>
            <li><Link to="/experiences" className="transition-colors hover:text-brand-purple">Trending Now</Link></li>
            <li><Link to="/events" className="transition-colors hover:text-brand-purple">New Arrivals</Link></li>
          </ul>
        </div>

        <div className="md:pt-12">
          <h3 className="text-base font-extrabold text-white">Account</h3>
          <ul className="mt-7 space-y-5 text-sm text-white/30">
            <li><Link to="/profile" className="transition-colors hover:text-brand-purple">My Profile</Link></li>
            <li><Link to="/profile?tab=bookings" className="transition-colors hover:text-brand-purple">My Bookings</Link></li>
            <li><Link to="/profile?tab=favorites" className="transition-colors hover:text-brand-purple">Favourites</Link></li>
            <li><Link to="/profile?tab=rewards" className="transition-colors hover:text-brand-purple">Rewards</Link></li>
          </ul>
        </div>

        <div className="md:pt-12">
          <h3 className="text-base font-extrabold text-white">Contact</h3>
          <ul className="mt-7 space-y-6 text-sm text-white/40">
            <li className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-purple">
                <MapPin className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span>Business Bay<br />Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-purple">
                <Mail className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span>hello@setthetable.ae</span>
            </li>
          </ul>

          <div className="mt-10 flex items-center gap-4">
            {[
              { icon: Instagram, href: 'https://instagram.com' },
              { icon: Twitter, href: 'https://x.com' },
              { icon: Facebook, href: 'https://facebook.com' },
            ].map((social) => {
              const Icon = social.icon

              return (
                <a key={social.href} href={social.href} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-purple text-white transition-opacity hover:opacity-90">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-brand-purple px-8 py-4 text-sm text-white/70">
        <div className="mx-auto max-w-6xl">
          © {new Date().getFullYear()} Set The Table. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer

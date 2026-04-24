import { getEventById, getPackageById, getVenueById } from '../experiences/data/selectors'

const eventOne = getEventById(1)
const eventTwo = getEventById(2)
const favoriteVenue = getVenueById(1)
const rooftopVenue = getVenueById(2)
const premiumPackage = getPackageById(2)
const rooftopPackage = getPackageById(201)

export const bookingFixtures = [
  {
    id: 1,
    event: eventOne.title,
    venue: eventOne.venue,
    date: eventOne.date,
    time: eventOne.time,
    status: 'Confirmed',
    price: premiumPackage.price,
    guests: 2,
    package: premiumPackage.name,
    image: eventOne.image
  },
  {
    id: 2,
    event: eventTwo.title,
    venue: eventTwo.venue,
    date: eventTwo.date,
    time: eventTwo.time,
    status: 'Completed',
    price: rooftopPackage.price,
    guests: 4,
    package: rooftopPackage.name,
    image: eventTwo.image
  }
]

export const favoriteFixtures = [
  {
    id: favoriteVenue.id,
    name: eventOne.title,
    venue: favoriteVenue.name,
    rating: favoriteVenue.rating,
    price: premiumPackage.price,
    image: favoriteVenue.image
  },
  {
    id: rooftopVenue.id,
    name: eventTwo.title,
    venue: rooftopVenue.name,
    rating: rooftopVenue.rating,
    price: rooftopPackage.price,
    image: rooftopVenue.image
  }
]

export const profileRewardHistory = [
  { id: 1, action: 'Booking Completed', points: 55, date: '2026-05-28' },
  { id: 2, action: 'Friend Referral', points: 100, date: '2026-05-20' },
  { id: 3, action: 'Booking Completed', points: 30, date: '2026-05-15' },
  { id: 4, action: 'Account Upgrade', points: 200, date: '2026-05-01' }
]

export const initialCancelRequests = [
  {
    id: 'CR-1001',
    event: eventOne.title,
    date: eventOne.date,
    status: 'Under Review',
    requestedAt: '2026-06-02'
  }
]

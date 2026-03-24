import React, { createContext, useContext, useState, useEffect } from 'react'

const MerchantContext = createContext()

export const useMerchant = () => {
  const context = useContext(MerchantContext)
  if (!context) {
    throw new Error('useMerchant must be used within a MerchantProvider')
  }
  return context
}

export const MerchantProvider = ({ children }) => {
  const [merchant, setMerchant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [venues, setVenues] = useState([])
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [faqs, setFaqs] = useState([])
  const [promotions, setPromotions] = useState([])
  const [customers, setCustomers] = useState([])
  const [adsCampaigns, setAdsCampaigns] = useState([])
  const [adsInternal, setAdsInternal] = useState([])
  const [adsExternal, setAdsExternal] = useState([])
  const [packageTemplates, setPackageTemplates] = useState([])

  const isStorageArrayMissing = (key) => {
    const raw = localStorage.getItem(key)
    if (!raw) return true
    try {
      const parsed = JSON.parse(raw)
      return !Array.isArray(parsed) || parsed.length === 0
    } catch (error) {
      return true
    }
  }

  // Check for existing merchant on app load
  useEffect(() => {
    const savedMerchant = localStorage.getItem('stt_merchant')
    if (savedMerchant) {
      const merchantData = JSON.parse(savedMerchant)

      // Ensure role is set for existing merchants (backward compatibility)
      if (!merchantData.role) {
        if (merchantData.email === 'admin@stt.com') {
          merchantData.role = 'super_admin'
        } else {
          merchantData.role = 'merchant'
        }
        localStorage.setItem('stt_merchant', JSON.stringify(merchantData))
      }

      setMerchant(merchantData)
      loadMerchantData()
      initializeMockData()
      loadMerchantData()
    }
    setLoading(false)
  }, [])

  const loadMerchantData = () => {
    // Load venues
    const savedVenues = localStorage.getItem('stt_merchant_venues')
    if (savedVenues) {
      setVenues(JSON.parse(savedVenues))
    }

    // Load events
    const savedEvents = localStorage.getItem('stt_merchant_events')
    if (savedEvents) {
      let parsedEvents = []
      try {
        parsedEvents = JSON.parse(savedEvents)
      } catch (error) {
        parsedEvents = []
      }
      const sanitizeEvents = (list) => {
        if (!Array.isArray(list)) return []
        const isPlaceholderPackage = (pkg) => {
          if (!pkg) return false
          const name = String(pkg.name || '').toLowerCase()
          const price = Number(pkg.price || 0)
          return name === 'individual package' && price <= 0
        }
        const isPlaceholderEvent = (event) => {
          const titleMissing = !event?.title || String(event.title).trim().length === 0
          const hasImage = Boolean(event?.image) || (Array.isArray(event?.images) && event.images.length > 0)
          const status = String(event?.status || '').toLowerCase()
          return status === 'draft' && (titleMissing || !hasImage)
        }
        return list
          .filter(event => !isPlaceholderEvent(event))
          .map(event => ({
            ...event,
            packages: (event.packages || []).filter(pkg => !isPlaceholderPackage(pkg))
          }))
      }
      const sanitized = sanitizeEvents(parsedEvents)
      setEvents(sanitized)
      if (sanitized.length !== parsedEvents.length || JSON.stringify(parsedEvents) !== JSON.stringify(sanitized)) {
        localStorage.setItem('stt_merchant_events', JSON.stringify(sanitized))
      }
    }

    // Load bookings
    const savedBookings = localStorage.getItem('stt_merchant_bookings')
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }

    // Load FAQs
    const savedFaqs = localStorage.getItem('stt_merchant_faqs')
    if (savedFaqs) {
      setFaqs(JSON.parse(savedFaqs))
    }

    // Load Promotions
    const savedPromotions = localStorage.getItem('stt_merchant_promotions')
    if (savedPromotions) {
      setPromotions(JSON.parse(savedPromotions))
    }

    // Load Customers
    const savedCustomers = localStorage.getItem('stt_merchant_customers')
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    }

    // Load Ads State
    const savedAdsCampaigns = localStorage.getItem('stt_merchant_ads_campaigns')
    if (savedAdsCampaigns) {
      setAdsCampaigns(JSON.parse(savedAdsCampaigns))
    }
    const savedAdsInternal = localStorage.getItem('stt_merchant_ads_internal')
    if (savedAdsInternal) {
      setAdsInternal(JSON.parse(savedAdsInternal))
    }
    const savedAdsExternal = localStorage.getItem('stt_merchant_ads_external')
    if (savedAdsExternal) {
      setAdsExternal(JSON.parse(savedAdsExternal))
    }

    const savedTemplates = localStorage.getItem('stt_merchant_package_templates')
    if (savedTemplates) {
      setPackageTemplates(JSON.parse(savedTemplates))
    }
  }

  const registerMerchant = async (merchantData) => {
    const { businessName, email, phone, password, venueData } = merchantData

    if (businessName && email && phone && password.length >= 6) {
      const newMerchant = {
        id: Date.now(),
        email,
        businessName,
        phone,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        status: 'Pending Approval',
        subscriptionType: 'Free',
        totalRevenue: 0,
        totalBookings: 0,
        totalEvents: 0,
        rating: 0,
        venueData
      }

      setMerchant(newMerchant)
      localStorage.setItem('stt_merchant', JSON.stringify(newMerchant))
      return { success: true }
    }

    return { success: false, error: 'Please fill all required fields' }
  }

  const loginMerchant = async (email, password) => {
    // Simple validation - in real app this would be API call
    if (email && password.length >= 6) {
      // Check if it's super admin credentials
      if (email === 'admin@stt.com' && password === 'admin123') {
        const adminData = {
          id: 1,
          email,
          businessName: 'STT Platform Administration',
          phone: '+971 4 000 0000',
          joinedDate: 'Platform Launch',
          status: 'Super Administrator',
          subscriptionType: 'Platform Admin',
          totalRevenue: 2847392,
          totalBookings: 5678,
          totalEvents: 342,
          rating: 5.0,
          role: 'super_admin'
        }

        setMerchant(adminData)
        localStorage.setItem('stt_merchant', JSON.stringify(adminData))
        loadMerchantData()
        return { success: true }
      }

      // Regular merchant login
      const merchantData = {
        id: Date.now(),
        email,
        businessName: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' Restaurant',
        phone: '+971 4 123 4567',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        status: 'Approved',
        subscriptionType: 'Free',
        totalRevenue: 15420,
        totalBookings: 89,
        totalEvents: 12,
        rating: 4.6,
        role: 'merchant'
      }

      setMerchant(merchantData)
      localStorage.setItem('stt_merchant', JSON.stringify(merchantData))
      
      // Initialize mock data if empty
      initializeMockData()
      loadMerchantData()
      return { success: true }
    }

    return { success: false, error: 'Invalid credentials' }
  }

  const logoutMerchant = () => {
    setMerchant(null)
    setVenues([])
    setEvents([])
    setBookings([])
    setPromotions([])
    setCustomers([])
    setAdsCampaigns([])
    setAdsInternal([])
    setAdsExternal([])
    localStorage.removeItem('stt_merchant')
    // We intentionally don't remove other data so it persists for the prototype
  }

  const initializeMockData = () => {
    // Only initialize if data doesn't exist to avoid overwriting user edits
    if (isStorageArrayMissing('stt_merchant_promotions')) {
      const mockPromotions = [
        {
          id: 1, name: 'Weekend Special', type: 'percentage', value: 20, code: 'WEEKEND20',
          description: '20% off on weekend brunch bookings', startDate: '2024-12-01', endDate: '2024-12-31',
          usageLimit: 100, usedCount: 23, minAmount: 200, applicableEvents: ['Weekend Brunch Buffet'],
          isActive: true, createdAt: '2024-11-15'
        },
        {
          id: 2, name: 'Early Bird Discount', type: 'fixed', value: 50, code: 'EARLY50',
          description: 'AED 50 off for bookings made 7 days in advance', startDate: '2024-11-01', endDate: '2024-12-31',
          usageLimit: 200, usedCount: 67, minAmount: 300, applicableEvents: ['All Events'],
          isActive: true, createdAt: '2024-10-28'
        }
      ]
      localStorage.setItem('stt_merchant_promotions', JSON.stringify(mockPromotions))
    }

    if (isStorageArrayMissing('stt_merchant_customers')) {
      const mockCustomers = [
        {
          id: 1, name: "Sarah Ahmed", email: "sarah.ahmed@email.com", phone: "+971 50 123 4567",
          location: "Dubai Marina", totalBookings: 8, totalSpent: 2394, averageRating: 4.8,
          lastBooking: "2024-12-15", status: "VIP", joinDate: "2023-06-15",
          favoriteEvents: ["Weekend Brunch", "Business Lunch"],
          bookingHistory: [{ date: "2024-12-15", event: "Weekend Brunch", amount: 299, status: "Completed" }]
        },
        {
          id: 2, name: "Michael Johnson", email: "michael.j@email.com", phone: "+971 55 987 6543",
          location: "Downtown Dubai", totalBookings: 5, totalSpent: 1247, averageRating: 4.6,
          lastBooking: "2024-12-10", status: "Regular", joinDate: "2023-09-22",
          favoriteEvents: ["Rooftop Party", "Date Night"],
          bookingHistory: [{ date: "2024-12-10", event: "Rooftop Party", amount: 199, status: "Completed" }]
        }
      ]
      localStorage.setItem('stt_merchant_customers', JSON.stringify(mockCustomers))
    }

    if (isStorageArrayMissing('stt_merchant_bookings')) {
      const mockBookings = [
        {
          id: 1, bookingRef: 'STT-001234', customerName: 'Sarah Ahmed', customerEmail: 'sarah.ahmed@email.com',
          customerPhone: '+971 50 123 4567', event: 'Weekend Brunch Buffet', date: '2024-12-15',
          time: '11:00 AM - 3:00 PM', guests: 2, package: 'Couple Package', amount: 549, commission: 82.35,
          status: 'Confirmed', bookingDate: '2024-12-01', specialRequests: 'Window table preferred', rating: null
        }
      ]
      localStorage.setItem('stt_merchant_bookings', JSON.stringify(mockBookings))
    }

    if (isStorageArrayMissing('stt_merchant_ads_internal')) {
      const mockAdsInternal = [
        { id: 1, name: 'Featured Event', description: 'Highlight your event at the top of search results', price: 299, duration: '7 days', features: ['Top position in search results'], metrics: { impressions: 12500, clicks: 890, bookings: 23 }, isActive: true },
        { id: 2, name: 'Homepage Banner', description: 'Display your venue on the homepage banner', price: 599, duration: '14 days', features: ['Homepage banner placement'], metrics: { impressions: 45000, clicks: 2100, bookings: 67 }, isActive: false }
      ]
      localStorage.setItem('stt_merchant_ads_internal', JSON.stringify(mockAdsInternal))
    }

    if (isStorageArrayMissing('stt_merchant_ads_external')) {
      const mockAdsExternal = [
        { id: 1, name: 'Social Media Management', description: 'Complete social media marketing across all platforms', price: 1299, duration: 'Monthly', features: ['Instagram, Facebook, Twitter management'], platforms: ['instagram', 'facebook', 'twitter'], isActive: true },
        { id: 2, name: 'Influencer Partnerships', description: 'Connect with food bloggers and influencers', price: 2499, duration: 'Campaign', features: ['Influencer matching and outreach'], platforms: ['instagram', 'tiktok'], isActive: false }
      ]
      localStorage.setItem('stt_merchant_ads_external', JSON.stringify(mockAdsExternal))
    }

    if (isStorageArrayMissing('stt_merchant_ads_campaigns')) {
      const mockAdsCampaigns = [
        { id: 1, name: 'Weekend Brunch Promotion', type: 'Featured Event', startDate: '2024-12-01', endDate: '2024-12-07', budget: 299, spent: 156, impressions: 8900, clicks: 234, bookings: 12, status: 'Active' },
        { id: 2, name: 'Holiday Special Campaign', type: 'Social Media Management', startDate: '2024-12-01', endDate: '2024-12-31', budget: 1299, spent: 432, impressions: 25600, clicks: 1200, bookings: 45, status: 'Active' }
      ]
      localStorage.setItem('stt_merchant_ads_campaigns', JSON.stringify(mockAdsCampaigns))
    }

    const mockTemplates = [
        {
          id: 1,
          name: 'Soft Drinks Package',
          description: 'Includes unlimited soft drinks with dining.',
          pricingRules: {
            type: 'individual',
            basePrice: 120,
            genderPricing: { enabled: false, ladies: '', gents: '', kids: '' },
            timePricing: { enabled: false, type: 'early_bird', discountLimit: '', rules: [] },
            fixedPricing: { enabled: false, amount: '' }
          },
          maxGuests: 4,
          minGuests: 1,
          features: ['Unlimited soft drinks', 'Dining access'],
          inclusions: ['Soft drinks', 'Dining'],
          exclusions: [],
          status: 'Draft'
        },
        {
          id: 2,
          name: 'House Beverages Package',
          description: 'Selection of house beverages for brunch experiences.',
          pricingRules: {
            type: 'individual',
            basePrice: 180,
            genderPricing: { enabled: false, ladies: '', gents: '', kids: '' },
            timePricing: { enabled: false, type: 'early_bird', discountLimit: '', rules: [] },
            fixedPricing: { enabled: false, amount: '' }
          },
          maxGuests: 6,
          minGuests: 1,
          features: ['House spirits', 'Beer & wine'],
          inclusions: ['House spirits', 'Beer', 'Wine'],
          exclusions: [],
          status: 'Draft'
        }
      ]
    const existingTemplatesRaw = localStorage.getItem('stt_merchant_package_templates')
    let existingTemplates = []
    try {
      existingTemplates = existingTemplatesRaw ? JSON.parse(existingTemplatesRaw) : []
    } catch (error) {
      existingTemplates = []
    }
    if (!Array.isArray(existingTemplates)) existingTemplates = []
    const mergedTemplates = [...existingTemplates]
    mockTemplates.forEach((template) => {
      const exists = mergedTemplates.some(t => t.id === template.id || t.name === template.name)
      if (!exists) mergedTemplates.push(template)
    })
    if (mergedTemplates.length !== existingTemplates.length) {
      localStorage.setItem('stt_merchant_package_templates', JSON.stringify(mergedTemplates))
    }

    const mockEvents = [
        {
          id: 101,
          title: 'Saiana Brunch Sunday',
          description: 'Sunday brunch experience with live DJ and beach access.',
          eventType: 'Brunch',
          primaryCategory: 'Brunch',
          subcategories: ['Beach Brunch'],
          tags: ['Live DJ', 'Outdoor'],
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop',
          images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop'],
          date: '2026-03-23',
          startTime: '14:00',
          endTime: '18:00',
          capacity: 200,
          status: 'Published',
          createdAt: new Date().toISOString(),
          views: 120,
          bookings: 34,
          scheduleType: 'one_time',
          availabilityStatus: 'open',
          blackoutDates: ['2026-04-06'],
          occurrenceOverrides: [
            { id: 1, date: '2026-04-06', status: 'sold_out', inventory: 0 }
          ],
          seo: {
            metaTitle: 'Saiana Brunch Sunday | STT',
            metaDescription: 'Sunday brunch experience with live DJ and beach access.',
            slug: 'saiana-brunch-sunday',
            ogImage: ''
          },
          accessibility: ['Wheelchair access', 'Accessible restrooms'],
          packages: [
            {
              id: 5001,
              name: 'Soft Drinks Package',
              description: 'Unlimited soft drinks with dining.',
              price: 120,
              guestCount: 1,
              type: 'individual',
              paymentMode: 'full',
              depositAmount: 0,
              includes: ['Soft drinks', 'Dining'],
              templateId: 1,
              templateName: 'Soft Drinks Package',
              rules: {
                inventoryConsumption: 'per_guest',
                maxBookingsPerDate: 60,
                cutoffHours: 6
              },
              status: 'Active'
            }
          ]
        },
        {
          id: 102,
          title: 'Twilight Brunch Series',
          description: 'Recurring brunch series with sunset views and soft drinks.',
          eventType: 'Brunch',
          primaryCategory: 'Brunch',
          subcategories: ['Sunset', 'Recurring'],
          tags: ['Sunset', 'Recurring'],
          image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=800&fit=crop',
          images: ['https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=800&fit=crop'],
          date: '2026-03-22',
          startTime: '16:00',
          endTime: '20:00',
          capacity: 150,
          status: 'Published',
          createdAt: new Date().toISOString(),
          views: 88,
          bookings: 20,
          scheduleType: 'recurring',
          recurrence: {
            startDate: '2026-03-22',
            endDate: '2026-04-12',
            pattern: 'weekly',
            days: ['sun']
          },
          availabilityStatus: 'open',
          blackoutDates: [],
          occurrenceOverrides: [],
          seo: {
            metaTitle: 'Twilight Brunch Series | STT',
            metaDescription: 'Recurring brunch series with sunset views.',
            slug: 'twilight-brunch-series',
            ogImage: ''
          },
          accessibility: ['Step-free entry'],
          packages: [
            {
              id: 5002,
              name: 'Soft Drinks Package',
              description: 'Unlimited soft drinks with dining.',
              price: 120,
              guestCount: 1,
              type: 'individual',
              paymentMode: 'deposit',
              depositAmount: 50,
              includes: ['Soft drinks', 'Dining'],
              templateId: 1,
              templateName: 'Soft Drinks Package',
              rules: {
                inventoryConsumption: 'per_package',
                maxBookingsPerDate: 40,
                cutoffHours: 24
              },
              status: 'Active'
            }
          ]
        }
      ]

    const existingEventsRaw = localStorage.getItem('stt_merchant_events')
    let existingEvents = []
    try {
      existingEvents = existingEventsRaw ? JSON.parse(existingEventsRaw) : []
    } catch (error) {
      existingEvents = []
    }
    if (!Array.isArray(existingEvents)) existingEvents = []
    const mergedEvents = [...existingEvents]
    mockEvents.forEach((event) => {
      const exists = mergedEvents.some(e => e.id === event.id || e.title === event.title)
      if (!exists) mergedEvents.push(event)
    })
    if (mergedEvents.length !== existingEvents.length) {
      localStorage.setItem('stt_merchant_events', JSON.stringify(mergedEvents))
    }
  }

  const seedDemoData = () => {
    initializeMockData()
    loadMerchantData()
  }

  const updateMerchant = (updates) => {
    const updatedMerchant = { ...merchant, ...updates }
    setMerchant(updatedMerchant)
    localStorage.setItem('stt_merchant', JSON.stringify(updatedMerchant))
  }

  const addVenue = (venueData) => {
    const newVenue = {
      id: Date.now(),
      ...venueData,
      merchantId: merchant.id,
      status: 'Pending Approval',
      createdAt: new Date().toISOString()
    }

    const updatedVenues = [...venues, newVenue]
    setVenues(updatedVenues)
    localStorage.setItem('stt_merchant_venues', JSON.stringify(updatedVenues))
    return newVenue
  }

  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      merchantId: merchant.id,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      views: 0,
      bookings: 0
    }

    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    localStorage.setItem('stt_merchant_events', JSON.stringify(updatedEvents))
    return newEvent
  }

  const updateEvent = (eventId, updates) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, ...updates } : event
    )
    setEvents(updatedEvents)
    localStorage.setItem('stt_merchant_events', JSON.stringify(updatedEvents))
  }

  const cloneEvent = (eventId) => {
    const originalEvent = events.find(e => e.id === eventId)
    if (originalEvent) {
      const clonedEvent = {
        ...originalEvent,
        id: Date.now(),
        title: `${originalEvent.title} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        views: 0,
        bookings: 0
      }

      const updatedEvents = [...events, clonedEvent]
      setEvents(updatedEvents)
      localStorage.setItem('stt_merchant_events', JSON.stringify(updatedEvents))
      return clonedEvent
    }
  }

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId)
    setEvents(updatedEvents)
    localStorage.setItem('stt_merchant_events', JSON.stringify(updatedEvents))
  }

  const addPackage = (eventId, packageData) => {
    const event = events.find(e => e.id === parseInt(eventId) || e.id === eventId)
    if (event) {
      const newPackage = {
        id: Date.now(),
        approvalStatus: 'Draft',
        pricingRules: {
          basePrice: packageData.price || 0,
          type: 'individual',
          genderPricing: { enabled: false, ladies: 0, gents: 0, kids: 0 },
          timePricing: { enabled: false, type: '', discountLimit: 0, rules: [] },
          fixedPricing: { enabled: false, amount: 0 }
        },
        availability: {
          type: 'day', // 'day' or 'time'
          slots: [], // For day type
          validFrom: '',
          validUntil: '',
          inventory: 0
        },
        combinations: {
          enabled: false,
          linkedPackages: []
        },
        discounts: {
          multiBooking: { enabled: false, rules: [] },
          gender: { enabled: false, rules: [] },
          age: { enabled: false, rules: [] }
        },
        ...packageData,
        eventId: event.id, // Ensure link
        status: packageData.status || 'Active',
        createdAt: new Date().toISOString()
      }
      const updatedPackages = [...(event.packages || []), newPackage]
      updateEvent(event.id, { packages: updatedPackages })
      return newPackage
    }
  }

  const updatePackage = (packageId, updates) => {
    let foundEvent = null
    let foundPackageIndex = -1

    for (const event of events) {
      const index = (event.packages || []).findIndex(p => p.id === parseInt(packageId) || p.id === packageId)
      if (index !== -1) {
        foundEvent = event
        foundPackageIndex = index
        break
      }
    }

    if (foundEvent) {
      const updatedPackages = [...foundEvent.packages]
      updatedPackages[foundPackageIndex] = { ...updatedPackages[foundPackageIndex], ...updates, status: updates.status || updatedPackages[foundPackageIndex].status || 'draft' }
      updateEvent(foundEvent.id, { packages: updatedPackages })
    }
  }

  const addPackageTemplate = (templateData) => {
    const newTemplate = {
      id: Date.now(),
      ...templateData,
      createdAt: new Date().toISOString()
    }
    const updatedTemplates = [...packageTemplates, newTemplate]
    setPackageTemplates(updatedTemplates)
    localStorage.setItem('stt_merchant_package_templates', JSON.stringify(updatedTemplates))
    return newTemplate
  }

  const updatePackageTemplate = (templateId, updates) => {
    const updatedTemplates = packageTemplates.map(t =>
      t.id === templateId ? { ...t, ...updates } : t
    )
    setPackageTemplates(updatedTemplates)
    localStorage.setItem('stt_merchant_package_templates', JSON.stringify(updatedTemplates))
  }

  const deletePackageTemplate = (templateId) => {
    const updatedTemplates = packageTemplates.filter(t => t.id !== templateId)
    setPackageTemplates(updatedTemplates)
    localStorage.setItem('stt_merchant_package_templates', JSON.stringify(updatedTemplates))
  }

  const clonePackage = (packageId) => {
    let foundEvent = null
    let foundPackage = null

    for (const event of events) {
      const pkg = (event.packages || []).find(p => p.id === parseInt(packageId) || p.id === packageId)
      if (pkg) {
        foundEvent = event
        foundPackage = pkg
        break
      }
    }

    if (foundEvent && foundPackage) {
      const clonedPackage = {
        ...foundPackage,
        id: Date.now(),
        name: `${foundPackage.name} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        bookings: 0,
        revenue: 0
      }

      const updatedPackages = [...(foundEvent.packages || []), clonedPackage]
      updateEvent(foundEvent.id, { packages: updatedPackages })
      return clonedPackage
    }
  }

  const addFaq = (faqData) => {
    const newFaq = {
      id: Date.now(),
      ...faqData,
      merchantId: merchant.id,
      createdAt: new Date().toISOString()
    }
    const updatedFaqs = [...faqs, newFaq]
    setFaqs(updatedFaqs)
    localStorage.setItem('stt_merchant_faqs', JSON.stringify(updatedFaqs))
    return newFaq
  }

  const updateFaq = (faqId, updates) => {
    const updatedFaqs = faqs.map(faq =>
      faq.id === faqId ? { ...faq, ...updates } : faq
    )
    setFaqs(updatedFaqs)
    localStorage.setItem('stt_merchant_faqs', JSON.stringify(updatedFaqs))
  }

  const deleteFaq = (faqId) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== faqId)
    setFaqs(updatedFaqs)
    localStorage.setItem('stt_merchant_faqs', JSON.stringify(updatedFaqs))
  }

  const updateBooking = (bookingId, updates) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, ...updates } : b
    )
    setBookings(updatedBookings)
    localStorage.setItem('stt_merchant_bookings', JSON.stringify(updatedBookings))
  }

  const updateCustomer = (customerId, updates) => {
    const updatedCustomers = customers.map(c =>
      c.id === customerId ? { ...c, ...updates } : c
    )
    setCustomers(updatedCustomers)
    localStorage.setItem('stt_merchant_customers', JSON.stringify(updatedCustomers))
  }

  // --- Promotions CRUD ---
  const addPromotion = (promoData) => {
    const newPromo = {
      id: Date.now(),
      ...promoData,
      merchantId: merchant.id,
      createdAt: new Date().toISOString()
    }
    const updatedPromotions = [...promotions, newPromo]
    setPromotions(updatedPromotions)
    localStorage.setItem('stt_merchant_promotions', JSON.stringify(updatedPromotions))
    return newPromo
  }

  const updatePromotion = (promoId, updates) => {
    const updatedPromotions = promotions.map(p =>
      p.id === promoId ? { ...p, ...updates } : p
    )
    setPromotions(updatedPromotions)
    localStorage.setItem('stt_merchant_promotions', JSON.stringify(updatedPromotions))
  }

  const deletePromotion = (promoId) => {
    const updatedPromotions = promotions.filter(p => p.id !== promoId)
    setPromotions(updatedPromotions)
    localStorage.setItem('stt_merchant_promotions', JSON.stringify(updatedPromotions))
  }

  const duplicatePromotion = (promoId) => {
    const originalPromo = promotions.find(p => p.id === promoId)
    if (originalPromo) {
      const clonedPromo = {
        ...originalPromo,
        id: Date.now(),
        name: `${originalPromo.name} (Copy)`,
        code: `${originalPromo.code}COPY`,
        usedCount: 0,
        isActive: false,
        createdAt: new Date().toISOString()
      }
      const updatedPromotions = [...promotions, clonedPromo]
      setPromotions(updatedPromotions)
      localStorage.setItem('stt_merchant_promotions', JSON.stringify(updatedPromotions))
      return clonedPromo
    }
  }

  // --- Advertising CRUD ---
  const toggleCampaignStatus = (campaignId) => {
    const updatedCampaigns = adsCampaigns.map(c =>
      c.id === campaignId ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c
    )
    setAdsCampaigns(updatedCampaigns)
    localStorage.setItem('stt_merchant_ads_campaigns', JSON.stringify(updatedCampaigns))
  }

  const purchaseAdPackage = (packageId, type) => {
    if (type === 'internal') {
      const updatedInternal = adsInternal.map(p =>
        p.id === packageId ? { ...p, isActive: true } : p
      )
      setAdsInternal(updatedInternal)
      localStorage.setItem('stt_merchant_ads_internal', JSON.stringify(updatedInternal))
    } else if (type === 'external') {
      const updatedExternal = adsExternal.map(p =>
        p.id === packageId ? { ...p, isActive: true } : p
      )
      setAdsExternal(updatedExternal)
      localStorage.setItem('stt_merchant_ads_external', JSON.stringify(updatedExternal))
    }
  }

  const value = {
    merchant,
    venues,
    events,
    bookings,
    updateBooking,
    customers,
    updateCustomer,
    promotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    duplicatePromotion,
    adsCampaigns,
    adsInternal,
    adsExternal,
    toggleCampaignStatus,
    purchaseAdPackage,
    seedDemoData,
    loading,
    registerMerchant,
    loginMerchant,
    logoutMerchant,
    updateMerchant,
    addVenue,
    addEvent,
    updateEvent,
    cloneEvent,
    deleteEvent,
    addPackage,
    updatePackage,
    clonePackage,
    packageTemplates,
    addPackageTemplate,
    updatePackageTemplate,
    deletePackageTemplate,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    isMerchantAuthenticated: !!merchant
  }

  return (
    <MerchantContext.Provider value={value}>
      {children}
    </MerchantContext.Provider>
  )
}

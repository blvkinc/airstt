import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, ArrowLeft, Camera, ThumbsUp, ThumbsDown } from 'lucide-react'

const ReviewPage = () => {
  const { bookingId } = useParams()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState({
    pros: '',
    cons: '',
    overall: '',
    wouldRecommend: null
  })
  const [photos, setPhotos] = useState([])

  // Mock booking data
  const booking = {
    id: bookingId,
    event: "Luxury Brunch at Burj Al Arab",
    venue: "Al Muntaha Restaurant",
    date: "2024-11-28",
    time: "11:00 AM - 3:00 PM",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
  }

  const handleRatingClick = (value) => {
    setRating(value)
  }

  const handleInputChange = (field, value) => {
    setReview(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    // In a real app, you'd upload these to a server
    setPhotos(prev => [...prev, ...files.slice(0, 5 - prev.length)])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit review logic here
    alert('Review submitted successfully! It will be published after moderation.')
  }

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    }
    return texts[rating] || 'Rate your experience'
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto container-padding pt-24 pb-12">
        {/* Back Button */}
        <Link to="/profile" className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-500 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to My Bookings</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Share Your Experience</h1>
          <p className="text-neutral-600 text-lg">Help other diners discover great experiences</p>
        </div>

        {/* Booking Info */}
        <div className="card mb-8 border border-neutral-100">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <img
                src={booking.image}
                alt={booking.event}
                className="w-24 h-24 object-cover rounded-2xl"
              />
              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-1">{booking.event}</h3>
                <p className="text-neutral-600 mb-2">{booking.venue}</p>
                <p className="text-neutral-500">{booking.date} • {booking.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating */}
          <div className="card border border-neutral-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 text-center">Overall Rating</h2>
              
              <div className="text-center mb-6">
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      <Star
                        className={`w-12 h-12 ${
                          value <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xl font-semibold text-neutral-700">
                  {getRatingText(hoveredRating || rating)}
                </p>
              </div>
            </div>
          </div>

          {/* Written Review */}
          <div className="card border border-neutral-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Tell Us More</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-neutral-800 mb-3">
                    What did you love? ✨
                  </label>
                  <textarea
                    value={review.pros}
                    onChange={(e) => handleInputChange('pros', e.target.value)}
                    placeholder="Share what made your experience special..."
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-neutral-800 mb-3">
                    What could be improved? 🤔
                  </label>
                  <textarea
                    value={review.cons}
                    onChange={(e) => handleInputChange('cons', e.target.value)}
                    placeholder="Any suggestions for improvement..."
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-neutral-800 mb-3">
                    Overall Experience
                  </label>
                  <textarea
                    value={review.overall}
                    onChange={(e) => handleInputChange('overall', e.target.value)}
                    placeholder="Describe your overall experience..."
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="card border border-neutral-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Would you recommend this to others?</h2>
              
              <div className="flex justify-center space-x-6">
                <button
                  type="button"
                  onClick={() => handleInputChange('wouldRecommend', true)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    review.wouldRecommend === true
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-neutral-200 hover:border-green-300 text-neutral-600'
                  }`}
                >
                  <ThumbsUp className="w-6 h-6" />
                  <span className="font-semibold">Yes, I'd recommend it</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleInputChange('wouldRecommend', false)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    review.wouldRecommend === false
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-neutral-200 hover:border-red-300 text-neutral-600'
                  }`}
                >
                  <ThumbsDown className="w-6 h-6" />
                  <span className="font-semibold">Not really</span>
                </button>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="card border border-neutral-100">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Add Photos (Optional)</h2>
              
              <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors">
                <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">Share photos from your experience</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="btn-secondary cursor-pointer inline-block"
                >
                  Choose Photos
                </label>
                <p className="text-sm text-neutral-500 mt-2">Up to 5 photos, max 5MB each</p>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={rating === 0}
              className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
            <p className="text-neutral-500 text-sm mt-4">
              Your review will be published after moderation (usually within 24 hours)
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewPage
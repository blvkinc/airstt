import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Button } from '../../../../shared/ui/button'
import { Card, CardContent } from '../../../../shared/ui/card'

export function EventReviews({ reviews, userRating, setUserRating, userComment, setUserComment, isAuthenticated, handleReviewSubmit }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-gray-900">Write a Review</h3>
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="mb-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setUserRating(star)} className="transition-transform hover:scale-110 focus:outline-none">
                  <Star className={`h-8 w-8 ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} />
                </button>
              ))}
            </div>
            <textarea
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 outline-none"
              rows="4"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleReviewSubmit}
                disabled={userRating === 0 || !userComment.trim()}
                className="rounded-full bg-gray-900 px-6 text-white hover:bg-black"
              >
                Submit Review
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="mb-4 text-gray-600">Please log in to share your experience</p>
            <Link to="/auth">
              <Button variant="outline" className="rounded-full px-8">Log In</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="group rounded-3xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue p-[2px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-lg font-bold text-brand-purple">
                      {review.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{review.name}</div>
                    <div className="text-sm font-medium text-gray-500">{review.date}</div>
                  </div>
                </div>
                <div className="flex gap-1 rounded-full bg-gray-50 px-3 py-1.5">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className={`h-4 w-4 ${index < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="pl-[64px] text-lg leading-relaxed text-gray-600">"{review.comment}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

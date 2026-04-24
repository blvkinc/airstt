import { EventAvailabilityCalendar } from './EventAvailabilityCalendar'

export function EventAvailability({ event, selectedOccurrenceDate, onSelectOccurrence }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Upcoming Dates</h2>
        <p className="max-w-2xl text-gray-600">Choose a published date from the calendar. Available dates are fully bookable, limited dates remain selectable, and sold out dates stay visible but disabled.</p>
      </div>

      <EventAvailabilityCalendar
        occurrences={event.occurrences}
        selectedOccurrenceDate={selectedOccurrenceDate}
        onSelectOccurrence={onSelectOccurrence}
      />
    </div>
  )
}

import { getHomepagePlacements } from '../api'
import { mapEventCard } from '../mappers/eventMappers'
import { mapHomepagePlacements } from '../mappers/homepageMappers'

export async function getCatalogHomepagePlacements({ signal } = {}) {
  const { items: placements } = await getHomepagePlacements({ signal })

  return mapHomepagePlacements(placements).map((placement) => ({
    ...placement,
    events: placement.events
      .map((entry) => ({
        ...entry,
        event: mapEventCard(entry.event),
      }))
      .filter((entry) => entry.event),
  }))
}

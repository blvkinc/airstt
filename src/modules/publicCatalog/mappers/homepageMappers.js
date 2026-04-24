export const mapHomepagePlacementEvent = (entry) => {
  if (!entry) return null

  return {
    eventId: entry.event_id ?? null,
    sortOrder: entry.sort_order ?? null,
    event: entry.event ?? null,
  }
}

export const mapHomepagePlacement = (placement) => {
  if (!placement) return null

  return {
    id: placement.id,
    slug: placement.slug ?? null,
    title: placement.title ?? placement.name ?? null,
    subtitle: placement.subtitle ?? null,
    placementType: placement.placement_type ?? null,
    sortOrder: placement.sort_order ?? null,
    events: (placement.events || []).map(mapHomepagePlacementEvent).filter(Boolean),
  }
}

export const mapHomepagePlacements = (placements) => {
  if (!Array.isArray(placements)) return []
  return placements.map(mapHomepagePlacement).filter(Boolean)
}

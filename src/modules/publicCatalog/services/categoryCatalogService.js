import { listPublicEventCategories } from '../api'

const mapCatalogCategory = (category) => {
  if (!category) return null

  const displayName = category.name ?? category.slug ?? null

  if (!displayName) return null

  return {
    id: category.id ?? null,
    name: category.name ?? null,
    slug: category.slug ?? null,
    displayName,
  }
}

export async function listCatalogEventCategories({ signal } = {}) {
  const { items } = await listPublicEventCategories({ signal })
  return items.map(mapCatalogCategory).filter(Boolean)
}

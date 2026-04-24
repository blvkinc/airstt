import { normalizeResourceEnvelope } from '../../../shared/api/normalizeResponse'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizePublicEventOfferingPlatformAsset = (asset) => {
  if (!isPlainObject(asset)) return null

  return {
    ...asset,
    id: asset.id ?? null,
    key: asset.key ?? null,
    asset_family: asset.asset_family ?? null,
    file_id: asset.file_id ?? null,
    asset_url: asset.asset_url ?? null,
  }
}

const normalizePublicEventOfferingIconBadge = (iconBadge) => {
  if (!isPlainObject(iconBadge)) return null

  return {
    ...iconBadge,
    icon_key: iconBadge.icon_key ?? null,
    badge_label: iconBadge.badge_label ?? null,
    platform_asset_id: iconBadge.platform_asset_id ?? null,
  }
}

const normalizePublicEventOfferingGroupRecord = (group) => {
  if (!isPlainObject(group)) return null

  return {
    ...group,
    id: group.id ?? null,
    key: group.key ?? null,
    name: group.name ?? null,
    label: group.label ?? null,
    slug: group.slug ?? null,
    select_mode: group.select_mode ?? null,
    sort_order: group.sort_order ?? null,
    render_order: group.render_order ?? null,
    icon_key: group.icon_key ?? null,
    badge_label: group.badge_label ?? null,
    platform_asset_id: group.platform_asset_id ?? null,
    platform_asset: normalizePublicEventOfferingPlatformAsset(group.platform_asset),
    icon_badge: normalizePublicEventOfferingIconBadge(group.icon_badge),
    status: group.status ?? null,
  }
}

const normalizePublicEventOfferingValueRecord = (value) => {
  if (!isPlainObject(value)) return null

  return {
    ...value,
    id: value.id ?? null,
    key: value.key ?? null,
    name: value.name ?? null,
    label: value.label ?? null,
    slug: value.slug ?? null,
    sort_order: value.sort_order ?? null,
    render_order: value.render_order ?? null,
    status: value.status ?? null,
  }
}

const normalizePublicEventOfferingSelection = (selection) => {
  if (!isPlainObject(selection)) return null

  return {
    ...selection,
    assignment_id: selection.assignment_id ?? null,
    status: selection.status ?? null,
    is_assigned: selection.is_assigned ?? null,
    is_active: selection.is_active ?? null,
    is_selectable: selection.is_selectable ?? null,
    activated_at: selection.activated_at ?? null,
    deactivated_at: selection.deactivated_at ?? null,
    value: normalizePublicEventOfferingValueRecord(selection.value),
  }
}

export const normalizePublicEventOfferingGroup = (groupedOffering) => {
  if (!isPlainObject(groupedOffering)) return null

  return {
    ...groupedOffering,
    group: normalizePublicEventOfferingGroupRecord(groupedOffering.group),
    values: Array.isArray(groupedOffering.values)
      ? groupedOffering.values.map(normalizePublicEventOfferingSelection).filter(Boolean)
      : [],
  }
}

export const normalizePublicEventOfferings = (offerings) => {
  if (!Array.isArray(offerings)) return []

  return offerings.map(normalizePublicEventOfferingGroup).filter(Boolean)
}

export const normalizePublicEventOfferingsResponse = (payload) => {
  const data = normalizeResourceEnvelope(payload)

  return {
    event_id: data?.event_id ?? null,
    offerings: normalizePublicEventOfferings(data?.offerings),
  }
}

import { normalizeResourceEnvelope } from '../../../shared/api/normalizeResponse'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizePublicEventAvailabilitySettings = (settings) => {
  if (!isPlainObject(settings)) return null

  return {
    ...settings,
    inventory_hold_minutes: settings.inventory_hold_minutes ?? null,
  }
}

const normalizePublicEventAvailabilityCapacity = (capacity) => {
  if (!isPlainObject(capacity)) return null

  return {
    ...capacity,
    capacity_limit: capacity.capacity_limit ?? null,
    effective_capacity_limit: capacity.effective_capacity_limit ?? capacity.capacity_limit ?? null,
    capacity_limit_mode: capacity.capacity_limit_mode ?? null,
    capacity_source: capacity.capacity_source ?? null,
    is_capped: capacity.is_capped ?? false,
    committed_quantity: capacity.committed_quantity ?? 0,
    active_hold_quantity: capacity.active_hold_quantity ?? 0,
    allocated_quantity: capacity.allocated_quantity ?? 0,
    remaining_quantity: capacity.remaining_quantity ?? null,
    is_exhausted: capacity.is_exhausted ?? false,
    decision_reason: capacity.decision_reason ?? null,
    decision_reason_label: capacity.decision_reason_label ?? null,
  }
}

const normalizePublicEventAvailabilityLifecycle = (lifecycle) => {
  if (!isPlainObject(lifecycle)) return null

  return {
    ...lifecycle,
    effective_status: lifecycle.effective_status ?? null,
    is_bookable: lifecycle.is_bookable ?? null,
    capacity: normalizePublicEventAvailabilityCapacity(lifecycle.capacity),
  }
}

const normalizePublicEventAvailabilityEligibility = (eligibility) => {
  if (!isPlainObject(eligibility)) return null

  return {
    ...eligibility,
    is_eligible: eligibility.is_eligible ?? null,
    reason: eligibility.reason ?? null,
    package_type: eligibility.package_type ?? null,
    guest_count: eligibility.guest_count ?? null,
    label: eligibility.label ?? null,
    reason_label: eligibility.reason_label ?? null,
    package_type_label: eligibility.package_type_label ?? null,
  }
}

const normalizePublicEventAvailabilityState = (state) => {
  if (!isPlainObject(state)) return null

  return {
    ...state,
    has_occurrence_override: state.has_occurrence_override ?? null,
    configuration_mode: state.configuration_mode ?? null,
    configuration_mode_label: state.configuration_mode_label ?? null,
    inherits_event_package_defaults: state.inherits_event_package_defaults ?? null,
    decision_state: state.decision_state ?? null,
    decision_state_label: state.decision_state_label ?? null,
    decision_reason: state.decision_reason ?? null,
    decision_reason_label: state.decision_reason_label ?? null,
  }
}

const normalizePublicEventAvailabilityPricingSummary = (summary) => {
  if (!isPlainObject(summary)) return null

  return {
    ...summary,
    contract_version: summary.contract_version ?? null,
    currency: summary.currency ?? null,
    quantity: summary.quantity ?? null,
    payment_mode: summary.payment_mode ?? null,
    unit_price: summary.unit_price ?? null,
    base_unit_price: summary.base_unit_price ?? null,
    discount_amount: summary.discount_amount ?? null,
    line_total: summary.line_total ?? null,
    due_now: summary.due_now ?? null,
    due_later: summary.due_later ?? null,
    remaining_balance_amount: summary.remaining_balance_amount ?? null,
    deposit: isPlainObject(summary.deposit)
      ? {
          ...summary.deposit,
          type: summary.deposit.type ?? null,
          value: summary.deposit.value ?? null,
          due_now: summary.deposit.due_now ?? null,
        }
      : null,
  }
}

const normalizePublicEventAvailabilityEffective = (effective) => {
  if (!isPlainObject(effective)) return null

  return {
    ...effective,
    price: effective.price ?? null,
    base_unit_price: effective.base_unit_price ?? null,
    discount_amount: effective.discount_amount ?? null,
    pricing_summary: normalizePublicEventAvailabilityPricingSummary(effective.pricing_summary),
    price_source: effective.price_source ?? null,
    selected_variant: isPlainObject(effective.selected_variant)
      ? {
          ...effective.selected_variant,
          code: effective.selected_variant.code ?? null,
          label: effective.selected_variant.label ?? null,
        }
      : null,
    winning_rule: isPlainObject(effective.winning_rule) ? { ...effective.winning_rule } : null,
    discount: isPlainObject(effective.discount) ? { ...effective.discount } : null,
    inventory_remaining: effective.inventory_remaining ?? null,
    occurrence_capacity: normalizePublicEventAvailabilityCapacity(effective.occurrence_capacity),
    availability_status: effective.availability_status ?? null,
    availability_source: effective.availability_source ?? null,
    sales_cutoff_at: effective.sales_cutoff_at ?? null,
    sales_cutoff_source: effective.sales_cutoff_source ?? null,
    sales_closed: effective.sales_closed ?? null,
    excluded_from_occurrence_capacity: effective.excluded_from_occurrence_capacity ?? false,
    capacity_exemption_mode: effective.capacity_exemption_mode ?? null,
    decision_state: effective.decision_state ?? null,
    decision_reason: effective.decision_reason ?? null,
    is_applicable: effective.is_applicable ?? null,
    is_bookable: effective.is_bookable ?? null,
  }
}

const normalizePublicEventAvailabilityDebug = (debug) => {
  if (!isPlainObject(debug)) return null

  return {
    ...debug,
    trace: Array.isArray(debug.trace)
      ? debug.trace.map((entry) => (isPlainObject(entry) ? { ...entry } : entry)).filter((entry) => entry != null)
      : [],
  }
}

const normalizePublicEventAvailabilityPackage = (pkg) => {
  if (!isPlainObject(pkg)) return null

  return {
    ...pkg,
    id: pkg.id ?? null,
    event_package_id: pkg.event_package_id ?? pkg.id ?? null,
    variant_key: pkg.variant_key ?? null,
    family_key: pkg.family_key ?? null,
    venue_package_id: pkg.venue_package_id ?? null,
    display_name: pkg.display_name ?? null,
    name: pkg.name ?? null,
    audience_label: pkg.audience_label ?? null,
    audience_mode: pkg.audience_mode ?? null,
    audience_code: pkg.audience_code ?? null,
    compatibility_aliases: Array.isArray(pkg.compatibility_aliases) ? pkg.compatibility_aliases.filter(Boolean) : [],
    gender_config: isPlainObject(pkg.gender_config) ? { ...pkg.gender_config } : null,
    guest_count: pkg.guest_count ?? null,
    package_type: pkg.package_type ?? null,
    currency: pkg.currency ?? null,
    payment_mode: pkg.payment_mode ?? null,
    deposit_type: pkg.deposit_type ?? null,
    deposit_value: pkg.deposit_value ?? null,
    excluded_from_occurrence_capacity: pkg.excluded_from_occurrence_capacity ?? false,
    pricing_summary: normalizePublicEventAvailabilityPricingSummary(pkg.pricing_summary),
    eligibility: normalizePublicEventAvailabilityEligibility(pkg.eligibility),
    state: normalizePublicEventAvailabilityState(pkg.state),
    effective: normalizePublicEventAvailabilityEffective(pkg.effective),
    debug: normalizePublicEventAvailabilityDebug(pkg.debug),
  }
}

const normalizePublicEventAvailabilityPackageFamily = (family) => {
  if (!isPlainObject(family)) return null

  return {
    ...family,
    family_key: family.family_key ?? null,
    event_id: family.event_id ?? null,
    venue_package_id: family.venue_package_id ?? null,
    name: family.name ?? null,
    display_name: family.display_name ?? null,
    package_type: family.package_type ?? null,
    compatibility_aliases: Array.isArray(family.compatibility_aliases) ? family.compatibility_aliases.filter(Boolean) : [],
    variants: Array.isArray(family.variants)
      ? family.variants.map(normalizePublicEventAvailabilityPackage).filter(Boolean)
      : [],
  }
}

export const normalizePublicEventOccurrenceAvailability = (occurrence) => {
  if (!isPlainObject(occurrence)) return null

  return {
    ...occurrence,
    id: occurrence.id ?? null,
    slot_key: occurrence.slot_key ?? occurrence.occurrence_date ?? null,
    event_id: occurrence.event_id ?? null,
    starts_at: occurrence.starts_at ?? null,
    ends_at: occurrence.ends_at ?? null,
    has_afterparty: occurrence.has_afterparty ?? false,
    afterparty_starts_at: occurrence.afterparty_starts_at ?? null,
    afterparty_ends_at: occurrence.afterparty_ends_at ?? null,
    occurrence_date: occurrence.occurrence_date ?? null,
    persisted_occurrence_id: occurrence.persisted_occurrence_id ?? occurrence.event_occurrence_id ?? occurrence.id ?? null,
    lifecycle: normalizePublicEventAvailabilityLifecycle(occurrence.lifecycle),
    capacity: normalizePublicEventAvailabilityCapacity(occurrence.capacity ?? occurrence.lifecycle?.capacity),
    packages: Array.isArray(occurrence.packages)
      ? occurrence.packages.map(normalizePublicEventAvailabilityPackage).filter(Boolean)
      : [],
    package_families: Array.isArray(occurrence.package_families)
      ? occurrence.package_families.map(normalizePublicEventAvailabilityPackageFamily).filter(Boolean)
      : [],
  }
}

export const normalizePublicEventAvailabilityResponse = (payload) => {
  const data = normalizeResourceEnvelope(payload)

  return {
    event_id: data?.event_id ?? null,
    settings: normalizePublicEventAvailabilitySettings(data?.settings),
    occurrences: Array.isArray(data?.slots)
      ? data.slots.map(normalizePublicEventOccurrenceAvailability).filter(Boolean)
      : [],
  }
}

export const normalizePublicOccurrenceAvailabilityResponse = (payload) => {
  const data = normalizeResourceEnvelope(payload)

  return {
    event_id: data?.event_id ?? null,
    settings: normalizePublicEventAvailabilitySettings(data?.settings),
    occurrence: normalizePublicEventOccurrenceAvailability(data?.slot),
  }
}

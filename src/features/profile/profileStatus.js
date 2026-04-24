const STATUS_STYLES = {
  confirmed: 'bg-green-100 text-green-700 hover:bg-green-100',
  completed: 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/10',
  pending: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  payment_pending: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  cancelled: 'bg-red-100 text-red-700 hover:bg-red-100',
  canceled: 'bg-red-100 text-red-700 hover:bg-red-100',
}

export const normalizeProfileStatus = (value) => String(value || 'pending').trim().toLowerCase()

export const formatProfileStatus = (value) => {
  const normalized = normalizeProfileStatus(value)

  return normalized
    .split('_')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ') || 'Pending'
}

export const getProfileStatusBadgeClassName = (value) => (
  STATUS_STYLES[normalizeProfileStatus(value)] || 'bg-slate-100 text-slate-700 hover:bg-slate-100'
)

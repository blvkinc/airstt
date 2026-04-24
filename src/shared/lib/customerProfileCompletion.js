export const hasRequiredCustomerProfile = (user) => {
  const profile = user?.profile || {}

  return Boolean(
    profile.firstName?.trim()
      && profile.lastName?.trim()
      && profile.phone?.trim()
  )
}

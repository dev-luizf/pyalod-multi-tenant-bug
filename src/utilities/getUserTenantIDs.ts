import type { Organization, User } from '../payload-types'
import { extractID } from './extractID'

/**
 * Returns array of all tenant IDs assigned to a user
 *
 * @param user - User object with tenants field
 * @param role - Optional role to filter by
 */
export const getUserTenantIDs = (
  user: null | User,
  role?: NonNullable<User['organizations']>[number]['roles'][number],
): Organization['id'][] => {
  if (!user) {
    return []
  }

  return (
    user?.organizations?.reduce<Organization['id'][]>((acc, { roles, organization }) => {
      if (role && !roles.includes(role)) {
        return acc
      }

      if (organization) {
        acc.push(extractID(organization))
      }

      return acc
    }, []) || []
  )
}

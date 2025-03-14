import type { Access } from 'payload'

import { isSuperAdmin } from '../../../access/isSuperAdmin'

export const filterByTenantRead: Access = (args) => {
  // Allow public tenants to be read by anyone
  if (!args.req.user) {
    return {
      allowPublicRead: {
        equals: true,
      },
    }
  }

  return true
}

export const canMutateTenant: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  return {
    id: {
      in:
        req.user?.organizations
          ?.map(({ roles, organization }) =>
            roles?.includes('tenant-admin')
              ? organization && (typeof organization === 'object' && 'id' in organization ? organization.id : organization)
              : null,
          )
          .filter(Boolean) || [],
    },
  }
}

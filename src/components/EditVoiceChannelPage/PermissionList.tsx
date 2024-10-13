import React from 'react'
import PermissionListItem from './PermissionListItem'

function PermissionList() {
    const mockPermissions: string[] = ['Permission-1', 'Permission-2', 'Permission-3', 'Permission-4', 'Permission-5']
  return (
    <div className='flex flex-col gap-6'>
        {
            mockPermissions.map((permission, index) => (
                <PermissionListItem key={index} permission={permission} />
            ))
        }
    </div>
  )
}

export default PermissionList
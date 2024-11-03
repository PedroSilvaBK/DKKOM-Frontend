import React from 'react'
import IOSSwitch from './IOSSwitch'
import { Permission } from './PermissionType'

function CaveConfigRolesPermission({permission, role_permission, setFieldValue}: {permission: Permission, role_permission: number, setFieldValue: any}) {
    const hasPermission = () => {
        return (role_permission & permission.id) === permission.id;
    }

    const removePermission = () => {
        setFieldValue('permissions', role_permission & ~permission.id)
    }

    const addPermission = () => {
        setFieldValue('permissions', role_permission | permission.id)
    }

    const togglePermission = () => {
        if(hasPermission()) {
            removePermission()
        } else {
            addPermission()
        }
    }


    return (
        <div>
            <div className='flex justify-between'>
                <h1>{permission.name}</h1>
                <IOSSwitch sx={{ m: 1 }} checked={hasPermission()} onChange={togglePermission} />
            </div>
            <div>
                {
                    permission.description
                }
            </div>
        </div>
    )
}

export default CaveConfigRolesPermission
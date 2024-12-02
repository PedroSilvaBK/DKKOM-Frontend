import IOSSwitch from './IOSSwitch'
import { Permission } from './PermissionType'

function CaveConfigRolesPermission({permission, role_permission, addPermission, removePermission}: {permission: Permission, role_permission: number, addPermission: (permission: Permission) => void, removePermission: (permission: Permission) => void}) {
    const hasPermission = () => {
        return (role_permission & permission.id) === permission.id;
    }

    const togglePermission = () => {
        if(hasPermission()) {
            removePermission(permission)
        } else {
            addPermission(permission)
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
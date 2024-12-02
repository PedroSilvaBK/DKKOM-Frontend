import CaveConfigRolesPermission from './CaveConfigRolesPermission'
import { Permission } from './PermissionType'
import { CaveRole } from '../api/CaveServiceApi'

function CaveConfigRolesTab_Permissions({selectedRole, markRoleAsUpdated}: 
    {selectedRole: any, markRoleAsUpdated: (role: CaveRole[]) => void}) {
    const permissions: Permission[] = [
        {
            name: 'SEE_CHANNELS',
            id: 1,
            description: "This permission allows the user to see the channels in the server"
        },
        {
            name: 'MANAGE_CHANNELS',
            id: 1 << 2,
            description: "This permission allows the user to manage the channels in the server"
        },
        {
            name: 'CREATE_INVITES',
            id: 1 << 3,
            description: "This permission allows the user to create invites for the server"
        },
        {
            name: 'KICK_MEMBERS',
            id: 1 << 4,
            description: "This permission allows the user to kick members from the server"
        },
        {
            name: 'BAN_MEMBERS',
            id: 1 << 5,
            description: "This permission allows the user to ban members from the server"
        },
        {
            name: 'SEND_MESSAGES',
            id: 1 << 6,
            description: "This permission allows the user to send messages in the server"
        },
        {
            name: 'CONNECT_VOICE_CHANNELS',
            id: 1 << 7,
            description: "This permission allows the user to connect to voice channels in the server"
        },
        {
            name: 'SPEAK',
            id: 1 << 8,
            description: "This permission allows the user to speak in voice channels in the server"
        },
        {
            name: 'VIDEO',
            id: 1 << 9,
            description: "This permission allows the user to use video in voice channels in the server"
        },
        {
            name: 'MOVE_MEMBERS',
            id: 1 << 10,
            description: "This permission allows the user to move members in voice channels in the server"
        },
        {
            name: 'MANAGE_ROLES',
            id: 1 << 11,
            description: "This permission allows the user to manage roles in the server"
        },
        {
            name: 'ADMIN',
            id: 1 << 29,
            description: "This permission allows the user to do anything in the server"
        }
    ]

    const addPermission = (permission: Permission) => {
        const updatedPermissions = selectedRole.permissions | permission.id
        
        markRoleAsUpdated([{...selectedRole, permissions: updatedPermissions}])
    }

    const removePermission = (permission: Permission) => {
        const updatedPermissions = selectedRole.permissions & ~permission.id
        markRoleAsUpdated([{...selectedRole, permissions: updatedPermissions}])
    }

    return (
        <div className='flex flex-col gap-4 h-[35rem] overflow-y-scroll w-full'>
            {
                selectedRole && permissions.map((permission, index) => (
                    <>
                        <CaveConfigRolesPermission key={index} 
                        permission={permission} 
                        role_permission={selectedRole?.permissions || 0} 
                        addPermission={addPermission}
                        removePermission={removePermission}
                        />
                        <hr />
                    </>
                ))
            }
        </div>
    )
}

export default CaveConfigRolesTab_Permissions
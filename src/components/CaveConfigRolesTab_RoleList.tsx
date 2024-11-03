import { IconButton } from '@mui/material'
import { useRef } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { CaveRole, CreateCaveRoleRequest } from '../api/CaveServiceApi';
import { useCave } from './CaveProvider';

function CaveConfigRolesTab_RoleList({createCaveRole, Roles, handleRoleSelection, selectedRole}: {createCaveRole: (request: CreateCaveRoleRequest) => void, Roles: CaveRole[], handleRoleSelection: (role: CaveRole) => void, selectedRole: CaveRole | null}) {
    const defaultRolePermissions = 961;
    const {selectedCaveBaseInfo} = useCave();

    const roleInputNameRef = useRef<HTMLInputElement>(null);

    const createRole = () => {
        const request: CreateCaveRoleRequest = {
            caveId: selectedCaveBaseInfo?.caveId || '',
            name: roleInputNameRef.current?.value || '',
            permissions: defaultRolePermissions
        }

        createCaveRole(request);
    }

    return (
        <div className='self-start flex flex-col gap-3'>
            <div>
                <div className='flex items-center gap-2 bg-primary-100 rounded-lg'>
                    <input type="text" ref={roleInputNameRef} placeholder='Role Name' className='outline-none bg-primary-100 rounded-lg p-2 w-full' />
                    <IconButton onClick={createRole}>
                        <AddIcon className='text-secondary-100' />
                    </IconButton>
                </div>
            </div>
            <div>
                <div className='text-secondary-100 flex items-center flex-col gap-2'>
                    {
                        Roles?.map((role, index) => (
                            <div key={index} onClick={() => handleRoleSelection(role)} className={`${role.id === selectedRole?.id ? "bg-secondary-300" : ""} hover:bg-secondary-300 hover:cursor-pointer w-full rounded-lg text-center`}>
                                <span>{role.name}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default CaveConfigRolesTab_RoleList
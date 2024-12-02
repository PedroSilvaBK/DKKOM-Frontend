import { useEffect, useRef, useState } from 'react'
import { CaveRoleOverview, MemberOverview } from '../api/CaveServiceApi';
import { useCave } from './CaveProvider';
import permissionsService from './PermissionsService/PermissionsService';

function UserRoleMenuSelect({selectedMember, caveRoles, updateRoles, closeMenu}: {selectedMember: MemberOverview | null, caveRoles: CaveRoleOverview[] | null, updateRoles: (roles: string[], initialRoles: string[]) => void, closeMenu: () => void}) {
    const [selectedMemberRoles, setSelectedMemberRoles] = useState<string[]>([]);
    const [debouncedRoles, setDebouncedRoles] = useState<string[]>([]);
    const [displayedRoles, setDisplayedRoles] = useState<CaveRoleOverview[]>(caveRoles || []);
    const [hasChanges, setHasChanges] = useState(false); 
    const initialRoles = useRef<string[]>([]); 
    const menuRef = useRef<HTMLDivElement>(null);

    const {selectedCaveBaseInfo} = useCave()

    useEffect(() => {
        const memberRoleIds = selectedMember?.roles.map((role) => role.id) || [];
        initialRoles.current = memberRoleIds; 
        setSelectedMemberRoles(memberRoleIds); 
        setHasChanges(false);

    }, [selectedMember]);

    useEffect(() => {
        if (selectedMember && caveRoles && selectedCaveBaseInfo) {
            if (permissionsService.isOwnerOrAdmin(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)) {
                setDisplayedRoles(caveRoles);
                return;
            }

            const memberHighestRole = caveRoles.find((role) => role.id === selectedCaveBaseInfo?.userPermissionsCache.userRoles[0]);
            setDisplayedRoles(filterRolesUserCanAssign(caveRoles || [], memberHighestRole || caveRoles[0]));
        }
    }, [caveRoles]);

    const filterRolesUserCanAssign = (roles: CaveRoleOverview[], memberHighestRole: CaveRoleOverview) => {
        return roles.filter((role) => role.position > memberHighestRole.position);
    }


    useEffect(() => {
        if (hasChanges) {
            const debounceTimeout = setTimeout(() => {
                setDebouncedRoles(selectedMemberRoles);
            }, 1000);

            return () => clearTimeout(debounceTimeout);
        }
    }, [selectedMemberRoles, hasChanges]);

    useEffect(() => {
        if (hasChanges && debouncedRoles.length >= 0 && !areArraysEqual(initialRoles.current, debouncedRoles)) {

            console.log('Updating roles');
            console.log(debouncedRoles);
            updateRoles(debouncedRoles, initialRoles.current);
        }
    }, [debouncedRoles]);

    const areArraysEqual = (array1: string[], array2: string[]) => {
        return array1.length === array2.length && array1.every((value) => array2.includes(value));
    };

    const toggleRoleSelection = (roleId: string) => {
        setSelectedMemberRoles((prevDisplayRoles) => {
            setHasChanges(true);
            if (prevDisplayRoles.includes(roleId)) {
                return prevDisplayRoles.filter((id) => id !== roleId);
            } else {
                return [...prevDisplayRoles, roleId];
            }
        });
    };

    const isRoleSelected = (roleId: string) => selectedMemberRoles.includes(roleId);

    const handleClickOutside = (event: any) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            closeMenu();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


  return (
    <div className='bg-primary-100 w-[10rem] h-fit p-1 rounded-xl' ref={menuRef}>
    {
        displayedRoles && displayedRoles.map((role) => {
            return (
                <div key={role.id} onClick={() => toggleRoleSelection(role.id)} className='flex items-center justify-between hover:bg-secondary-300 p-1 pl-2 hover:cursor-pointer rounded-xl'>
                    <input type='checkbox' checked={isRoleSelected(role.id)} readOnly />
                    <h1 className='w-full text-center'>{role.name}</h1>
                </div>
            )
        })
    }
    </div>
  )
}

export default UserRoleMenuSelect
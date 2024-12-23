import { useEffect, useState } from 'react'
import { useCave } from './CaveProvider';
import caveServiceApi, { CaveRoleOverview, MemberOverview, UserStatus } from '../api/CaveServiceApi';
import UserRoleMenuSelect from './UserRoleMenuSelect';
import { useWebSocket } from './websockets/WebSockets';
import permissionsService from './PermissionsService/PermissionsService';

function UserPanel() {
    const { selectedCaveTextChannelId, selectedCaveBaseInfo } = useCave();
    const { newPresence, newCaveRole, roleAssignedToMember, userJoinedCave } = useWebSocket();

    const [usersGroupedByRoles, setUsersGroupedByRoles] = useState<UserList | null>(null);

    const [caveRoles, setCaveRoles] = useState<CaveRoleOverview[] | null>(null);

    const [selectedMember, setSelectedMember] = useState<MemberOverview | null>(null);

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    interface UserList {
        sideList: Map<string, MemberOverview[]>;
    }

    useEffect(() => {
        if (userJoinedCave) {
            setUsersGroupedByRoles((prevState) => {
                if (!prevState) return null;

                const updatedUsersGroupedByRoles = new Map(
                    Array.from(prevState.sideList).map(([key, members]) => [key, [...members]])
                );

                updatedUsersGroupedByRoles.set("online", [
                    ...(updatedUsersGroupedByRoles.get("online") || []),
                    {
                        id: userJoinedCave.memberId,
                        userId: userJoinedCave.userId,
                        username: userJoinedCave.username,
                        userStatus: UserStatus.ONLINE,
                        roles: [],
                    },
                ])

                return { sideList: updatedUsersGroupedByRoles };
            });
        }
    }, [userJoinedCave]);

    useEffect(() => {
        if (newPresence) {
            setUsersGroupedByRoles((prevState) => {
                if (!prevState) return null;

                // Clone the current state
                const updatedUsersGroupedByRoles = new Map(
                    Array.from(prevState.sideList).map(([key, members]) => [key, [...members]])
                );

                if (newPresence.status === UserStatus.ONLINE) {
                    let foundMember: MemberOverview | null = null;

                    // Find member in the "offline" group
                    const offlineMembers = updatedUsersGroupedByRoles.get('offline') || [];
                    offlineMembers.forEach((member) => {
                        if (member.userId === newPresence.userId) {
                            foundMember = member;
                        }
                    });

                    if (!foundMember) return prevState;

                    // Update status and move member to "online" group
                    (foundMember as MemberOverview).userStatus = UserStatus.ONLINE;
                    const updatedOfflineMembers = offlineMembers.filter((m) => m.userId !== newPresence.userId);
                    updatedUsersGroupedByRoles.set('offline', updatedOfflineMembers);

                    if ((foundMember as MemberOverview).roles.length === 0) {
                        updatedUsersGroupedByRoles.set('online', [
                            ...(updatedUsersGroupedByRoles.get('online') || []),
                            foundMember,
                        ]);
                    } else {
                        const highestRoleId = (foundMember as MemberOverview).roles[0].id;
                        updatedUsersGroupedByRoles.set(highestRoleId, [
                            ...(updatedUsersGroupedByRoles.get(highestRoleId) || []),
                            foundMember,
                        ]);
                    }
                } else if (newPresence.status === UserStatus.OFFLINE) {
                    let foundMember: MemberOverview | null = null;

                    // Find member across all groups
                    updatedUsersGroupedByRoles.forEach((members) => {
                        members.forEach((member) => {
                            if (member.userId === newPresence.userId) {
                                foundMember = member;
                            }
                        });
                    });

                    if (!foundMember) return prevState;

                    // Update status and move member to "offline" group
                    (foundMember as MemberOverview).userStatus = UserStatus.OFFLINE;

                    const highestRoleId = (foundMember as MemberOverview).roles.length > 0 ? (foundMember as MemberOverview).roles[0].id : 'online';
                    const updatedMembers = (updatedUsersGroupedByRoles.get(highestRoleId) || []).filter(
                        (m) => m.userId !== newPresence.userId
                    );
                    updatedUsersGroupedByRoles.set(highestRoleId, updatedMembers);

                    updatedUsersGroupedByRoles.set('offline', [
                        ...(updatedUsersGroupedByRoles.get('offline') || []),
                        foundMember,
                    ]);
                }

                return { sideList: updatedUsersGroupedByRoles };
            });
        }
    }, [newPresence]);

    useEffect(() => {
        if (newCaveRole) {
            setCaveRoles((prevRoles) => {
                if (!prevRoles) return prevRoles;

                const updatedRoles = [...prevRoles, {
                    id: newCaveRole.id,
                    name: newCaveRole.name,
                    position: newCaveRole.position,
                }];

                // Sort roles by position
                return updatedRoles.sort((a, b) => a.position - b.position);
            });
        }
    }, [newCaveRole]);

    useEffect(() => {
        if (roleAssignedToMember) {
            setUsersGroupedByRoles((prevState) => {
                if (!prevState) return null;

                // Clone the state
                const usersGroupedByRolesCopy = new Map(
                    Array.from(prevState.sideList).map(([key, members]) => [key, [...members]])
                );

                if (roleAssignedToMember.caveRoleOverviews.length === 0) {
                    // Remove the user from all roles
                    let memberOverview: MemberOverview | null = null;

                    usersGroupedByRolesCopy.forEach((members, roleId) => {
                        if (memberOverview) return;
                        members.forEach((member) => {
                            if (member.userId === roleAssignedToMember.userId) {
                                memberOverview = member;
                                const updatedMembers = members.filter((m) => m.userId !== roleAssignedToMember.userId);
                                usersGroupedByRolesCopy.set(roleId, updatedMembers);
                            }
                        });
                    });

                    if (memberOverview) {
                        const group = (memberOverview as MemberOverview).userStatus === UserStatus.ONLINE ? 'online' : 'offline';
                        usersGroupedByRolesCopy.set(group, [
                            ...(usersGroupedByRolesCopy.get(group) || []),
                            { ...(memberOverview as MemberOverview), roles: [] },
                        ]);
                    }

                    return { sideList: usersGroupedByRolesCopy };
                }

                // Assign new roles
                roleAssignedToMember.caveRoleOverviews.sort((a, b) => a.position - b.position);

                let processed = false;
                const newRoleId = roleAssignedToMember.caveRoleOverviews[0].id;

                usersGroupedByRolesCopy.get(newRoleId)?.forEach((member) => {
                    if (member.userId === roleAssignedToMember.userId) {
                        processed = true;
                        member.roles = roleAssignedToMember.caveRoleOverviews;
                    }
                });

                if (!processed) {
                    usersGroupedByRolesCopy.forEach((members, roleId) => {
                        members.forEach((member) => {
                            if (member.userId === roleAssignedToMember.userId) {
                                const updatedMembers = members.filter((m) => m.userId !== member.userId);
                                usersGroupedByRolesCopy.set(roleId, updatedMembers);

                                usersGroupedByRolesCopy.set(newRoleId, [
                                    ...(usersGroupedByRolesCopy.get(newRoleId) || []),
                                    { ...member, roles: roleAssignedToMember.caveRoleOverviews },
                                ]);
                            }
                        });
                    });
                }

                return { sideList: usersGroupedByRolesCopy };
            });
        }
    }, [roleAssignedToMember]);

    useEffect(() => {
        getCaveRolesOverview().then((roles) => {
            getCaveMembersFilteredByChannel(roles);
        });
    }, [selectedCaveTextChannelId])

    const getCaveMembersFilteredByChannel = (caveRoles: CaveRoleOverview[]) => {
        if (selectedCaveBaseInfo && selectedCaveTextChannelId) {
            caveServiceApi.getCaveMembersFilteredByChannel(selectedCaveBaseInfo.caveId, selectedCaveTextChannelId)
                .then((response) => {
                    buildUserList(response.memberOverviews, caveRoles)
                })
        }
    }

    const getCaveRolesOverview = (): Promise<CaveRoleOverview[]> => {
        if (!selectedCaveBaseInfo) {
            return Promise.reject(new Error("No selected cave base info."));
        }

        return caveServiceApi.getCaveRoles(selectedCaveBaseInfo.caveId)
            .then((response) => {
                setCaveRoles(response.caveRoles);
                return response.caveRoles; // Return the roles for chaining or further use
            });
    };

    const buildUserList = (users: MemberOverview[], roles: CaveRoleOverview[]) => {
        const userList: UserList = { sideList: new Map() };

        roles.sort((a, b) => a.position - b.position).forEach((role) => {
            userList.sideList.set(role.id, []);
        });

        userList.sideList.set('online', []);
        userList.sideList.set('offline', []);

        users.forEach((user) => {
            if (user.userStatus === UserStatus.OFFLINE) {
                userList.sideList.get('offline')?.push(user);
                return;
            }

            const roleId = user.roles[0]?.id || 'online';
            userList.sideList.get(roleId)?.push(user);
        });

        setUsersGroupedByRoles(userList);
    };

    const handleClickedUser = (e: any, userId: string, roleId: string) => {
        e.preventDefault();
        if (!selectedCaveBaseInfo) return;

        if (caveRoles?.length === 0) return;

        if (!permissionsService.canManageRoles(selectedCaveBaseInfo.userPermissionsCache.cavePermissions) && !permissionsService.isAdmin(selectedCaveBaseInfo.userPermissionsCache.cavePermissions)) {
            return;
        }

        const viewportWidth = window.innerWidth;

        let top = e.clientY;
        let left = e.clientX;

        const menuWidth = 160;

        if (left + menuWidth > viewportWidth) {
            left = left - menuWidth;
        }

        if (!usersGroupedByRoles) return;

        const usersInRole = usersGroupedByRoles.sideList.get(roleId);
        setSelectedMember(usersInRole ? usersInRole.find((user) => user.id === userId) || null : null);

        setMenuPosition({ top, left });

        setMenuVisible(true);
    };

    const closeMenu = () => setMenuVisible(false);

    const updateRoles = (newRoles: string[], oldRoles: string[]) => {
        console.log(selectedMember);
        if (!selectedCaveBaseInfo || !selectedMember) return;

        // Clone the current Map to avoid directly mutating state
        let updatedUsersGroupedByRoles = new Map(usersGroupedByRoles?.sideList || []);

        if (selectedMember.userStatus === UserStatus.OFFLINE) {
            const offlineUsers = updatedUsersGroupedByRoles.get('offline') || [];
            offlineUsers.forEach((user) => {
                if (user.id === selectedMember.id) {
                    user.roles = newRoles
                        .map((roleId) => caveRoles?.find((role) => role.id === roleId))
                        .filter((role): role is CaveRoleOverview => role !== null);
                }
            });
            updatedUsersGroupedByRoles.set('offline', offlineUsers);

            setUsersGroupedByRoles({ sideList: updatedUsersGroupedByRoles });
            caveServiceApi.assignRole(selectedCaveBaseInfo.caveId, { memberId: selectedMember.id, roleIds: newRoles });
            return;
        }

        // Remove the user from the old role group
        if (oldRoles.length === 0) {
            const onlineUsers = updatedUsersGroupedByRoles.get('online') || [];
            const filteredOnlineUsers = onlineUsers.filter((user) => user.id !== selectedMember.id);
            updatedUsersGroupedByRoles.set('online', filteredOnlineUsers);
        } else {
            const oldRoleUsers = updatedUsersGroupedByRoles.get(oldRoles[0]) || [];
            const filteredOldRoleUsers = oldRoleUsers.filter((user) => user.id !== selectedMember.id);
            updatedUsersGroupedByRoles.set(oldRoles[0], filteredOldRoleUsers);
        }

        // Add the user to the new role group
        if (newRoles.length === 0) {
            const onlineUsers = updatedUsersGroupedByRoles.get('online') || [];
            updatedUsersGroupedByRoles.set('online', [...onlineUsers, { ...selectedMember, roles: [] }]);
        } else {
            const roleWithLowestPosition = newRoles.reduce((lowest, roleId) => {
                const role = caveRoles?.find((role) => role.id === roleId);
                if (!role) return lowest;
                if (!lowest || role.position < lowest.position) return role;
                return lowest;
            }, null as CaveRoleOverview | null);

            const newRoleUsers = roleWithLowestPosition ? updatedUsersGroupedByRoles.get(roleWithLowestPosition.id) || [] : [];
            const memberRoles = caveRoles?.filter((role) => newRoles.includes(role.id)) || [];

            // Ensure the new role group exists
            if (roleWithLowestPosition?.id) {
                if (!updatedUsersGroupedByRoles.has(roleWithLowestPosition.id)) {
                    updatedUsersGroupedByRoles.set(roleWithLowestPosition.id, []);
                }

                // Add the user to the new role group
                updatedUsersGroupedByRoles.set(roleWithLowestPosition.id, [...newRoleUsers, { ...selectedMember, roles: memberRoles }]);
            }
        }

        // Update the state with the modified Map
        setUsersGroupedByRoles({ sideList: updatedUsersGroupedByRoles });

        // Call the API to assign roles
        caveServiceApi.assignRole(selectedCaveBaseInfo?.caveId, { memberId: selectedMember.id, roleIds: newRoles });
    };

    return (
        <div className='bg-primary-200 p-3 text-secondary-100 font-semibold flex flex-col gap-4'>
            <div>
                {
                    usersGroupedByRoles &&
                    Array.from(usersGroupedByRoles.sideList.entries()).map(([roleId, users]) => {
                        if (users.length === 0) return null; // Skip empty groups

                        return (
                            <div key={roleId} className="mt-2 flex flex-col gap-2">
                                <div className="flex items-center justify-between rounded-xl">
                                    <h1 className="w-full text-left">
                                        {roleId === 'online'
                                            ? 'Online'
                                            : roleId === 'offline'
                                                ? 'Offline'
                                                : users[0]?.roles[0]?.name || 'Role Name'}
                                    </h1>
                                </div>
                                {users.map((user, index) => (
                                    <div
                                        key={`${roleId}-${user.id}-${index}`} // Add index for fallback uniqueness
                                        onContextMenu={(e) => handleClickedUser(e, user.id, roleId)}
                                        className="flex gap-2 items-center hover:bg-secondary-300 p-1 pl-2 hover:cursor-pointer rounded-xl"
                                    >
                                        <div className="bg-white w-[2.5rem] h-[2.5rem] rounded-full"></div>
                                        <h1>{user.username}</h1>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                }
            </div>
            {
                menuVisible && (
                    <div className='absolute z-10' style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                    }}>
                        <UserRoleMenuSelect selectedMember={selectedMember} caveRoles={caveRoles} updateRoles={updateRoles} closeMenu={closeMenu} />
                    </div>
                )
            }
        </div>
    )
}

export default UserPanel
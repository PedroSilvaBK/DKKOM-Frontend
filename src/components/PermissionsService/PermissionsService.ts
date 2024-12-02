import { CavePermissions } from "./CavePermissions";

class PermissionsService {

    public checkCavePermission(userPermissions: number, permission: number): boolean {
        return this.hasPermission(userPermissions, permission);
    }

    private hasPermission(userPermissions: number, permission: number): boolean {
        if (userPermissions & CavePermissions.OWNER || userPermissions & CavePermissions.ADMIN) {
            return true;
        }
        return (userPermissions & permission) === permission;
    }

    public processChannelPermissionCheck(
        cavePermissions: number,
        channelPermissionsAllow: number,
        channelPermissionsDeny: number,
        cavePermission: number,
        channelPermission: number
    ): boolean {
        const isCaveAllowed = this.hasPermission(cavePermissions, cavePermission);

        if (channelPermissionsAllow === 0 && channelPermissionsDeny === 0) {
            return isCaveAllowed;
        }

        const isAllowed = this.hasPermission(channelPermissionsAllow, channelPermission);
        const isDenied = this.hasPermission(channelPermissionsDeny, channelPermission);

        if (isAllowed) {
            return true;
        } else if (isDenied) {
            return false;
        } else {
            return isCaveAllowed; 
        }
    }

    public canManageRoles(userPermissions: number): boolean {
        return this.hasPermission(userPermissions, CavePermissions.MANAGE_ROLES);
    }

    public isOwer(userPermissions: number): boolean {
        return this.hasPermission(userPermissions, CavePermissions.OWNER);
    }

    public isAdmin(userPermissions: number): boolean {
        return this.hasPermission(userPermissions, CavePermissions.ADMIN);
    }

    public isOwnerOrAdmin(userPermissions: number): boolean {
        return this.isOwer(userPermissions) || this.isAdmin(userPermissions);
    }

    public canManageChannels(userPermissions: number): boolean {
        return this.hasPermission(userPermissions, CavePermissions.MANAGE_CHANNELS);
    }

    public canCreateInvite(userPermissions: number): boolean {
        return this.hasPermission(userPermissions, CavePermissions.CREATE_INVITES);
    }

    public canSendMessage(userPermissions: number): boolean {
        return this.hasPermission(userPermissions, CavePermissions.SEND_MESSAGES);
    }
}

const permissionsService = new PermissionsService();
export default permissionsService;

import { UserInChannel } from "../components/VoiceChannelList";
import api from "./BaseApi";
import { User } from "./UserServiceApi";

interface CreateCaveRequest {
    name: string;
    ownerId: string;
}
interface CreateCaveResponse {
    id: string;
}

interface CaveBootStrapInformation {
    caveId: string;
    caveName: string;
    owner: string;
    voiceChannelsOverview: ChannelOverviewDTO[];
    textChannelsOverview: ChannelOverviewDTO[];
    userPermissionsCache: UserPermissionCache;
}

interface UserPermissionCache {
    cavePermissions: number;
    userRoles: string[];
    channelPermissionsCacheHashMap: {
        [channelId: string]: ChannelPermissionsCache; 
    };
}

interface ChannelPermissionsCache {
    allow: number;
    deny: number;
}

interface ChannelOverviewDTO {
    id: string;
    name: string;
}

interface VoiceChannelOverviewDTO extends ChannelOverviewDTO {
    connectedUsers: UserInChannel[];
}

interface CaveOverview {
    id: string;
    name: string;
}

interface GetCavesOverviewResponse {
    caveOverviews: CaveOverview[];
}


enum CaveInviteExpiration {
    THIRTY_MINUTES = "THIRTY_MINUTES",
    ONE_HOUR = "ONE_HOUR",
    SIX_HOURS = "SIX_HOURS",
    TWELVE_HOURS = "TWELVE_HOURS",
    ONE_DAY = "ONE_DAY",
    SEVEN_DAYS = "SEVEN_DAYS",
    NEVER = "NEVER",
}

interface CreateCaveInviteRequest {
    caveId: string;
    caveInviteExpiration: CaveInviteExpiration;
    maxUses: number;
}

interface CreateCaveInviteResponse {
    id: string;
}

interface JoinCaveResponse {
    caveId: string;
}

interface CreateCaveRoleRequest {
    caveId: string;
    name: string;
    permissions: number;
}

interface CreateCaveRoleResponse {
    id: string;
    name: string;
    position: number;
    permissions: number;
}

interface ChannelEntity {
    id: string;
    name: string;
    position: number;
}

interface CaveRole {
    id: string;
    caveId?: string;
    position: number;
    name: string;
    permissions: number;
}

interface GetCaveRolesResponse {
    caveRoles: CaveRole[];
}


interface CaveRoleOverview extends ChannelEntity {
}

interface GetCaveRolesOverviewResponse {
    caveRoles: CaveRoleOverview[];
}

enum UserStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
}

interface MemberOverview {
    id: string;
    userId: string;
    username: string;
    userStatus: UserStatus;
    roles: CaveRoleOverview[];
}

interface GetCaveMembersResponse {
    memberOverviews: MemberOverview[];
}

interface AssignRoleRequest {
    memberId: string;
    roleIds: string[];
}

interface UserPresence {
    userId: string;
    status: UserStatus;
}

interface CaveServiceApi {
    createCave(request: CreateCaveRequest): Promise<CreateCaveResponse>;
    getCaveBootStrapInformation(caveId: string): Promise<CaveBootStrapInformation>;
    getCavesOverviewByUserId(userId: string): Promise<GetCavesOverviewResponse>;

    assignRole(caveId: string, AssignRoleRequest: AssignRoleRequest): Promise<Boolean>;

    createCaveInvite(request: CreateCaveInviteRequest): Promise<CreateCaveInviteResponse>;
    joinCave(caveId: string): Promise<JoinCaveResponse>;

    getCaveMembers(caveId: string): Promise<GetCaveMembersResponse>;
    getCaveMembersFilteredByChannel(caveId: string, channelId: string): Promise<GetCaveMembersResponse>;

    createCaveRole(request: CreateCaveRoleRequest): Promise<CreateCaveRoleResponse>;
    getCaveRoles(caveId: string): Promise<GetCaveRolesResponse>;
    getCaveRolesOverview(caveId: string): Promise<GetCaveRolesOverviewResponse>;
    updateCaveRoles(request: CaveRole[]): Promise<Boolean>;
}

const caveServiceApi: CaveServiceApi = {
    createCave: (request) => { return api.post("/cave-service/cave", request).then((response) => response.data); },
    getCaveBootStrapInformation: (caveId) => { return api.get(`/cave-service/cave/${caveId}`).then((response) => response.data); },
    getCavesOverviewByUserId: (userId) => { return api.get(`/cave-service/cave/overview/${userId}`).then((response) => response.data); },

    assignRole: (caveId, request) => { return api.post(`/cave-service/cave/${caveId}/role/assign`, request).then((response) => response.data); },

    createCaveInvite: (request) => { return api.post(`/cave-service/cave/${request.caveId}/invite`, request).then((response) => response.data); },
    joinCave: (caveId) => { return api.get(`/cave-service/cave/invite/${caveId}`).then((response) => response.data); },

    getCaveMembers: (caveId) => { return api.get(`/cave-service/cave/${caveId}/members`).then((response) => response.data); },
    getCaveMembersFilteredByChannel: (caveId, channelId) => { return api.get(`/cave-service/cave/${caveId}/member/channel/${channelId}`).then((response) => response.data); },

    createCaveRole: (request) => { return api.post(`/cave-service/cave/${request.caveId}/role`, request).then((response) => response.data); },
    getCaveRoles: (caveId) => { return api.get(`/cave-service/cave/${caveId}/role`).then((response) => response.data); },
    getCaveRolesOverview: (caveId) => { return api.get(`/cave-service/cave/${caveId}/role/overview`).then((response) => response.data); },
    updateCaveRoles: (request) => { return api.patch(`/cave-service/cave/${request[0].caveId}/role`, request).then((response) => response.data); },
}

export default caveServiceApi;

export type { 
    CreateCaveRequest, 
    CreateCaveResponse, 
    CaveBootStrapInformation, 
    ChannelOverviewDTO, 
    CaveOverview, 
    GetCavesOverviewResponse, 
    CaveInviteExpiration, 
    CreateCaveInviteRequest, 
    CreateCaveInviteResponse,
    CreateCaveRoleRequest,
    CreateCaveRoleResponse,
    CaveRole,
    GetCaveRolesResponse,
    CaveRoleOverview,
    GetCaveRolesOverviewResponse,
    ChannelEntity,
    UserPermissionCache,
    MemberOverview,
    UserPresence,
    VoiceChannelOverviewDTO,
};

export { UserStatus }
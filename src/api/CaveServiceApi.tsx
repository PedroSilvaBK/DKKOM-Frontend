import api from "./BaseApi";

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
}
interface ChannelOverviewDTO {
    id: string;
    name: string;
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
    permissions: number;
}

interface ChannelEntity {
    id: string;
    name: string;
}

interface CaveRole {
    id: string;
    caveId?: string;
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

interface CaveServiceApi {
    createCave(request: CreateCaveRequest): Promise<CreateCaveResponse>;
    getCaveBootStrapInformation(caveId: string): Promise<CaveBootStrapInformation>;
    getCavesOverviewByUserId(userId: string): Promise<GetCavesOverviewResponse>;

    createCaveInvite(request: CreateCaveInviteRequest): Promise<CreateCaveInviteResponse>;
    joinCave(caveId: string): Promise<JoinCaveResponse>;

    createCaveRole(request: CreateCaveRoleRequest): Promise<CreateCaveRoleResponse>;
    getCaveRoles(caveId: string): Promise<GetCaveRolesResponse>;
    getCaveRolesOverview(caveId: string): Promise<GetCaveRolesOverviewResponse>;
    updateCaveRole(request: CaveRole): Promise<Boolean>;
}

const caveServiceApi: CaveServiceApi = {
    createCave: (request) => { return api.post("/cave-service/cave", request).then((response) => response.data); },
    getCaveBootStrapInformation: (caveId) => { return api.get(`/cave-service/cave/${caveId}`).then((response) => response.data); },
    getCavesOverviewByUserId: (userId) => { return api.get(`/cave-service/cave/overview/${userId}`).then((response) => response.data); },

    createCaveInvite: (request) => { return api.post(`/cave-service/cave/${request.caveId}/invite`, request).then((response) => response.data); },
    joinCave: (caveId) => { return api.get(`/cave-service/cave/invite/${caveId}`).then((response) => response.data); },

    createCaveRole: (request) => { return api.post(`/cave-service/cave/${request.caveId}/role`, request).then((response) => response.data); },
    getCaveRoles: (caveId) => { return api.get(`/cave-service/cave/${caveId}/role`).then((response) => response.data); },
    getCaveRolesOverview: (caveId) => { return api.get(`/cave-service/cave/${caveId}/role/overview`).then((response) => response.data); },
    updateCaveRole: (request) => { return api.patch(`/cave-service/cave/${request.caveId}/role`, request).then((response) => response.data); },
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
    ChannelEntity
};
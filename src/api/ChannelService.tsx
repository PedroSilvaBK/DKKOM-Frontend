import api from "./BaseApi";

enum ChannelType {
    VOICE_CHANNEL = "VOICE_CHANNEL",
    TEXT_CHANNEL = "TEXT_CHANNEL"
}

interface CreateChannelRequest {
    channelName: string;
    caveId: string;
    channelType: ChannelType;
}
interface CreateChannelResponse {
    id: string;
    name: string;
    type: ChannelType;
}

enum ChannelPermissionType {
    CAVE_ROLE = "CAVE_ROLE",
    USER = "USER"
}

interface CreateChannelRoleRequest {
    channelId: string;
    entityId: string;
    type: ChannelPermissionType;
    entityName: string
    allow: number;
    deny: number;
}

interface CreateChannelRoleResponse {
    id: string;
    channelId: string;
    entityId: string;
    entityName: string
    type: ChannelPermissionType;
    allow: number;
    deny: number;
}

interface ChannelRole {
    id: string;
    channelId: string;
    entityId: string;
    entityName: string
    type: ChannelPermissionType;
    allow: number;
    deny: number;
}

interface GetChannelRolesResponse {
    channelRoles: ChannelRole[];
}


interface ChannelServiceApi {
    createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse>;
    createChannelRole(request: CreateChannelRoleRequest): Promise<CreateChannelRoleResponse>;

    getChannelRoles(channelId: string): Promise<GetChannelRolesResponse>;
    updateChannelRole(request: ChannelRole): Promise<Boolean>;
}

const ChannelServiceApi: ChannelServiceApi = {
    createChannel: (request) => { return api.post("/cave-service/channel", request).then((response) => response.data); },
    createChannelRole: (request) => { return api.post(`/cave-service/channel/${request.channelId}/role`, request).then((response) => response.data); },

    getChannelRoles: (channelId) => { return api.get(`/cave-service/channel/${channelId}/role`).then((response) => response.data); },
    updateChannelRole: (request) => { return api.patch(`/cave-service/channel/${request.channelId}/role`, request).then((response) => response.data); }
}

export default ChannelServiceApi;

export type { CreateChannelRequest, CreateChannelResponse, CreateChannelRoleRequest, CreateChannelRoleResponse, ChannelRole, GetChannelRolesResponse }
export { ChannelType, ChannelPermissionType }
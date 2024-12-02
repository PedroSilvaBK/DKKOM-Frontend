import api from "./BaseApi";

interface WSAuthApi {
    getAuthToken: () => Promise<string>;
}

const wsAuthApi: WSAuthApi = {
    getAuthToken: () => { return api.get("/ws/auth").then((response) => response.data); },
}

export default wsAuthApi;

export type { WSAuthApi };
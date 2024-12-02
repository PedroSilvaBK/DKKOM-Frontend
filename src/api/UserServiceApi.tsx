import api from "./BaseApi";


interface User {
    id: string;
    username: string;
    email: string;
    name: string;
}

interface UserServiceApi {
    getUserById(userId: string): Promise<User>;
    updateUser(user: User): Promise<User>;
    getNewToken(): Promise<string>;
}

const UserServiceApi: UserServiceApi = {
    getUserById: (userId) => { return api.get(`/user-service/user/${userId}`).then((response) => response.data); },
    updateUser: (user) => { return api.put(`/user-service/user/${user.id}`, user).then((response) => response.data); },
    getNewToken: () => { return api.get('/user-service/user/token').then((response) => response.data); }
}


export default UserServiceApi;

export type { User }
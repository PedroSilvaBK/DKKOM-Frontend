import api from "./BaseApi";

interface Message {
    id: string
    channelId: string;
    content: string;
    author: MessageAuthor;
    timestamp: number;
    editedTimestamp: number | null;
    attachments: string[];
}

interface CreateMessageRequest {
    channelId: string;
    content: string;
    attachments?: string[];
}

interface MessageAuthor {
    id: string;
    username: string;
}

interface GetMessagesResponse {
    messages: Message[];
    nextPageState: string;
}

interface MessageServiceApi {
    sendMessage(message: CreateMessageRequest): void;
    getMessages(channelId: string, pageState: string): Promise<GetMessagesResponse>;
    exportMessages(userId: string): Promise<Blob>;
}

const MessageServiceApi: MessageServiceApi = {
    sendMessage: (message) => { return api.post(`/message-service/message/${message.channelId}`, message).then((response) => response.data); },
    getMessages: (channelId, pageState) => { return api.get(`/message-service/message/${channelId}?pageState=${pageState}`).then((response) => response.data as GetMessagesResponse); },
    exportMessages: (userId) => { return api.get(`/message-service/message/export-messages/${userId}`, { responseType: 'blob' }).then((response) => response.data); }
}


export default MessageServiceApi;

export type { Message, CreateMessageRequest, MessageAuthor, GetMessagesResponse }
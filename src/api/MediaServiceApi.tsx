import api from "./BaseApi";


interface MediaServiceApi {
    uploadImage(uploadImage: File): Promise<string>;
    getImage(id: string): Promise<Uint8Array>;
}

const MediaServiceApi: MediaServiceApi = {
    uploadImage: (uploadImage) => {
        const formData = new FormData();
        formData.append('file', uploadImage); 
    
        return api.post(`/media-service/images/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => response.data);
    },
    getImage: (id) => { return api.get(`/media-service/images/${id}`).then((response) => response.data); }
}


export default MediaServiceApi;
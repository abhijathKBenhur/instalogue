import AxiosInstance from "../wrapper/apiWrapper"

export const uploadImage = (payload) =>  { 
    return AxiosInstance.post("/uploadImage",payload) 
}

const CloudinaryInterface = {
    uploadImage
}

export default CloudinaryInterface

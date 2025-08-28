import AxiosInstance from "../wrapper/apiWrapper"

const AdminInterface = {
    authenticate: (payload) => {
        return AxiosInstance.post("/authenticate",payload)
    }
}

export default AdminInterface   
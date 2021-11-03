import _ from "lodash";
import AxiosInstance from "../wrapper/apiWrapper"

export const getStores = (payload) =>  { 
    return AxiosInstance.post("/getStores",payload) 
}

export const addStore = (payload) =>  { 
    return AxiosInstance.post("/addStore",payload) 
}
export const getCategories = (payload) =>  { 
    return AxiosInstance.post("/getCategories",payload) 
}
export const getSubCategories = (payload) =>  { 
    return AxiosInstance.post("/getSubCategories",payload) 
}

const CatalogueInterface = {
    getStores,
    addStore,
    getCategories,
    getSubCategories
}

export default CatalogueInterface
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

export const getProfileStats = () =>  { 
    return AxiosInstance.get('https://graph.instagram.com/me?fields=id,media_count&access_token=IGQVJYM3Nmc242THc3NTVyT21ENVF6N1dYVVdUTHEtNGR0aVgzNUZACSkdTWV80a2VPSHpiLUpyVHNQa0NjSXU2MF9pTEd3SXhhX3c0TkF1N2hGSEwxMlRkMFlDTDVpX3kwRE5fak9IQXNQT1VzSEVuYgZDZD')
}



const CatalogueInterface = {
    getStores,
    addStore,
    getCategories,
    getSubCategories,
    getProfileStats
}

export default CatalogueInterface
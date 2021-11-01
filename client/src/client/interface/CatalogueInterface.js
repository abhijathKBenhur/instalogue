import _ from "lodash";
import AxiosInstance from "../wrapper/apiWrapper"

export const getStores = (payload) =>  { 
    return AxiosInstance.post("/getStores",payload) 
}

const CatalogueInterface = {
    getStores
}

export default CatalogueInterface
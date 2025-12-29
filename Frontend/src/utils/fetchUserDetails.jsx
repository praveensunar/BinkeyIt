import Axios from "./axios"
import summaryApi from "../common/SummaryApi"
const fetchUserDetails = async()=>{
    try{

        const response = await Axios({
            ...summaryApi.userDetails
        })
        return response.data
    }catch(error){

    }
    
}
export default fetchUserDetails
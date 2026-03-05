import Axios from "./axios"
import summaryApi from "../common/SummaryApi"
const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...summaryApi.userDetails
        })
        return response.data
    } catch (error) {
        console.log("Error fetching user details", error)
        return { error: true, success: false, message: error.message }
    }
}
export default fetchUserDetails
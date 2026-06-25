import axios from "axios";
export const axiosInstance=axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true,            //sending the cookie from the server  
})

//Creating an axios instance (axios.create()) is useful when you need to:

//Set a Default baseURL (Avoid repeating the base API URL in every request)
//Enable withCredentials Globally (For authentication & cookies)
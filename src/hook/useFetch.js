import axios from "axios"

export const useFetch = async(url, request) => {
    const { status, data } = await axios(url, request);
    if ( 200 <= status < 300) {
        return data;
    } 
    else if (400 <= status < 500) {
        console.log(`request error : ${status}')`);
    } 
    else if (500 <= status < 600) {
        console.log(`server error : ${status}`);
    }
}
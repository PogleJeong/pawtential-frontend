import axios from "axios"

export const dataFromServer = async(url, request) => {
    const { status, data } = await axios(process.env.SERVER_URL + url, request);
    if ( 200 <= status < 300) {
        return data;
    } 
    else if (400 <= status < 500) {
        console.log(`request error : ${status}')`);
        return null;
    } 
    else if (500 <= status < 600) {
        console.log(`server error : ${status}`);
        return null;
    }
}
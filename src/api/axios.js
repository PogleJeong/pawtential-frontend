import axios from "axios"

const Method = {
    GET: "GET",
    POST: "POST",
};


// axios 는 option 의 validateStatus 가 default 값으로 200대의 status만 return 하게 되있음.
// axios 는 각 request 마다 작성하는 거싱 좋을 것 같음 (옵션이 많기때문에)

export const axiossss = async(url, method, request) => {

    // if (method == Method.GET) {
    //     const { status, data } = await axios.get(process.env.REACT_SERVER_URL + url, request);
    //     if ( 200 <= status < 300) {
    //         return data;
    //     } 
    //     else if (400 <= status < 500) {
    //         console.log(`request error : ${status}')`);
    //         return null;
    //     } 
    //     else if (500 <= status < 600) {
    //         console.log(`server error : ${status}`);
    //         return null;
    //     }
        
    // }

    // if (method == Method.POST) {
    //     const { status, data } = await axios.post(process.env.REACT_SERVER_URL + url, request);
    //     if ( 200 <= status < 300) {
    //         return data;
    //     } 
    //     else if (400 <= status < 500) {
    //         console.log(`request error : ${status}')`);
    //         return null;
    //     } 
    //     else if (500 <= status < 600) {
    //         console.log(`server error : ${status}`);
    //         return null;
    //     }
    // }
}
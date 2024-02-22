import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ADMIN_USER_STATIS } from "../../../constants/UrlPath";

const Container = styled.div`
    
`

function AdminUserStatis({ manager }) {

    const [ userStatis, setUserStatis ] = useState("")

    useEffect(()=>{
        // getUserStatis(); 
    },[]);

    const getUserStatis = async() => {
        await axios.get(ADMIN_USER_STATIS, {
            params: manager,
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                console.log("success to get user statis")
                setUserStatis(data);
            } else {
                console.log("fail to get user statis")
            }
        }).catch((error)=>{
            console.log("fail to get user statis", error);
        });
    };
    return(
        <Container>

        </Container>
    );
};

export default AdminUserStatis;
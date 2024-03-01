import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ADMIN_USER_STATIS } from "../../../constants/UrlPath";

const Container = styled.div`
    position: relative;
    padding: 20px;
    overflow-y: scroll;
    min-height: 800px;
    max-height: 80vh;
`

const UserBorderHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    h2 {
        font-size: 1.25rem;
        font-weight: bold;
        text-align: center;
    }
`

const UserStatisBorder = styled.div`

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
            <UserBorderHeader>
                <h2>유저 통계 패널</h2>
            </UserBorderHeader>
            <UserStatisBorder>
                
            </UserStatisBorder>
        </Container>
    );
};

export default AdminUserStatis;
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PAWTENS, USER_INFO } from "../../../constants/UrlPath";
import Pagination from "./components/Pagination";
import { useEffect, useState } from "react";
import { GET_USER_PAWTENS_LIST } from "../../../constants/ApiUrl";
import axios, { HttpStatusCode } from "axios";
import { testPawtensData } from "../../../test-data/pawtens-data";

const Container = styled.div`
    padding: 20px;
`

const Navibar = styled.div`
    padding: 10px 20px;
    border-bottom: 2px solid black;
    
    button {
        border: 1px solid black;
        border-radius: 5px;
        width: 80px;
        height: 40px;
        margin-right: 10px;
        transition: background-color 500ms;
        &:hover {
            background-color: gray;
        }
    }
`

const PawtensListBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 300px;
    gap: 20px;
    min-height: 800px;
    
    z-index: 1;
`

const VideoCard = styled.div`
    position: relative;
    padding: 10px;
    transition: scale 1s;
    
    &:hover{
        cursor: pointer;
        z-index: 3;
        background-color: #ebe5ddf2;
        transform-origin: center;
    }

    img {
        border-radius: 5px;
        width: 100%;
        height: 70%;
    }

    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 30%;
        max-height: 30%;
        
        padding: 10px;
        h2 {
            font-weight: bold;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 3px;
            font-size: 0.9rem;
            color: gray;
            &:last-child {
                display: flex;
                justify-content: space-between;
            }
        }   
    }
`

const matchBtnStyle = {
    color: "white",
    backgroundColor: "black"
}

function UserPawtensPostBorder() {
    const { params: { id, category } } = useMatch("/user/:id/:category");
    const navigator = useNavigate();
    const [ pawtensList, setPawtensList ] = useState(testPawtensData);
    const [ page, setPage ] = useState(1);

    useEffect(()=>{
        getUserPawtensList();
    },[page])

    const getUserPawtensList = async() => {
        await axios.get(GET_USER_PAWTENS_LIST, {
            params: {
                id,
                page
            },
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                setPawtensList(data);
            } else {
                console.log(status);
            }
        }).catch((error)=>{
            console.log("네트워크 연결이 필요합니다.");
        })
    }
    
    return(
        <Container>
            <Navibar>
                <button style={category === "pawtens" ? matchBtnStyle : null} onClick={()=>navigator(`${USER_INFO}/${id}/pawtens`)}>포텐스</button>
                <button style={category === "market" ? matchBtnStyle : null} onClick={()=>navigator(`${USER_INFO}/${id}/market`)}>마켓</button>
            </Navibar>
            <div>
                <PawtensListBox>
                {pawtensList.map((pawtens)=>(
                <VideoCard 
                    key={pawtens.pawtens_id} 
                    onClick={()=>navigator(`${PAWTENS}/${pawtens.pawtens_id}`)}>
                    <img src={pawtens.thumbnail} />
                    <div>
                        <h2>{pawtens.title}</h2>
                        <p>{pawtens.nickname}</p>
                        <p>
                            <span>관심수 {pawtens.like}</span> 
                            <span>조회수 {pawtens.view}</span> 
                        </p>
                    </div>
                </VideoCard>
            ))}
                </PawtensListBox>
                <div>
                    <Pagination
                        totalItems={pawtensList.length}
                        currentPage={page && parseInt(page) > 0 ? parseInt(page) : 1}
                        setPage={setPage}
                    />
                </div>
            </div>
        </Container>
    );
};

export default UserPawtensPostBorder;
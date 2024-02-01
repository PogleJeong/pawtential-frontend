import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { Card, Container, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { HOME } from "../../constants/UrlPath";
import { GET_USER_PET } from "../../constants/ApiUrl";
import { useCookies } from "react-cookie";

/**
 * 유저정보 확인하기
 * @returns 
 */

const testUserInfo = {
    id: "test1234",
    nickname: "테스트 닉네임",
    profile: process.env.PUBLIC_URL + "/images/logo_js.png"
}

const testUserPetListInfo = [
    {
        name: "흰둥이",
        sex: "남",
        introduce: "네모네모 멈멈미",
        profile: process.env.PUBLIC_URL + "/images/logo_js.png"
    },
    {
        name: "고등어",
        sex: "남",
        introduce: "고양고양 고양시",
        profile: process.env.PUBLIC_URL + "/images/logo_js.png"
    }
]

const UserInfoCard = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 15px;
    box-shadow: 2px 3px 5px 0px;
    background-color: rgba(0,0,0,0.1);
    margin: 50px 0px;
    padding: 30px 10px;
`

const PetInfoBox = styled.div`
    display: grid;
    max-width: 1400px;
    min-height: 400px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 300px;
    gap: 20px;
    margin: 50px 0px;
`

function UserInfo() {
    const params = useParams();
    const [ cookies ] = useCookies(["id", "nickname"]);
    const [ userInfo, setUserInfo ] = useState({
        id: "",
        nickname: "",
        profile: null
    });

    const [ petInfoList, setPetInfoList ] = useState([{
        name: "",
        sex: "",
        introduce: "",
        profile: "",
    }])
    
    useEffect(()=>{
        if (!params?.id) {
            alert("유저아이디없음");
            navigator(HOME)
        } 
        
        getUserInfo();
        getPetInfo();
    },[]);

    const getUserInfo = async() => {
        // await axios.get(`/user/${parmas?.id}`, null).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Ok) {
        //         const { data } = response;

        //     } else {
        //         alert("유저정보를 가져오지 못했습니다.");
        //         navigator(HOME);
        //     }
        // })
        setUserInfo(testUserInfo);
    }
    
    const getPetInfo = async() => {
        // await axios.get(GET_USER_PET, null).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Ok) {
        //         const { data } = response;
        //         setPetInfoList(data);
        //     } else {
        //         alert("해당 유저의 반려동물 정보를 불러오지 못했습니다.");
        //     }
        // });

        setPetInfoList(testUserPetListInfo);
    }

    const follow = async() => {

        const profile_user_id = params?.id;
        const login_user_id = cookies?.id;

        // 자기자신과 팔로우 할 수 없음.
        if (profile_user_id === login_user_id) {
            alert("자기자신과 팔로우 할 수 없습니다.");
            return;
        }
        const data = {
            follow_id: params?.id,
            user_id: cookies?.id
        }
        await axios.post("/user/follow", data, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert( userInfo?.nickname + "님을 팔로우하였습니다.");
            } else {
                alert("팔로우 중 에러가 발생하였습니다.");
            }
        });
    }

    const unfollow = async() => {

        const profile_user_id = params?.id;
        const login_user_id = cookies?.id;

        // 자기자신과 언팔로우 할 수 없음.
        if (profile_user_id === login_user_id) {
            alert("자기자신과 언팔로우 할 수 없습니다.");
            return;
        }

        const data = {
            follow_id: params?.id,
            user_id: cookies?.id,
        }

        await axios.post("/user/unfollow", data, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert( userInfo?.nickname + "님을 언팔로우하였습니다.");
            } else {
                alert("팔로우 취소 중 에러가 발생하였습니다.");
            }
        });
    }
    
    return (
        <Container>
            <UserInfoCard>
                <Image style={{maxWidth: "150px", maxHeight: "150px", borderRadius: "100%"}} src={userInfo?.profile} roundedCircle/>
                <div>
                    <h4>{userInfo?.nickname}</h4>
                </div>
                {params?.id !== cookies?.id &&
                <div>
                    <button onClick={follow}>Follow</button>
                    <button onClick={unfollow}>Unfollow</button>
                </div>
                }
                
            </UserInfoCard>
            <PetInfoBox>
            {petInfoList.map((petInfo, index)=>(
                <Card key={index}>
                    <div style={{display: "flex", alignContent: "center", justifyContent: "center", padding: "10px"}}>
                        <Card.Img style={{maxWidth: "150px", maxHeight: "150px", borderRadius: "100%"}} variant="top" src={petInfo?.profile}/>
                    </div>
                    <Card.Body style={{minHeight: "150px"}}>
                        <Card.Title>{petInfo?.name} | {petInfo?.sex}</Card.Title>
                        <Card.Text>
                            {petInfo?.introduce}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
            </PetInfoBox>
        </Container>
    );
}

export default UserInfo;
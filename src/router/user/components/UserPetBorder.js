import { useEffect, useState } from "react";
import styled from "styled-components";
import { testUserPetListInfo } from "../../../test-data/user-pet-data";
import axios, { HttpStatusCode } from "axios";
import { GET_USER_PET } from "../../../constants/ApiUrl";

const Container = styled.div`
    padding: 20px;
`

const DetailPetInfoBox = styled.div`
    display: flex;
    padding: 20px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.2);
    img {
        width: 150px;
        height: 150px;
    }
    div {
        padding: 5px 10px;
        div {
            margin-bottom: 10px;
            span {
                font-size: 0.9rem;
                &:first-child {
                    display: inline-block;
                    width: 60px;
                    color: gray;
                }
                &:last-child {
                    color: black;
                }
            }
        }
    }
`

const UserPetInfoList = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 20px;
`

const Card = styled.div`
    max-width: 200px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    margin: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: scale 1s;
    &:hover {
        scale: 1.05;
    }
    img {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #ddd;
    }
    div {
        padding: 20px;
        h2 {
            color: #007BFF;
        }
        p {
            margin: 10px 0;
        }
    }
`

function UserPetBorder() {
    const [ petInfoList, setPetInfoList ] = useState([{
        name: "",
        age: 0,
        sex: "",
        introduce: "",
        profile: "",
    }])

    const [ detailPetInfo, setDetailPetInfo ] = useState({
        name: "",
        age: 0,
        sex: "",
        introduce: "",
        profile: "",
    })

    useEffect(()=>{
        getUserPetInfo();
    },[])

    const getUserPetInfo = async() => {
        await axios.get(GET_USER_PET, {
            params: null,
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                setPetInfoList(data);
            } else {
                alert("해당 유저의 반려동물 정보를 불러오지 못했습니다.");
            }
        }).catch((error)=>{
            console.log("fail to get user pet info");
        })
        setPetInfoList(testUserPetListInfo);
    }

    const showDetailPetInfo = (petInfo) => {
        setDetailPetInfo(petInfo);
    }

    return(
        <Container>
            {detailPetInfo.name !== "" &&
                <DetailPetInfoBox>
                    <img src={detailPetInfo.profile} />
                    <div>
                        <div>
                            <span>이름</span>
                            &nbsp;
                            <span>{detailPetInfo.name}</span>
                        </div>
                        <div>
                            <span>나이</span>
                            &nbsp;
                            <span>{detailPetInfo.age}</span>
                        </div>
                        <div>
                            <span>성별</span>
                            &nbsp;
                            <span>{detailPetInfo.sex}</span>
                        </div>
                        <div>
                            <span>소개글</span>
                            &nbsp;
                            <span>{detailPetInfo.introduce}</span>
                        </div>
                    </div>
                </DetailPetInfoBox>
            }
             <UserPetInfoList>
            {petInfoList.map((petInfo, index)=>(
               <Card key={index} onClick={()=>showDetailPetInfo(petInfo)}>
                    <img src={petInfo.profile} />
                    <div>
                        <h2>{petInfo.name}({petInfo.sex})</h2>
                        <p>{petInfo.introduce}</p>
                    </div>
               </Card>
            ))}
            </UserPetInfoList>
        </Container>
    );
};

export default UserPetBorder;
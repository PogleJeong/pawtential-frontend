import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, Outlet, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";

import { HOME, USER_INFO } from "../../constants/UrlPath";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../constants/ApiUrl";
import { testUserInfo } from "../../test-data/user-info-data";

/**
 * 유저정보 확인하기
 * @returns 
 */

const Container = styled.div`
    margin-top: 30px;
    padding: 50px;
    width: 1200px;
    height: 1200px;
    max-height: 2000px;
    border: 1px solid black;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.23);
`

const UserProfileHeader = styled.div`
    margin-bottom: 60px;
    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
    }
`

const UserProfileBody = styled.div`
    display: grid;
    grid-template-columns: 1fr 4fr;
    height: 90%;
`

const UserProfileSideBar = styled.div`
    padding: 200px 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    height: 100%;
    ul {
        li {
            border: 1px solid black;
            padding: 10px 20px;
            margin-bottom: 10px;
            a {
                display: block;
                width: 100%;
            }
            &:hover {
                background-color: aliceblue;
            }
        }
    }
`

const UserInfoCard = styled.div`
    display: grid;
    grid-template-columns: 1fr 4fr;
    padding: 10px 30px;
`

const Profile = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 5px;    
`

const UserInfo = styled.div`
    padding: 20px;
    h2 {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 10px;
    }
`

const FollowInfo = styled.div`
    display: flex;
    padding: 10px;
    margin-bottom: 10px;
    span {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        font-size: 0.8rem;
        color: gray;
    }
`

const FollowBox = styled.div`
    button {
        border: none;
        border-radius: 5px;
        height: 30px;
        padding: 0px 10px;
        font-size: 0.8rem;
        font-weight: bold;
        color: white;
        &#follow__btn {
            background-color: skyblue;
        }
        &#unfollow__btn {
            background-color: firebrick;
        }
    }
`
const OutletBox = styled.div`
    padding: 20px;
`

const pageMatchStyle = {
    color: "white",
    backgroundColor: "skyblue",
}


function UserProfile() {
    const params = useParams();
    const [ cookies ] = useCookies(["id", "nickname"]);
    const [ userInfo, setUserInfo ] = useState({
        id: "",
        nickname: "",
        profile: null,
        follower: 0,
        follow: 0,
        isFollow: false,
    });
    const { params: { id, category }} = useMatch("/user/:id/:category");
    
    useEffect(()=>{
        if (!params?.id) {
            alert("해당 아이디의 유저는 존재하지 않습니다.");
            navigator(HOME);
            return;
        } 
        getUserInfo();
    },[]);

    const getUserInfo = async() => {
        await axios.get(`${USER_INFO}/${params?.id}`, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                console.log(data);
                setUserInfo(data);
            } else {
                alert("유저정보를 가져오지 못했습니다.");
                navigator(HOME);
            }
        }).catch((error)=>{
            console.log("인터넷에 연결되지 않았습니다.");
        })
        setUserInfo(testUserInfo.normal);
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
            follow_id: profile_user_id,
            user_id: login_user_id
        }
        await axios.post(FOLLOW_USER, data, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert( userInfo?.nickname + "님을 팔로우하였습니다.");
            } else {
                alert("팔로우 중 에러가 발생하였습니다.");
            }
        }).catch((error)=>{
            console.log("팔로우 중 에러가 발생하였습니다.");
        });
        // 서버 구축시 삭제수정
        toggleIsFollow("follow");
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
            follow_id: profile_user_id,
            user_id: login_user_id,
        }

        await axios.post(UNFOLLOW_USER, data, {
           baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert( userInfo?.nickname + "님을 언팔로우하였습니다.");
            } else {
                alert("팔로우 취소 중 에러가 발생하였습니다.");
            }
        }).catch((error)=>{
            console.log("팔로우 취소중 에러가 발생하였습니다.");
        });;
        // 서버 구축시 삭제수정
        toggleIsFollow("unfollow");
    }
    // 팔로우 및 언팔로우 시 버튼토글
    const toggleIsFollow = (type) => {
        console.log("시작")
        setUserInfo((userInfo)=>{
            const copy = {...userInfo};
            if (type === "follow") {
                copy.follower = userInfo.follower + 1;
            } else {
                copy.follower = userInfo.follower - 1;
            }
            copy.isFollow = !userInfo.isFollow;
            return copy;
        })
    }
    
    return (
        <Container>
            <UserProfileHeader>
                <h2>{userInfo.nickname} 님의 프로필</h2>
            </UserProfileHeader>
            <hr/>
            <UserProfileBody>
                <UserProfileSideBar>
                    <ul>
                        <li style={category === "pet" ? pageMatchStyle : null}>
                            <Link to={`${USER_INFO}/${userInfo.id}/pet`}>반려동물 정보</Link></li>
                        <li style={["pawtens", "market"].includes(category) ? pageMatchStyle : null}>
                            <Link to={`${USER_INFO}/${userInfo.id}/pawtens`}>작성 게시물</Link></li>
                        <li style={category === "comment" ? pageMatchStyle : null}>
                            <Link to={`${USER_INFO}/${userInfo.id}/comment`}>작성 댓글</Link></li>
                    </ul>
                </UserProfileSideBar>
                <div>
                    <UserInfoCard>
                        <Profile src={userInfo?.profile}/>
                        <UserInfo>
                            <div>
                                <h2>{userInfo?.nickname}({userInfo.id})</h2>
                            </div>
                            <FollowInfo>
                                <span>팔로워 {userInfo.follower}</span>
                                <span>팔로우 {userInfo.follow}</span>
                                <FollowBox>
                                    {userInfo.isFollow ? 
                                    <button id="unfollow__btn" onClick={unfollow}>Unfollow</button>
                                    :
                                    <button id="follow__btn" onClick={follow}>Follow</button>
                                    }
                                </FollowBox>
                            </FollowInfo>
                        </UserInfo>
                    </UserInfoCard>
                    <OutletBox>
                        <Outlet />
                    </OutletBox>            
                </div>
            </UserProfileBody>
           
        </Container>
    );
}

export default UserProfile;
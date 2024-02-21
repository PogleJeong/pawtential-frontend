import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import { GET_CONTEST_LIST } from "../../constants/ApiUrl";
import ContestList from "./component/ContestList";
import WinnerList from "./component/WinnerList";
import { Outlet } from "react-router-dom";

const testContestData = [
    {   
        seq: 0,
        id: "test1234",
        nickname: "테스트 닉네임1",
        title: "테스트 제목1",
        startDate: new Date(2023, 2, 3) - 100000000,
        endDate: new Date(2024, 2, 1),
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png", // 첫번째 이미지만 썸네일
    },
    {   
        seq: 1,
        id: "test1235",
        nickname: "테스트 닉네임2",
        title: "테스트 제목2",
        startDate: new Date() - 200000000,
        endDate: new Date(2024, 1, 28),
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png", // 첫번째 이미지만 썸네일
    },
    {   
        seq: 2,
        id: "test1235",
        nickname: "테스트 닉네임3",
        title: "테스트 제목3",
        startDate: new Date() - 300000000,
        endDate: new Date(2024, 3, 8),
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png", // 첫번째 이미지만 썸네일
    }
]

const Partition = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

/**
 * 컨테스트 : 관리자 주관. - 작성은 할 수 있는데 관리자가 허가해야함.
 * - 당첨자, 컨테스트 등 다 게시판 형식
 * - 내용은 들어가서 봐야함.
 * - 컨테스트의 카드형식은 최근 15개로 제한.
 */
function ContestHome() {

    const [ winnerList, setWinnerList ] = useState([{
        seq: 5,
        id: "test1234",
        nickname: "테스트 닉네임",
        title: "당첨자1"

    }])

    const [ contestList, setContestList ] = useState([{
        seq: 2,
        id: "test1235",
        nickname: "테스트 닉네임3",
        title: "테스트 제목1",
        startDate: new Date() - 3000000,
        endDate: new Date() + 3000000,
        thumbnail: process.env.REACT_APP_SERVER_URL + "/iamges/logo_js.png", // 첫번째 이미지만 썸네일
    }]);

    useEffect(()=>{
        // getContestList();
        setContestList(testContestData);
    }, [])

    const getContestList = async() => {
        await axios.get(GET_CONTEST_LIST, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                setContestList(data);
            } else {
                alert("콘테스트 정보를 가져오는데 실패하였습니다.");
            }
        }).catch((error)=>{
            alert("콘테스트 정보를 가져오는데 실패하였습니다.");
        })
    }

    return(
        <Container>
           
             
                <Outlet />
       
        </Container>
    );
};

export default ContestHome;
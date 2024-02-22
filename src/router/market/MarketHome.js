import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { MARKET } from "../../constants/UrlPath";
import MarketSideBar from "./border/MarketSideBar";
import MarketBorder from "./border/MarketBorder";

const testMarketData = [
    {
        id: 1,
        title: "테스트 제목1",
        writer: "test1",
        writer_nick: "작성자 닉네임1",
        state: "나눔",
        wdate: new Date(),
        posting: 5,
    },
    {
        id: 2,
        title: "테스트 제목2",
        writer: "test2",
        writer_nick: "작성자 닉네임2",
        state: "나눔",
        wdate: new Date(),
        posting: 1,
    },
    {
        id: 3,
        title: "테스트 제목3",
        writer: "test3",
        writer_nick: "작성자 닉네임3",
        state: "판매",
        wdate: new Date(),
        posting: 2,
    }
];

const Container = styled.div`
    display: flex;
    justify-content: center;
    min-height: 600px;
    max-height: 1000px;
    min-width: 2000px;
`

const MarketBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 4fr;
    max-width: 1500px;
`

/**
 * 마켓홈
 * - 처음은 all, type="", keyword="", page=1
 * - 분류: all / free / sell
 * - 검색옵션(type): title / content 등
 * - 검색키워드(keyword)
 * @returns 
 */
function MarketHome() {
    const [ searchParams ] = useSearchParams();
    const [ marketPreviewList, setMarketPreviewList ] = useState(testMarketData);
    const [ viewCount, setViewCount ] = useState(15); // 기본 15개 볼 수 있음.
    
    useEffect(()=>{
       getMarketData();
    },[searchParams, viewCount]) // Link 로 query params 가 바뀌면 감지를 해야함.

    const getMarketData = async() => {
        
        const queryParams = addQueryParams();

        // await axios.get(`MARKET?${queryParams}`, {   
        //     baseURL: process.env.REACT_APP_SERVER_URL,
        // }).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Ok) {
        //         const { data } = response;
        //         setMarketPreviewList(data);
        //     } else {
        //         alert("데이터를 가져오지 못했습니다.");
        //     }
        // }).catch((error)=>{
        //     alert("데이터를 가져오지 못했습니다.");
        // });
    }

    const addQueryParams = () => {
        const filter = searchParams.get("filter");
        const type = searchParams.get("type");
        const keyword = searchParams.get("keyword");
        const page = searchParams.get("page");
        const viewCount = searchParams.get("viewCount");

        const queryParams = [];

        // filter가 있다면 추가
        if (filter) {
          queryParams.push(`filter=${encodeURIComponent(filter)}`);
        }
      
        // type가 있다면 추가
        if (type) {
          queryParams.push(`type=${encodeURIComponent(type)}`);
        }
      
        // keyword가 있다면 추가
        if (keyword) {
          queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
        }
      
        // page가 있다면 추가
        if (page) {
            queryParams.push(`page=${encodeURIComponent(page)}`);
        } else {
            queryParams.push("page=1");
        }
      
        // viewCount가 있다면 추가
        if (viewCount) {
          queryParams.push(`viewCount=${encodeURIComponent(viewCount)}`);
        }
      
        return queryParams.join('&');
    }


    return(
        <Container>
            <MarketBox>
                <MarketSideBar filter={searchParams.get("filter") || "all"} />
                <MarketBorder marketPreviewList={marketPreviewList} page={searchParams.get("page")} viewCount={viewCount} setViewCount={setViewCount}/>
                <div>
                {/* {printAllMarket !== null? 
                <MarketList />
                :
                <Outlet />
                } */}
                </div>
            </MarketBox>
           
        </Container>
    );
};

export default MarketHome;
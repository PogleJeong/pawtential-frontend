import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Pagination, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";

/*
    market preview
    
    private int id;
    private String title;
    private String writer;
    private String writer_nick;
    private String state; // 판매 OR 나눔
    private Date wdate; // 오늘쓰여졌으면 시간으로, 이전날짜이면 
    private int posting; // 포스팅수

*/

const FlexColumnBox = styled.div`
   display: flex;
   flex-direction: column;
`

const SearchBar = styled.div`
    display: flex;
    flex-direction: row;
    padding: 50px 30%;

    input {
        min-width: 100px;
        width: 250px;
    }
    button {
        min-width: 50px;
    }
`

const testMarketData = [
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

function MarketSellList() {
      
    const [ marketPreviewList, setMarketPreviewList ] = useState(testMarketData);
    const [ index, setIndex ] = useState(0); // index 0 = page 1 ~ page 10, index 1 = page 11 ~ page 20 
    const [ maxPage, setMaxPage ] = useState(5); // test를 위해 5로 설정

    // 검색 params
    const [ type, setType ] = useState("전체")
    const [ keyword ,setKeyword ] = useState("");
    const [ page, setPage ] = useState(1);

    // 페이지 변경시 market 데이터 가져오기
    useEffect(()=>{
        // 전체 게시물 개수를 파악하는 로직 필요.
        // 만약 전체 게시물이 3개인데 page 개수가 4 이상 나오면 안됨.
        axios.get("/market/sell/border-page", null)
            .then((response)=>{
            const status = response?.status;
            if (200 <= status && status < 300) {
                const getBorderPage = response?.data;
                setMaxPage(()=>getBorderPage);
            } else {
                console.log("서버에러, 마켓 플레이스 전체의 최대 페이지수를 가져오지 못했습니다.");
            }
        })},[])

    useEffect(()=>{
        axios.get("/market/sell", {params: { type, keyword, page }})
        .then((response)=> {
            const status = response?.status;
            if ( 200 <= status && status < 300 ) {
                const getMarketData = response?.data;
                setMarketPreviewList((prevData)=>[...prevData, ...getMarketData]);
            }
        })
    }, [page, keyword])

    const dateFormat = (dateObject) => {
        const current = new Date();
        const currentYear = current.getFullYear();
        const currentMonth = current.getMonth();
        const currentDay = current.getDay();

        const isSameDay = currentYear === dateObject.getFullYear() && currentMonth === dateObject.getMonth() && currentDay === dateObject.getDay();
        if (isSameDay) {
            return dateObject.getHours() + ":" + dateObject.getMinutes();
        } else {
            if (currentYear === dateObject.getFullYear()) {
                return `${dateObject.getMonth}-${dateObject.getDay()}`;
            }
            return `${dateObject.getFullYear()}-${dateObject.getMonth}-${dateObject.getDay()}`;
        }
    }

    const goToPrevIndex = (currentIndex) => {
        const prevIndex = currentIndex - 1;
        if (prevIndex <= 0) {
            alert("처음 페이지 입니다.");
        } else {
            setIndex((prev)=>prev-1);
        }
    }

    const goToNextIndex = (currenIndex) => {
        const nextIndex = currenIndex + 1;
        if (nextIndex > Math.floor(maxPage / 10)) {
            alert("마지막 페이지 입니다.");
        } else {
            setIndex((prev)=>prev+1);
        }
    }

    // 검색버튼을 누르면 type 과 keyword 가 set 되면서 useEffect 가 작동하여 데이터가 fetch 됨.ㄴ
    const goToSearch = () => {
        const keyword = document.getElementById("keyword");
        const type = document.getElementById("type");
        setKeyword(keyword);
        setType(type);
    }
    

    return(
        <Container>
            <FlexColumnBox>
                <Table size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>작성자</th>
                            <th>제목</th>
                            <th>분류</th>
                            <th>작성날짜</th>
                            <th>포스팅</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketPreviewList.map(({id, writer, writer_nick, title, state, wdate, posting},index)  => (
                        <tr id={index}>
                            <td>{id}</td>
                            <td>
                                <Link to={`/user/${writer}`}>
                                    {writer_nick}
                                </Link>
                            </td>
                            <td><Link to={`/market/detail/${id}`}>{title}</Link></td>
                            <td>{state}</td>
                            <td>{dateFormat(wdate)}</td>
                            <td>{posting}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                
                <div>
                    <Pagination>
                        {0 < index && <Pagination.Prev onClick={goToPrevIndex(index)} />}
                        {[1,2,3,4,5,6,7,8,9,10].map((number)=>
                            (index*10 + number < Math.floor(maxPage / 10)) &&
                            <Pagination.Item onClick={()=>setPage(index*10 + number)}>{index*10 + number}</Pagination.Item>
                        )}
                        {index < Math.floor(maxPage / 10) && <Pagination.Next onClick={goToNextIndex(index)} />}
                    </Pagination>
                </div>
                <SearchBar>
                    <select id="type">
                        <option value="전체">전체</option>
                        <option value="제목">제목</option>
                        <option value="내용">내용</option>
                        <option value="카테고리">카테고리</option>
                    </select>
                    <input id="keyword" type="text" placeholder="검색어를 입력해주세요."/>
                    <input type="button" onClick={goToSearch}value="검색" />
                </SearchBar>
            </FlexColumnBox>
        </Container>
    );
};

export default MarketSellList;
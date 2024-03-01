import { Link, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MARKET, USER_INFO } from "../../../constants/UrlPath";
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { GET_USER_MARKET_LIST } from "../../../constants/ApiUrl";
import { testMarketListData } from "../../../test-data/market-data";
import { dateFormat } from "../../../util/UtilFunction";
import Pagination from "./components/Pagination";


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

const MarketListBox = styled.div`
    padding: 20px 0px;

`

const matchBtnStyle = {
    color: "white",
    backgroundColor: "black"
}

function UserMarketPostBorder() {
    const { params: { id, category } } = useMatch("/user/:id/:category");
    const navigator = useNavigate();
    const [ marketList, setMarketList ] = useState(testMarketListData);
    const [ page, setPage ] = useState(1);

    const getUserMarketList = async() => {
        await axios.get(GET_USER_MARKET_LIST, {
            params: {
                id,
                page
            },
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                setMarketList(data);
            } else {
                console.log(status);
            }
        }).catch((error)=>{
            console.log("네트워크 연결이 필요합니다.");
        })
    }
    
    useEffect(()=>{
        getUserMarketList();
    },[page])

    const viewMarketBorder = (market_id) => {
        navigator(MARKET + "/" + market_id);
    }
    return(
        <Container>
            <Navibar>
                <button style={category === "pawtens" ? matchBtnStyle : null} onClick={()=>navigator(`${USER_INFO}/${id}/pawtens`)}>포텐스</button>
                <button style={category === "market" ? matchBtnStyle : null} onClick={()=>navigator(`${USER_INFO}/${id}/market`)}>마켓</button>
            </Navibar>
            <MarketListBox>
                <div>
                <table size="sm">
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
                        {marketList.map(({id, writer, writer_nick, title, state, wdate, posting},index)  => (
                        <tr id={index} onClick={()=>viewMarketBorder(id)}>
                            <td>{id}</td>
                            <td>{writer_nick}</td>
                            <td>{title}</td>
                            <td>{state}</td>
                            <td>{dateFormat(wdate)}</td>
                            <td>{posting}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <div>
                    <Pagination
                        totalItems={marketList.length}
                        currentPage={page && parseInt(page) > 0 ? parseInt(page) : 1}
                        setPage={setPage}
                    />
                </div>
            </MarketListBox>

        </Container>
    );
};

export default UserMarketPostBorder;
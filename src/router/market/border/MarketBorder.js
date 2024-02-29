import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Pagination from "./components/Pagination";
import { dateFormat } from "../../../util/UtilFunction";
import { MARKET, MARKET_WRITE, USER_INFO } from "../../../constants/UrlPath";
import { useCookies } from "react-cookie";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start  ;
    padding: 10% 5%;
    padding: 100px 30px;
    border-left: 1px solid rgba(0,0,0,0.1);
    border-right: 1px solid rgba(0,0,0,0.1);
    border-bottom: 1px solid rgba(0,0,0,0.1);
    box-shadow: 3px 0 5px rgba(0, 0, 0, 0.1); 
    height: 800px;
`
const ViewCountBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    button {
        height: 30px;
        padding: 10px;
        font-size: 0.8rem;
        border: none;
        color: white;
        background-color:  #3498db;
        transition: background-color 1s;
        &:hover {
            background-color: black;
        }
    }
    span {
        display: inline-block;
        margin-right: 10px;
        line-height: 30px;
    }
`

const Border = styled.div`
    width: 100%;
`

function MarketBorder({marketPreviewList, page, viewCount, setViewCount}) {
    const [ cookies ] = useCookies(["id"]);
    const navigator = useNavigate();
    // 보는 게시물 수 달라지면 다시 검색.
    const changeBorderCount = (event) => {
        const selectViewCount = event.target.value;
        setViewCount(selectViewCount);
    }

    const writeMarketBorder = () => {
        navigator(MARKET_WRITE);
    }

    return(
        <Wrapper>
            <ViewCountBox>
                {cookies?.id && 
                <div>
                    <button onClick={writeMarketBorder}>게시물 작성하기</button>
                </div>}
                <div>
                    <span>표시개수</span>
                    <select onChange={changeBorderCount} >
                        <option value="20">20개</option>
                        <option value="40">40개</option>
                        <option value="60">60개</option>
                        <option value="80">80개</option>
                    </select>
                </div>
            </ViewCountBox>
            <Border>
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
                        {marketPreviewList.map(({id, writer, writer_nick, title, state, wdate, posting},index)  => (
                        <tr id={index}>
                            <td>{id}</td>
                            <td>
                                <Link to={`${USER_INFO}/${writer}`}>
                                    {writer_nick}
                                </Link>
                            </td>
                            <td><Link to={`${MARKET}/${id}`}>{title}</Link></td>
                            <td>{state}</td>
                            <td>{dateFormat(wdate)}</td>
                            <td>{posting}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Border>
            <div>
              <Pagination
                totalItems={marketPreviewList.length}
                currentPage={page && parseInt(page) > 0 ? parseInt(page) : 1}
                pageCount={5}
                itemCountPerPage={viewCount}>
              </Pagination>
            </div>
        </Wrapper>
    )
}

export default MarketBorder;
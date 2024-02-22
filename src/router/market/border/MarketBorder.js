import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import Pagination from "./components/Pagination";
import { dateFormat } from "../../../util/UtilFunction";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    justify-content: right;
    padding: 10px;

    span {
        display: inline-block;
        margin-right: 10px;
        line-height: 30px;
    }
`

const Border = styled.div`
    width: 100%;
`

const Paging = styled.div`
   
`
function MarketBorder({marketPreviewList, page, viewCount, setViewCount}) {

    const changeBorderCount = (element) => {
        const selectViewCount = element.target.value;
        setViewCount(selectViewCount);
    }

    return(
        <Wrapper>
            <ViewCountBox>
                <span>표시 게시물 개수</span>
                <select onChange={changeBorderCount} >
                    <option value="15">15개</option>
                    <option value="20">20개</option>
                    <option value="25">25개</option>
                    <option value="30">30개</option>
                </select>
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
            </table>
            </Border>
            <Paging>
              <Pagination
                totalItems={marketPreviewList.length}
                currentPage={page && parseInt(page) > 0 ? parseInt(page) : 1}
                pageCount={5}
                itemCountPerPage={viewCount}>
              </Pagination>
            </Paging>
        </Wrapper>
    )
}

export default MarketBorder;
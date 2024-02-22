import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    color: #888;
    font-size: 14px;

    li {
        float: left;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .page {
        margin: 0 5px;
        cursor: pointer;
        width: 25px;
        border-radius: 30px;
        border: solid 1px rgba(0, 0, 0, 0);
        text-align: center;
    }
    .page:hover {
        border: solid 1px #aaa;
    }

    .icon, .move:last-child::after, .move:first-child::before {
        position: absolute;
        font-size: 20px;
        padding: 0 7px 0px;
    }

    .move {
        position: relative;
        cursor: pointer;
        margin: 0 10px;
    }
    .move a {
        width: 50px;
        display: block;
        z-index: 10;
    }
    .move a:hover {
        text-decoration: underline;
    }
    .move:first-child {
        text-align: right;
    }
    .move:first-child::before {
        content: "<";
        left: 0;
    }
    .move:last-child::after {
        content: ">";
        right: 0;
        }

    .invisible {
        visibility: hidden;
    }

    .active {
        font-weight: 700;
        background: #2f5d62;
        color: white;
    }
`

function Pagination({totalItems, itemCountPerPage, pageCount, currentPage}) {
    
    const [ searchParams ] = useSearchParams();
    const [start, setStart] = useState(1);
    const totalPages = Math.ceil(totalItems / itemCountPerPage);
    const noPrev = start === 1;
    const noNext = start + pageCount - 1 >= totalPages;

    useEffect(() => {
        if (currentPage === start + pageCount) {
            setStart((prev) => prev + pageCount);
        }
        if (currentPage < start) {
            setStart((prev) => prev - pageCount);
        }
    }, [currentPage, pageCount, start]);

    const addQueryParams = (page) => {
        const filter = searchParams.get("filter");
        const type = searchParams.get("type");
        const keyword = searchParams.get("keyword");
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
        }
      
        // viewCount가 있다면 추가
        if (viewCount) {
          queryParams.push(`viewCount=${encodeURIComponent(viewCount)}`);
        }
      
        return queryParams.join('&');
    }

    return(
        <Wrapper>
            <ul>
                <li className={`move ${noPrev && "invisible"}`}>
                    <Link to={`?${addQueryParams(start - 1)}`}>이전</Link>
                </li>
                {[...Array(pageCount)].map((a, i) => (
                <>
                    {start + i <= totalPages && (
                    <li key={i}>
                        <Link className={`page ${currentPage === start + i && "active"}`}
                        to={`?${addQueryParams(start + i)}`}>
                        {start + i}
                        </Link>
                    </li>
                    )}
                </>
                ))}
                <li className={`move ${noNext && "invisible"}`}>
                    <Link to={`?${addQueryParams(start + pageCount)}`}>다음</Link>
                </li>
            </ul>
        </Wrapper>
    )
}

export default Pagination;
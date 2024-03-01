import { useEffect, useState } from "react";
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
const itemCountPerPage = 1; // 한페이지에 20개
const pageCount = 10; // 보여지는 페이지 단위 (1,2,3,4,5)

function Pagination({totalItems, currentPage, setPage}) {
    const [ start, setStart ] = useState(1);
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
    }, [pageCount, start]);

    return(
        <Wrapper>
            <ul>
                <li className={`move ${noPrev && "invisible"}`}>
                    <span onClick={()=>setPage(start - 1)}>이전</span>
                </li>
                {[...Array(pageCount)].map((count, index) => (
                <>
                    {start + index <= totalPages && (
                    <li key={index}>
                        <span className={`page ${currentPage === start + index && "active"}`}
                            onClick={()=>setPage(start + index)}
                        >
                        {start + index}
                        </span>
                    </li>
                    )}
                </>
                ))}
                <li className={`move ${noNext && "invisible"}`}>
                    <span onClick={()=>setPage(start + pageCount)}>다음</span>
                </li>
            </ul>
        </Wrapper>
    )
}

export default Pagination;
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_REPORT_RESULT } from "../../../constants/ApiUrl";
import Pagination from "../../market/border/components/Pagination";
import { useScroll } from "framer-motion";
import { reportResultTestData, reportTestData } from "../../../test-data/report-data";
import { useForm } from "react-hook-form";

const Container = styled.div`
    position: relative;
    padding: 20px;
    overflow-y: scroll;
    max-width: 100%;
    min-height: 800px;
    max-height: 80vh;
    .filter__box {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        background-color: #fff; /* 검색 바의 배경 색상 */
        border: 1px solid #ddd; /* 테두리 스타일 */
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;

        form {
            display: flex;
            align-items: center;
            justify-content: center;          
        }

        #filter_type {
            flex-grow: 1;
            height: 30px;
            margin-right: 3px;
            text-align: center;
        }
        
        #filter_keyword {
            width: 100%;
            height: 30px;
            padding: 10px;
            
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        button {
            width: 80px;
            height: 30px;
            background-color: #4caf50;
            color: #fff;
            padding: 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-size: 0.75rem;
            &:hover {
                background-color: #45a049;
            }
        }
    }

    /* 테이블 css */
    table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
       
    }
    th, td {
        padding: 6px 15px;
    }
    th {
        background: #42444e;
        color: #fff;
        text-align: center;
        font-size: 0.7em;
        font-weight: bold;
        padding: 10px 0px;
    }
    th:last-child {
        letter-spacing:-2px
    }
    tr:first-child th:first-child {
        border-top-left-radius: 6px;
    }
    tr:first-child th:last-child {
        border-top-right-radius: 6px;
    }
    td {
        border-right: 1px solid #c6c9cc;
        border-bottom: 1px solid #c6c9cc;
        font-size: 0.7em;
    }
    td:first-child {
        border-left: 1px solid #c6c9cc;
    }
    tr:nth-child(even) td {
        background: #eaeaed;
    }
    tr:last-child td:first-child {
        border-bottom-left-radius: 6px;
    }
    tr:last-child td:last-child {
        border-bottom-right-radius: 6px;
    }
    tr td:first-child {
        min-width: 30px;
        width: 40px;
        text-align: center;
    }
    tr td:nth-child(2) {
        min-width: 100px;
        width: 100px;
        max-width: 200px;
        text-align: center;
    }
    tr td:nth-child(3) {
        min-width: 60px;
        width: 60px;
        max-width: 100px;
    }
    tr td:nth-child(4) {
        min-width: 40px;
        width: 40px;
    }
    tr td:nth-child(5) {
        min-width: 100px;
        width: 100px;
        text-align: center;
    }
    tr td:nth-child(6) {
        min-width: 50px;
        width: 100px;
        text-align: center;
    }
    tr td:nth-child(7) {
        min-width: 300px;
        width: 300px;
        text-align: center;
    }
    tr td:nth-child(8) {
        min-width: 60px;
        width: 100px;
        text-align: center;
    }
    tr td:nth-child(9){
        min-width: 40px;
        width: 60px;
        text-align: center;
    }
    tr td:nth-child(10){
        min-width: 40px;
        width: 60px;
        text-align: center;
    }
    tr td:last-child {
        min-width: 40px;
        width: 60px;
        text-align: center;
    }
`

const UserBorderHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
    }
`

/**
 * 관리자의 신고결과 현황.
 */
function AdminReportResult({ manager }) {
    const [ reportResultList, setReportResultList ] = useState(()=>reportResultTestData(5));
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            type: "",
            keyword: "",
        },
        mode: "onSubmit"
    });

    useEffect(()=>{
        // getAdminReportResult();
    },[]);

    const getAdminReportResult = async() => { 
        await axios.get(GET_REPORT_RESULT, {
            params: {
                id: manager,
                page: 1,
            },
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                console.log("success to get results of Report")
                setReportResultList(data);
            } else {
                console.log("fail to get results of Report")
            }
        }).catch((error)=>{
            console.log("fail to get results of Report", error);
        })
    }
    return(
        <Container>
            <UserBorderHeader>
                <h2>신고처리현황 패널</h2>
            </UserBorderHeader>
            <div className="filter__box">
                <form onSubmit={handleSubmit(getAdminReportResult)}>
                    <select id="filter_type" {...register("type", {
                        required: "검색타입을 선택해주세요.",
                    })}>
                        <option value="">선택</option>
                        <option value="writer">작성자</option>
                        <option value="border_type">게시물종류</option>
                        <option value="report_type">신고유형</option>
                    </select>
                    <input id="filter_keyword" 
                        {...register("keyword",{
                        required: "검색키워드를 작성해주세요."
                    })} />
                    <button type="submit">검색</button>
                </form>
            </div>
            <div>
                <table size="sm">
                    <thead>
                        <tr>
                            <th>신고 ID</th>
                            <th>작성자</th>
                            <th>게시물종류</th>
                            <th>게시물ID</th>
                            <th>신고유형</th>
                            <th>제목</th>
                            <th>내용</th>
                            <th>신고날짜</th>
                            
                            <th>신고처리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportResultList.map((report)  => (
                        <tr id={report.report_id}>
                            <td>{report.report_id}</td>
                            <td>{report.reporter}</td>
                            <td>{report.border}</td>
                            <td>{report.border_id}</td>
                            <td>{report.category}</td>
                            <td>{report.title}</td>
                            <td>{report.content}</td>
                            <td>{report.wdate}</td>
                            <td>{report.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Container>
    );
};

export default AdminReportResult;
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_REPORT_RESULT } from "../../../constants/ApiUrl";
import Pagination from "../../market/border/components/Pagination";
import { useScroll } from "framer-motion";
import { reportTestData } from "../../../test-data/report-data";

const Container = styled.div`
    width: 100%;
    height: 100%;
`

/**
 * 관리자의 신고결과 현황.
 */
function AdminReportResult({ manager }) {
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ reportResultList, setReportResultList ] = useState(()=>reportTestData(5));

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
            <table size="sm">
                <thead>
                    <tr>
                        <th>신고 ID</th>
                        <th>작성자</th>
                        <th>신고목록</th>
                        <th>신고유형</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>신고날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {reportResultList.map((report)  => (
                    <tr id={report.report_id}>
                        <td>{report.report_id}</td>
                        <td>{report.reporter}</td>
                        <td>{report.category}</td>
                        <td>{report.title}</td>
                        <td>{report.content.slice(10) + "..."}</td>
                        <td>{dateFormat(report.wdate)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination 
                totalItems={reportResultList.length}
                itemCountPerPage={10}
                pageCount={null}
                currentPage={currentPage} 
            />
        </Container>
    );
};

export default AdminReportResult;
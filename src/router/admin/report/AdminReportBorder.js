import { useEffect, useState } from "react";
import styled from "styled-components";
import axios, { HttpStatusCode } from "axios";
import { reportTestData } from "../../../test-data/report-data";
import { ADMIN_REPORT_MANAGE } from "../../../constants/UrlPath";

const Container = styled.div`

`

function AdminReportBorder({ manager }) {
    const [ reportList, setReportList ] = useState(()=>reportTestData(20));

    useEffect(()=>{
        // getReportBorder();
    },[])
    const getReportBorder = async() => {
        await axios.get(ADMIN_REPORT_MANAGE, {
            params: manager,
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                console.log("success to get report border")
                setReportList(data);
            } else {
                console.log("fail to get report border")
            }
        }).catch((error)=>{
            console.log("fail to get report border", error);
        });
    };
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
                    {reportList.map((report)  => (
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
        </Container>
    );
};

export default AdminReportBorder;
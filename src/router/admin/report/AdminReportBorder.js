import { useEffect, useState } from "react";
import styled from "styled-components";
import axios, { HttpStatusCode } from "axios";
import { reportTestData } from "../../../test-data/report-data";
import { ADMIN_REPORT_MANAGE } from "../../../constants/UrlPath";
import { useNavigate } from "react-router-dom";
import { CANCEL_REPORT, REMOVE_REPORT } from "../../../constants/ApiUrl";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import ProcessReportModal from "./components/ProcessReportModal";

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

function AdminReportBorder() {
    const [ cookies ] = useCookies(["id", "nickname"]);
    const [ reportList, setReportList ] = useState(()=>reportTestData(20));
    const [ openModal, setOpenModal ] = useState(false);
    const [ selectedReport, setSelectedReport ] = useState({
        border_writer: "",
        border_id: "",
        border_type: "",
    })
    const navigator = useNavigate();

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
        getReportBorder();
    },[])

    // 신고 처리가 되지 않은 신고만 가져오기
    const getReportBorder = async() => {
        const queryParams = addQueryParams();
        queryParams.id = cookies?.id;
        console.log(queryParams);

        await axios.get(ADMIN_REPORT_MANAGE, {
            params: queryParams,
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

    const addQueryParams = () => {
        let params = {};
        const [ type, keyword ] = [ getValues("type"), getValues("keyword") ];
        if (type) {
            params.type = encodeURIComponent(type);
        } 
        if (keyword) {
            params.keyword = encodeURIComponent(keyword);
        }
        return params;
    }

    
    const viewReportedBorder = (border_type, border_id) => {
        navigator(`/${border_type}/${border_id}`);
    }

    // 신고된 게시물 각하
    const cancelReport = async(border_type, border_id) => {
        
        const data = {
            id: cookies?.id,
            border_type,
            border_id
        }

        await axios.post(CANCEL_REPORT, data, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if ( status === HttpStatusCode.Created) {
                alert("취소처리 하였습니다.");
            } else {
                alert("취소처리에 실패하였습니다.");
            }
        }).catch((error)=>{
            alert("취소처리에 실패하였습니다.");
        });

        window.location.reload();
    }

    // 신고된 게시물 삭제처리
    const removeReport = async(writer ,border_type, border_id) => {
        setSelectedReport((data)=> {
            const copy = {...data};
            copy.border_writer = writer;
            copy.border_id = border_id;
            copy.border_type = border_type
            return copy;
        })
        setOpenModal(true);
        // const data = {
        //     id: cookies?.id,
        //     border_type,
        //     border_id
        // }

        // await axios.post(REMOVE_REPORT, data, {
        //     baseURL: process.env.REACT_APP_SERVER_URL,
        // }).then((response)=>{
        //     const { status } = response;
        //     if ( status === HttpStatusCode.Created) {
        //         alert("삭제처리하였습니다.");
        //     } else {
        //         alert("삭제처리에 실패하였습니다.");
        //     }
        // }).catch((error)=>{
        //     alert("삭제처리에 실패하였습니다.");
        // });

        // window.location.reload();
    }


    return(
        <Container>
            <UserBorderHeader>
                <h2>신고현황 패널</h2>
            </UserBorderHeader>
            <div className="filter__box">
                <form onSubmit={handleSubmit(getReportBorder)}>
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
            {openModal &&
            <ProcessReportModal manager={cookies?.id} data={selectedReport} setOpenModal={setOpenModal} />}
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
                            <th>페이지이동</th>
                            <th colSpan="2">신고처리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportList.map((report)  => (
                        <tr id={report.report_id}>
                            <td>{report.report_id}</td>
                            <td>{report.reporter}</td>
                            <td>{report.border}</td>
                            <td>{report.border_id}</td>
                            <td>{report.category}</td>
                            <td>{report.title}</td>
                            <td>{report.content}</td>
                            <td>{report.wdate}</td>
                            <td><button onClick={()=>viewReportedBorder(report.border, report.border_id)}>이동</button></td>
                            <td><button onClick={()=>removeReport(report.writer, report.border, report.border_id)}>삭제</button></td>
                            <td><button onClick={()=>cancelReport(report.border, report.border_id)}>거부</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Container>
    );
};

export default AdminReportBorder;
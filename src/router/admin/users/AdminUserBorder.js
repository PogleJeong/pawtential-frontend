import { useEffect, useState } from "react";
import styled from "styled-components";
import { memberTestData } from "../../../test-data/member-data";
import axios, { HttpStatusCode } from "axios";
import { GET_USERS } from "../../../constants/ApiUrl";
import { useNavigate, useRouteError } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import ChangeUserStatusModal from "./modals/ChangeUserStatusModal";
import { useCookies } from "react-cookie";
import { LOGIN } from "../../../constants/UrlPath";

const Container = styled.div`
    position: relative;
    padding: 20px;
    overflow-y: scroll;
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
        &:hover {
            background-color: aqua;
        }
       
    }
    tr:last-child td:first-child {
        border-bottom-left-radius: 6px;
    }
    tr:last-child td:last-child {
        border-bottom-right-radius: 6px;
    }
    tr {
         td:hover {
            border: 1px solid black;
            cursor: pointer;
            background-color: aqua;
            z-index: 3;
        }
        td:first-child {
        min-width: 30px;
        width: 40px;
        text-align: center;
        }
        td:nth-child(2) {
            min-width: 100px;
            width: 100px;
            max-width: 200px;
            text-align: center;
        }
        td:nth-child(3) {
            min-width: 60px;
            width: 60px;
            max-width: 100px;
        }
        td:nth-child(4) {
            min-width: 40px;
            width: 40px;
        }
        td:nth-child(5) {
            min-width: 100px;
            width: 100px;
            text-align: center;
        }
        td:nth-child(6) {
            min-width: 100px;
            width: 100px;
            text-align: center;
        }
        td:last-child {
            min-width: 40px;
            width: 60px;
            text-align: center;
        }
    }
`

const UserBorderHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    h2 {
        font-size: 1.25rem;
        font-weight: bold;
        text-align: center;
    }
`

function AdminUserBorder() {
    const [ cookies ] = useCookies(["id", "nickname"]);
    const [ memberList, setMemberList ] = useState(()=>memberTestData(30));
    const [ modalData, setModalData ] = useState({
        open: false,
        data: null,
    })
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
        getUserList();
    },[])

    const getUserList = async() => {
        
        const queryParams = addQueryParams();
        console.log(queryParams);
        await axios.get(GET_USERS, {
            params: queryParams,
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                setMemberList(data);
            } else {
                console.log("fail to get user list");
            }
        }).catch((error)=>{
            console.log("fail to get user list");
        })
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

    const handleClickUserInfo = (member) => {
        setModalData((modalData)=> {
            let copy = {...modalData};
            copy.open = true;
            copy.data = member;
            return copy;
        });
    }

    return(
        <Container>
            <UserBorderHeader>
                <h2>유저 계정 패널</h2>
            </UserBorderHeader>
            <div className="filter__box">
                <form onSubmit={handleSubmit(getUserList)}>
                    <select id="filter_type" {...register("type", {
                        required: "검색타입을 선택해주세요.",
                    })}>
                        <option value="">=선택=</option>
                        <option value="id">유저ID</option>
                        <option value="nickname">닉네임</option>
                    </select>
                    <input id="filter_keyword" 
                        {...register("keyword",{
                        required: "검색키워드를 작성해주세요."
                    })} />
                    <button type="submit">검색</button>
                </form>
            </div>
            {modalData.open &&
            <ChangeUserStatusModal 
                manager={cookies?.id} 
                data={modalData.data} 
                setModalData={setModalData}
            />}
            <div>
                <table size="sm">
                    <thead>
                        <tr>
                            <th>유저ID</th>
                            <th>닉네임</th>
                            <th>이름</th>
                            <th>성별</th>
                            <th>생년월일</th>
                            <th>이메일</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberList.map((member)  => (
                        <tr id={member.id} onClick={()=>handleClickUserInfo(member)}>
                            <td>{member.id}</td>
                            <td>{member.nickname}</td>
                            <td>{member.name}</td>
                            <td>{member.sex}</td>
                            <td>{member.birth}</td>
                            <td>{member.email}</td>
                            <td>{member.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            
        </Container>
    );
};

export default AdminUserBorder;
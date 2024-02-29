import axios, { HttpStatusCode } from "axios";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import styled from "styled-components"
import { REPORT } from "../../../../constants/ApiUrl";

const Container = styled.div`
    position: absolute;
    left: 800px;
    background: #fff;
    width: 400px;
    max-width: 400px;
    height: 500px;
    max-height: 500px;
    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    z-index: 3;
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    h2 {
        width: 100%;
        height: 30px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        color: black;
        
        font-weight: bold;
    }
    select {
        width: 100%;
        padding: 12px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        appearance: none; /* 기본 스타일 제거 (모바일에서 특히 유용) */
        background: #fff; /* 선택된 옵션 배경색 */
        background-image: url('data:image/svg+xml;utf8,<svg fill="%23333" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'); /* 화살표 아이콘 추가 */
        background-repeat: no-repeat;
        background-position: right 8px center;
        cursor: pointer;
        &:checked {
            background: #007bff;
            color: #fff;
        }
        &:hover {
            background: #f5f5f5;
        }
    }
    textarea {
        width: 100%;
        min-height: 300px;
        max-height: 300px;
        padding: 10px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    button {
        &:first-child {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 200ms;
            
            &:hover {
                background-color: #0056b3;
            }
            &:active {
                background-color: #003366;
            }
        }
        &:last-child {
            background-color:  #ccc;
            color: #333;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 200ms;
            
            &:hover {
                background-color: #999;
            }
            &:active {
                background-color: #666;
            }
        }
    }
`

function ReportModal({setReportModal}) {
    const [ cookies ] = useCookies(["id"]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            reporter: cookies?.id,
            border: "market",
            category: "",
            content: "",
        }
    })

    const goToReport = async(data) => {
        console.log(data);
        // await axios.post(REPORT, data, {
        //     baseURL: process.env.REACT_APP_SERVER_URL
        // }).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Created) {
        //         alert("해당 게시물을 신고하였습니다.");
        //         setReportModal(false);
        //     } else {
        //         alert("해당 게시물 신고에 실패하였습니다.");
        //     }
        // }).catch((error)=>{
        //     alert("해당 게시물 신고에 실패하였습니다.");
        // });
        setReportModal(false);
    }

    return(
        <Container>
            <form onSubmit={handleSubmit(goToReport)}>
                <h2>게시물 신고하기</h2>
                <div>
                    <select {...register("category", {
                        required: "신고유형을 선택해주세요"
                    })}>
                        <option value="">신고유형을 선택해주세요</option>
                        <option value="1">욕설 및 부적절</option>
                        <option value="2">광고</option>
                        <option value="3">기타</option>
                    </select>
                    <textarea {...register("content", {
                        required: "신고내용을 작성해주세요",
                        maxLength: {
                            value: 200,
                            message: "200자 이내로 작성해주세요"
                        }
                    })}
                    rows="15"
                    placeholder="신고내용을 작성해주세요"
                    />
                </div>
                <div>
                    <button type="submit">신고하기</button>
                    <button type="reset" onClick={()=>setReportModal(false)}>취소하기</button>
                </div>
            </form>
        </Container>
    );
};

export default ReportModal;
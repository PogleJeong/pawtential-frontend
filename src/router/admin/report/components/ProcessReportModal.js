import axios, { HttpStatusCode } from "axios";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { REMOVE_REPORT } from "../../../../constants/ApiUrl";

const Container = styled.div`
    position: absolute;
    left: 25%;
    background: #fff;
    width: 50%;
    max-width: 800px;
    height: 600px;
    max-height: 600px;
    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    z-index: 3;
    h2 {
        width: 100%;
        height: 30px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        color: black;
        
        font-weight: bold;
    }
    form {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
`

const FormBox = styled.div`
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
`

const FormGroup = styled.div`
    width:100%;
    margin-bottom: 20px;
    input {
        width: 100%;
        height: 40px;
        padding-left: 10px;
    }
    label {
        display: block;
        padding-bottom: 3px;
        font-size: 0.8rem;
        font-weight: bold;
        border-bottom: 2px solid black;
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
        min-height: 100px;
        max-height: 200px;
        padding: 10px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    small {
        color: red;
        font-size: 0.8rem;
    }
`

const BtnBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
      button {
        margin: 0px 10px;
        &:first-child {
            background-color: #ff5555;
            color: #fff;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 200ms;
            
            &:hover {
                background-color: #ff0000;
            }
            &:active {
                background-color: #ff0000;
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

// data 는 신고게시물에 대한 정보
function ProcessReportModal({ manager, data, setOpenModal }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {
            manager: manager,
            category: "",
            reason: "", // 규제이유
        },
        mode: "onSubmit"
    })

    const removeReportBorder = async(formData) => {
        console.log(data); // 
        formData.border_id = data.border_id;
        formData.border_type = data.border_type;
        formData.border_writer = data.border_writer;
        console.log("최종 data", formData);
        await axios.post(REMOVE_REPORT, formData, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert("해당 게시물이 삭제처리 되었습니다.");
                window.location.reload();
            } else {
                console.log("fail to change user status");
            }
        }).catch((error)=>{
            console.log("fail to change user status");
        })

    } 

    return(
        <Container>
            <h2>게시물 삭제</h2>
            <form onSubmit={handleSubmit(removeReportBorder)}>
                <FormBox>
                    <FormGroup>
                        <label htmlFor="manager">처리자</label>
                        <input id="manager" 
                        {...register("manager", {
                            required: "로그인이 필요합니다.",
                        })}
                        disabled
                        />
                        {errors?.manager && <small>{errors?.manager.message}</small>}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="category">삭제유형</label>
                        <select id="category"
                        {...register("category", {
                            required: "삭제유형을 선택해주세요."
                        })}>
                            <option value="">신고유형을 선택해주세요</option>
                            <option value="1">욕설 및 부적절</option>
                            <option value="2">광고</option>
                            <option value="3">기타</option>
                        </select>
                        {errors?.category && <small>{errors?.category.message}</small>}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="reason">삭제사유</label>
                        <textarea id="reason" 
                        {...register("reason", {
                            required: "정지이유를 작성해주세요.",
                            maxLength: {
                                value: 200,
                                message: "200자 이내로 작성해주세요."
                            }
                            })}
                            rows="15"
                            placeholder="삭제사유를 입력해주세요."
                        />  
                        {errors?.reason && <small>{errors?.reason.message}</small>}
                    </FormGroup>
                </FormBox>
                <BtnBox>
                    <button type="submit">변경</button>
                    <button type="reset" onClick={()=>setOpenModal(false)}>취소</button>
                </BtnBox>
            </form>
        </Container>
    );
};

export default ProcessReportModal;
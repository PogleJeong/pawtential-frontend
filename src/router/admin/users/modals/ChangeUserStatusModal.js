import axios, { HttpStatusCode } from "axios";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { UPDATE_USER_STATUS } from "../../../../constants/ApiUrl";

const Container = styled.div`
    position: absolute;
    left: 25%;
    background: #fff;
    width: 50%;
    max-width: 800px;
    height: 500px;
    max-height: 500px;
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

function ChangeUserStatusModal({ manager, data, setModalData }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {
            writer: data?.writer,
            manager: manager,
            category: "",
            content: "", // 규제이유
            ban_day: 0,
        },
        mode: "onSubmit"
    })

    const changeUserStatus = async(formData) => {
        console.log(formData);
        await axios.post(UPDATE_USER_STATUS, formData, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                window.location.reload();
            } else {
                console.log("fail to change user status");
            }
        }).catch((error)=>{
            console.log("fail to change user status");
        })

    } 

    const closeModal = () => {
        setModalData((modalData)=>{
            let copy = {...modalData};
            copy.open = false;
            return copy;
        })
    }

    
    return(
        <Container>
            <h2>유저계정상태 변경</h2>
            <form onSubmit={handleSubmit(changeUserStatus)}>
                <FormBox>
                    <FormGroup>
                        <label htmlFor="category">정지유형</label>
                        <select id="category"
                        {...register("category", {
                            required: "신고유형을 선택해주세요"
                        })}>
                            <option value="">신고유형을 선택해주세요</option>
                            <option value="1">욕설 및 부적절</option>
                            <option value="2">광고</option>
                            <option value="3">기타</option>
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="reason">정지사유</label>
                        <textarea id="reason" 
                        {...register("content", {
                            required: "정지이유를 작성해주세요",
                            maxLength: {
                                value: 200,
                                message: "200자 이내로 작성해주세요"
                            }
                            })}
                            rows="15"
                            placeholder="신고내용을 작성해주세요"
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="ban_day">정지일수</label>
                        <input id="ban_day"
                            type="number" {...register("ban_day", {
                            min: {
                                value: 1,
                                message: "정지일수는 최소 1일 이상입니다."
                            }
                        })}
                            min="1"
                        />
                    </FormGroup>
                </FormBox>
                <BtnBox>
                    <button type="submit">변경</button>
                    <button type="reset" onClick={closeModal}>취소</button>
                </BtnBox>
            </form>
        </Container>
    );
};

export default ChangeUserStatusModal;
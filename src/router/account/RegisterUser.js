import axios, { HttpStatusCode } from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { CHECK_EMAIL, CHECK_ID } from "../../constants/ApiUrl";
import { CHOICE_REGISTER_PET, REGISTER } from "../../constants/UrlPath";
import styled from "styled-components";

const Container = styled.div`
    width: 500px;
    padding: 30px;
    margin-top: 30px;
    box-shadow: 0 4px 8px rgba(20, 20, 20, 0.5);
    background-color: #fff;
    text-align: left;
    h2 {
        color: #333;
        margin-bottom: 40px;
        text-align: center;
        font-size: 2em; 
    }
`

const FormGroup = styled.div`
    color: #333;
    margin-bottom: 20px;
    img {
        width: 200px;
        height: 200px;
        border-radius: 15px;
        margin-bottom: 10px;
        
    }
    label {
        display: block;
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-weight: bold;
        padding-left: 3px;
        margin-bottom: 8px;
        color: #555;
    }
    input {
        width: 70%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    small {
        display: block;
        font-size: 0.5em;
        color: red;
        margin-top: 3px;
    }

    select {
        width: 80px;
        height: 40px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        text-align: center;
    }

    button {
        width: 80px;
        height: 40px;
        margin-left: 10px;
        border: none;
        border-radius: 5px;
        &.checked {
            color: white;
            background-color: #3498db;
            transition: background-color 500ms;
            &:hover {
                
                background-color: blue;        
            }
        }
        &.unchecked {
            color: white;
            background-color: brown;
        }
    }
`

const FormBtnGroup = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 30px;
    button {
        width: 100px;
        height: 40px;
        margin-left: 10px;
        border: none;
        border-radius: 5px;
        color: white;
        background-color: #3498db;
        transition: background-color 500ms;
        &:hover {
            background-color: blue;
        }
    }
`

function RegisterUser() {
    const [ imageFakeUrl, setImageFakeUrl ] = useState(process.env.PUBLIC_URL + "/images/homeslide1.jpg");
    const checkInputRef = useRef({id: null, email: null});
    const [ isCheckId, setIsCheckId ] = useState(true);
    const [ isCheckEmail, setIsCheckEmail ] = useState(true);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues, // 현재 register 에 등록된 input value 값 가져오기
        setValue,
    } = useForm({
        defaultValues: {
            profile: null,
            id: "",
            password: "",
            passwordDuplication: "",
            username: "",
            nickname: "",
            email: "",
            birth: "",
            sex: "male",
        },
        mode: "onBlur"
    });

    // 이미지 업로드 시 미리보기
    const regiUserImage = (event) => {
        let fileUrl = event.target.files[0];
        if (fileUrl) {
            const imageURL = URL.createObjectURL(fileUrl);
            setImageFakeUrl(imageURL);
        } 
    }

    // 아이디 중복 확인
    const checkId = async() => {
        console.log(getValues("id"));
        await axios.get(CHECK_EMAIL, {
            params: {
                email : getValues("id"),
            },
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=> {
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                if (data) {
                    // email 중복처리 완료되면 disabled
                    setIsCheckId(true);
                    checkInputRef.current.id.disabled = true;
                } else {
                    setIsCheckId(false);
                    alert("이미 존재하는 이메일입니다.");
                }
            } 
        }).catch((error)=>{
            console.log("네트워크 연결이 필요합니다.");
        })
    }

    // 이메일 중복 확인
    const checkEmail = async() => { 
        console.log(getValues("email"));
        await axios.get(CHECK_EMAIL, {
            params: {
                email : getValues("email"),
            },
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=> {
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                if (data) {
                    // email 중복처리 완료되면 disabled
                    setIsCheckEmail(true);
                    checkInputRef.current.email.disabled = true;
                } else {
                    setIsCheckEmail(false);
                    alert("이미 존재하는 이메일입니다.");
                }
            } 
        }).catch((error)=>{
            console.log("네트워크 연결이 필요합니다.");
        })
    }

    // 아이디 변경
    const uncheckId = () => {
        setValue("id", "");
        setIsCheckId(false);
    }

    // 이메일 변경
    const uncheckEmail = () => {
        setValue("email", "")
        setIsCheckEmail(false);
    }

    const submitForm = async(formData) => {
        console.log(formData);
        await axios.post(REGISTER, formData, {
            baseURL: process.env.REACT_APP_SERVER_URL
        }).then(response => {
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert("회원가입에 성공하였습니다.");
                navigator(CHOICE_REGISTER_PET, { 
                    state: formData.id,
                });
            } else {
                alert("회원가입에 실패하였습니다.");
            }
        }).catch((error)=>{
            alert("회원가입에 실패하였습니다.");
        })

        navigator(CHOICE_REGISTER_PET, { 
            state: formData.id,
        });
    };

    return(
        <Container>
            <h2>회원가입</h2>   
            <form onSubmit={handleSubmit(submitForm)}>
                <FormGroup>
                    <label>프로필사진</label>
                    <img src={imageFakeUrl} />
                    <label htmlFor="regi__profile" style={{cursor: "pointer"}}>프로필 선택</label>
                    <input type="file" id="regi__profile" 
                        {...register("profile")}
                        onChange={regiUserImage}
                        text="프로필선택"
                    />
                    <small>설정하지 않으면 기본이미지가 설정됩니다.</small>
                </FormGroup>
                <FormGroup> 
                    <label htmlFor="regi__id">아이디</label>
                    <input id="regi__id"
                        ref={(element)=> checkInputRef.current.id = element}
                        {...register("id", {
                            required: "ID 를 입력해주세요",
                            pattern: /^[a-z0-9_-]{6,20}$/,
                            validate: {
                                check: () => isCheckId || "ID 중복을 확인해주세요"
                            }
                        })}
                        disabled={isCheckId}
                    />
                    {isCheckId ? 
                    <button className="unchecked" type="button" onClick={uncheckId}>변경</button>
                    :
                    <button className="checked" type="button" onClick={checkId}>중복확인</button>
                    }
                    {errors?.id && <small>{errors.id.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__password">비밀번호</label>
                    <input id="regi_password"
                        {...register("password", {
                            required: "PASSWORD 를 입력해주세요",
                            minLength: {
                                value: 8,
                                message: "최소 8자 이상의 비밀번호를 입력해주세요"
                            },
                            maxLength: {
                                value: 24,
                                message: "최대 24자의 비밀번호를 입력해주세요",
                            },
                            pattern: {
                                value: /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,24}/,
                                message: "8자 이상, 24자 이하의 특수문자를 포함한 영문, 숫자 혼용비밀번호를 입력해주세요"
                            }
                        })}
                        type="password"
                    />
                    {errors?.password && <small>{errors?.password.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__confirm">비밀번호 재확인</label>
                    <input id="regi__confirm"
                        {...register("passwordDuplication", {
                            required: "비밀번호를 확인해주세요.",
                            validate: {
                                isMatchPassword: (value) => value === getValues("password") || "비밀번호가 일치하지 않습니다. 다시 확인해주세요."
                            }
                        })}
                        type="password"
                    />
                    {errors?.passwordDuplication && <small>{errors?.passwordDuplication.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__email">이메일</label>
                    <input id="regi__email"
                        type="email"
                        ref={(element)=> checkInputRef.current.email = element}
                        {...register("email", {
                            required: "이메일을 입력해주세요.",
                            pattern: {
                                value: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                                message: "이메일 형식이 맞지 않습니다."
                            },
                            validate: {
                                check: () => isCheckEmail || "이메일 중복을 확인해주세요."
                            }
                        })}
                        disabled={isCheckEmail}
                    />
                    {isCheckEmail ?
                    <button className="unchecked" type="button" onClick={uncheckEmail}>변경</button>
                    :
                    <button className="checked" type="button" onClick={checkEmail}>중복확인</button>
                    }
                    {errors?.email && <small>{errors?.email.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__name">이름</label>
                    <input id="regi__name"
                        {...register("username", {
                            required: "이름을 입력해주세요",
                            minLength: {
                                value: 2,
                                message: "이름은 최소 2자 이상입니다.."
                            },
                            maxLength: {
                                value: 5,
                                message: "이름은 최대 5자 이상입니다."
                            },
                            pattern: {
                                vlaue: /^[가-힣]{2,5}$/,
                                message: "5글자 내 한글입니다."
                            }
                        })}
                        maxLength="5"
                    />
                    {errors?.username && <small>{errors?.username.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__nick">닉네임</label>
                    <input id="regi__nick"
                        {...register("nickname", {
                            required: "닉네임을 입력해주세요",
                            minLength: {
                                value: 2,
                                message: "닉네임은 최소 2자 입니다.."
                            },
                            maxLength: {
                                value: 10,
                                message: "닉네임은 최대 10자 입니다."
                            },
                            pattern: {
                                vlaue: /^[가-힣a-zA-Z0-9]{2,10}$/,
                                message: "닉네임은 영문, 한글, 숫자 조합만 가능합니다.."
                            }
                        })}
                        maxLength="10"
                    />
                    {errors?.nickname && <small>{errors?.nickname?.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__birth">생년월일</label>
                    <input id="regi__birth"
                        
                        {...register("birth", {
                            required: "생년월일을 입력해주세요",
                            maxLength: {
                                value: 8,
                                message: "생년월일은 8글자 이어야합니다.",
                            },
                            validate: {
                                equalLength: value => value.length === 8 || "생년월일은 8자리입니다.",
                                onlyNumber: value => !isNaN(value) || "오직 숫자만 입력해야합니다.",
                                isPrevious: (value) => {
                                    let birthday = new Date();
                                    birthday.setFullYear(parseInt(value.substring(0, 4)));
                                    birthday.setMonth(parseInt(value.substring(4, 6)));
                                    birthday.setDate(parseInt(value.substring(6)));
                            
                                    return (Date.now() - birthday.getTime()) > 0 || "현재보다 이후의 시간입니다."
                                }
                            }
                        })}
                        maxLength="8"
                    />
                    {errors?.birth && <small>{errors?.birth?.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__sex">성별</label>
                    <select id="regi__sex"
                         {...register("sex", {
                            required: "성별을 선택해주세요."
                        })} 
                    >
                        <option value="male">남성</option>
                        <option vaue="female">여성</option>
                    </select>
                </FormGroup>
                <FormBtnGroup>
                    <button type="submit">가입하기</button>
                </FormBtnGroup>
            </form>
        </Container>
    )
}

export default RegisterUser;
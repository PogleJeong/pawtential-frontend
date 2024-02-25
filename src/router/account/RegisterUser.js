import axios, { HttpStatusCode } from "axios";
import { useRef, useState } from "react";
import { Form, useForm } from "react-hook-form";

import { CHECK_EMAIL, CHECK_ID } from "../../constants/ApiUrl";
import { PET_ADD, REGISTER } from "../../constants/UrlPath";
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
    #regi__profile {
        display: none;
    }

    small {
        font-size: 0.5em;
    }

    select {
        width: 75px;
    }

    button {
        width: 80px;
        height: 40px;
        margin-left: 10px;
        border: none;
        border-radius: 5px;
        transition: background-color 500ms;
        &:hover {
            background-color: aliceblue;
            
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
        transition: background-color 500ms;
        width: 80px;
        height: 40px;
        margin-left: 10px;
        border: none;
        border-radius: 5px;
        transition: background-color 500ms;
        &:hover {
            background-color: aliceblue;
            
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
    } = useForm({
        mode: "onSubmit"
    });

    const regiUserImage = (event) => {
        let fileUrl = event.target.files[0];

        if (fileUrl) {
            const imageURL = URL.createObjectURL(fileUrl);
            setImageFakeUrl(imageURL);
        } 
    }

    const checkEmail = async(formData) => { // data 는 register 값이 들어감
        console.log(formData);
        // 서버쪽 고치기 - 비즈니스로직상 중복아이디나 중복이메일이 있어도 정상이므로 200을 받아야함.
        const { status } = await axios.get(CHECK_EMAIL);
        if (status === HttpStatusCode.NoContent) {
            // email 중복처리 완료되면 disabled
            setIsCheckId(()=>true);
            checkInputRef.current.email.disabled = true;
        } else {
            setIsCheckId(()=>false);
            alert("이미 존재하는 아이디입니다.");
        }
    }

    const checkId = async(formData) => {
        console.log(formData);
        const { status } = await axios.get(CHECK_ID);
        if (status === HttpStatusCode.NoContent) {
            setIsCheckEmail(()=>true);
            checkInputRef.current.id.disabled = true;
        } else {
            setIsCheckEmail(()=>false);
            alert("이미 존재하는 이메일입니다.");
        }
    }

    const submitForm = async(formData) => {
        console.log(formData);
        await axios.post(REGISTER, formData, {
            baseURL: process.env.REACT_APP_SERVER_URL
        }).then(response => {
            if (response.data) {
                navigator(PET_ADD);
            } else {
                alert("회원가입에 실패하였습니다.");
            }
        }).catch((error)=>{
            alert("회원가입에 실패하였습니다.");
        })
    };

    return(
        <Container>
            <h2>회원가입</h2>   
            <form onSubmit={handleSubmit(submitForm)}>
                <FormGroup>
                    <label>Profile</label>
                    <img src={imageFakeUrl} />
                    <label htmlFor="regi__profile" style={{cursor: "pointer"}}>프로필 선택</label>
                    <input type="file" id="regi__profile" 
                        {...register("profile")}
                        onChange={regiUserImage} 
                    />
                    <small>설정하지 않으면 기본이미지가 설정됩니다.</small>
                </FormGroup>
                <FormGroup> 
                    <label htmlFor="regi__id">ID</label>
                    <input id="regi__id"
                        ref={(element)=> checkInputRef.current.id = element}
                        {...register("id", {
                            required: "ID 를 입력해주세요",
                            pattern: /^[a-z0-9_-]{6,20}$/,
                            validate: {
                                check: () => isCheckId || "ID 중복을 확인해주세요"
                            }
                        })}
                    />
                    <button type="button" onClick={checkId}>중복확인</button>
                    {errors?.id && <small>{errors.id.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__password">PASSWORD</label>
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
                    <label htmlFor="regi__confirm">CONFIRM PASSWORD</label>
                    <input id="regi__confirm"
                        placeholder="비밀번호를 다시 입력해주세요"
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
                    <label htmlFor="regi__email">EMAIL</label>
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
                    />
                    <button type="button" onClick={checkEmail}>중복확인</button>
                    {errors?.email && <small>{errors?.email.message}</small>}
                </FormGroup>
                <FormGroup>
                    <label htmlFor="regi__name">USER NAME</label>
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
                    <label htmlFor="regi__nick">NICK NAME</label>
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
                    <label htmlFor="regi__birth">BIRTH</label>
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
                    <label htmlFor="regi__sex">SEX</label>
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
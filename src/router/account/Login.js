import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { useCookies } from "react-cookie";
import { Breadcrumb, Button, Col, Form, Row } from "react-bootstrap";

import { LOGIN_BY_KAKAO, LOGIN_BY_NAVER } from "../../constants/ApiUrl";
import { FIND_ACCOUNT, HOME, LOGIN, REGISTER } from "../../constants/UrlPath";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: 5% 10%;
    height: 100%;
`

const LoginBox = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    border: none;
    border-radius: 10px;
    box-shadow: 8px 8px 8px rgba(0,0,0,0.1);
    background-color: #fcfcfc;
    overflow: hidden; 
`

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    opacity: 0.7;
`

const FormBox = styled.div`
    padding: 20px 20px;
    height: 100%;

    h2 {
        font-size: 2em;
        font-weight: bold;
        text-align: center;
        padding: 20px;
        margin-bottom: 30px;
    };
    div {
        position: relative !important;
    };
    label {
        position:absolute;
        z-index: 1;
        pointer-events: none;
        top: 30%;
        transform: translateY(-50%);
        font-size: 0.8rem;
        left: 10px;
        transition: .2s linear;
    };

    .change_label {
        background-color:#fcfcfc;
        transition: .2s linear;
        transform: scale(0.9);
        top: -5px !important;
        left: 5px !important;
    }

    input {
        width: 100%;
        height: 30px;
        font-size: 0.8rem;
        padding-left: 5px;
        margin-bottom:20px;
        background: transparent !important;
    }


`

const AccountOptionBox = styled.div`
    margin-bottom: 25px;
    ul {
        display: flex;
        justify-content: space-between;
        li {
            font-size: 0.9em;
            &:hover {
                text-decoration: underline;
            }
        }
    }
`

const SnsLoginBox = styled.div`
    button {
        border: none;
        border-radius: 5px;
        width: 100%;
        height: 45px;
        margin-bottom: 15px;
        color: white;
        font-size: 1rem;
        font-weight: bold;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
    .login__naver {
        background-color: rgba(3, 199, 90, 1);
    }
    .login__kakao {
        background-color: rgba(255, 235, 0, 1);
    }
`

function Login() {

    const [ loginImage ] = useState([
        process.env.PUBLIC_URL + "/images/homeslide1.jpg",
        process.env.PUBLIC_URL + "/images/homeslide2.jpg",
        process.env.PUBLIC_URL + "/images/homeslide3.jpg"
    ]);

    const [ cookies, setCookies ] = useCookies(["id", "nickname"]);

    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: "onSubmit",
        criteriaMode: "firstError",
        delayError: 500,
    })

    const navigate = useNavigate();

      // 이미 로그인 세션이 있다면 home으로 이동
    useEffect(()=>{
        if (cookies?.id !== null) {
            // navigate("/market");
        }
    },[])

    const submitLogin = async(formData) => {
        console.log(formData);

        // 로그인 회원을 세션에 저장하는 방식은 서버에 위임.
        await axios.post(LOGIN, formData, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then(response => {
            const { status } = response;
            if ( status === HttpStatusCode.Ok) {
                const { id, nickname, social } = response?.data;
                if (id && nickname && social) {
                    // 쿠키에 해당 유저의 id, nickname 저장
                    setCookies("id", id, { maxAge: 3600 });
                    setCookies("nickname", nickname, { maxAge: 3600 });
                    setCookies("social", social, { maxAge: 3600 });
                    // 페이지 이동
                    navigate(HOME);
                } else {
                    alert("로그인에 실패하였습니다. 아이디/비밀번호를 확인해주세요.");
                }
            } else {
                alert("서버에러로 인해 로그인 할 수 없습니다.");
            }
        })
    }

    const labelUp = (input) => {
        input.target.parentElement.children[0].setAttribute("class", "change_label");    
    }

    const labelDown = (input) => {
        if(input.target.value.length === 0){
            input.target.parentElement.children[0].classList.remove("change_label");
        }
    }

    const loginByKakao = async() => {
        await axios.get(LOGIN_BY_KAKAO, {
            baseURL: process.env.REACT_SERVER_URL
        })
    }

    const loginByNaver = async() => {
        await axios.get(LOGIN_BY_NAVER, {
            baseURL: process.env.REACT_SERVER_URL
        })
    }
  

    return(
        <Container>
            <LoginBox>
                <div>
                    <Image src={loginImage[Math.floor(Math.random()*3)]}/>
                </div>
                <FormBox>
                    <Form onSubmit={handleSubmit(submitLogin)}>
                        <h2>LOGIN</h2>
                        <div>
                            <label htmlFor="login__id">ID</label>
                            <input id="login__id" 
                                {...register("id", {
                                    required: "아이디를 입력해주세요",
                                    maxLength: {
                                        value: 15,
                                        message: "아이디는 최대 15자입니다."
                                    }
                                })}
                                onFocus={labelUp}
                                onBlur={labelDown}
                            />
                            <Form.Text className="text-muted">{errors.id?.message}</Form.Text>
                        </div>
                        <div>
                            <label htmlFor="login__password">PASSWORD</label>
                            <input id="login__password" 
                                {...register("password", {
                                    required: "비밀번호를 입력해주세요",
                                    maxLength: {
                                        value: 20,
                                        message: "비밀번호는 최대 20자입니다."
                                    }
                                })}
                                onFocus={labelUp}
                                onBlur={labelDown}
                                type="password"
                            />
                            <Form.Text className="text-muted">{errors.password?.message}</Form.Text>
                        </div>
                        <Button style={{width: "100%", height: "45px"}} variant="primary">Login</Button>
                    </Form>
                    <hr />
                    <AccountOptionBox>
                        <ul>
                            <li><Link to={REGISTER}>Create Account</Link></li>
                            <li><Link to={FIND_ACCOUNT}>Find Account</Link></li>
                        </ul>
                    </AccountOptionBox>
                    <SnsLoginBox>
                        <ul>
                            <li><button className="login__naver" 
                                style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/btnG_official.png)`}}
                                onClick={loginByNaver}></button></li>
                            <li><button className="login__kakao" 
                                style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/kakao_login_large_wide.png)`}}
                                onClick={loginByKakao}></button></li>
                        </ul>
                    </SnsLoginBox>
                   
                </FormBox>
            </LoginBox>
        </Container>
    );
}
// style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/login_logo_naver.png)`}} 
// style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/login_logo_kakao.png)`}}
export default Login;
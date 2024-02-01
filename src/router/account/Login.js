import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { useCookies } from "react-cookie";
import { Breadcrumb, Button, Col, Container, Form, Image, Row } from "react-bootstrap";

import { LOGIN_BY_KAKAO, LOGIN_BY_NAVER } from "../../constants/ApiUrl";
import { FIND_ACCOUNT, HOME, LOGIN, REGISTER } from "../../constants/UrlPath";
import { useEffect } from "react";

function Login() {

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

    const submitLogin = async(formData) => {
        console.log(formData);
        // 로그인 회원을 세션에 저장하는 방식은 서버에 위임.
        const { data } = await axios.post(LOGIN, formData, {
            headers: {
                "Content-Type": "application/json"
            },
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
    // 이미 로그인 세션이 있다면 home으로 이동
    useEffect(()=>{
        if (cookies?.id !== null) {
            // navigate("/market");
        }
    })

    return(
        <Container>
            <div>
                <Form onSubmit={handleSubmit(submitLogin)}>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="login__id">ID</Form.Label>
                        <Form.Control id="login__id" 
                            {...register("id", {
                                required: "아이디를 입력해주세요",
                                maxLength: {
                                    value: 15,
                                    message: "아이디는 최대 15자입니다."
                                }
                            })}
                            placeholder="ID"
                        />
                        <Form.Text className="text-muted">{errors.id?.message}</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="login__password">PASSWORD</Form.Label>
                        <Form.Control id="login__password" 
                            {...register("password", {
                                required: "비밀번호를 입력해주세요",
                                maxLength: {
                                    value: 20,
                                    message: "비밀번호는 최대 20자입니다."
                                }
                            })}
                            placeholder="PASSWORD"
                        />
                        <Form.Text className="text-muted">{errors.password?.message}</Form.Text>
                        
                    </Form.Group>
                    <Button variant="primary">Login</Button>
                </Form>
                <Row>
                    <Col>
                        <Image style={{width: "200px", height: "50px"}} src={process.env.PUBLIC_URL + "/images/login_logo_naver.png"} onClick={loginByNaver} rounded />
                    </Col>
                    <Col>
                        <Image style={{width: "200px", height: "50px"}} src={process.env.PUBLIC_URL + "/images/login_logo_kakao.png"} onClick={loginByKakao} rounded />
                    </Col>
                </Row>
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item href={REGISTER}>Sign in</Breadcrumb.Item>
                        <Breadcrumb.Item href={FIND_ACCOUNT}>Find ID/PASSWORD</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </Container>
    );
}

export default Login;
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { dataFromServer } from "../api/axios";
import { LOGIN_BY_NAVER } from "../constants/ApiUrl";
import { FIND_ACCOUNT, LOGIN, REGISTER } from "../constants/UrlPath";

function Login() {
    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: "onSubmit",
        criteriaMode: "firstError",
        delayError: 500,
    })

    const submitLogin = () => {
        // 로그인 회원을 세션에 저장하는 방식은 서버에 위임.
        dataFromServer(LOGIN);
    }

    return(
        <div>

            <div>
                <form onSubmit={handleSubmit(submitLogin)}>
                    <label for="login__id">ID</label>
                    <input id="login__id" 
                        {...register("id", {
                            required: "아이디를 입력해주세요",
                            maxLength: {
                                value: 15,
                                message: "아이디는 최대 15자입니다."
                            }
                        })}
                        placeholder="ID"
                    />
                    <p>{errors.id?.message}</p>

                    <label for="login__password">PASSWORD</label>
                    <input id="login__password" 
                        {...register("password", {
                            required: "비밀번호를 입력해주세요",
                            maxLength: {
                                value: 20,
                                message: "비밀번호는 최대 20자입니다."
                            }
                        })}
                        placeholder="PASSWORD"
                    />
                    <p>{errors.password?.message}</p>
                </form>
                <div>
                    <input value="naver logo" id="login__naver" type="button" onClick={()=>useFetch(process.env.REACT_APP_SERVER_URL + LOGIN_BY_NAVER)} />
                    <input id="kakao logo" type="button" onClick={()=>useFetch(process.env.REACT_APP_SERVER_URL + LOGIN_BY_KAKAO)} />
                </div>
                <div>
                    <ul>
                        <li><Link to={REGISTER}>Sign in</Link></li>
                        <li><Link to={FIND_ACCOUNT}>Find ID/PASSWORD</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Login;
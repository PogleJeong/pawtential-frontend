import { useForm } from "react-hook-form";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function ChangePassword() {
    const [ cookies ] = useCookies(["id","social"]);
    const navigator = useNavigate();

    // form validator
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: async() => await axios.get("/member/update", {
            params: {
                userId: () => cookies.id,
            },
            baseURL: process.env.REACT_SERVER_URL
        }),
        mode: "onSubmit"
    })

     // 쿠키 : 소셜로그인 계정 접근 막기
    useEffect(()=>{
        // const isSocialAccount = cookies?.social != "D";
        // if (isSocialAccount) {
        //     alert("소셜로그인 계정은 비밀번호 변경이 불가능합니다.");
        //     navigator("/");
        // }
    },[])

    const sendFormData = async(formData) => {
        const data = {
            id: cookies.id,
            ...formData
        }
        console.log(data);
        await axios.post("/member/password/update", data, {
            headers: {
                "Content-Type": "application/json",
            },
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=> {
            const status = response.status;
            if (200 <= status < 300) {
                alert("비밀번호를 성공적으로 변경했습니다.")
            } else {
                alert("서버에서 에러가 발생했습니다. 관리자에게 연락해주세요 error status:", status);
                window.location.reload();
            }
        })
    }

    const cancelToChangePassword = () => {
        window.location.href="/user"
    }

    return(
        <div>
            <h1>비밀번호 변경</h1>
            <form onSubmit={handleSubmit(sendFormData)}>
                <ul>
                    <li>
                        <label htmlFor="password">PASSWORD</label>
                        <input id="password" 
                            {...register("password", {
                                required: "기존 비밀번호를 입력해주세요"
                            })}
                            placeholder="현재 비밀번호"
                            type="password"
                        />
                        {errors?.password && <small>{errors?.password.message}</small>}
                    </li>
                    <li>
                        <label htmlFor="new_password">NEW PASSWORD</label>
                            <input id="new_password" 
                                {...register("new_password", {
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
                                },
                            })}
                            placeholder="새 비밀번호"
                            type="password"
                        />
                        {errors?.new_password && <small>{errors?.new_password.message}</small>}
                    </li>
                    <li>
                        <label htmlFor="new_password_confirm">CONFIRM PASSWORD</label>
                        <input id="new_password_confirm"
                            {...register("passwordDuplication", {
                                required: "비밀번호를 확인해주세요.",
                                validate: {
                                    isMatchPassword: (value) => value === getValues("password") || "비밀번호가 일치하지 않습니다. 다시 확인해주세요."
                                },   
                            })}
                            placeholder="새 비밀번호 확인"
                            type="password"
                        />
                        {errors?.passwordDuplication && <small>{errors?.passwordDuplication.message}</small>}
                    </li>
                    <li>
                        <input type="submit" value="확인" /> 
                    </li>
                    <li>
                        <input type="button" value="취소" 
                            onClick={cancelToChangePassword}
                        />
                    </li>
                </ul>
                
            </form>
        </div>
    );
}

export default ChangePassword;
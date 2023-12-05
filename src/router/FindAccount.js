import { useState } from "react";
import { useForm } from "react-hook-form";
import { FIND_ID, FIND_PASSWORD } from "../constants/ApiUrl";
import { FIND_ACCOUNT_ID_RESULT, FIND_ACCOUNT_PASSWORD_RESULT, LOGIN } from "../constants/UrlPath";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function FindAccount() {
    const {
        register,
        handleSubmit,
        errors,
    } = useForm({
        mode: "onSubmit",
        delayError: 300,
    });
    const [ findOption, setFindOption ]  = useState(0);
    const navigator = useNavigate();

    const submitFindId = async(formData) => {
        console.log(formData);
        await axios.get(FIND_ID, {
            params: formData
        }).then(response => {
            if (response?.data) {
                navigator(FIND_ACCOUNT_ID_RESULT, {
                    state: {
                        foundId: response?.data?.id
                    }
                })
            }
        })
    }

    const submitFindPassword = async(formData) => {
        console.log(formData);
        await axios.get(FIND_PASSWORD, {
            params: formData
        }).then(response => {
            if (response?.data) {
                navigator(FIND_ACCOUNT_PASSWORD_RESULT, {
                    state: {
                        sendEmail: response?.data?.email
                    }
                })
            }
        })
        
        
    }


    return(
        <div>
            <div>
                <ul>
                    <li onClick={()=>setFindOption(0)}>아이디 찾기</li>
                    <li onClick={()=>setFindOption(1)}>비밀번호 찾기</li>
                </ul>
            </div>
            {findOption == 0 ?
                <div>
                    <form action={FIND_ID}>
                        <label for="find__email">이메일</label>
                        <input
                            type="email" 
                            id="find__email" {...register("email",{
                            required: true,
        
                        }) 
                        }/>
                        <label for="find__name">이름</label>
                        <input {...register("name", {
                            required: true,
                            pattern: /^[가-핳]{2,10}$/
                        })}/>
                        <button>submit</button>
                    </form>
                    
                </div>
                :
                <div>
                    <form action={FIND_PASSWORD}>
                        <label for="find__id">아이디</label>
                        <input id="find__id" 
                            {...register("id", {
                                required: "아이디를 입력해주세요."
                            })
                        }/>
                        {errors?.id && <small>{errors?.id?.message}</small>}
                        <label for="find__email">이메일</label>
                        <input id="find__email" type="email" 
                            {...register("email", {
                                required: "이메일을 입력해주세요.",
                            })
                        }/>
                        {errors?.email && <small>{errors?.email?.message}</small>}
                        <button>submit</button>
                    </form>
                   
                </div>
                }
            <div>
                <Link to={LOGIN}>Sign in</Link>
            </div>
        </div>
    )
}

export default FindAccount;
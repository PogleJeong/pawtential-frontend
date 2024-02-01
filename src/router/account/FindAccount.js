import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { FIND_ACCOUNT_ID_RESULT, FIND_ACCOUNT_PASSWORD_RESULT, LOGIN } from "../../constants/UrlPath";
import { FIND_ID, FIND_PASSWORD } from "../../constants/ApiUrl";

function FindAccount() {
    const {
        register,
        handleSubmit,
        formState: {errors}
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
            {findOption === 0 ?
                <div>
                    <form action={FIND_ID} onSubmit={handleSubmit(submitFindId)}>
                        <label htmlFor="find__email">이메일</label>
                        <input
                            type="email" 
                            id="find__email" {...register("email",{
                                required: "이메일을 작성해주세요.",
                        })}/>
                        {errors?.email && <small>{errors.email.message}</small>}
                        <label htmlFor="find__name">이름</label>
                        <input {...register("name", {
                            required: true,
                            pattern: {
                                value: /^[가-핳]{2,5}$/,
                                message: "이름은 5자 내 한글입니다."
                            }
                        })}/>
                        {errors?.name && <small>{errors.name.message}</small>}
                        <button>submit</button>
                    </form>
                </div>
                :
                <div>
                    <form action={FIND_PASSWORD} onSubmit={handleSubmit(submitFindPassword)}>
                        <label htmlFor="find__id">아이디</label>
                        <input id="find__id" 
                            {...register("id", {
                                required: "아이디를 입력해주세요."
                            })
                        }/>
                        {errors?.id && <small>{errors?.id?.message}</small>}
                        <label htmlFor="find__email">이메일</label>
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
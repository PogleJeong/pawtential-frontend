import { useState } from "react";
import { useForm } from "react-hook-form";
import { FIND_PASSWORD } from "../constants/ApiUrl";
import { FIND_ACCOUNT_ID_RESULT, FIND_ACCOUNT_PASSWORD_RESULT, LOGIN } from "../constants/UrlPath";
import { dataForServer, dataFromServer } from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";

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

    const submitFindId = async() => {
        const { data } = dataFromServer(FIND_ID);
        if (data != null) {
            navigator(FIND_ACCOUNT_ID_RESULT, data);
        }
    }

    const submitFindPassword = async() => {
        const { data } = dataFromServer(FIND_PASSWORD);
        if (data !== null) {
            navigator(FIND_PASSWORD);
        }
    }


    return(
        <div>
            <div>
                <ul>
                    <li onClick={()=>setFindOption(0)}>아이디 찾기</li>
                    <li onClick={()=>setFindOption(1)}>비밀번호 찾기</li>
                </ul>
            </div>
            {findOptionToggle == 0 ?
                <div>
                    <form action={FIND_ID}>
                        <label for="find__email">이메일</label>
                        <input id="find__email" {...register("email",{
                            required: true,
                            pattern: /^[0-9a-zAz-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_.]?[0-9a-zA-z])*.[a-zA-Z]{2,3}$/i,
                        }) 
                        }/>
                        <label for="find__name">이름</label>
                        <input {...register("name", {
                            required: true,
                            pattern: /^[가-핳]{2,10}) $/
                        })}/>
                        <button>submit</button>
                    </form>
                    {errors?.email?.required && <p>이메일을 입력해주세요.</p>}
                    {errors?.email?.pattern && <p>이메일 형식이 올바르지 않습니다.</p>}
                    {errors?.name?.required && <p>이름을 입력해주세요.</p>}
                    {errors?.name?.pattern && <p>이름은 10글자 이내 한글입니다.</p>}
                </div>
                :
                <div>
                    <form action={FIND_PASSWORD}>
                        <label for="find__id">아이디</label>
                        <input id="find__id" {...register("id",{
                            required: true,
                            pattern: /^$/
                        })
                        }/>
                        <label for="find__email">이메일</label>
                        <input id="find__email" {...register("email", {
                            required: true,
                            pattern: /^[0-9a-zAz-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_.]?[0-9a-zA-z])*.[a-zA-Z]{2,3}$/i,
                        })
                        }/>
                        <button>submit</button>
                    </form>
                    {errors?.id?.required && <p>아이디 입력해주세요.</p>}
                    {errors?.id?.pattern && <p>아이디 형식이 올바르지 않습니다.</p>}
                    {errors?.email?.required && <p>이메일 입력해주세요.</p>}
                    {errors?.email?.pattern && <p>이메일 형식이 올바르지 않습니다.</p>}
                </div>
                }
            <div>
                <Link to={LOGIN}>Sign in</Link>
            </div>
        </div>
    )
}

export default FindAccount;
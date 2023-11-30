import { useForm } from "react-hook-form";

function Register() {
    const [ isCheckId, setIsCheckId ] = useState(false);
    const [ isCheckEmail, setIsCheckEmail ] = useState(false);
    const { 
        register,
        handleSubmit,
        trigger,
        setValue,
        formState: { errors },
        getValues, // 현재 register 에 등록된 input value 값 가져오기
    } = useForm();

    return(
        <div>
            <form>
                <h2>REGISTER LIST</h2>
                <ul>
                    <li>
                        <label htmlFor="regi__id">ID</label>
                        <input id="regi__id"
                            {...register("id",{
                                required: "ID 를 입력해주세요",
                                pattern: /^[a-z0-9_-]{6,20}$/
                            })}
                        />
                        <input type="button" onClick={checkId}>중복확인</input>
                        <small>{errors}</small>
                    </li>
                    <li>
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
                        />
                        <small>{errors?.password?.message}</small>
                    </li>
                    <li>
                        <label htmlFor="regi__confirm">CONFIRM PASSWORD</label>
                        <input id="regi__confirm"
                            placeholder="비밀번호를 다시 입력해주세요"
                            {...register("passwordDuplication", {
                                required: "비밀번호를 확인해주세요.",
                                validate: {
                                    isMatchPassword: (value) => {
                                        return value == getValues("password") ? true : "비밀번호를 다시 확인해주세요."
                                    }
                                }
                            })}
                        />
                        <small>{errors}</small>
                    </li>
                    <li>
                        <label htmlFor="regi__email">EMAIL</label>
                        <input id="regi__email"
                            {...register("email", {
                                required: "이메일을 입력해주세요.",
                                pattern: {
                                    value: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                                    message: "이메일 형식이 맞지 않습니다."
                                }
                            })}
                        />
                        <input type="button" onClick={checkEmail}
                            {...register("checkEmail", {
                                value: false
                            })} 
                        />
                        <small>{errors?.email?.message}</small>
                    </li>
                    <li>
                        <label htmlFor="regi__name">USER NAME</label>
                        <input id="regi__name"
                            {...register("username", {
                                required: "이름을 입력해주세요",
                                minLength: {
                                    value: 2,
                                    message: "이름은 최소 2글자 이상이어야 합니다."
                                },
                                maxLength: {
                                    value: 10,
                                    message: "이름은 최대 10글자 이상이어야 합니다."
                                },
                                pattern: {
                                    vlaue: /^[가-힣]{2,10}$/,
                                    message: "이름은 한글만 가능합니다."
                                }
                            })}
                        />
                        <small>{errors?.username?.message}</small>
                    </li>
                    <li>
                        <label htmlFor="regi__nick">NICK NAME</label>
                        <input id="regi__nick"
                            {...register("nickname", {
                                required: "닉네임을 입력해주세요",
                                minLength: {
                                    value: 2,
                                    message: "닉네임은 최소 2글자 이상이어야 합니다."
                                },
                                maxLength: {
                                    value: 10,
                                    message: "넥네임은 최대 10글자 이상이어야 합니다."
                                },
                                pattern: {
                                    vlaue: /^[가-힣a-zA-Z0-9]{2,10}$/,
                                    message: "닉네임은 영문, 한글, 숫자 조합만 가능합니다.."
                                }
                            })}
                        />
                        <small>{errors?.nickname?.message}</small>
                    </li>
                    <li>
                        <label htmlFor="regi__birth">BIRTH</label>
                        <input id="regi__birth"
                            {...register("birth", {
                                required: "생일을 입력해주세요",
                                validate: {
                                    equalLength: (value) => {
                                        return String(value).length == 8;
                                    }
                                },
                            
                            })}
                        />
                        <small>{errors}</small>
                    </li>
                    <li>
                        <label htmlFor="regi__sex">SEX</label>
                        <ul id="regi__sex">
                            <li>
                                <label htmlFor="regi__male">MALE</label>
                                <input id="regi__male" 
                                    type="radio" 
                                    value="M"
                                />
                            </li>
                            <li>
                                <label htmlFor="regi__female">FEMALE</label>
                                <input id="regi__female" 
                                    type="radio" 
                                    value="F"
                                />
                            </li>
                        </ul>
                    </li>
                </ul>
            </form>
        </div>
    )
}

export default Register;
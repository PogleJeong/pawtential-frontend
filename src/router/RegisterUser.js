import { useForm } from "react-hook-form";
import { CHECK_EMAIL, CHECK_ID } from "../constants/ApiUrl";
import { dataFromServer } from "../api/axios";
import axios from "axios";

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

    const checkEmail = async(formData) => { // data 는 register 값이 들어감
        console.log(formData);
        
        // 서버쪽 고치기 - 비즈니스로직상 중복아이디나 중복이메일이 있어도 정상이므로 200을 받아야함.
        const { status } = await axios.get(CHECK_EMAIL);
        if (status == 204) {
            setIsCheckId(()=>true);
        } else {
            setIsCheckId(()=>false);
        }
    }

    const checkId = async(formData) => {
        console.log(formData);
        const { status } = await axios.get(CHECK_ID);
        if (status == 204) {
            setIsCheckEmail(()=>true);
        } else {
            setIsCheckEmail(()=>false);
        }
    }

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
                                pattern: /^[a-z0-9_-]{6,20}$/,
                                validate: {
                                    check: () => isCheckId || "ID 중복을 확인해주세요"
                                }
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
                                },
                                validate: {
                                    check: () => isCheckEmail || "이메일 중복을 확인해주세요."
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
                                required: "생년월일을 입력해주세요",
                                maxLength: {
                                    value: 8,
                                    message: "생년월일은 8글자 이어야합니다.",
                                },
                                validate: {
                                    equalLength: value => value.length == 8 || "생년월일은 8자리입니다.",
                                    onlyNumber: value => !value.isNaN() || "오직 숫자만 입력해야합니다.",
                                    isPrevious: (value) => {
                                        let birthday = new Date();
                                        birthday.setFullYear(parseInt(value.substring(0, 4)));
                                        birthday.setMonth(parseInt(value.substring(4, 6)));
                                        birthday.setDate(parseInt(value.substring(6)));

                                        return Date.now() - birthday.getTime() > 0 || "현재보다 이후의 시간입니다."
                                    }
                                },
                            
                            })}
                        />
                        <small>{errors?.birth?.message}</small>
                    </li>
                    <li>
                        <label htmlFor="regi__sex">SEX</label>
                        <ul id="regi__sex">
                            <li>
                                <label htmlFor="regi__male">MALE</label>
                                <input id="regi__male" 
                                    {...register("sex", {
                                        required: "성별을 선택해주세요."
                                    })}
                                    type="radio" 
                                    value="M"
                                />
                            </li>
                            <li>
                                <label htmlFor="regi__female">FEMALE</label>
                                <input id="regi__female"
                                    {...register("sex", {
                                        required: "성별을 선택해주세요."
                                    })} 
                                    type="radio" 
                                    value="F"
                                />
                            </li>
                        </ul>
                    </li>
                </ul>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Register;
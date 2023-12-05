import { useNavigate } from "react-router-dom";
import { HOME } from "../constants/UrlPath";
import { useFieldArray, useForm } from "react-hook-form";
import { ADD_PET } from "../constants/ApiUrl";

function RegisterPet() {
    
    const {
        register,
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    }= useForm()

    const {
        fields,
        append,
        remove
    } = useFieldArray({
        name: "pet",
        control
    })

    const navigate = useNavigate();

    const imageLoad = (imageData) => {
        let reader = new FileReader();
        reader.readAsDataURL(imageData); // file을 url로 읽고
        reader.onloadend = () => reader.result
    }

    const submitForm = async() => { 
        await axios.post(ADD_PET, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            if (response.data) {
                alert("반려동물이 등록되었습니다.");
                navigate(HOME);
            } else {
                alert("반려동물 등록에 실패하였습니다.")
            }
        })
    }

    return(
        <div>
            <div>
                <form onSubmit={handleSubmit(submitForm)}>
                    <h2>반려동물 추가하기</h2>
                    <ul>
                        
                        {fields.map((item, index) => {
                            <li>
                                <ul>
                                    <li>
                                        <div>
                                            <img src={()=>imageLoad(getValues("pet_image"))}/>
                                            <label htmlFor="pet__image">대표이미지 설정</label>
                                            <input id="pet__image" type="file"
                                                {...register("pet_image", {
                                                    required: "반려동물 대표이미지를 설정해주세요".
                                                })}
                                                style={{display: "none"}}
                                            />
                                        </div>
                                        <small>{errors?.images?.message}</small>
                                    </li>
                                    <li>
                                        <input 
                                            {...register("pet_name", {
                                                required: "반려동물 이름을 작성해주세요!",
                                                pattern: {
                                                    value: /^[가-힣]{1,10)$/,
                                                    message: "10자 이내 한글만 가능합니다."
                                                },
                                            })}
                                            placeholder="흰둥이"
                                        />
                                        <small>{errors?.pet_name?.message}</small>
                                    </li>
                                    <li>
                                        <label htmlFor="pet__birth">반려동물 나이</label>
                                        <input 
                                            id="pet__birth"
                                            type="number"
                                            {...register("pet_birth", {
                                                required: "반려동물의 나이를 입력해주세요",
                                                validate: {
                                                    isPositive: (value) => value > 0 || "0 보다 커야합니다."
                                                }
                                            })}
                                            placeholder="5"
                                        />
                                        <small>{errors?.pet_birth.message}</small>
                                    </li>
                                    <li>
                                        <label htmlFor="pet__sex">반려동물 성별</label>
                                        <select id="pet__sex" {...register("pet_sex", {
                                            required: "성별을 선택해주세요."
                                        })}>
                                            <option value="">==선택==</option>
                                            <option value="M">남아</option>
                                            <option value="F">여아</option>
                                        </select>
                                        <small>{errors?.pet_sex?.message}</small>
                                    </li>
                                    <li>
                                        <label htmlFor="pet_introduce">반려동물 소개</label>
                                        <textarea {...register("pet_introduce", {
                                            maxLength: {
                                                value: 100,
                                                message: "소개는 100자 이내입니다."
                                            }
                                    })} rows={10}/>
                                    <small>{errors?.pet_introduce?.message}</small>
                                </li>
                            </ul>
                        </li>
                        })}
                        
                        
                    </ul>
                    <button>반려동물 등록하기</button>
                </form>
            </div>
        </div>
    )
}

export default RegisterPet;
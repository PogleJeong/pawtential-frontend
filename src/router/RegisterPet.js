import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { HOME } from "../constants/UrlPath";
import { ADD_PET } from "../constants/ApiUrl";
import { useEffect } from "react";

let renderCount = 0;

function RegisterPet() {
    
    const {
        register,
        control,
        handleSubmit,
        getValues,
        formState: { errors }
    }= useForm({
        defaultValues: {
            pet: [{image: null, name: "", age: "", sex: "", introduce: ""}]
        }
    })

    // FIELDS 는 useForm 의 defaultValues에 영향을 받음.
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
        reader.onloadend = () => {
            return reader.result
        }
    }

    const submitForm = async(formData) => {
        // form data = [{}, {}, {}] 형식으로 들어감. 
        console.log(formData);
        // await axios.post(ADD_PET, formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data"
        //     }
        // }).then(response => {
        //     if (response.data) {
        //         alert("반려동물이 등록되었습니다.");
        //         navigate(HOME);
        //     } else {
        //         alert("반려동물 등록에 실패하였습니다.")
        //     }
        // })
    }
    useEffect(()=>{
        console.log(fields);
    }, [renderCount])

    const previewImage = (event, index) => {
        let previewBox = event.currentTarget.previousSibling.previousSibling;
        
    }
    renderCount++;
    return(
        <div>
            rendering: {renderCount}
            <div>
                <form onSubmit={handleSubmit(submitForm)}>
                    <h2>반려동물 추가하기</h2>
                    <button type="button" onClick={()=>append({image: null, name: "흰둥이", age: "5", sex: "F", introduce: "소개글"})}>반려동물 추가하기</button>
                    <ul>
                        {fields.map((item, index) => {
                            return (
                            <li key={item.id} >
                                <ul>
                                    <li>
                                        <div>
                                            <img alt="대표이미지" src={()=>imageLoad(getValues(`pet.${index}.image`))} />
                                            <label htmlFor="pet__image">대표이미지 설정</label>
                                            <input id="pet__image" type="file"
                                                {...register(`pet.${index}.image`, {
                                                    required: "반려동물 대표이미지를 설정해주세요",
                                                })}
                                                onChange={previewImage}
                                                style={{display: "none"}}
                                            />
                                        </div>
                                        <small>{errors?.pet?.[index]?.message}</small>
                                    </li>
                                    <li>
                                        <input 
                                            {...register(`pet.${index}.name`, {
                                                required: "반려동물 이름을 작성해주세요!",
                                                pattern: {
                                                    value: /^[가-힣]{1,10}$/,
                                                    message: "10자 이내 한글만 가능합니다."
                                                },
                                            })}
                                            placeholder="흰둥이"
                                        />
                                        <small>{errors?.pet?.[index]?.message}</small>
                                    </li>
                                    <li>
                                        <label htmlFor="pet__age">반려동물 나이</label>
                                        <input 
                                            id="pet__age"
                                            type="number"
                                            {...register(`pet.${index}.age`, {
                                                required: "반려동물의 나이를 입력해주세요",
                                                validate: {
                                                    isPositive: (value) => value > 0 || "0 보다 커야합니다."
                                                }
                                            })}
                                            placeholder="5"
                                        />
                                        <small>{errors?.pet?.[index]?.message}</small>
                                    </li>
                                    <li>
                                        <label htmlFor="pet__sex">반려동물 성별</label>
                                        <select id="pet__sex" {...register(`pet.${index}.sex`, {
                                            required: "성별을 선택해주세요."
                                        })}>
                                            <option value="">==선택==</option>
                                            <option value="M">남아</option>
                                            <option value="F">여아</option>
                                        </select>
                                        <small>{errors?.pet?.[index]?.message}</small>
                                    </li>
                                    <li>
                                        <label htmlFor="pet_introduce">반려동물 소개</label>
                                        <textarea {...register(`pet.${index}.introduce`, {
                                            maxLength: {
                                                value: 100,
                                                message: "소개는 100자 이내입니다."
                                            }
                                        })} rows={10}/>
                                        <small>{errors?.pet?.[index]?.introduce?.message}</small>
                                    </li>
                                </ul>
                            <button type="button" onClick={()=>remove(index)}>정보삭제하기</button>
                        </li>
                        )
                        })}
                    </ul>
                    <button>반려동물 등록하기</button>
                </form>
            </div>
        </div>
    )
}

export default RegisterPet;
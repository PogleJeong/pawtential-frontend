import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { HOME } from "../../constants/UrlPath";
import { ADD_PET } from "../../constants/ApiUrl";

let renderCount = 0;

function RegisterPet() {
    
    const {
        register,
        control,
        handleSubmit,
        getValues,
        setFocus,
        reset,
        formState: { errors }
    }= useForm({
        defaultValues: {
            pet: [{image: null, name: "", age: "", sex: "", introduce: ""}]
        },
        mode: "onChange",
    })

    // FIELDS 는 useForm 의 defaultValues에 영향을 받음.
    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        name: "pet",
        control
    })

    // 업로드할 이미지를 미리 보여주는 image fake url 값 저장
    const [previewImage, setPerviewImage] = useState([{}]);
    const imageRef = useRef([]);
    const navigate = useNavigate();
    
    const submitForm = async(formData) => {
        // form data = [{}, {}, {}] 형식으로 들어감. 
        console.log("form 제출 >>", formData);
        await axios.post(ADD_PET, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then(response => {
            if (response.data) {
                alert("반려동물이 등록되었습니다.");
                navigate(HOME);
            } else {
                alert("반려동물 등록에 실패하였습니다.")
            }
        })
    }

    const previewProfileImage = (event, itemId) => {
        // input 태그 내 target > files 에 FileList 가 저장되어있음.
        // 본래 key 값 자체에 대한 동적할당이 불가했으나, 2019 부터 가등하게 함.
        // {[key가 될 변수]: "value"}
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            imageRef.current[itemId].src= imageURL;
            setPerviewImage((previewImage)=> [...previewImage, {[itemId]: imageURL}])};
    }
    
    return(
        <div>
            <div>
                <form onSubmit={handleSubmit(submitForm)}>
                    <h2>반려동물 추가하기</h2>
                    <button type="button" onClick={()=>append({image: null, name: "흰둥이", age: "5", sex: "F", introduce: "소개글"})}>반려동물 추가하기</button>
                    <ul>
                        {fields.map((item) => {
                            return (
                            <li key={item.id} >
                                <ul>
                                    <li>
                                        <div>
                                            <img alt="대표이미지" ref={element => imageRef.current[item.id] = element} />
                                            <label htmlFor="pet__image">대표이미지 설정</label>
                                            <input 
                                                {...register(`pet.${item.id}.image`, {
                                                    required: "반려동물 대표이미지를 설정해주세요",
                                                })}
                                                id="pet__image" type="file"
                                                onChange={(event)=>previewProfileImage(event, item.id)}
                                            />
                                        </div>
                                        {errors.pet?.[item.id]?.image && <small>{errors.pet[item.id]?.image.message}</small>}
                                    </li>
                                    <li>
                                        <input 
                                            {...register(`pet.${item.id}.name`, {
                                                required: "반려동물 이름을 작성해주세요!",
                                                pattern: {
                                                    value: /^[가-힣]{1,10}$/,
                                                    message: "10자 이내 한글만 가능합니다."
                                                },
                                            })}
                                            placeholder="흰둥이"
                                        />
                                        {errors.pet?.[item.id]?.name && <small>{errors.pet[item.id]?.name.message}</small>}
                                    </li>
                                    <li>
                                        <label htmlFor="pet__age">반려동물 나이</label>
                                        <input 
                                            id="pet__age"
                                            type="text"
                                            {...register(`pet.${item.id}.age`, {
                                                required: "반려동물의 나이를 입력해주세요",
                                                validate: {
                                                    isPositive: (value) => {
                                                        if (isNaN(value)) {
                                                            return "숫자만 가능합니다.";
                                                        }
                                                        if (value < 0 || value > 30) {
                                                            return "나이는 최소 0살에서 최대 50살 까지 입력가능합니다.";
                                                        } 
                                                    }
                                                }
                                            })}
                                            placeholder="5"
                                        />
                                        {errors.pet?.[item.id]?.age && <small>{errors.pet[item.id]?.age.message}</small>}
                                    </li>
                                    <li>
                                        <label htmlFor="pet__sex">반려동물 성별</label>
                                        <select id="pet__sex" {...register(`pet.${item.id}.sex`, {
                                            required: "성별을 선택해주세요.",
                                            validate: {
                                                isNotNull: (value) => value != "" | "성별을 선택해주세요"
                                            }
                                        })}>
                                            <option value="">==선택==</option>
                                            <option value="M">남아</option>
                                            <option value="F">여아</option>
                                        </select>
                                        {errors.pet?.[item.id]?.sex && <small>{errors.pet[item.id]?.sex.message}</small>}
                                    </li>
                                    <li>
                                        <label htmlFor="pet_introduce">반려동물 소개</label>
                                        <textarea {...register(`pet.${item.id}.introduce`, {
                                            required: "반려동물 소개를 입력해주세요",
                                            maxLength: {
                                                value: 100,
                                                message: "소개는 100자 이내입니다."
                                            }
                                        })} rows={10}/>
                                        {errors.pet?.[item.id]?.introduce && <small>{errors.pet[item.id]?.introduce.message}</small>}
                                    </li>
                                </ul>
                            {fields.length > 1 && <button type="button" onClick={()=>remove(item.id)}>정보삭제하기</button>}
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
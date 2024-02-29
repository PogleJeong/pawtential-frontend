import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Form, useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { HOME, LOGIN, REGISTER } from "../../constants/UrlPath";
import { ADD_PET } from "../../constants/ApiUrl";
import styled from "styled-components";
import { CheckImageFileSize } from "../../util/RestrictUploadSize";

const Container = styled.div`
    width: 500px;
    padding: 50px 20px;
    margin-top: 30px;
    box-shadow: 0 4px 8px rgba(20, 20, 20, 0.5);
    background-color: #fff;
    text-align: left;
   
`

const Head = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 20px;
    h2 {
        color: #333;
        margin-bottom: 40px;
        text-align: center;
        font-size: 1.5em; 
        font-weight: bold;
    }
    button {
        border: none;
        border-radius: 5px;
        padding: 10px;
        transition: color 1s, background-color 1s;
        &:hover {
            color: white;
            background-color: #333;
        }
    }
`

const Card = styled.div`
    padding: 10px;
    box-shadow: 0 4px 8px rgba(20, 20, 20, 0.5);
    margin-bottom: 15px;
`

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 10px;
    margin-bottom: 20px;
    img {
        min-width: 200px;
        min-height: 200px;
        width: 200px;
        height: 200px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    label {
        display: block;
        width: 100%;
        font-size: 1rem;
        font-weight: bold;
        padding-bottom: 3px;
        margin-bottom: 10px;
        border-bottom: 1px solid black;
    }
    input {
        height: 35px;
        padding-left: 5px;
        border-width: 1px;
        border-radius: 5px;

        &#pet__age {
            text-align: center;
            width: 60px;
        }
    }
    select {
        width: 80px;
        height: 35px;
        text-align: center;
        border-radius: 5px;
    }
    textarea {
        width: 100%;
        min-height: 30px;
        max-height: 200px;
        padding: 10px;
        border-radius: 5px;
    }
    small {
        margin: 5px 0px;
        font-size: 0.8rem;
        color: red;
    }
`

const RemoveBtnBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    button {
        height: 30px;
        color: white;
        background-color: #e74c3c;
        border: none;
        font-size: 0.8rem;
        transition: scale 300ms, background-color 300ms;
        &:active {
            scale: 0.95;           
        }
        &:hover {
            background-color: red;
        }
    }
`

const SumbitBtnBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    button {
        width: 100px;
        height: 40px;
        border: none;
        font-size: 0.9rem;
        color: white;
        border-radius: 5px;
        background-color: #3498db;
        transition: background-color 500ms;
        &:hover {
            background-color: skyblue;
        }
    }
`

function RegisterPet() {

    const location = useLocation();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    }= useForm({
        defaultValues: {
            pet: [{profile: null, name: "", age: "", sex: "", introduce: ""}]
        },
        mode: "onSubmit",
    });
    // FIELDS 는 useForm 의 defaultValues에 영향을 받음.
    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        name: "pet",
        control
    });

    // 업로드할 이미지를 미리 보여주는 image fake url 값 저장
    const imageRef = useRef([]);
    const navigator = useNavigate();

    useEffect(()=>{
        const { state } = location;
        if (!state) {
            navigator(REGISTER);
            alert("등록한 회원정보가 없습니다. 회원가입 첫 페이지로 이동합니다.");
            return;
        }
    },[])
    
    const submitForm = async(formData) => {
        // form data = [{}, {}, {}] 형식으로 들어감. 
        const data = formData.pet;
        
        console.log(data);
        await axios.post(ADD_PET, data, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then(response => {
            if (response.data) {
                alert("반려동물이 등록되었습니다.");
                navigator(LOGIN);
            } else {
                alert("반려동물 등록에 실패하였습니다.")
            }
        }).catch((error)=>{
            console.log("네트워크 연결이 필요합니다.");
        })
    }

    const previewProfileImage = (event, itemId) => {
        
        const file = event.target.files[0];
        if (file) {
            // 파일업로드용량 제한
            let checkFileSize = CheckImageFileSize(file, 1024*5);
            
            if (checkFileSize) {
                const imageURL = URL.createObjectURL(file); 
                imageRef.current[itemId].src= imageURL;
                // setPerviewImage((previewImage)=> [...previewImage, {[itemId]: imageURL}])};  
            }
        }
    }
    
    return(
        <Container>
            <Head>
                <h2>반려동물 추가하기</h2>
                <button type="button" onClick={()=>append({profile: null, name: "흰둥이", age: "5", sex: "F", introduce: "소개글"})}>반려동물 추가하기</button>
            </Head>
            <form onSubmit={handleSubmit(submitForm)}>
            {fields.map((item) => (
                <Card key={item.id} >
                    <FormGroup>
                        <label>반려동물 대표이미지</label>
                        <img alt="대표이미지" ref={element => imageRef.current[item.id] = element} src={process.env.PUBLIC_URL + "/images/logo_js.png"}/>
                        <input 
                            {...register(`pet.${item.id}.profile`, {
                                required: "반려동물 대표이미지를 설정해주세요",
                            })}
                            id="pet__image" type="file"
                            onChange={(event)=>previewProfileImage(event, item.id)}
                        />
                        {errors.pet?.[item.id]?.profile && 
                        <small>{errors.pet[item.id]?.profile.message}</small>}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="pet__name">반려동물 이름</label>
                        <input 
                            id="pet__name"
                            {...register(`pet.${item.id}.name`, {
                                required: "반려동물 이름을 작성해주세요!",
                                pattern: {
                                    value: /^[가-힣]{1,10}$/,
                                    message: "10자 이내 한글만 가능합니다."
                                },
                            })}
            
                        />
                        {errors.pet?.[item.id]?.name && 
                        <small>{errors.pet[item.id]?.name.message}</small>}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="pet__age">반려동물 나이</label>
                        <input 
                            id="pet__age"
                            type="number"
                            {...register(`pet.${item.id}.age`, {
                                required: "반려동물의 나이를 입력해주세요",
                                validate: {
                                    isPositive: (value) => {
                                        if (isNaN(value)) {
                                            return "숫자만 가능합니다.";
                                        }
                                        if (value < 0 || value > 30) {
                                            return "나이는 최소 0살에서 최대 30살 까지 입력가능합니다.";
                                        } 
                                    }
                                }
                            })}
                        />
                        {errors.pet?.[item.id]?.age && 
                        <small>{errors.pet[item.id]?.age.message}</small>}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="pet__sex">반려동물 성별</label>
                        <select id="pet__sex" {...register(`pet.${item.id}.sex`, {
                            required: "성별을 선택해주세요.",
                            validate: {
                                isNotNull: (value) => value != "" | "성별을 선택해주세요"
                            }
                        })}>
                            <option value="">선택</option>
                            <option value="male">남아</option>
                            <option value="female">여아</option>
                        </select>
                        {errors.pet?.[item.id]?.sex && 
                        <small>{errors.pet[item.id]?.sex.message}</small>}
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="pet_introduce">반려동물 소개</label>
                        <textarea {...register(`pet.${item.id}.introduce`, {
                            required: "반려동물 소개를 입력해주세요",
                            maxLength: {
                                value: 100,
                                message: "소개는 100자 이내입니다."
                            }
                            
                        })} 
                        rows={10}
                        placeholder="100자 이내로 작성해주세요"
                        />
                        {errors.pet?.[item.id]?.introduce && 
                        <small>{errors.pet[item.id]?.introduce.message}</small>}
                    </FormGroup>
                    <RemoveBtnBox>
                        {fields.length > 1 && 
                        <button type="button" onClick={()=>remove(item.id)}>정보삭제하기</button>}
                    </RemoveBtnBox>
                </Card>))}  
                <SumbitBtnBox>
                    <button>등록하기</button>
                </SumbitBtnBox>
            </form>
        </Container>
    )
}

export default RegisterPet;
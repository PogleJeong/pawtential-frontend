import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { Button } from "react-bootstrap";
import axios, { HttpStatusCode } from "axios";
import { WRITE_PAWTENS } from "../../constants/UrlPath";
import { useRef, useState, useEffect } from "react";
import PreviewThumbnail from "./modal/PreviewThumbnail";
import PreviewVideo from "./modal/PreviewVideo";
import styled from "styled-components";

import { useLocation, useNavigate } from "react-router-dom";
import { PAWTENS } from "../../constants/UrlPath";
import { getValue } from "@testing-library/user-event/dist/utils";

const Container = styled.div`
    margin: 50px 0px;
    padding: 20px;
    display: flex;
    width: 800px;
    flex-direction: column;
    justify-content: center;


    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        height: 80px;
        line-height: 80px;
        text-align: center;
        background-color: aliceblue;
    }
`

const Form = styled.form`
    margin: 20px 0px;
`

const FormGroup = styled.div`
    label {
        display: block;
        padding-bottom: 5px;
        border-bottom: 1px solid black;
        font-weight: bold;
    }
    input {
        width: 100%;
        margin: 10px 0px;
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        transition: box-shadow 0.3s ease; /* 부드러운 전환 효과 */
        outline: none; /* 클릭 시 파란 테두리 제거 */

        &:focus {
            box-shadow: 0 0 15px rgba(135, 206, 235, 0.9); /* 포커스 상태에서 그림자 강화 */
        }
    }
    small {
        color: red;
        font-size: 0.8rem;
    }
`

const BtnBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
`

function UpdatePawtens() {
    const [ cookies ] = useCookies(["id"]);
    const { state } = useLocation(); // view 에서 수정되야함.
    const navigator = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            writer: state?.writer,
            title: state?.title,
            content: state?.content,
            thumbnail: state?.thumbnail,
            video: state?.video,
        },
        mode: "onSubmit"
    });
    
    useEffect(()=>{
        console.log(state);
        // 작성자가 아니라면 수정불가
        const isWriter = cookies?.id === state.writer;
        if (!isWriter) {
            alert("해당 포텐셜을 수정할 권한이 없습니다.");
            navigator(PAWTENS + `/${state?.id}`)
            return;
        } 
    },[])

    // 썸네일, 포텐셜비디오
    const [ previewData, setpreviewData ] = useState({thumbnail: "", video: ""});
    const [ showModal, setShowModal ] = useState({thumbnail: false, video: false});

    const updatePawtens = async(data) => {
        console.log(data);
        await axios.post(WRITE_PAWTENS, data, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert("포텐셜이 성공적으로 작성되었습니다.");
            } else {
                alert("포텐셜 작성에 실패하였습니다.");
            }
        }).catch((error)=>{
            alert("포텐셜 등록에 실패하였습니다.");
        })
    }

    const uploadThumbnail = (event) => {
        const thumbnailFile = event.target?.files[0];
        if (thumbnailFile !== null && thumbnailFile !== undefined) {
            const fakeUrl = URL.createObjectURL(thumbnailFile);
            setpreviewData((data)=>{
                let copy = {...data};
                copy.thumbnail = fakeUrl;
                return copy;
            });
            setShowModal((show)=>{
                let copy = {...show};
                copy.thumbnail = true;
                return copy;
            });
        }
    }

    const uploadVideo = (event) => {
        const videoFile = event.target?.files[0];
        if (videoFile !== null && videoFile !== undefined) {
            const fakeUrl = URL.createObjectURL(videoFile);
            console.log(fakeUrl);
            setpreviewData((data)=>{
                let copy = {...data};
                copy.video = fakeUrl;
                return copy;
            });
            setShowModal((show)=>{
                let copy = {...show};
                copy.video = true;
                return copy;
            });
        }
    }

    return(
        <Container>
            <h2>포텐스 영상 수정하기</h2>
            <Form onSubmit={handleSubmit(updatePawtens)}>
                <FormGroup className="mb-3">
                    <label>작성자</label>
                    <input type="text" 
                        plaintext readOnly 
                        {...register("writer", {
                            required: "로그인 정보가 없습니다.",
                        })}
                        
                    />
                    {errors?.writer && 
                    <small>
                        {errors?.writer?.message}
                    </small>
                    }
                </FormGroup>
                <FormGroup className="mb-3">
                    <label>제목 (30자이내)</label>
                    <input type="text"
                        {...register("title", {
                            required: "제목을 입력해주세요",
                            maxLength: {
                                value: 20,
                                message: "제목은 20자 이내입니다."
                            },
                        })}
                    />
                    {errors?.title && 
                    <small>
                        {errors?.title?.message}
                    </small>
                    }
                </FormGroup>
                <FormGroup className="mb-3">
                    <label>내용 (100자이내)</label>
                    <input as="textarea" rows={3} 
                        {...register("content", {
                            required: "내용을 입력해주세요",
                            maxLength: {
                                value: 20,
                                message: "내용은 100자 이내입니다."
                        },
                    })}
                    style={{maxHeight: "200px"}}
                    />
                    {errors?.content && 
                    <small>
                        {errors?.content?.message}
                    </small>
                    }
                </FormGroup>
                <FormGroup className="mb-3">
                    <label>썸네일</label>
                    <input type="file" size="sm" accept="image/*" 
                        {...register("thumbnail", {
                            required: "썸네일을 업로드해주세요."
                        },
                    )}
                    onChange={uploadThumbnail}
                    />
                    {errors?.thumbnail && 
                    <small>
                        {errors?.thumbnail?.message}
                    </small>
                    }
                </FormGroup>
                <FormGroup className="mb-3">
                    <label>포텐스 영상</label>
                    <input type="file" size="sm" accept="video/*" 
                        {...register("video", {
                            required: "포텐셜로 등록할 동영상을 업로드해주세요."
                        },
                    )}
                    onChange={uploadVideo}
                    />
                      {errors?.video && 
                    <small>
                        {errors?.video?.message}
                    </small>
                    }
                </FormGroup>
                <BtnBox>
                    <Button type="submit">제출</Button>
                </BtnBox>
            </Form>
            <PreviewThumbnail showModal={showModal} setShowModal={setShowModal} previewData={previewData} />
            <PreviewVideo showModal={showModal} setShowModal={setShowModal} previewData={previewData} />
        </Container>
    )
};

export default UpdatePawtens;
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { Button, Container, Form } from "react-bootstrap";
import axios, { HttpStatusCode } from "axios";
import { WRITE_PAWTENS } from "../../constants/UrlPath";
import { useRef, useState } from "react";
import PreviewThumbnail from "./modal/PreviewThumbnail";
import PreviewVideo from "./modal/PreviewVideo";

function WritePawtens() {
    const [ cookies ] = useCookies(["id", "nickname"]);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            writer: `${cookies?.id}`,
            title: "",
            content: "",
            thumbnail: null,
            video: null,
        },
        mode: "onSubmit"
    });

    const thumbnailRef = useRef(null);
    const videoRef = useRef(null);

    // 썸네일, 포텐셜비디오
    const [ previewData, setpreviewData ] = useState({thumbnail: "", video: ""});
    const [ showModal, setShowModal ] = useState({thumbnail: false, video: false});

    const writePawtens = async(data) => {
        console.log(data);
        // await axios.post(WRITE_PAWTENS, data, {
        //     baseURL: process.env.REACT_APP_SERVER_URL,
        // }).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Created) {
        //         alert("포텐셜이 성공적으로 작성되었습니다.");
        //     } else {
        //         alert("포텐셜 작성에 실패하였습니다.");
        //     }
        // })
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
            <Form onSubmit={handleSubmit(writePawtens)}>
                <Form.Group className="mb-3">
                    <Form.Label>작성자</Form.Label>
                    <Form.Control type="text" 
                        plaintext readOnly 
                        {...register("writer", {
                            required: "로그인 정보가 없습니다.",
                        })}
                    />
                    {errors?.writer && 
                    <Form.Text>
                        {errors?.writer?.message}
                    </Form.Text>
                    }
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>제목</Form.Label>
                    <Form.Control type="text"
                        {...register("title", {
                            required: "제목을 입력해주세요",
                            maxLength: {
                                value: 20,
                                message: "제목은 20자 이내입니다."
                            },
                        })}
                    />
                    {errors?.title && 
                    <Form.Text>
                        {errors?.title?.message}
                    </Form.Text>
                    }
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>내용 (100자이내)</Form.Label>
                    <Form.Control as="textarea" rows={3} 
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
                    <Form.Text>
                        {errors?.content?.message}
                    </Form.Text>
                    }
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>썸네일</Form.Label>
                    <Form.Control type="file" size="sm" accept="image/*" 
                        {...register("thumbnail", {
                            required: "썸네일을 업로드해주세요."
                        },
                    )}
                    onChange={uploadThumbnail}
                    />
                    {errors?.thumbnail && 
                    <Form.Text>
                        {errors?.thumbnail?.message}
                    </Form.Text>
                    }
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>포텐스</Form.Label>
                    <Form.Control type="file" size="sm" accept="video/*" 
                        {...register("video", {
                            required: "포텐셜로 등록할 동영상을 업로드해주세요."
                        },
                    )}
                    onChange={uploadVideo}
                    />
                      {errors?.video && 
                    <Form.Text>
                        {errors?.video?.message}
                    </Form.Text>
                    }
                </Form.Group>
                <Button type="submit">제출</Button>
                
            </Form>
            <PreviewThumbnail showModal={showModal} setShowModal={setShowModal} previewData={previewData} />
            <PreviewVideo showModal={showModal} setShowModal={setShowModal} previewData={previewData} />
        </Container>
    );
};

export default WritePawtens;
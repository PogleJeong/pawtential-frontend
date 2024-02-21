import { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { Button, Container, Form } from "react-bootstrap";
import { DateRange } from "react-date-range";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// react-date-range 의 스타일 import 
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

// PATH
import { ADD_CONTEST } from "../../constants/ApiUrl";
import { CONTEST, HOME } from "../../constants/UrlPath";
import SlidePreview from "./modal/SlidePreview";

const ContestWrapper = styled.div`
    margin: auto 30%;
`

const ErrorMessage = styled.small`
    color: red;
    margin-top: 5px;
    font-weight: bold;
    font-size: 0.75em;
`

const GroupStyle = {
    border: "1px gray solid",
    boxShadow: "1px 3px 5px 0px",
    padding: "15px", 
    borderRadius: "10px",
}

const FlexStyle = {
    display: "flex", 
    justifyContent: "center", 
    alignContent: "center"
}

/**
 * 기간설정 : react-date-range 사용
 */
const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
}

function WriteContest() {
    const [ cookies ] = useCookies(["id","nickname"]);
    const navigator = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            writer: cookies?.id,
            category: "콘테스트",
            startDate: new Date(),
            endDate: new Date(),
            content: "",
            attaches: null,
        }
    });

    /**
     * 카테고리: 콘테스트 and 콘테스트 날짜 설정관련 state
     */
    const [ isContest, setIsContest ] = useState(true);
    const [ contestDate, setContestDate] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
    ]);

    /**
     * 콘테스트 이미지 미리보기
     */
    const [ showPreview, setShowPreview ] = useState(false);
    const [ contestPreviewImage, setContestPreviewImage ] = useState([]);

    /**
     * 달력에서 시작날짜와 종료날짜를 설정하면 contestDate state 가 변경되면서 작동
     * - useForm 의 startDate, endDate 수정 
    */
    useEffect(()=>{
        setValue("startDate", contestDate[0].startDate);
        setValue("endDate", contestDate[0].endDate);
    }, [contestDate]);

    const uploadImageFile = (event) => {
        let fileList = event.target.files;
        if (fileList.length > 3) {
            event.target.files = null;
            console.log(event.target.files);
            alert("최대 3개의 이미지만 업로드할 수 있습니다.");
            return;
        }
        let fakeUrlList = [];
        for (let i=0; i < fileList.length; i++) {
            const fakeUrl = URL.createObjectURL(fileList[i]);
            fakeUrlList.push(fakeUrl);
        }
        setContestPreviewImage(fakeUrlList);
        setShowPreview(true);
    }

    const submitContestForm = async(data) => {
        console.log(data);
        // await axios.post(ADD_CONTEST, data, {
        //     baseURL: process.env.REACT_APP_SERVER_URL
        // }).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Created) {
        //         const { data } = response;
        //         alert("콘테스트 작성에 성공하였습니다.");
        //     } else {
        //         alert("콘테스트 작성에 실패하였습니다.");
        //     }
        //     
        // }).catch((error)=>{
        //     alert("콘테스트 작성에 실패하였습니다.");
        // });
        navigator(CONTEST);
    }
    return(
        <Container style={{padding: "auto"}}>
            <ContestWrapper>
                <Form onSubmit={handleSubmit(submitContestForm)} style={{minWidth: "400px"}}>
                    {/* 작성자 */}
                    <Form.Group className="mb-3" style={GroupStyle}>
                        <Form.Label style={{ fontWeight: "bolder", fontSize: "20px", color: "black" }}>작성자</Form.Label><br/>
                        <Form.Control type="text" 
                            plaintext readOnly 
                            value={cookies?.id} 
                        />

                    </Form.Group><br/>

                    {/* 카테고리 선택 */}
                    <Form.Group className="mb-3" style={GroupStyle}>
                        <Form.Label style={{ fontWeight: "bolder", fontSize: "20px", color: "black" }}>카테고리</Form.Label><br/><br/>
                        <Form.Check inline label="콘테스트" 
                            {...register("category", {
                                required: "콘테스트 또는 당첨자 발표 중 하나를 선택해주세요",
                            })}
                            name="category" 
                            type="radio" 
                            value="콘테스트" 
                            onChange={()=>setIsContest(true)}
                        />
                        <Form.Check inline label="당첨자 발표" 
                            {...register("category", {
                                required: "콘테스트 또는 당첨자 발표 중 하나를 선택해주세요",
                            })}
                            name="category" 
                            type="radio" 
                            value="당첨자 발표" 
                            onChange={()=>setIsContest(false)}
                        />
                        {errors?.category && <ErrorMessage>{errors?.category.message}</ErrorMessage>}
                    </Form.Group><br/>

                    {/* 콘테스트 작성일 경우 날짜 설정필요. */}
                    {isContest &&
                    <Form.Group className="mb-3" style={GroupStyle}>
                        <Form.Label style={{ fontWeight: "bolder", fontSize: "20px", color: "black" }}>콘테스트 날짜</Form.Label><br/><br/>
                        <div style={FlexStyle}>
                            <DateRange
                                editableDateInputs={true}
                                onChange={ item=> setContestDate([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={contestDate}
                                minDate={new Date()}
                            />
                        </div>
                        {errors?.date && <ErrorMessage>{errors?.date.message}</ErrorMessage>}
                    </Form.Group>}<br/>
                    
                    {/* 제목 작성 */}
                    <Form.Group className="mb-3" style={GroupStyle}>
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
                        {errors?.title && <ErrorMessage>{errors?.title?.message}</ErrorMessage>}
                    </Form.Group>

                    {/* 내용 작성 */}
                    <Form.Group className="mb-3" style={GroupStyle}>
                    <Form.Label style={{ fontWeight: "bolder", fontSize: "20px", color: "black" }}>내용작성</Form.Label><br/><br/>
                        <CKEditor
                          editor={ClassicEditor}
                          onChange={(event, editor) => {
                              const data = editor.getData();
                              setValue("content", data);
                          }}
                        />
                        {getValues("content") == "" && <ErrorMessage>내용을 입력해주세요</ErrorMessage>}
                    </Form.Group><br/>

                    {/* 콘테스트 썸네일 */}
                    <Form.Group className="mb-3"  style={GroupStyle}>
                        <Form.Label style={{ fontWeight: "bolder", fontSize: "20px", color: "black" }}>첨부파일</Form.Label>
                        <Form.Text>&nbsp; 첫번째 이미지가 콘테스트 썸네일로 표시됩니다.</Form.Text><br/><br/>
                        <Form.Control type="file" size="sm" multiple accept="image/*"
                          {...register("attaches", {
                            required: "적어도 하나 이상의 이미지를 업로드해주세요",
                          })}                        
                          onChange={uploadImageFile}
                        />
                        {errors?.attaches && <ErrorMessage>{errors?.attaches.message}</ErrorMessage>}
                    </Form.Group>

                    {/* 이미지 미리보기 모달창 */}
                    <SlidePreview 
                      show={showPreview}
                      onHide={()=>setShowPreview(false)}
                      images={contestPreviewImage}
                    />

                    <Form.Group style={FlexStyle}>
                        <Button type="submit">작성하기</Button>
                    </Form.Group>
                </Form>
            </ContestWrapper>
        </Container>
    );
};

export default WriteContest;
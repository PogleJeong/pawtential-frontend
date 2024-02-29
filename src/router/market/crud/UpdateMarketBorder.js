import axios, { HttpStatusCode } from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

// 텍스트 에디터 라이브러리
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from '../../../util/UploadAdaptor';
import "../../../ckeditor.css";
import useScript from '../../../CustomHook';

// kakao map
import KakaoMap from './components/KakaoMap';

// 내부파일
import ImageCarousel from "./components/ImageCarousel";
import { LOGIN, MARKET, MARKET_UPDATE } from "../../../constants/UrlPath";
import { CheckImageFileSize } from "../../../util/RestrictUploadSize";

const Container = styled.div`
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-top: 30px;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        padding: 30px;
        margin-bottom: 30px;
        border-radius: 5px;
        color: white;
        background-color: #333;
    }
`

const FormGroup = styled.div`
    margin-bottom: 10px;
    border-bottom: 2px solid black;
    label {
        font-size: 0.9rem;
        font-weight: bold;
        display: block;
        margin-bottom: 10px;
    }
    input, select {
        width: 100%;
        padding: 10px;
        margin-bottom: 5px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }
    small {
        display: block;
        width: 100%;
        padding-left: 3px;
        margin-bottom: 5px;
        color: red;
        font-size: 0.75rem;
    }
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    
    button {
        width: 100%;
        height: 40px;
        border: none;
        font-weight: bold;
        color: white;
        background-color: skyblue;
        transition: background-color 500ms;
        &:hover {
            
            background-color: #3498db;
        }
    }
`

// 텍스트 에디터 - 업로드 어댑터
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
    }
}

function UpdateMarketBorder() {
    const [ cookies ] = useCookies(["id", "nickname"]);
    const { state: { marketInfo, geoLocation } } = useLocation();
    const { id } = useParams();
    const { register, handleSubmit, getValues, setValue, formState: { errors }}
    = useForm({
        defaultValues: {
            writer: cookies?.id,
            title: marketInfo.title,
            state: marketInfo.state,
            price: marketInfo.price,
            category: marketInfo.category,
            content: marketInfo.content,
            attaches: marketInfo.attaches,
            getLat: geoLocation[0],
            getLng: geoLocation[1],
        },
        mode: "onSubmit"
    });

    // 페이지 이동
    const navigator = useNavigate();

    // 이미지 미리보기용 fake url
    const [ image, setImage ] = useState([...marketInfo.attaches]);

    // 지도값, 주소값
    const [ geoLatLng, setGeoLatLng] = useState([33.450701, 126.570667])

    // 카카오맵 API 라이브러리 불러오기
    const [ loading, error ] = useScript(`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`);

    useEffect(()=>{
        if (!cookies?.id) {
            alert("로그인이 필요합니다.");
            navigator(LOGIN);
        } 
        setGeoLatLng(geoLocation);
    },[])


    const uploadFile = async(event) => {
        setImage([]); // 초기화
        const files = event.target.files;
        
        if (files.length > 3) {
            alert("업로드할 수 있는 파일은 최대 3개 입니다.")
            return null;
        } 
    
        for (let i=0; i< files.length; i++) {
            if (!CheckImageFileSize(files[i], 1024 * 3)) {
                alert("이미지 파일은 각 최대 3MB 입니다.");
                return;
            }
            const fakeUrl = URL.createObjectURL(files[i]);
            setImage((prev)=>[...prev, fakeUrl]);
        }
    }

    const submitMarket = async(data) => {
        data.geoLat = geoLatLng[0];
        data.geoLng = geoLatLng[1];
        console.log(data);
        await axios.post(MARKET_UPDATE + id, data, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                console.log(data);
                alert("게시물이 성공적으로 수정되었습니다.");
                navigator(`${MARKET}/${data}`);
            } else {
                alert("게시물 수정에 실패하였습니다.");
                navigator(MARKET);
            }
        }).catch((error)=>{
            console.log(error);
        })
    }
    
    return(
        <Container>
            {/* header */}
            <h2>MARKET 작성하기</h2>
            <form onSubmit={handleSubmit(submitMarket)}>
                <FormGroup>
                    {/*  작성자 */}
                    <label htmlFor="writer">작성자</label>
                    <input {...register("writer", {
                            required: "로그인이 필요합니다."
                        })} 
                        value={getValues("writer")} 
                        readOnly 
                        disabled
                    />
                    {errors?.writer && <small>{errors.writer.message}</small>}
                </FormGroup>
                <FormGroup>
                    {/* 제목 */}
                    <label htmlFor="title">제목</label>
                    <input id="title" {...register("title", {
                            required: "제목을 작성해주세요.",
                            maxLength: {
                                value: 30,
                                message: "제목은 최대 30자입니다."
                            }
                        })}
                    />
                </FormGroup>
                <FormGroup>
                    {/* 분류 */}
                    <label htmlFor="state">분류</label>
                    <select id="state" {...register("state", {
                        required: "분류를 선택해주세요."
                    })}
                    >
                        <option value="">분류를 선택해주세요</option>
                        <option value="sell">판매</option>
                        <option value="free">나눔</option>
                    </select>
                    {errors?.state && <small>{errors.state.message}</small>}
                </FormGroup>

                <FormGroup>
                    {/* 가격 */}
                    <label Htmlfor="price">가격:</label>
                    <input type="number" id="price" 
                        {...register("price", {
                            required: "가격을 입력해주세요",
                            max: {
                                value: 10000000,
                                message: "최대 가격은 1천만원 이하입니다."
                            },
                            min: {
                                value: 10,
                                message: "최소 가격은 10원 이상입니다."
                            }
                        })}
                        max="10000000"
                        min="10"
                        placeholder="숫자로 입력하세요" 
                    />
                    {errors?.price && <small>{errors.price.message}</small>}
                </FormGroup>

                <FormGroup>
                    {/* 분류 */}
                    <label htmlFor="category">카테고리</label>
                    <select id="category"
                        {...register("category", {
                            required: "카테고리를 선택해주세요.",
                        })}
                    >
                        <option value="">카테고리를 선택해주세요</option>
                        <option value="food">음식</option>
                        <option value="toys">장난감</option>
                        <option value="beds">침대</option>
                        <option value="clothing">의류</option>
                        <option value="grooming">그루밍용품</option>
                    </select>
                    {errors?.category && <small>{errors.category.message}</small>}
                </FormGroup>

                <FormGroup>
                    {/* 대표이미지 최대 3개 */}
                    <label htmlFor='image'>상품이미지 등록하기</label>
                    <input type="file" id="image"
                        {...register("attaches", {
                            required: "대표이미지를 설정해주세요.",
                        })}
                        multiple 
                        accept="image/*"
                        onChange={uploadFile}
                    />
                    {errors?.attaches && <small>{errors.attaches.message}</small>}
                </FormGroup>
                {image.length > 0 && 
                <FormGroup style={{minHeight: "200px"}}>
                    {/* 이미지 미리보기 */}
                    <label>이미지 미리보기</label>
                    <ImageCarousel images={image} />
                </FormGroup>
                }
                <FormGroup>
                    <label>내용</label>
                    <CKEditor
                        id="editor"
                        data={getValues("content")}
                        editor={ ClassicEditor }
                        config={{
                            extraPlugins: [MyCustomUploadAdapterPlugin],
                        }}
                        onBlur={ (event, editor) => {
                            const content = editor.getData();
                            setValue("content", content);
                        }}
                    />
                </FormGroup>
                {/* 카카오지도 */}
                {!loading && <KakaoMap geoLatLng={geoLatLng} setGeoLatLng={setGeoLatLng} />}
                <ButtonBox>
                    <button>작성하기</button>
                </ButtonBox>
            </form>
        </Container>
    );
}

export default UpdateMarketBorder;
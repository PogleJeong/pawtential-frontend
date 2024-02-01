import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import axios, { HttpStatusCode } from "axios";

// 텍스트 에디터 라이브러리
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UploadAdapter from '../../util/UploadAdaptor';
import "../../ckeditor.css";
import useScript from '../../CustomHook';

// GEOLOCATION
import Geolocation from '@react-native-community/geolocation';
import KakaoMap from './market-home/component/WriteMap';
import { useNavigate } from "react-router-dom";


// 텍스트 에디터 - 업로드 어댑터
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
    }
}

function WriteMarketBorder() {
    const [ cookies ] = useCookies("id");
    const [ title, setTitle ] = useState("");
    const [ content, setContent ] = useState("");
    const [ state, setState ] = useState("")
    const [ imageFiles, setImageFiles ] = useState(null);
    const imageRef = useRef([]);
    // 페이지 이동
    const navigator = useNavigate();

    // 이미지 미리보기용 fake url
    const [ image, setImage ] = useState([]);

    // 지도값, 주소값
    const [ geoLatLng, setGeoLatLng] = useState([33.450701, 126.570667])

    // 카카오맵 API 라이브러리 불러오기
    const [ loading, errors ] = useScript(`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`);

    useEffect(()=>{
        Geolocation.getCurrentPosition((data)=>{
            const currentGeoLatLng = [ data?.coords.latitude, data?.coords.longitude];
            setGeoLatLng(()=>currentGeoLatLng);
        });
    },[])

    const uploadFile = async(event) => {
        setImageFiles(null);
        setImage([]); // 초기화

        const files = event.target.files;
        
        if (files.length > 3) {
            alert("업로드할 수 있는 파일은 최대 3개 입니다.")
            return null;
        } 
    
        for (let i=0; i< files.length; i++) {
            const fakeUrl = URL.createObjectURL(files[i]);
            setImage((prev)=>[...prev, fakeUrl]);
        }
        setImageFiles(files);
    }

    const submitMarket = async() => {
        if (title === "") {
            alert("제목이 입력되지 않았습니다.");
        }
        if (content === "") {
            alert("내용이 입력되지 않았습니다.");
        }
        if (state === "") {
            alert("분류를 선택해주세요");
        }
        if (imageFiles === null || imageFiles.length === 0) {
            alert("대표이미지를 설정해주세요");
        }
        

        const formData = new FormData();
        formData.append("id", cookies.id);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("state", state);
        formData.append("attaches", imageFiles);

        for(var pair of formData.entries()) {
            console.log(pair[0], "=", pair[1]);
        }
        await axios.post("/market/write", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert("게시물이 성공적으로 작성되었습니다.");
            } else {
                alert("게시물 작성에 실패하였습니다.");
            }
            navigator("/market");
        })
    }
    
    return(
        <div>
            
            {/* // header */}
            <div>
                {/* 작성자 */}
                <label htmlFor="writer">작성자</label>
                <input value={`${cookies.id}(${cookies.nickname})`} readOnly disabled/>
                {/* 제목 */}
                <input type="text" 
                  value={title}
                  required 
                  maxLength="50" 
                  placeholder='제목'
                  onChange={(event)=>setTitle(event.target.value)}
                />
                {/* 분류 */}
                <select id="state" onChange={(event)=>setState(event.target.value)}>
                    <option value="">=선택=</option>
                    <option value="판매">판매</option>
                    <option value="나눔">나눔</option>
                </select>

                {/* 대표이미지 최대 3개 */}
                <label htmlFor='image'>
                    "상품이미지 등록하기"
                </label>
                <input type="file" 
                  id="image"
                  multiple 
                  accept="image/*"
                  onChange={uploadFile}
                  style={{display: "none"}}
                />
            </div>
            <div style={{display: "flex", maxWidth: "100px"}}>
                {/* 이미지 미리보기 */}
                {image.map((url, index)=>
                <img key={index} ref={(element)=>imageRef.current[index] = element} src={url}
                    style={{maxWidth: "200px", maxHeight: "200px"}}
                />)
                }
            </div>
            <CKEditor
                id="editor"
                data={content}
                editor={ ClassicEditor }
                config={{
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                }}
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setContent(data);
                }}
        
            />
            {/* 카카오지도 */}
            {!loading && <KakaoMap geoLatLng={geoLatLng} setGeoLatLng={setGeoLatLng} />}
            
           
            <div>
                <input type="submit" onClick={submitMarket} value="작성하기" />
            </div>
        </div>
    )
}

export default WriteMarketBorder;
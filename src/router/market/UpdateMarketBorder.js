import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";

// 텍스트 에디터 라이브러리
import UploadAdapter from '../../util/UploadAdaptor';
import "../../ckeditor.css";
import useScript from '../../CustomHook';

// GEOLOCATION
import KakaoMap from './market-home/component/WriteMap';

// 텍스트 에디터 - 업로드 어댑터
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
    }
}

function UpdateMarketBorder() {
    const [ cookies ] = useCookies("id");
    const [ title, setTitle ] = useState("");
    const [ content, setContent ] = useState("<p>테스트 내용</p>");
    const [ state, setState ] = useState("")
    const [ imageFiles, setImageFiles ] = useState(null);
    const imageRef = useRef([]);
    const contentRef = useRef();

    // 페이지 이동
    const navigator = useNavigate();

    // url params;
    const params = useParams();

    // 이미지 미리보기용 fake url
    const [ image, setImage ] = useState([]);

    // 지도값, 주소값
    const [ geoLatLng, setGeoLatLng] = useState([33.450701, 126.570667])

    // 카카오맵 API 라이브러리 불러오기
    const [ loading, errors ] = useScript(`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`);

    useEffect(()=>{
        console.log(params.id);
        // 기존 게시물의 정보가져오기
        axios.get(`/market/update/${params.id}`).then((response)=>{
            const status = response?.status;
            if (status === HttpStatusCode.Ok){
                const { title, content, writer, state, geoLat, geoLng, attaches } = response?.data;
                if (cookies.id !== writer) {
                    alert("해당 게시물을 수정할 권한이 없습니다.");
                    navigator(`/market/${params.id}`);
                    return;
                }
                setTitle(title);
                setContent(content);
                setState(state);
                setGeoLatLng([geoLat, geoLng]);
                setImage(attaches);
                return;
            } else {
                alert("해당 게시물 정보를 가져오는데 실패하였습니다.");
                return;
            }
        })

        // content 내용 innerText 로 삽입
        contentRef.current.innerHTML = content;
    },[])

    const uploadFile = (event) => {
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
        // 수정시 이미지를 첨부하지 않으면 기존 이미지 사용
        // if (imageFiles === null || imageFiles.length === 0) {
        //     alert("대표이미지를 설정해주세요");
        // }
        

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
                alert("게시물이 성공적으로 수정되었습니다.");
            } else {
                alert("게시물 수정에 실패햐였습니다.");
            }
            navigator(`/market/${params.id}`);
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
            <div ref={contentRef}>
                
            </div>
            {/* 카카오지도 */}
            {!loading && <KakaoMap geoLatLng={geoLatLng} setGeoLatLng={setGeoLatLng} />}
            {errors && <div>kakao map 을 불러오는데 실패하였습니다.</div>}
           
            <div>
                <input type="submit" onClick={submitMarket} value="작성하기" />
            </div>
        </div>
    )
}

export default UpdateMarketBorder;
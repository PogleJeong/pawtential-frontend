import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";

// 텍스트 에디터 라이브러리
import UploadAdapter from '../../util/UploadAdaptor';
import "../../ckeditor.css";
import useScript from '../../CustomHook';

// GEOLOCATION
import KakaoMap from './market-home/component/WriteMap';
import { useForm } from "react-hook-form";
import WriteCommentForm from "./market-home/component/WriteCommentForm";
import { dateFormat } from "../../util/UtilFunction";

function ViewMarketBorder() {
     // url params;
     const params = useParams();

    // 게시물 정보
    const [ marketInfo, setMarketInfo ] = useState({
        title: "테스트용 제목",
        content: "테스트용 내용",
        writer: "test1234",
        writer_nick: "닉넴",
        wdate: new Date(),
        posting: 5,
        state: "나눔",
        category: "완구",
        price: 10000,
        attaches: null,
        comments: [
            {
                marketId: params.id,
                marketCommentId: "abc1", // backend 에서 추가 필요;
                parentCommentId: "1",
                depth: 1,
                writer: "댓글작성자1",
                comment: "작성된 댓글1",
                wdate: new Date(),
                modified: true,
            }
        ],
    })
    const [ cookies ] = useCookies("id");
    const imageRef = useRef([]);
    const contentRef = useRef();

    // 모달
    const [ open, setOpen ] = useState(false);

    // 페이지 이동
    const navigator = useNavigate();

    // 이미지 미리보기용 fake url
    const [ image, setImage ] = useState([]);

    // 지도값, 주소값
    const [ geoLatLng, setGeoLatLng] = useState([33.450701, 126.570667])

    // 카카오맵 API 라이브러리 불러오기
    const [ loading, error ] = useScript(`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`);

    useEffect(()=>{
        console.log(params.id);
        callBorderInfo();
    },[])

    const callBorderInfo = async() => {
        // 기존 게시물의 정보가져오기
        await axios.get(`/market/detail/${params.id}`).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok){
                const { title, content, writer, writer_nick, wdate, state, category, geoLat, geoLng, attaches, comments } = response?.data;
                // 마켓정보
                setMarketInfo({
                    title,
                    content,
                    writer,
                    writer_nick,
                    wdate,
                    state,
                    category,
                    attaches,
                    comments,
                });
                // 지도설정
                setGeoLatLng([geoLat, geoLng]);
                
            } else {
                alert("해당 게시물 정보를 가져오는데 실패하였습니다.");
            }
        });
        // content 내용 innerText 로 삽입
        
        contentRef.current.innerHTML = marketInfo.content;
    };

    const writeRecomment = async(event) => {
        console.log(event.target);
    }

    return(
        <div>
            {/* // header */}
            <div>
                <h3>
                    <span>&#91;{marketInfo.state}&#93;</span>
                    <span>{marketInfo.title}</span>
                </h3>
            </div>
            <div>
                <span onClick={()=>setOpen((prev)=>!prev)}>
                    {open &&
                    <div>
                        <ul>
                            <li>
                                <span>{marketInfo.writer_nick}</span>
                            </li>
                            <li>
                                <Link to={`/user/${marketInfo.writer}`}>작성자 계정보기</Link>
                            </li>
                        </ul>
                    </div>
                    }
                    <em>{marketInfo.writer_nick}</em>
                </span>
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
            {error && <div>kakao map 을 불러오는데 실패하였습니다.</div>}
            {/* 댓글 작성*/}
            <div>
                {cookies.id !== null &&
                <div>
                   <WriteCommentForm params={params} loginUser={cookies}/>
                </div>
                }
            </div>
            {/* 작성된 댓글 */}
            <div>
                <ul>
                    {marketInfo.comments &&
                    marketInfo.comments.map((comment, index)=>(
                        <li>
                            <div>
                                <h3>
                                    <span>{comment?.writer}</span>
                                    <span>작성일자 | {dateFormat(comment?.wdate)}</span>
                                    <span>{comment?.modified === true && "(수정됨)"}</span>
                                </h3>
                                <div>
                                    {comment?.comment}
                                </div>
                                <div>
                                    <span data-commentId={comment?.marketCommentId} onClick={writeRecomment}>대댓글달기</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )

};

export default ViewMarketBorder;
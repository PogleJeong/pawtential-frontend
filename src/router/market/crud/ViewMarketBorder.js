import axios, { HttpStatusCode } from "axios";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

// 텍스트 에디터 라이브러리
import "../../../ckeditor.css";
import useScript from '../../../CustomHook';

// GEOLOCATION
import KakaoMap from './components/KakaoMap';
import { dateFormat } from "../../../util/UtilFunction";
import { MARKET, MARKET_UPDATE, USER_INFO } from "../../../constants/UrlPath";
import ImageCarousel from "./components/ImageCarousel";
import ReportModal from "./components/ReportModal";
import ViewMarketComments from "./components/ViewMarketComments";
import WriteMarketCommentForm from "./components/WriteMarketCommentForm";
import { GET_MARKET } from "../../../constants/ApiUrl";

const Container = styled.div`
    width: 700px;
    max-width: 700px;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

const PostTitle = styled.div`
    color: #333;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
`

const Title = styled.div`
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 15px;
`

const Meta = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    color: #777;
    margin-top: 10px;
    
    div {
        &:first-child {
            span {
                display: inline-block;
                padding: 3px;
                &:first-child {
                    cursor: pointer;
                }
            }
        }
    }
`

const UserModal = styled.div`
    position: absolute;
    top: 30px;
    background-color: white;
    border: 1px solid black;
    z-index: 3;
    ul {
        li {
            padding: 10px 5px;
        }
    }
`

const ReportBox = styled.div`
    span {
        display: inline-block;
        padding: 3px;
        &:last-child:hover {
            cursor: pointer;
            color: #3498db;
        }
        &.update__btn {
            color: skyblue;
        }
        &.remove__btn {
            color: red;
            &:hover {
                text-decoration: underline;
            }
        }
    }
`

const InfoBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    height: 250px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 10px;
    margin: 20px 0px;
`

const InfoText = styled.div`
    padding: 20px;
    border-radius: 8px;
    ul {
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: space-around;
        li {
            list-style: circle;
            vertical-align: middle;
            border-bottom: 1px solid black;
            padding-bottom: 2px;
            span:first-child {
                font-size: 0.8rem;
                color: gray;
            }
            span:last-child {
                font-size: 0.8rem;
                font-weight: bold;
                color: black;

            }
        }
    }
`

const ContentBox = styled.div`
    min-height: 300px;
    border: 1px solid rgba(0,0,0,0.3);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
`

const CommentBox = styled.div`
    min-height: 300px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    margin-top: 20px;
`


function ViewMarketBorder() {
     // url params;
    const params = useParams();

    // 게시물 정보
    const [ marketInfo, setMarketInfo ] = useState({
        title: "테스트용 제목",
        content: "테스트용 내용",
        writer: "test1234",
        writer_nick: "마이네임이츠",
        wdate: new Date(),
        posting: 5,
        process: "process",
        product: "츄르~",
        state: "free",
        category: "toys",
        price: 10000,
        attaches: [process.env.PUBLIC_URL + "/images/logo_js.png", process.env.PUBLIC_URL + "/images/homeslide1.jpg"],
    });
    const [ cookies ] = useCookies(["id", "nickname"]);
    const contentRef = useRef();

    // 모달
    const [ userModal, setUserModal ] = useState(false);
    const [ reportModal, setReportModal ] = useState(false);

    // 페이지 이동
    const navigator = useNavigate();

    // 지도값, 주소값
    const [ geoLatLng, setGeoLatLng] = useState([33.450701, 126.570667])

    // 카카오맵 API 라이브러리 불러오기
    const [ loading, error ] = useScript(`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`);

    useEffect(()=>{
        callBorderInfo();
    },[])

    const callBorderInfo = async() => {
        // 기존 게시물의 정보가져오기
        await axios.get(GET_MARKET + params?.id, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok){
                const { data } = response;
                // 마켓정보
                setMarketInfo(data);
                // 지도설정
                setGeoLatLng([data.geoLat, data.getoLng]);
                return;
            } 
            if (status === HttpStatusCode.NotFound) {
                alert("해당 게시물이 존재하지 않습니다.");
                navigator(MARKET);
                return;
            }
        }).catch((error)=>{
            alert("네트워크에 연결되지 않았습니다.");
            navigator(MARKET);
        });
        contentRef.current.innerHTML = marketInfo.content;
    };

    const removeBorder = async() => {
        await axios.post(MARKET)
    }

    return(
        <Container>
            {/* header */}
            <PostTitle>
                <Title>
                    <h3>
                        <span>&#91;{marketInfo.state}&#93;</span>
                        <span>{marketInfo.title}</span>
                    </h3>
                </Title>
                <Meta>
                    <div>
                        <span onClick={()=>setUserModal((prev)=>!prev)}>
                            {marketInfo.writer_nick}
                        </span>
                        <span>
                            |
                        </span>
                        <span>
                            {dateFormat(marketInfo.wdate)}
                        </span>
                        
                    </div>
                    {userModal &&
                    <UserModal>
                        <ul>
                            <li>
                                <span>{marketInfo.writer_nick}</span>
                            </li>
                            <li>
                                <Link to={`${USER_INFO}/${marketInfo.writer}`}>작성자 계정보기</Link>
                            </li>
                        </ul>
                    </UserModal>
                    }
                    <ReportBox>
                        <span>
                            포스팅 {marketInfo.posting}
                        </span>
                        <span>
                            |
                        </span>
                        {marketInfo?.writer == cookies?.id ?
                        <>
                        <Link to={MARKET_UPDATE + params?.id} state={{marketInfo, geoLocation: geoLatLng}}>
                            <span className="update__btn">수정하기</span>
                        </Link>
                        <span className="remove__btn">삭제하기</span>
                        </>
                        :
                        <span onClick={()=>setReportModal(prev=>!prev)}>
                            신고하기
                        </span>
                        }
                    </ReportBox>
                     {/* report modal */}
                    {reportModal && <ReportModal setReportModal={setReportModal}/>}
                </Meta>
            </PostTitle>
           
            {/* body */}
            <div>
                <InfoBox>
                    <ImageCarousel images={marketInfo.attaches}/>
                    <InfoText>
                        <ul>
                            <li>
                                <span>거래상태</span>
                                &nbsp;
                                <span>{marketInfo?.process}</span>
                            </li>
                            <li>
                                <span>거래분류</span>
                                &nbsp;
                                <span>{marketInfo?.state}</span>
                            </li>
                            <li>
                                <span>작성자</span>
                                &nbsp;
                                <span>{marketInfo?.writer_nick}</span>
                            </li>
                            <li>
                                <span>제품이름</span>
                                &nbsp;
                                <span>{marketInfo?.product}</span>
                            </li>
                            <li>
                                <span>가격</span>
                                &nbsp;
                                <span>{marketInfo?.price}</span>
                            </li>
                            <li>
                                <span>카테고리</span>
                                &nbsp;
                                <span>{marketInfo?.category}</span>
                            </li>
                        </ul>
                    </InfoText>
                </InfoBox>
                <ContentBox ref={contentRef}>
                
                </ContentBox>
                {/* 카카오지도 */}
                {!loading && <KakaoMap geoLatLng={geoLatLng} setGeoLatLng={setGeoLatLng} />}
                {error && <div>kakao map 을 불러오는데 실패하였습니다.</div>}
            </div>
            <CommentBox>
                {/* 댓글 작성*/}
                {cookies.id !== null &&
                <>
                <h2>댓글 작성</h2>
                <WriteMarketCommentForm params={params} loginUser={cookies.id}/>
                </>
                }
                {/* 작성된 댓글 */}
                <ViewMarketComments loginUser={cookies.id}/>
            </CommentBox>
        </Container>
    )

};

export default ViewMarketBorder;
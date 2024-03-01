import axios, { HttpStatusCode } from "axios";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ADD_PAWTENS_LIKE, CANCEL_PAWTENS_LIKE, GET_PAWTENS_LIKE } from "../../../constants/ApiUrl";
import { dateFormat } from "../../../util/UtilFunction";
import { PAWTENS, UPDATE_PAWTENS } from "../../../constants/UrlPath";
import PawtensWriteCommentForm from "../components/PawtensWriteCommentForm";
import PawtensViewComments from "../components/PawtensViewComments";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const testPawtensData =  {
    pawtens_id: "dd38dje-393jdnw-375smak0-18283aa",
    title: "테스트 포텐스 제목1",
    content: "테스트 포텐스 내용1",
    writer: "test1234",
    nickname: "테스트 닉네임97",
    like: 9,
    view: 999,
    date_created: new Date(),
    date_updated: new Date(),
    original_name: process.env.PUBLIC_URL + "/videos/test_video.mp4",
    stored_name: "메르세데스 시연영상 mp4"
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    padding-top: 100px;
    padding-bottom: 100px;
    overflow: hidden;
`

const Wrapper = styled.div`
    width: 800px;
    box-shadow: 2px 3px 5px 0px;
`

const VideoBox = styled.div`
    position: relative;
    padding-top: 40px;
    background-color: white;
    video {
        min-width: 800px;
        height: 400px;
        cursor: pointer;
    }
`

const ControllerBox = styled.div`
    position: absolute;
    left: 45px;
    bottom: 0;
    width: 89%;
    padding: 20px 10%;
    color: white;
    background-color: rgba(0,0,0,0.5) ;
    z-index: 5;
`

const OptionBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    input {
        width: 100px;
        margin-right: 10px;
    }
    div {
        &:last-child {
            display: flex;
            align-items: center;
        }
        span:hover {
            cursor: pointer;
        }
    }
 
`

const Timeline = styled.div`
    padding: 5px 0px;
    width: 100%;
    input {
        width: 100%;
    }
`


const InfoBox = styled.section`
    background-color: white;
    padding: 40px;
    text-align: left;
    h2 {
        font-size: 1.5em;
        margin-bottom: 20px;
    }
    p {
        color: #555;
        margin-bottom: 20px;
    }
   
`

const LikeViewBox = styled.div`
    display: flex;
    margin: 10px 0px;
`

const IconBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 40px;
    width: 60px;
    border-radius: 15px;
    background-color: #f1f1f1;
    margin-right: 20px;
`

const ContentBox = styled.div`
    width: 100%;
    max-height: 300px;
    overflow-x: hidden;
    background-color: #f1f1f1;
    padding: 30px;
    border-radius: 5px;
`

const WriterOptionBox = styled.div`
    padding: 10px;
    a {
        color: #87ceeb;
        text-decoration: underline;
    }
`


let controlsTimeout = null;
let controlsMovementTimeout = null;
function PawtensVideo() {
    const [ cookies ] = useCookies(["id"]);
    const [ pawtensData, setPawtensData ] = useState({
        pawtens_id: "",
        title: "",
        content: "",
        writer: "",
        nickname: "",
        like: 0,
        date_created: new Date(),
        date_updated: new Date(),
        original_name: "",
        stored_name: ""
    });

    const videoRef = useRef(null);
    const [ timelineBar, setTimelineBar ] = useState({
        totalTime: 0,
        currentTime: 0,
    });
    const [ timeline, setTimeline ] = useState({
        totalTime: "00:00:00",
        currentTime: "00:00:00",
    })
    const [ controller, setController ] = useState(false);
    const [ volumn, setVolumn ] = useState({
        prev: 0.5,
        current: 0.5,
    });
    const [ like, setLike ] = useState(false);
    
    useEffect(()=>{
        getPawtensInfo(); // 
        hasLike();
    },[]);


    /**
     * 포텐스 정보 가져오기
     */
    const getPawtensInfo = async() => {
        // await axios.get(`/pawtens/${pawtens_id}`, {
        //     baseURL: process.env.REACT_APP_SERVER_URL
        // }).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Ok) {
        //         const { data } = response;
        //         setPawtensData((pawtensData) => {
        //             let copyData = {...pawtensData};
        //             copyData["like"] = copyData.like - 1;
        //             return copyData;
        //         });
        //         setLike(false);
        //     } else if (status === HttpStatusCode.NoContent) {
        //         alert("해당 포텐셜 정보가 없습니다.")
        //         navigator("/pawtens");
        //     } else {
        //         alert("해당 포텐셜 정보를 가져오는데 에러가 발생하였습니다.")
        //         navigator("/pawtens");
        //     }
        // }).catch((error)=>{
        //     console.log(error?.status);
        // })
        setPawtensData(testPawtensData);
    }

    /**
     * 비디오 클릭시 재생 및 정지
     */
    const handleClickPlay = () => {
        videoRef.current.paused ? videoRef.current.play(): videoRef.current.pause();
    }

    /**
     * 비디오 올려놓으면 컨트롤바 보여주기
     */
    const handleMouseMove = () => {
        if (controlsTimeout) {
            clearTimeout(controlsTimeout); // 해당 id 를 가지고 있는 timeout function 제거
            controlsTimeout = null;
        }
        if (controlsMovementTimeout) { // 마우스가 움직이고 있으면 id 존재 - 3초동안 움직임이 없을 경우 null 값.
            clearTimeout(controlsMovementTimeout);
            controlsMovementTimeout = null;
        }
        setController(true);
        controlsMovementTimeout = setTimeout(()=>setController(false), 3000);
    }

    /**
     * 비디오 밖으로 마우스가 벗어나면 3초뒤 컨트롤바 사리짐
     */
    const handleMouseLeave = () => {
        controlsTimeout = setTimeout(()=>setController(false), 3000);
    }

    /**
     * 전체화면
     */
    const handleFullScreen = () => {
        const fullScreen = document.fullscreenElement;
        if (fullScreen) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen();
        }
    }

    /**
     * 비디오가 전부 재생하면 조회수 1 증가
     */
    const handleVideoEnded = async() => {
        console.log("조회수 증가");
        // await axios.post("view", null, {
        //     baseURL: process.env.REACT_APP_SERVER_URL,
        // }).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Created) {
        //         console.log("조회수 등록 성공");
        //     } else {
        //         console.log("조회수 등록 실패");
        //     }
        // });
    }

    /**
     * 비디오의 메타데이터가 전부 로드되면 발생 
     */
    const handleLoaderMetadata = (event) => {
        const { duration } = event.target;
        const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11,19);
        setTimeline((timeline)=>{
            let copy = {...timeline};
            copy.totalTime = formatTime(Math.floor(duration));
            return copy;
        });
        setTimelineBar((timeline)=>{
            let copy = {...timeline};
            copy.totalTime = Math.floor(duration);
            return copy;
        });
    }

    /**
     * 비디오가 재생되는 동안 발생하는 이벤트 
     */
    const handleTimeUpdate = (event) => {
        const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11,19);
        const { currentTime } = event.target;
        setTimeline((timeline)=>{
            let copy = {...timeline};
            copy.currentTime = formatTime(Math.floor(currentTime));
            return copy;
        })
        setTimelineBar((timeline)=>{ 
            let copy = {...timeline};
            copy.currentTime = Math.floor(currentTime);
            return copy;
        });
    }

    /**
     * 사운드 뮤트 
     * - 뮤트 풀면 이전의 사운드로 돌아가야함.
     */
    const muteSound = () => {   
        setVolumn((volume)=>{
            let copy = {...volume};
            copy.prev = volume.current; // 현재 음량을 이전음량으로 저장
            copy.current = 0; // 현재 음량을 0으로 저장
            return copy;
        });
    }

    /**
     * 사운드 켜기
     */
    const openSound = () => {
        setVolumn((volumn)=>{
            let copy = {...volumn};
            copy.current = volumn.prev;
            return copy;
        });
    }

    /**
     * 사운드 조절 
     */
    const changeSound = (event) => {
        const vol = event.target.value;
        setVolumn((volumn)=>{
            let copy = {...volumn};
            copy.prev = vol;
            copy.current = vol;
            return copy;
        })
    }

    /**
     * 타임라인 변경 
     */
    const handleTimelineChange = (event) => {
        const { value } = event.target;
        videoRef.current.currentTime = value;
    }

    /**
     * 해당 유저의 좋아요 여부
     */
    const hasLike = async() => {
        // await axios.get(GET_PAWTENS_LIKE, {
        //     params: {
        //         pawtens_id,
        //         user_id
        //     }
        // }).then((response)=>{
        //     const { status, data } = response; 
            
        //     if (status === HttpStatusCode.Ok) {
        //         // data : true or false
        //         setLike(data);
        //     } else {
        //         alert("해당 포텐셜의 관심 정보 이력을 가져오지 못했습니다.");
        //     }
        // }).catch((error)=>{
        //     console.log(error);
        // })
        setLike(true);
    }

    /**
     * 좋아요 추가
     */
    const addLike = async() => {
        if (like) {
            alert("이미 관심 이력이 있습니다.")
            return;
        }
        // await axios.post(ADD_PAWTENS_LIKE, null, {
        //     baseURL: process.env.REACT_APP_SERVER_URL
        // }).then((response)=> {
        //     const { status } = response;
        //     if (status === HttpStatusCode.Created) {
        //         setPawtensData((pawtensData) => {
        //             let copyData = {...pawtensData};
        //             copyData["like"] = copyData.like + 1;
        //             return copyData;
        //         });
        //         setLike(true);
        //         alert("관심 등록에 성공하였습니다.")
        //     } else {
        //         alert("관심 등록에 실패하였습니다.")
        //     };
        // });
        setPawtensData((pawtensData) => {
            let copyData = {...pawtensData};
            copyData["like"] = copyData.like + 1;
            return copyData;
        });
        setLike(true);
    }

    /**
     * 좋아요 취소
     */
    const cancelLike = async() => {
        // 관심 이력이 없다면 실행할수없음; (클라이언트)
        if (!like) {
            alert("취소할 관심 이력이 없습니다.");
            return;
        }

        // await axios.post(CANCEL_PAWTENS_LIKE, null, {
        //     baseURL: process.env.REACT_APP_SERVER_URL
        // }).then((response)=> {
        //     const { status } = response;
        //     if (status === HttpStatusCode.NoContent) {
                
        //     setPawtensData((pawtensData) => {
        //         let copyData = {...pawtensData};
        //         copyData["like"] = copyData.like + 1;
        //         return copyData;
        //     });
        //     setLike(false);
        //         alert("관심 취소에 성공하였습니다.")
        //     } else {
        //         alert("관심 취소에 실패하였습니다.")
        //     };
        // }); 
        setPawtensData((pawtensData) => {
            let copyData = {...pawtensData};
            copyData["like"] = copyData.like - 1;
            return copyData;
        });
        setLike(false);
    };

    return(
        <Container>
            <Wrapper>
                <VideoBox>
                    <video ref={videoRef} src={pawtensData.original_name} 
                        preload="metadata"
                        onClick={handleClickPlay} 
                        onEnded={handleVideoEnded}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onLoadedMetadata={handleLoaderMetadata}
                        onTimeUpdate={handleTimeUpdate}
                    />
                    {controller &&
                    <ControllerBox>
                        <div>
                            <OptionBar>
                                <div>
                                    <span id="currentTime">{timeline.currentTime}</span>
                                    <span>/</span>
                                    <span id="totalTime">{timeline.totalTime}</span>
                                </div>
                                <div>
                                    {volumn.current > 0 ?
                                    <span onClick={muteSound}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-volume-up" viewBox="0 0 16 16">
                                            <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
                                            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
                                            <path d="M10.025 8a4.5 4.5 0 0 1-1.318 3.182L8 10.475A3.5 3.5 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.5 4.5 0 0 1 10.025 8M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11"/>
                                        </svg>
                                    </span>
                                    :
                                    <span onClick={openSound}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-volume-mute" viewBox="0 0 16 16">
                                        <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06M6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
                                        </svg>
                                    </span>
                                    }
                                    
                                    <input id="volume" type="range" min="0" max="1" step="0.1" value={volumn.current} onChange={changeSound} />
                                    <span id="fullScreen" onClick={handleFullScreen} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-angle-expand" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707"/>
                                        </svg>
                                    </span>
                                </div>
                            </OptionBar>
                        </div>
                        <Timeline>
                            <input type="range" 
                              min="0" 
                              max={timelineBar.totalTime}
                              value={timelineBar.currentTime}  
                              onChange={handleTimelineChange}
                            />
                        </Timeline>
                    </ControllerBox>
                    }
                </VideoBox>
                <InfoBox>
                    <h2>{pawtensData.title}</h2>
                    <p>작성자: {pawtensData.nickname}</p>
                    <p>작성일자: {pawtensData.date_created.toLocaleString("ko-kr")}</p>
                    <div>
                        <LikeViewBox>
                            {!like ?
                            <IconBox onClick={addLike}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                                </svg>
                                <span>{pawtensData.like}</span>
                            </IconBox>
                            :
                            <IconBox onClick={cancelLike}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                </svg>
                                <span>{pawtensData.like}</span>
                            </IconBox>           
                            }
                            <IconBox>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                </svg>
                                <span>{pawtensData.view}</span>
                            </IconBox>
                        </LikeViewBox>
                    </div>
                   
                    <ContentBox>
                        {pawtensData.content}
                    </ContentBox>
                    <WriterOptionBox>
                        <Link to={UPDATE_PAWTENS} state={pawtensData}>수정하기</Link>
                    </WriterOptionBox>
                </InfoBox>
                {/* 댓글작성 컴포넌트 */}
                {cookies?.id && 
                    <PawtensWriteCommentForm loginUser={cookies.id}/>                
                }

                {/* 댓글리스트 컴포넌트 */}
                <PawtensViewComments loginUser={cookies?.id}/>
            </Wrapper>
        </Container>
    )
};

export default PawtensVideo;
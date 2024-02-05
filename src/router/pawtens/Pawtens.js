import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { GET_PAWTENS_LIST } from "../../constants/ApiUrl";
import axios, { HttpStatusCode } from "axios";
import { Carousel, Container, Spinner } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import PawtensVideo from "./detail/PawtensVideo";
import { PAWTENS } from "../../constants/UrlPath";

const testPawtensData = [
    {
        pawtens_id: "dd38dje-393jdnw-375smak0-18283aa",
        title: "테스트 포텐스 제목1",
        content: "테스트 포텐스 내용1",
        writer: "test9987",
        nickname: "테스트 닉네임97",
        like: 9,
        date_created: new Date(),
        date_updated: new Date(),
        original_name: process.env.PUBLIC_URL + "/videos/test_video.mp4",
        stored_name: "메르세데스 시연영상 mp4"
    },
    {
        pawtens_id: "2983dje-393jdnw-375smak0-18283aa",
        title: "테스트 포텐스 제목2",
        content: "테스트 포텐스 내용3",
        writer: "test3397",
        nickname: "테스트 닉네임32",
        like: 9,
        date_created: new Date(),
        date_updated: new Date(),
        original_name: process.env.PUBLIC_URL + "/videos/test_video.mp4",
        stored_name: "메르세데스 시연영상 mp4"
    }
];

const PawtensListBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 200px;
    gap: 50px;
    min-height: 800px;
    min-width: 1200px;
    z-index: 1;
`

const VideoCard = styled(motion.div)`
    position: relative;

    section: {
        position: absolute;
        bottom: 0px;
        max-height: 20%;
    };
    &:hover{
        cursor: pointer;
    };
`

function Pawtens() {
    const [ cookies ] = useCookies(["id", "nickname"]);
    const { params } = useMatch(PAWTENS + "/:id");
    const [ pawtensList, setPawtensList ] = useState([
        {
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
        }
    ]);

    const [ loading, setLoading ] = useState(true); // 데이터 로딩
    const navigator = useNavigate(); // 페이지 이동

    useEffect(()=>{
        getPawtensList();
    },[]);

    const getPawtensList = async() => {
        // await axios.get(GET_PAWTENS_LIST, {
        //     baseURL: process.env.REACT_APP_SERVER_URL,
        // }).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Ok) {
        //         const { data: pawtensItem } = response;
        //         setPawtensList(pawtensItem);
        //         setLoading(false);
        //     } else {
        //         alert("서버에서 포텐스 정보를 가져오지 못했습니다.");
        //     };
        // }).catch((error)=>{
        //     alert("인터넷에 연결되지 않았습니다.");
        // });
        setPawtensList(testPawtensData);
        setLoading(false);
    };

    const clickPawtens = params?.id && pawtensList.find((pawtens)=>pawtens.pawtens_id === params?.id);

    console.log("params:" + params);
    console.log("click pawtens:" + clickPawtens);
    return(
        <Container>
            {loading ? // 데이터 불러오기전 로딩
            <div>
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />
            </div>
            :
            <AnimatePresence>
                <PawtensListBox>
                {pawtensList.map((pawtens)=>(
                    <VideoCard 
                        layoutId={pawtens.pawtens_id}
                        key={pawtens.pawtens_id} 
                        onClick={()=>navigator(`/pawtens/${pawtens.pawtens_id}`)}>
                        <video src={pawtens.original_name} />
                        <section>
                            <h5>{pawtens.title}</h5>
                        </section>
                    </VideoCard>
                    
                ))}
                </PawtensListBox>
            </AnimatePresence>
            }
            <AnimatePresence>
                {params?.id && clickPawtens &&
                <PawtensVideo pawtens_id={params?.id}/>}                
            </AnimatePresence>
        </Container>
    );
};

export default Pawtens;
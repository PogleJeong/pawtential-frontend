import axios, { HttpStatusCode } from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ADD_PAWTENS_LIKE, CANCEL_PAWTENS_LIKE, GET_PAWTENS_LIKE } from "../../../constants/ApiUrl";

const testPawtensData =  {
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
}

const LayoutBox = styled(motion.div)`
    position: fixed;
    overflow: scroll;
    top: 10%;
    left: 30%;
    width: 80vw;
    height: 80vh;
    border-radius: 10px;
    z-index: 3;
`

const DetailInfo = styled.section`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 3fr;
`

function PawtensVideo({pawtens_id, user_id}) {
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
    
    const [ like, setLike ] = useState(false);
    
    useEffect(()=>{
        getPawtensInfo();
        hasLike();
    },[]);

    useEffect(()=>{
        console.log(pawtensData);
    },[pawtensData])

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

    return(
        <LayoutBox layoutId={pawtens_id}>
            <video src={pawtensData.original_name}/>
            <DetailInfo>
                <h5>{pawtensData.title}</h5>
                <span>작성자: {pawtensData.nickname}</span>
                <div style={{justifyContent: "space-around"}}>
                    <span>작성일자</span>
                    <span>like {pawtensData.like}</span>
                    <div>
                        {!like ?
                        <span onClick={addLike}>관심 등록</span>
                        :
                        <span onClick={cancelLike}>관심 취소</span>                
                        }
                    </div>
                </div>
                <div>{pawtensData.content}</div>
            </DetailInfo>
        </LayoutBox>
    )
};

export default PawtensVideo;
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useMatch, useNavigate, useParams } from "react-router-dom";
import { GET_PAWTENS_LIST } from "../../constants/ApiUrl";
import axios, { HttpStatusCode } from "axios";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";
import { LOGIN, PAWTENS, WRITE_PAWTENS } from "../../constants/UrlPath";
import { testPawtensData } from "../../test-data/pawtens-data";

const Container = styled.div`
    max-width: 1500px;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

const PawtensHeader = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    h2 {
        font-size: 1.5rem;
        font-weight: bold;
    }
    div {
        display: flex;
        justify-content: center;
        margin: 10px 0px;
        width: 100%;
        div {
            &:first-child {
                justify-content: start;
                span {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 5px;
                    background-color: #0000000d;
                    margin: 5px;
                    cursor: pointer;
                    &:hover {
                        background-color: #0000001a;
                    }
                }
            }
            &:last-child {
                justify-content: end;
                
                span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: auto;
                    width: 150px;
                    height: 40px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    border-radius: 5px;
                    color: white;
                    background-color: #87ceeb;
                    cursor: pointer;
                    transition: background-color 1s, color 1s;
                    &:hover {
                        background-color: aquamarine;
                        color: black;
                    }
                }  
            }
        }
    }
`

const LoadingBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

`

const PawtensListBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 350px;
    gap: 20px;
    min-height: 800px;
    min-width: 1200px;
    z-index: 1;
`

const VideoCard = styled.div`
    position: relative;
    padding: 10px;
    transition: scale 1s;
    
    &:hover{
        cursor: pointer;
        z-index: 3;
        background-color: #ebe5ddf2;
        transform-origin: center;
    }

    img {
        border-radius: 5px;
        width: 100%;
        height: 70%;
    }

    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 30%;
        max-height: 30%;
        
        padding: 10px;
        h2 {
            font-weight: bold;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 3px;
            font-size: 0.9rem;
            color: gray;
            &:last-child {
                display: flex;
                justify-content: space-between;
            }
        }   
    }
`

const acitveBtnStyle = {
    backgroundColor: "black",
    color: "white",
}

function Pawtens() {
    const [ cookies ] = useCookies(["id"]);
    const [ pawtensList, setPawtensList ] = useState([
        {
            pawtens_id: "",
            title: "",
            content: "",
            writer: "",
            nickname: "",
            like: 0,
            view: 0,
            date_created: new Date(),
            date_updated: new Date(),
            thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        }
    ]);
    const [ category, setCategory ] = useState("all");

    const [ loading, setLoading ] = useState(true); // 데이터 로딩
    const navigator = useNavigate(); // 페이지 이동

    useEffect(()=>{
        if (!cookies?.id) {
            alert("로그인이 필요합니다.");
            navigator(LOGIN);
            return;
        }
        // 카테고리가 변경되면 다시 데이터 불러오기
        getPawtensList();
    },[category]);

    const getPawtensList = async() => {
        await axios.get(GET_PAWTENS_LIST, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data: pawtensItem } = response;
                setPawtensList(pawtensItem);
                setLoading(false);
            } else {
                alert("서버에서 포텐스 정보를 가져오지 못했습니다.");
            };
        }).catch((error)=>{
            alert("인터넷에 연결되지 않았습니다.");
        });
        setPawtensList(testPawtensData);
        setLoading(false);
    };

    return(
        <Container>
            <PawtensHeader>
                <h2>포텐스</h2>
                <div>
                    <div>
                        <span style={category==="all" ? acitveBtnStyle : null} onClick={()=>setCategory("all")}>전체</span>
                        <span style={category==="popular" ? acitveBtnStyle : null} onClick={()=>setCategory("popular")}>인기</span>
                        <span style={category==="follow" ? acitveBtnStyle : null} onClick={()=>setCategory("follow")}>팔로우</span>
                    </div>
                    <div>
                        {cookies?.id && 
                        <Link to={WRITE_PAWTENS}>
                            <span>포텐스 작성하기</span>
                        </Link>}
                    </div>
                </div>
            </PawtensHeader>
            {loading ? // 데이터 불러오기전 로딩
            <LoadingBox>
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />
            </LoadingBox>
            :
            <PawtensListBox>
            {pawtensList.map((pawtens)=>(
                <VideoCard 
                    key={pawtens.pawtens_id} 
                    onClick={()=>navigator(`${pawtens.pawtens_id}`)}>
                    <img src={pawtens.thumbnail} />
                    <div>
                        <h2>{pawtens.title}</h2>
                        <p>{pawtens.nickname}</p>
                        <p>
                            <span>관심수 {pawtens.like}</span> 
                            <span>조회수 {pawtens.view}</span> 
                        </p>
                    </div>
                </VideoCard>
            ))}
            </PawtensListBox>
            }
        </Container>
    );
};

export default Pawtens;
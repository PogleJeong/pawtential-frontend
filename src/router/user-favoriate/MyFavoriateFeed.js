import axios, { HttpStatusCode } from "axios";
import { Alert, Button, Card, Container } from "react-bootstrap";
import { MY_FAVORIATE_FEED } from "../../constants/UrlPath";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";

const testData = [
    {
        id: "3",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심피드1",
        writer: "test1234",
    },
    {
        id: "5",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심피드2",
        writer: "test1235",
    },
    {
        id: "20",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심피드3",
        writer: "test9384",
    },
    {
        id: "99",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심피드4",
        writer: "test3273",
    },
    {
        id: "120",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심피드5",
        writer: "test0987",
    },
]

const FeedList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 200px;
    gap: 20px;
`

function MyFavoriateFeed({user_id}) {

    const [ feedList, setFeedList ] = useState([
        {
            id: "",
            thumbnail: "",
            title: "",
            writer: ""
        }
    ]);
    const navigator = useNavigate();

    useEffect(()=>{
        getMyFavoriateFeed();
    });

    const getMyFavoriateFeed = async() => {
        // await axios.get(MY_FAVORIATE_FEED, {
        //     params: {
        //         user_id: user_id
        //     }
        // }).then((response)=>{
        //     const { status, data } = response;
        //     if (status === HttpStatusCode.Ok) {
        //         setFeedList(data);
        //     } else {
        //         alert("데이터를 불러오는데 실패하였습니다.");
        //     }
        // }).catch((response)=> {
        //     alert("데이터를 불러오는데 실패하였습니다.");
        // })
        setFeedList(testData);
    }
    return(
        <Container>
            <Alert variant={"warning"}>
                내가 관심있어한 피드 리스트
            </Alert>
            <FeedList>
            {feedList && feedList.map((feed)=>(
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={feed?.thumbnail} />
                    <Card.Body>
                    <Card.Title>{feed?.title}</Card.Title>
                    <Card.Text>
                        {feed?.writer}
                    </Card.Text>
                    <Button variant="primary" onClick={()=>navigator()}>시청하기</Button>
                    </Card.Body>
                </Card>
            ))}
            </FeedList>
        </Container>
    );
};

export default MyFavoriateFeed;
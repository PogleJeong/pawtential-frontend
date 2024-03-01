import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const testData = [
    {
        id: "3",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심포텐스1",
        writer: "test1234",
    },
    {
        id: "5",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심포텐스2",
        writer: "test1235",
    },
    {
        id: "20",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심포텐스3",
        writer: "test9384",
    },
    {
        id: "99",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심포텐스4",
        writer: "test3273",
    },
    {
        id: "120",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
        title: "관심포텐스5",
        writer: "test0987",
    },
]

const FeedList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 200px;
    gap: 20px;
`
function MyFavoriatePawtens({user_id}) {

    const [ pawtensList, setPawtensList ] = useState([
        {
            id: "",
            thumbnail: "",
            title: "",
            writer: ""
        }
    ]);

    const navigator = useNavigate();

    useEffect(()=>{
        getMyFavoriatePawtens();
    });

    const getMyFavoriatePawtens = async() => {
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
        setPawtensList(testData);
    }
    return(
        <Container>
        <Alert variant={"warning"}>
            내가 관심있어한 피드 리스트
        </Alert>
        <FeedList>
        {pawtensList && pawtensList.map((pawtens)=>(
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={pawtens?.thumbnail} />
                <Card.Body>
                <Card.Title>{pawtens?.title}</Card.Title>
                <Card.Text>
                    {pawtens?.writer}
                </Card.Text>
                <Button variant="primary" onClick={()=>navigator()}>시청하기</Button>
                </Card.Body>
            </Card>
        ))}
        </FeedList>
    </Container>
    )
}
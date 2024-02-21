import { Link } from "react-router-dom";
import styled from "styled-components";

const testChatList = [
    {
        id: "1234",
        opponent: "상대방1",
        profile: process.env.PUBLIC_URL + "/images/logo_js.png",
    },
    {
        id: "1235",
        opponent: "상대방2",
        profile: process.env.PUBLIC_URL + "/images/logo_js.png",
    },
    {
        id: "1236",
        opponent: "상대방3",
        profile: process.env.PUBLIC_URL + "/images/logo_js.png",
    },
    {
        id: "1237",
        opponent: "상대방4",
        profile: process.env.PUBLIC_URL + "/images/logo_js.png",
    },
    {
        id: "1238",
        opponent: "상대방5",
        profile: process.env.PUBLIC_URL + "/images/logo_js.png",
    },
]

const Container = styled.div`
    padding: 10px;
    border-right: 3px solid rgba(0,0,0,0.3);

    ul {
        li {
            display: flex;
            width: 100%;
            padding: 15px;
            border-bottom: 1px solid #ddd;
            &:hover {
                background-color: aliceblue;
            }
            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 15px;
            }
            div {
                h2 {
                    font-size: 18px;
                    margin: 0;
                    color: #007BFF;
                }
                p {
                    margin: 5px 0;
                    color: #555;
                }
            }
        }
    }
`


function ChatList() {

    return(
        <Container>
            <ul>
            {testChatList.map((chatInfo)=>(
                <Link to={`/chat/${chatInfo.id}`}>
                    <li>                    
                        <img src={chatInfo.profile}/>
                        <div>
                            <h2>{chatInfo.opponent}</h2>
                        </div>
                    </li>
                </Link>
            ))}
        </ul>
        </Container>
    );
};

export default ChatList;
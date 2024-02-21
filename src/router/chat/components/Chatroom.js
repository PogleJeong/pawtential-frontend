import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_CHAT_HISTORY } from "../../../constants/ApiUrl";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { dateFormat } from "../../../util/UtilFunction";
import SockJS from "sockjs-client";
import webstomp from "webstomp-client";
import { HOME } from "../../../constants/UrlPath";

const Container = styled.div`
    width: 90%;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`

const ChatHeader = styled.div`
    background-color: #007BFF;
    color: #fff;
    padding: 15px;
    text-align: center;
`

const ChatMessages = styled.div`
    height: 85%;
    padding: 15px;
`

const SendMessage = styled.div`
    display: flex;
    justify-content: right;
    div {
        p {
            background-color:  #4169e1;
            color: #fff;
            align-self: flex-end;
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
            padding: 20px;
        }
    }
    margin-bottom: 15px;
`

const ReceivedMessage = styled.div`
    display: flex;
    justify-content: left;
    div {
        p {
            background-color:  #ffdab9;
            align-self: flex-start;
            min-height: 60px;
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
            padding: 20px;
        }
    }
  
    margin-bottom: 15px;
`

const TimeStamp = styled.span`
    display: block;
    color: #888;
    font-size: 12px;
    margin-top: 5px;
`

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100px;
    padding: 15px;
    border-top: 1px solid #ddd;
    input {
        max-width: 400px;
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #f5f5f5;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease;
        &:hover {
            background-color: #e0e0e0;
        }
        &:focus {
            outline: none;
            background-color: #d3d3d3;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
    }
    button {
        background-color: #007BFF;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        height: 45px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        &:hover {
            background-color: #0056b3;
        }
    }
`
let stomp = null;
function ChatRoom() {
    const { id } = useParams("id"); // 채팅방 id
    const [ cookies ] = useCookies(["id", "nickname"]);
    const [ chatMessage, setChatMessage ] = useState("");
    const navigator = useNavigate();
    const [ chatHistory, setChatHistory ] = useState([
        {
            writer: "상대방1",
            content: "안녕하세요~",
            wdate: new Date(),
        },
        {
            writer: "test1234",
            content: "안녕하세요~",
            wdate: new Date(),
        },
        {
            writer: "상대방",
            content: "혹시 팔렸을까요!",
            wdate: new Date(),
        },
        {
            writer: "test1234",
            content: "아뇨 아직 안팔렸습니다!",
            wdate: new Date(),
        },
    ])

    useEffect(()=>{
        console.log(11);
        // getChatHistroy();
        connectWebsocket();
    },[id])

    /**
     * 채팅내역 불러오기
     */
    const getChatHistroy = async() => {
        await axios.get(GET_CHAT_HISTORY, {
            params: {
                id
            },
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status, data } = response;
            if (status === HttpStatusCode.Ok) {
                setChatHistory(data);
            } else if (status === HttpStatusCode.NotAcceptable){
                alert("해당 채팅방에 접근할 수 있는 권한이 없습니다.");
                navigator(HOME);
            }
            else {
                alert("채팅내역을 가져오지 못했습니다.");
            }
        }).catch((error)=>{
            alert("채팅내역을 가져오지 못했습니다.");
        })
    }

    const connectWebsocket = () => {
        const websocket = new SockJS(process.env.REACT_APP_SERVER_URL + "/chat/"+ id);
        stomp = webstomp.over(websocket);
        stomp.connect({}, function(){
            // subscribe(path, callback) 으로 웹소켓으로부터 메세지 받음.
            stomp.subscribe("/sub/chat/room/" + id, function(chat){
                const chatInfo = JSON.parse(chat.body);

                console.log("받은내용 >> " ,chatInfo)
                // 두 내용을 합칠때는 concat + 느낀점 js 공부많이 해야겠는데??;;
                setChatHistory(chatHistory => chatHistory.concat(chatInfo));
            });
        })
    }

    const sendChat = () => {
        if (chatMessage === "") {
            return;
        }
        stomp.send("/pub/chat/send",JSON.stringify({
            writer: cookies?.id,

        }));
    }
    
    return (
        <Container>
            {id ?
            <>
            <ChatHeader>
                <h2>상대방 아이디</h2>
            </ChatHeader>
            <ChatMessages>
            {chatHistory.map((chat)=>{
                if (chat.writer === cookies.id) {
                    return (
                    <SendMessage>
                        <div>
                            <p>{chat.content}</p>
                            <TimeStamp>{dateFormat(chat.wdate)}</TimeStamp>
                        </div>
                    </SendMessage>
                    )
                }else{
                    return(
                    <ReceivedMessage>
                        <div>
                            <p>{chat.content}</p>
                            <TimeStamp>{dateFormat(chat.wdate)}</TimeStamp>
                        </div>
                    </ReceivedMessage>
                    )
                }
            })}
            </ChatMessages>
            <InputContainer>
                <input onChange={value=>setChatMessage(value)} value={chatMessage} placeholder="enter your message"/>
                <button onClick={sendChat} disabled={chatMessage === ""}>전송</button>
            </InputContainer>
            </>
            :
            <div>
                
            </div>
            }
            
        </Container>
    );
};

export default ChatRoom;
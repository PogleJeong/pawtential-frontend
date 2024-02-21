import styled from "styled-components"
import ChatList from "./components/ChatList";
import ChatRoom from "./components/Chatroom";

const Wrapper = styled.div`
    display: grid;
    width: 1000px;
    height: 800px;
    grid-template-columns: 3fr 7fr;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    margin-top: 30px;
`

function ChatMain() {
    return(
        <Wrapper>
            <ChatList />
            <ChatRoom />
        </Wrapper>
    );
};

export default ChatMain;
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    padding: 20px;
    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        textarea {
            display: block;
            width: 100%;
            min-height: 30px;
            max-height: 300px;
            margin-bottom: 10px;
            
            border: none;
            border-bottom: 1px solid black;
            padding: 10px;          
        }

        button {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
                background-color: #0056b3;
            }
        }
    }
`

function PawtensWriteCommentForm({loginUser}) {
    const [ commentWriteForm, setCommentWriteForm ] = useState("");
    
    const writeComment = async(event) => {
        // form 제출 후 기능막기(새로고침 막기)
        event.preventDefault(); 

        // 댓글작성 확인
        const isWrite = window.confirm("댓글을 작성하시겠습니까?");
        if (!isWrite) return;

        // 클라이언트 validation
        if(commentWriteForm === "") {
            alert("댓글 내용을 작성해주세요");
            return;
        }
        if(!loginUser) {
            alert("댓글을 작성하기 위해서는 로그인이 필요합니다.");
            return;
        }

        const writeCommentForm = {
            writer: loginUser,
            content: commentWriteForm,
        }
        console.log(writeCommentForm);
        // await axios.post(ADD_PAWTENS_COMMENT, writeCommentForm, {
        //     baseURL: process.env.REACT_APP_SERVER_URL,
        // }).then((response)=>{
        //     const { status } = response;
        //     if (status === HttpStatusCode.Created) {
        //         alert("댓글 작성에 성공하였습니다.");
        //     }else {
        //         alert("댓글 작성에 실패하였습니다.")
        //     }
        // });
    };

    return(
        <Container>
             <form>
                <textarea type="text" maxLength="500" placeholder="댓글을 작성해주세요" value={commentWriteForm} onChange={(event)=>setCommentWriteForm(event.target.value)}/>
                <button onClick={writeComment} disabled={commentWriteForm.length === 0}>댓글작성</button>
            </form>
        </Container>
    );
};

export default PawtensWriteCommentForm;
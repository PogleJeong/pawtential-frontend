import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_PAWTENS_COMMENT, REMOVE_PAWTENS_COMMENT, UPDATE_PAWTENS_COMMENT } from "../../../constants/ApiUrl";

const testCommentsData = [
    {
        pawtensCommentId: "test1234", // backend 에서 추가 필요;
        parentCommentId: "1",
        depth: 1,
        writer: "test1234",
        nickname: "나",
        comment: "작성된 댓글1",
        wdate: new Date(),
        modified: true,
    },
    {
        pawtensCommentId: "abc1a", // backend 에서 추가 필요;
        parentCommentId: "2",
        depth: 1,
        writer: "abcd1",
        nickname: "반고닉2",
        comment: "작성된 댓글2",
        wdate: new Date(),
        modified: true,
    },
    {
        pawtensCommentId: "abc13", // backend 에서 추가 필요;
        parentCommentId: "3",
        depth: 1,
        writer: "abcd1",
        nickname: "반고닉3",
        comment: "작성된 댓글3",
        wdate: new Date(),
        modified: true,
    },
]

const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    margin-top: 20px;
    .video__comment {
        padding: 10px 20px;
        max-height: 320px;
        border-radius: 3px;
        border-top: 1px solid gray;
        background-color: white;
        color: black;
        margin-bottom: 10px;
        .video__comment-header {
            padding: 5px;
            height: 30px;
            i {
                margin-right: 10px;
            }
            span {
                font-size: 1em;
                font-weight: bold;
                margin-right: 10px;
            }
            .removeCommentBtn, .updateCommentBtn{
                font-size: 0.8em;
                font-weight: lighter;
                text-decoration: underline;
                cursor: pointer;
            }
        }
        
        .video__comment-body {
            padding: 5px;
            .textarea__update {
                padding: 10px;
                min-width: 97%;
                max-width: 97%;
                min-height: 100px;
                max-height: 200px;
            }
            .button__box {
                display: flex;
                justify-content: center;
                align-items: center;
                padding-top: 10px;
                #updateBtn {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    text-decoration: none;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    background-color: yellowgreen;
                    transition: background-color 1s ease, color 1s ease;
                    &:hover {
                        color: white;
                        background-color: #2980b9; /* 호버 시 버튼 배경색 변경 */
                    }
                }
                #cancelBtn {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                    text-decoration: none;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease, color 0.3s ease;
                    color: #333333; /* 텍스트 색상 */
                    background-color: gray; /* 흰색 버튼 배경색 */
                
                    &:hover {
                        background-color: #333333; /* 호버 시 버튼 배경색 변경 */
                        color: #ffffff; /* 호버 시 텍스트 색상 변경 */
                    }
                }
            }
        }
    }
`

function PawtensViewComments({loginUser}) {
    
    const [ comments, setComments ] = useState(testCommentsData);
    const [ commentUpdateContent, setCommentUpdateContent ] = useState("");
    const [ updateMyComment, setUpdateMyComment ] = useState({
        switching: false, // 수정버튼을 눌렀는가
        commentId: "", // 수정할 댓글의 id
    });

    useEffect(()=>{
        getComments();
    },[]);
    
    /**
     * 댓글수정 폼 스위칭하기 
     */
    const switchingForUpdateComment = (event) => {
     
        const { id: commentId } = event.target.parentNode.parentNode.dataset;
        
        setUpdateMyComment((value)=>{
            let copy = {...value};
            copy.switching = value.switching ? false : true;
            copy.commentId = commentId;
            return copy;
        });
    }

    /**
     * 댓글 업데이트 후 원래 상태로 변경
     */
    const switchingAfterUpdateComment = (commentId) => {     
        setUpdateMyComment((value)=>{
            let copy = {...value};
            copy.switching = value.switching ? false : true;
            copy.commentId = commentId;
            return copy;
        });
    }

    /**
     * 해당 포텐셜에 작성된 댓글 가져오기
     */
    const getComments = async() => {
        await axios.get(GET_PAWTENS_COMMENT, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response; 
                setComments(data);
            }
        }).catch((error)=> {
            console.log(error);
        })
    };

    /**
     * 해당 댓글 삭제
     * - 자신이 작성한 댓글.
     */
    const removeComment = async(event) => {
        const isRemove = window.confirm("해당 댓글을 삭제하시겠습니까?");
        if (!isRemove) return;
        const { id: commentId } = event.target.parentNode.parentNode.dataset;

        await axios.post(REMOVE_PAWTENS_COMMENT, commentId, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.NoContent) {
                // 댓글삭제
                setComments((comments)=>{
                    return comments.filter((comment)=> comment.pawtensCommentId !== commentId); 
                })
                alert("댓글 삭제에 성공하였습니다.");
            }else {
                alert("댓글 삭제에 실패하였습니다.")
            }            
        }).catch((error)=>{
            console.log(error);
        }).finally(()=>{
            setComments((comments)=>{
                return comments.filter((comment)=> comment.pawtensCommentId !== commentId); 
            })
        })
    }

    /**
     * 해당 댓글 수정
     * - 자신이 작성한 댓글.
     */
    const updateComment = async(event) => {
        const isUpdate = window.confirm("해당 댓글을 수정하시겠습니까?");
        if (!isUpdate) return;
        const { id: commentId } = event.target.parentNode.parentNode.parentNode.parentNode.dataset;
        
        const updateCommentForm = {
            commentId,
            writer: loginUser,
            content: commentUpdateContent,
        }

        await axios.post(UPDATE_PAWTENS_COMMENT, updateCommentForm, {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                setComments((comments)=>{
                    const updateComment = comments.find(comment => comment.pawtensCommentId === commentId);
                    updateComment.comment = commentUpdateContent;
                    return comments;
                })
                alert("댓글 수정에 성공하였습니다.");
                switchingAfterUpdateComment(commentId);
            }else {
                alert("댓글 수정에 실패하였습니다.")
            }
        }).catch((error)=>{
            console.log(error);
        }).finally(()=>{
            setComments((comments)=>{
                const updateComment = comments.find(comment => comment.pawtensCommentId === commentId);
                updateComment.comment = commentUpdateContent;
                return comments;
            })
            switchingAfterUpdateComment(commentId);
        })
    }

    return(
        <Container>
            <ul>
            {comments.map((comment)=>(
                <li className="video__comment"
                    key={comment.pawtensCommentId} 
                    data-id={comment.pawtensCommentId}
                >
                    {/* 일반댓글보기 vs 내 댓글 수정 */}
                    <div className="video__comment-header">
                        <span>{comment.nickname}</span>
                        {loginUser === comment.writer && !updateMyComment.switching &&
                        <>
                        <span className="removeCommentBtn" onClick={removeComment}>댓글삭제</span>
                        <span className="updateCommentBtn" onClick={switchingForUpdateComment}>댓글수정</span>
                        </>}
                    </div>
                    <div className="video__comment-body">
                        {updateMyComment.switching && updateMyComment.commentId === comment.pawtensCommentId ? 
                        <div>
                            <textarea className="textarea__update" value={commentUpdateContent}onChange={(event)=>setCommentUpdateContent(event.target.value)}>
                                {comment.comment}
                            </textarea>
                            <div className="button__box">
                                <button id="updateBtn" onClick={updateComment}>수정</button>
                                <button id="cancelBtn" onClick={switchingForUpdateComment}>취소</button>
                            </div>
                        </div>
                        :
                        <span>{comment?.comment}</span>
                        }
                    </div>
                </li>
            ))}
            </ul>
        </Container>
    );
};

export default PawtensViewComments;
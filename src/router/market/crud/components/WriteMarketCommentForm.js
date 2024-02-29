import axios, { HttpStatusCode } from "axios";
import { useForm } from "react-hook-form";
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

function WriteMarketCommentForm({params, loginUser}) {
     // 댓글 form
     const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            writer: "",
            depth: 0,
            parentCommentId: "",
        },
        mode: "onSubmit"
    })

    const writeComment = async(formData) => {
        console.log(formData);
        await axios.post(`${params.id}/add/comment`, formData, null)
        .then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Created) {
                alert("댓글이 성공적으로 작성되었습니다.");
                // 댓글 추가
                // 부모댓글의 id 를 찾아서 그 다음 위치에 댓글을 위치시킨다. filter
            } else {
                alert("댓글 작성에 실패하였습니다.");
            }
        });
    };

    return(
        <Container>
            <form onSubmit={handleSubmit(writeComment)}>
                <textarea {...register("comment", {
                    required: "내용을 작성해주세요",
                    maxLength: {
                        value: 100,
                        message: "댓글은 100자 이내 작성가능합니다."
                    }
                })}/>
                <button type="submit">댓글작성</button>
                {errors?.comment && <small>{errors.comment.message}</small>}
            </form>
        </Container>
    );
};

export default WriteMarketCommentForm;
import axios, { HttpStatusCode } from "axios";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function WriteCommentForm({params, loginUser}) {
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
        <div>
             <h3>댓글작성</h3>
                <Form onSubmit={handleSubmit(writeComment)}>
                    <h3>
                        <span>작성자</span>
                        <span>{`${loginUser.writer_nick} | (${loginUser.nickname})`}</span>
                    </h3>
                    <textarea {...register("comment", {
                        required: "내용을 작성해주세요",
                        maxLength: {
                            value: 100,
                            message: "댓글은 100자 이내 작성가능합니다."
                        }
                    })}/>
                    <input type="submit" value="작성하기" />
                    {errors?.comment && <small>{errors.comment.message}</small>}
                </Form>
        </div>
    );
};

export default WriteCommentForm;
import { useForm } from "react-hook-form";

function Login() {
    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: "onSubmit",
        criteriaMode: "firstError",
        delayError: 500,
    })

    const printFormData = (data) => console.log(data);

    return(
        <div>
            <div>
                <form method="POST" onSubmit={handleSubmit(printFormData)}>
                    <label for="login__id">ID</label>
                    <input id="login__id" 
                        {...register("id", {
                            required: "아이디를 입력해주세요",
                            maxLength: {
                                value: 15,
                                message: "아이디는 최대 15자입니다."
                            }
                        })}
                        placeholder="ID"
                    />
                    <p>{errors.id?.message}</p>

                    <label for="login__password">PASSWORD</label>
                    <input id="login__password" 
                        {...register("password", {
                            required: "비밀번호를 입력해주세요",
                            maxLength: {
                                value: 20,
                                message: "비밀번호는 최대 20자입니다."
                            }
                        })}
                        placeholder="PASSWORD"
                    />
                    <p>{errors.password?.message}</p>
                </form>
            </div>
        </div>
    );
}

export default Login;
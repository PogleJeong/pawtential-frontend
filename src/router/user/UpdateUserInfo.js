import axios from "axios";
import { useRef } from "react";

/**
 * Update User 는 직접 사이트에 회원가입한 유저만 가능.
 * SNS 유저는 접근할수없음. (social "N", "K") 일 경우
 * @returns 
 */
function UpdateUserInfo() {
    const {
        register,
        control,
        handleSubmit,
        getValues,
        setFocus,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            user: [{username: "", nickname: "", sex: "", birth: ""}]
        }
    });

    const [ profileImage, setProfileImage ] = useState(""); // 이미지 미리보기를 위한 fake url
    const [ showProfileImageModal, setShowProfileImageModal ] = useState(false); // modal
    const previewImageRef = useRef(); // 미리보기 img ref

    // 프로파일 이미지가 바뀔 떄마다 미리보기 img 의 src 값이 바뀜.
    useEffect(()=> {
        previewImageRef.current.src = profileImage;
    }, [profileImage])

    const previewProfileImage = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if(file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fakeUrl = URL.createObjectURL(file);
                previewImageRef.current.src = fakeUrl;
                setProfileImage(fakeUrl);
            }
        }
    }

    const onSubmitUpdateForm = async(data) => {
        console.log("update form data:", data);
        await axios.post("", data, {
            headers: {
                "Content-Type": "application/json",
            },
            baseURL: process.env.REACT_SERVER_URL
        }).then((response)=> {
            // 성공할시
            if (200 <= response?.status < 300) {
                alert("회원정보가 성공적으로 수정되었습니다.");
                location.reload();
            }
        })
    }

    return (
        <div>
            <h1>Update User Info</h1>
            <form onSubmit={handleSubmit(onSubmitUpdateForm)}>
                <ul>
                    <li>
                        <img ref={previewImageRef} />
                        <label htmlFor="update__profile">대표이미지 설정</label>
                        <input type="file" id="update__profile"
                            {...register("profile")}
                            style={{display: "none"}}
                            onChange={previewProfileImage}
                        />
                    </li>
                    {/** 비밀번호 변경은 따로.*/}
                    <li>
                        <label></label>
                    </li>
                </ul>
               
            </form>
            {showProfileImageModal && 
            <div>
                {profileImage && <img alt="미리보기" ref={previewImageRef}/>}
            </div>
            }
        </div>
    );
}

export default UpdateUserInfo;
import { useNavigate } from "react-router-dom";
import { HOME, PET } from "../constants/UrlPath";

/**
 * 반려동물 정보 추가 or 생략
 * 이전 프로젝트에서는 DB Schema 에 반려동물 유무 컬럼이 있었으나 제거.
 * @returns 
 */
function ChoiceToRegisterPet() {
    const navigate = useNavigate();
    return(
        <div>
            <div>
                <h2>반려동물 정보 추가하기</h2>
                <ul>
                    <li onClick={()=>navigate(PET)}>지금 등록할게요!</li>
                    <li onClick={()=>navigate(HOME)}>나중에 등록할게요!</li>
                </ul>
            </div>
        </div>
    )
}

export default ChoiceToRegisterPet;
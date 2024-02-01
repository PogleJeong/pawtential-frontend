import { useLocation } from "react-router-dom";

function FindId() {
    // useNavigate 로 받은 state 정보 get
    const { state } = useLocation();
    return(
        <div>
            <h2>아이디 찾기 결과</h2>
            {state?.foundId ?
            <div>
                <p>해당 이용자의 아이디는 {state?.foundId}입니다.</p>
            </div>
            :
            <div>
                <p>작성하신 이용자의 정보의 아이디가 존재하지 않습니다.</p>
            </div>
            }    
        </div>
    )
}

export default FindId;
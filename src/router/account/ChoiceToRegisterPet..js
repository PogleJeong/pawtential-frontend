import { useLocation, useNavigate } from "react-router-dom";
import { HOME, LOGIN, REGISTER, REGISTER_PET } from "../../constants/UrlPath";
import styled from "styled-components";
import { useEffect } from "react";

const Container = styled.div`
    width: 800px;
    max-width: 800px;
    
`

const Header = styled.div`
    width: 100%;
    height: 100px;
    margin: 20px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
    }
`

const ChoiceBox = styled.div`
    height: 100px;
    max-height: 100px;
    ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        height: 100%;
        li {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            cursor: pointer;
            border: 1px solid black;
            border-radius: 15px;
            transition: scale 1s;
            &:hover {
                border-width: 3px;
                scale: 1.05;
                
            }
            img {
                margin-bottom: 20px;
                padding: 10px;
                width: 100%;
                height: 80%;
                border-radius: 20px;
                opacity: 0.7;
            }
            span {
                font-size: 1.2rem;
                font-weight: bold;
            }
        }
    }
`

/**
 * 반려동물 정보 추가 or 생략
 * 이전 프로젝트에서는 DB Schema 에 반려동물 유무 컬럼이 있었으나 제거.
 */
function ChoiceToRegisterPet() {
    const navigator = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        console.log(location);
        // 회원가입 첫 페이지로부터 들어온게 아니라면 페이지 이동
        if (!location.state) {
            alert("등록한 회원정보가 없습니다. 회원가입 첫 페이지로 이동합니다.");
            navigator(REGISTER);
            return;
        }
    },[])

    const choiceRegisterPet = () => {
        navigator(REGISTER_PET, { state: {
            id: location.state.id,
        }})
    }

    const notChoiceRegisterPet = () => {
        navigator(LOGIN);
    }
    return(
        <Container>
           
            <Header>
                <h2>반려동물 정보 추가하기</h2>
            </Header>
            <ChoiceBox>
                <ul>
                    <li onClick={choiceRegisterPet}>
                        <img src={process.env.PUBLIC_URL + "/images/logo_js.png"}/>
                        <span>지금 등록할게요!</span>
                    </li>
                    <li onClick={notChoiceRegisterPet}>
                        <img src={process.env.PUBLIC_URL + "/images/logo_js.png"}/>
                        <span>나중에 등록할게요!</span>
                    </li>
                </ul>
            </ChoiceBox>
          
        </Container>
    )
}

export default ChoiceToRegisterPet;
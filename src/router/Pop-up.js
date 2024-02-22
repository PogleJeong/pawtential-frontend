import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    .pop-up__image {
        width: 100%;
        height: 370px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .pop-up__check {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        label {
            font-size: 0.8em;
        }
    }
`

function PopUp() {
    const [ cookies, setCookie, removeCookie ] = useCookies(['skip']);
    const [ popUpData, setPopUpData ] = useState({
        id: "123",
        thumbnail: process.env.PUBLIC_URL + "/images/logo_js.png",
    })

    const getPopUpData = async() => {
        await axios.get("/pop-up", {
            baseURL: process.env.REACT_APP_SERVER_URL,
        }).then((response)=>{
            const { status } = response;
            if (status === HttpStatusCode.Ok) {
                const { data } = response;
                setPopUpData(data);
            }
        })
    }
    /**
     * 체크 변화인식 
     */
    const todaySkipPopUp = (event) => {
        const { checked } = event.target;
        if (checked) {
            // 만료일을 설정 (내일 자정)
            var expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 1);
            expirationDate.setHours(0, 0, 0, 0);
            setCookie("skip", true, { expires: expirationDate });
        } else {
            removeCookie("skip");
        }
    }
    
    useEffect(()=>{
        // getPopUpData();
    },[])


    return(
        <Container>
            <div className="pop-up__image">
                <Link to="#">
                    <img src={popUpData.thumbnail} alt="팝업 정보 썸네일"/>
                </Link>
            </div>
            <div className="pop-up__check">
                <input id="check" type="checkbox" onChange={todaySkipPopUp} />
                <label htmlFor="check">오늘 이 창 보지않기</label>
            </div>
        </Container>
    );
};

export default PopUp;
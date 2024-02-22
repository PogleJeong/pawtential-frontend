
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { LOGIN, POP_UP } from "../constants/UrlPath";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0px);
    }
`

const textUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0px);
    }
`

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 30px;
`

const MainSection = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1500px;
    min-height: 800px;
    border-left: 1px solid rgba(0,0,0,0.2);
    border-right: 1px solid rgba(0,0,0,0.2);

    p {
        font-size: 3em;
        font-weight: bold;
        width: 100%;
        padding: 30px 0px;
        margin-bottom: 30px;
        &:first-child {
            text-align: center;
            animation: ${fadeIn} 3s
        }
    }
    div {
        margin-bottom: 50px;
        span {
            display: inline-block;
            padding:10px;
            animation: ${textUp} 3s;
        }
    }
`

const StartBtn = styled.button`
    box-sizing: border-box;
    appearance: none;
    background-color: transparent;
    border: 2px solid #e74c3c;
    border-radius: 0.6em;
    color: #e74c3c;
    cursor: pointer;
    display: flex;
    align-self: center;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1;
    margin: 20px;
    padding: 1.2em 2.8em;
    text-decoration: none;
    text-align: center;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;

    &:hover,
    &:focus {
    color: #fff;
    outline: 0;
    }
    transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
    &:hover {
        box-shadow: 0 0 40px 40px #e74c3c inset;
    }
    animation: ${fadeIn} 2s;
`

function Home() {
    const [ cookies ] = useCookies(['skip']);
    const navigator = useNavigate();

    useEffect(()=>{
        // 쿠키를 찾아서 팝업스킵이 있다면 띄우지 않음.
        if (!cookies?.skip) {
            window.open(POP_UP, "_blank", "width=600,height=400");
        }
        
    },[])

    return(
        <Container>
            <MainSection>
                <p>WELCOME&nbsp;&nbsp;&nbsp;TO&nbsp;&nbsp;&nbsp;PAW-TENTIAL</p>
                <div>
                    <span>안녕하세요 Paw-tential 에 오신것을 환영합니다!</span><br/>
                    <span>Paw-tential 은 전세계 모든 집사님들과 반려동물을 위한 커뮤니티입니다.</span><br/>
                    <span>반려동물과의 특별한 순간과 좋은 정보를 공유하면서 함께 성장해보세요!</span>
                </div>
                <div>
                    <StartBtn onClick={()=>navigator(LOGIN)}>시작하기!</StartBtn>
                </div>
            </MainSection>
            
        </Container>
    )
};

export default Home;
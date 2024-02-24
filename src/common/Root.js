import { Outlet } from "react-router-dom";
import Header from "./Header"
import Footer from "./Footer"
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import styled from "styled-components";

const Main = styled.div`
    display: flex;
    justify-content: center;
    padding: 0px auto;
    min-height: 800px;
`

function Root() {
    const [ cookies, setCookies, removeCookies ] = useCookies();
    useEffect(()=>{
      // 테스트용 임시 쿠키데이터 설정
      setCookies("id", "test1234", { maxAge: 3600 });
      setCookies("nickname", "포텐셜 매니저", { maxAge: 3600 }); 
      setCookies("auth", "MANAGER", { maxAge: 3600 });
    },[])
    return(
        <>
            <Header />
            <Main>
                <Outlet />
            </Main>
            <Footer auth={cookies?.auth} />
        </>
    )
}

export default Root;
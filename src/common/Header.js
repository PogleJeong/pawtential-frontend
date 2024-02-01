import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { HOME, LOGIN, MARKET, REGISTER } from "../constants/UrlPath";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Head = styled.header`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 200px;
    position: relative;
`

const UserMenu = styled.div`
    position: absolute;
    padding: 20px;
    top: 0px;
    right: 0px;
`

/**
 * 현재 로그인 상태에 따라 볼 수 있는 메뉴가 다름
 * - 미로그인상태 : 홈페이지, 로그인, 회원가입,
 * - 로그인상태 : 홈페이지, 마켓, 피드, 닉네임(내정보보기, 내피드보기, 채팅내역, 로그아웃)
 * @returns 
 */
function Header() {
    const [ cookies, removeCookies ] = useCookies(["id", "nickname"]);
    const navigator = useNavigate();

    const logout = () => {
        removeCookies("id");
        removeCookies("nickname");
        navigator(HOME);
    }

    useEffect(()=>{
        console.log(cookies?.id);
    },[cookies])

    return (
        <Head>
            <h2>Pawtential</h2>
            <UserMenu>
                {cookies?.id === undefined || cookies?.id === "undefined" ?
                <Navbar expand="lg">
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href={HOME}>홈</Nav.Link>
                        <Nav.Link href={LOGIN}>로그인</Nav.Link>
                        <Nav.Link href={REGISTER}>회원가입</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Navbar>
                :
                <Navbar expand="lg">
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href={"/"}>홈</Nav.Link>
                        <Nav.Link href={MARKET}>마켓플레이스</Nav.Link>
                        <Nav.Link href="#1">피드</Nav.Link>
                        <NavDropdown title={cookies?.nickname} id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">내정보보기</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">
                            Another action
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">
                            Something
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={logout}>
                            로그아웃
                        </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>
                </Navbar>
                }
                
            </UserMenu>
        </Head>
    )
}

export default Header;
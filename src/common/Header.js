import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { CHAT_LIST, CONTEST, HOME, LOGIN, MARKET, MY_FAVORIATE_FEED, PAWTENS, REGISTER, USER_INFO } from "../constants/UrlPath";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Head = styled.header`
    display: flex;
    justify-content: center;
    border-bottom: 2px solid rgba(0,0,0,0.4);
    background-color: #222;
    color: white;
`

const HeaderBox = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 100px;
    width: 1400px;
    max-width: 1400px;
    height: 80px;
`

const PawtentialLogo = styled.div`
    a {
        font-size: 1.2rem;
        font-weight: bold;
        color: white;
    }
`

const UserMenu = styled.div`
    ul {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    li {
        position: relative;
        margin: 20px;
        
        a, span {
            font-size: 0.9rem;
            color: white;
            transition: color 500ms;
            &:hover {
                color : #3498db;
                cursor: pointer;
            }
        }
        div {
            position: absolute;
            top: 30px;
            left: -10px;
            width: 150px;
            border: 1px solid black;
            border-radius: 5px;
            background-color: white;
            z-index: 5;
           
            ul{
                display: grid;
                grid-template-rows: 1fr 1fr 1fr 1fr;
                padding: 10px 0px;
                li {
                    margin: 10px 0px;
                    font-size: 0.85em;
                    color: black;
                        font-weight: 550;
                    &:hover {
                        color: black;
                        text-decoration: underline;
                    }
                    a {
                        color: black;
                        font-weight: 550;
                    }
                }
            }
        }
    }
`

/**
 * 현재 로그인 상태에 따라 볼 수 있는 메뉴가 다름
 * - 미로그인상태 : 홈페이지, 로그인, 회원가입,
 * - 로그인상태 : 홈페이지, 마켓, 피드, 닉네임(내정보보기, 내피드보기, 채팅내역, 로그아웃)
 * @returns 
 */
function Header() {
    const [ cookies, removeCookies ] = useCookies(["id", "nickname"]);
    const [ openMenu, setOpenMenu ] = useState(false);
    const navigator = useNavigate();

    const logout = () => {
        removeCookies("id");
        removeCookies("nickname");
        navigator(HOME);
    }

    return (
        <Head>
            <HeaderBox>
                <PawtentialLogo>
                    <Link to={HOME}>PAW-TENTIAL</Link>
                </PawtentialLogo>
                <UserMenu>
                    {cookies?.id === undefined || cookies?.id === "undefined" ?
                    <ul>
                        <li><Link href={HOME}>HOME</Link></li>
                        <li><Link to={LOGIN}>LOGIN</Link></li>
                        <li><Link to={REGISTER}>REGISTER</Link></li>
                    </ul>
                    :
                
                    <ul>
                        <li><Link href={HOME}>HOME</Link></li>
                        <li><Link to={MARKET}>MARKET PLACE</Link></li>
                        <li><Link to={PAWTENS}>PAWTENS</Link></li>
                        <li><Link to={CONTEST}>CONTEST</Link></li>
                        <li onClick={()=>setOpenMenu(prev=>!prev)}>
                            <span>MY PROFILE</span>
                            {openMenu && 
                            <div id="my_menu">
                                <ul>
                                    <li><Link to={`${USER_INFO}/${cookies?.id}/pet`}>MY INFO</Link></li>
                                    <li><Link to={MY_FAVORIATE_FEED}>LIKED FEED</Link></li>
                                    <li><Link to={CHAT_LIST}>CHAT</Link></li>
                                
                                    <li onClick={logout}>LOGOUT</li>
                                </ul>
                            </div>}
                        </li>
                    </ul>                
                    }   
                </UserMenu>
            </HeaderBox>
        </Head>
    )
}

export default Header;
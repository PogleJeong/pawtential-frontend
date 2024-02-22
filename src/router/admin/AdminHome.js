import { Link, Outlet } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ADMIN, ADMIN_REPORT_MANAGE, ADMIN_REPORT_RESULT, ADMIN_USER_MANAGE, ADMIN_USER_STATIS, HOME } from "../../constants/UrlPath";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const sublistAnimation = keyframes`
    from {
        transform: scaleY(0);
    }
    to {
        transform: scale(1);
    }

`

const Container = styled.div`
    display: flex;
    justify-content: center;
    
    .panel__container {
        width: 90vw;
        max-width: 2000px;
        height: 95vh;
        max-height: 1000px;
        margin-top: 20px;
        box-shadow: 2px 3px 6px 1px;
        .panel__header {
            width: 100%;
            border-bottom: 2px solid rgba(0,0,0,0.3);
            background-color: beige;
            h2 {
                text-align: center;
                font-size: 1.5em;
                font-weight: bold;
                padding: 20px;
            }
            p {
                padding: 10px;
                text-align: center;
            }
        }
        .panel__body {
            display: grid;
            grid-template-columns: 1fr 4fr;
            
            .panel__sidebar {
                /* display: flex;
                flex-direction: column; */
                height: 100%;
                padding: 100px 10px;
                box-shadow: 2px 2px 2px 0px;
                .panel__list {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    font-size: 1.2rem;
                    cursor: pointer;
                    &:hover {
                        background-color: antiquewhite;
                    }
                }
                .panel__sublist {
                    border: 1px solid black;
                    transform-origin: top;
                    animation: ${sublistAnimation} 0.3s;
                }
            }
            .panel__main {

            }
        }
    }
`

const activeStyle = {
    backgroundColor: "aliceblue",
    border: "1px solid black"
}

const PANEL = {
    USER: "user",
    REPORT: "report",
    STATIS: "statis"
}

function AdminHome() {
    const [ cookies ] = useCookies(["id", "nickname"]);
    const [ partChoice, setPartChoice ] = useState("");

    // 관리자만이 접속가능.
    useEffect(()=>{
        const { id, nickname } = cookies;
        if (!id || !nickname) {
            alert("권한이 없습니다.");
            window.location.href = HOME;
            return;
        }
    },[]);

    const handleClickPanel = (event) => {
        const { id } = event.target.dataset;
        // 같은 메뉴를 두번클릭시 리스트 접기
        if (partChoice === id) {
            setPartChoice("");
        } else {
            setPartChoice(id);
        }
    }

    return(
        <Container>
            <div className="panel__container">
                <header className="panel__header">
                    <h2>관리자 패널</h2>
                    <p>접속 관리자 | {`${cookies?.nickname} (id: ${cookies?.id})`}</p>
                </header>
                <div className="panel__body">
                    <div className="panel__sidebar">
                        <ul>
                            <li className="panel__list"
                                style={partChoice === PANEL.USER ? activeStyle : null}
                                data-id={PANEL.USER} 
                                onClick={handleClickPanel} 
                            >
                                유저관리
                                
                            </li>
                            {partChoice === PANEL.USER &&
                                <div className="panel__sublist">
                                    <ul>
                                        <li className="panel__list"><Link to={ADMIN_USER_MANAGE} >유저관리</Link></li>
                                        <li className="panel__list"><Link to={ADMIN_USER_STATIS} >유저통계</Link></li>
                                    </ul>
                                </div>
                            }
                            <li className="panel__list"
                                style={partChoice === PANEL.REPORT ? activeStyle : null}
                                data-id={PANEL.REPORT} 
                                onClick={handleClickPanel} 
                            >
                                신고관리
                            </li>
                            {partChoice === PANEL.REPORT &&
                                <div className="panel__sublist">
                                    <ul>
                                        <li className="panel__list"><Link to={ADMIN_REPORT_MANAGE} >신고내역</Link></li>
                                        <li className="panel__list"><Link to={ADMIN_REPORT_RESULT} >처리결과</Link></li>
                                    </ul>
                                </div>
                                }
                        </ul>
                    </div>
                    <div className="panel__main">
                        {/* 패널에 따른 컴포넌트 */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AdminHome;
import { Outlet, useMatch, Link } from "react-router-dom";
import styled from "styled-components";
import MarketList from "./component/MarketList.";
import { useEffect } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { MARKET, MARKET_FREE, MARKET_SELL } from "../../../constants/UrlPath";

// const Tab = styled.li<{ emphasize }>`
//     background-color:  ${(props)=> props.emphasize ? "gray" :  "rgba(255, 255, 255, 0.5)"};
//     color:  ${(props) => props.emphasize ? "white" : "black"};

// `

function MarketHome() {
    
    // 서버 코드 고치기 필요
    const printAllMarket = useMatch(MARKET);
    const printFreeMarket = useMatch(MARKET_FREE);
    const printSellMarket = useMatch(MARKET_SELL);

    return(
        <Container>
            <Breadcrumb>
                <Breadcrumb.Item active={printAllMarket !== null} href={MARKET}>전체</Breadcrumb.Item>
                <Breadcrumb.Item active={printFreeMarket !== null} href={MARKET_FREE}>나눔</Breadcrumb.Item>
                <Breadcrumb.Item active={printSellMarket !== null} href={MARKET_SELL}>판매</Breadcrumb.Item>
            </Breadcrumb>
            <div>
                {printAllMarket !== null? 
                <MarketList />
                :
                <Outlet />
                }
            </div>
        </Container>
    );
};

export default MarketHome;
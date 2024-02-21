import styled from "styled-components";

const Wrapper = styled.footer`
    display: flex;
    justify-content: center;
    margin-top: 15px;
    background-color: #333;
`

const Container = styled.div`
    width: 1500px;
    max-width: 1500px;
    display: flex;
    justify-content: space-around;
    
    color: white;
    padding: 40px;
`

const Section = styled.section`
    max-width: 250px;
    h3 {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 30px;
    }
    p {
        margin-bottom: 10px;
    }
    ul {
        list-style-type: none;
        padding: 0;
        li {
            margin-bottom: 10px;
        }
    }

    a {
        color: white;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
`
  
  

function Footer() {
    return(
        <Wrapper>
            <Container className="footer-container">
                <Section className="footer-section">
                    <h3>Paw-tential</h3>
                    <p>대표: 정은성</p>
                    <p>주소: 경기도 용인시...</p>
                    <p>전화번호: 031-1234-5678</p>
                </Section>

                <Section className="footer-section">
                    <ul>
                        <li><a href="/">홈</a></li>
                        <li><a href="/about">회사 소개</a></li>
                        <li><a href="/services">서비스</a></li>
                        <li><a href="/contact">문의하기</a></li>
                    </ul>
                </Section>

                <Section className="footer-section">
                    <p>소셜미디어</p>
                    <ul>

                    </ul>
                    
                </Section>
                <p>Copyright Pawtenital {new Date().getFullYear()}</p>
            </Container>
            
        </Wrapper>
    )
}

export default Footer;
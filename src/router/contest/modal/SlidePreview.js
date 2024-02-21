import { useState } from "react";
import { Button, Carousel, Image, Modal } from "react-bootstrap";
import styled from "styled-components";

const ImageBox = styled.div`
    min-width: 350px;
    min-height: 350px;
    max-width: 350px;
    max-height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Img = styled.img`
    min-width: 350px;
    min-height: 350px;
    max-width: 350px;
    max-height: 350px;
`

function SlidePreview({show, onHide, images}) {

    // 클릭해서 볼수있는 슬라이더
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) => setIndex(selectedIndex);

    return(
        <Modal
          show={show}
          onHide={onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                콘테스트 이미지 미리보기
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Carousel activeIndex={index} onSelect={handleSelect} data-bs-theme="dark">
                {images.map((image, number)=>(
                    <Carousel.Item key={number}>
                        <ImageBox>
                            <Img src={image} />
                        </ImageBox>
                    </Carousel.Item>
                ))}
                </Carousel>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SlidePreview;

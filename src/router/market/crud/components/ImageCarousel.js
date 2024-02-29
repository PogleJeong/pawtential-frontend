import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: hidden;

    button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 18px;
        color: white;
        background: #333;
        cursor: pointer;
        &:first-child {
            left: 10px;
        }
        &:last-child {
            right: 10px;
        }
    }

    img {
        padding: 10%;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 10px;
    }
`


function ImageCarousel({images}) {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    };
  
    const prevImage = () => {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Container>
            <button onClick={prevImage}>&lt;</button>
            <img src={images[currentImage]} alt={`Slide ${currentImage + 1}`}/>
            <button type="button" onClick={nextImage}>&gt;</button>
        </Container>
    );
};

export default ImageCarousel;
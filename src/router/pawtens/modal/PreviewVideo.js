import React, { useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";

function PreviewVideo({showModal, setShowModal, previewData}) {
  
    const handleClose = () => {
        setShowModal((show)=>{
            let copy = {...show};
            copy.video = false;
            return copy;
        })
    };

    return(
        <Modal show={showModal.video} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>포텐스 미리보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <video controls style={{width: "100%"}}>
              <source src={previewData.video} type="video/mp4" />
            </video>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default React.memo(PreviewVideo);
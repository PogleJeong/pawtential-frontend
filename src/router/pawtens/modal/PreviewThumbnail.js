import React, { useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";

function PreviewThumbnail({showModal, setShowModal, previewData}) {

    const handleClose = () => {
        setShowModal((show)=>{
            let copy = {...show};
            copy.thumbnail = false;
            return copy;
        })
    };

    return(
        <Modal show={showModal.thumbnail} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>썸네일 미리보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <img style={{width: "100%"}} src={previewData.thumbnail} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default React.memo(PreviewThumbnail);
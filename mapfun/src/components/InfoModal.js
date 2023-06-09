import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import apis from "../api/api";

export function InfoModal({
  show,
  setShow,
  modalData,
  setModalData,
  addPopup,
  setAddMode,
  removeMapListener,
}) {
  const handleClose = () => {
    addPopup();
    setShow(false);
    setAddMode(false);
    removeMapListener();
  };
  const handleSubmit = () => {
    addPopup();
    setShow(false);
    setAddMode(false);
    removeMapListener();

    // let payload = { ...modalData };
    let payload = {
      name: modalData.name,
      title: modalData.title || "",
      description: modalData.instruction,
      location: [modalData.lngLat.lng, modalData.lngLat.lat],

      // user: modalData.user,
    };

    console.log("payload::", payload);
    apis.addTask(payload).then((res) => {
      console.log("res::", res);
    });
  };
  const handleShow = () => setShow(true);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Instruction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Your name</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Instruction</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={modalData.instruction}
                onChange={(e) =>
                  setModalData({ ...modalData, instruction: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FaUserAlt } from "react-icons/fa";

export default function Sidebar({ user }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="sidebar  ">
      <Button
        variant="primary "
        className="position-absolute   z-index-10 "
        onClick={handleShow}
      >
        <FaUserAlt />
      </Button>

      <Offcanvas placement="end" show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Account Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h3>{user?.toUpperCase()}</h3>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

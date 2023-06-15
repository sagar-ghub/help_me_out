import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Navigate, redirect } from "react-router-dom";
export default function Login() {
  const locationImage = require("../assets/location_pin.jpg");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.status === "error") {
        setError(data.error);
        setLoading(false);
        return;
      }
      console.log(data);
      if (data.status === "ok") {
        localStorage.setItem("token", data.data);
        console.log("true");
        window.location.href = "/home";
      }
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  };

  return (
    <Row className="align-middle vertical-center">
      <Col className="text-center" style={{ backgroundColor: "" }} md={6}>
        <img src={locationImage} alt="location" height={500} width={500} />
      </Col>
      <Col className="text-center " md={6}>
        <Card style={{ width: "18rem", margin: "50px" }} className="text-start">
          <Form className="m-3">
            <Form.Group
              className="mb-3 "
              autocomplete="off"
              controlId="formBasicEmail"
            >
              <Form.Label className="text-start">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text> */}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group> */}
            <div className="text-center">
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Login
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

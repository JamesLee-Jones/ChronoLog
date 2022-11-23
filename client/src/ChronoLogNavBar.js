import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Navbar.css";

function ChronoLogNavBar() {
  return (
    <Navbar className="color-nav" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand className="nav-brand" href="/">
          ChronoLog.
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="nav-link" href="/about">
              About
            </Nav.Link>
            <Nav.Link className="nav-link" href="/library">
              Library
            </Nav.Link>
            <NavDropdown title="Developers" id="basic-nav-dropdown">
              <NavDropdown.Item href="https://github.com/JamesLee-Jones/ChronoLog">
                GitHub
              </NavDropdown.Item>
              <NavDropdown.Item href="https://github.com/JamesLee-Jones/ChronoLog/blob/main/README.md">
                Documentation
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ChronoLogNavBar;

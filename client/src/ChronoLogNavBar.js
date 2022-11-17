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
        <Navbar.Brand className="nav-brand" href="#home">
          ChronoLog.
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="nav-link" href="#home">
              About
            </Nav.Link>
            <NavDropdown title="Library" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/2.1">
                Winne The Pooh
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/2.2">
                Little Women
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/2.3">
                Harry Potter and the Philosopher's Stone
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Developers" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">GitHub</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Documentation
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ChronoLogNavBar;

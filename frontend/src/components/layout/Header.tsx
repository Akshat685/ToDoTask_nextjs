"use client";

import { useAtom } from "jotai";
import { userAtom } from "@/hooks/useAuth";
import { Container, Navbar, Nav } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [user] = useAtom(userAtom);
  const pathname = usePathname();
  const shouldShowNavbar = pathname !== "/";

  if (!shouldShowNavbar) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold">
          TodoApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} href="/">Home</Nav.Link>
                <Nav.Link as={Link} href="/logout" className="btn btn-outline-light btn-nav-cta">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} href="/login">Login</Nav.Link>
                <Nav.Link as={Link} href="/signup" className="btn btn-nav-cta">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

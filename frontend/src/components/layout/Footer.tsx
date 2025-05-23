import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4" style={{ marginTop: "54px" }}>
      <Container>
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="fw-bold">Contact Us</h5>
            <p className="mb-1">
              <i className="bi bi-envelope me-2"></i> support@todoapp.com
            </p>
            <p className="mb-1">
              <i className="bi bi-telephone me-2"></i> +91 1478523690
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <h5 className="fw-bold">Follow Us</h5>
            <a className="text-white me-3" aria-label="Twitter">
              <i className="bi bi-twitter fs-4"></i>
            </a>
            <a className="text-white me-3" aria-label="Facebook">
              <i className="bi bi-facebook fs-4"></i>
            </a>
            <a className="text-white" aria-label="LinkedIn">
              <i className="bi bi-linkedin fs-4"></i>
            </a>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="mb-0">© 2025 TodoApp. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

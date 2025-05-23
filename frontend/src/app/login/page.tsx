"use client";
import { useAtom } from "jotai";
import { userAtom } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { Form, Button, Alert, Card, Container, InputGroup } from "react-bootstrap";
import { loginValidation } from "@/utils/validation";
import axios from "axios";
import { toast } from "react-toastify";
import { setCookie } from "@/utils/cookies";
import "react-toastify/dist/ReactToastify.css";

// Separate component that uses useSearchParams
function LoginContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toastShownRef = useRef(false);

  useEffect(() => {
    const status = searchParams.get("status");

    // Use a ref to ensure each toast type is shown only once per mount
    if (status && !toastShownRef.current) {
      toastShownRef.current = true;

      if (status === "signup") {
        // Show signup success toast
        toast.success("Account created successfully! Please log in.", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Remove the status parameter from URL without reloading
      router.replace("/login", { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginValidation.validateAsync({ username, password });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}`,
        {
          query: `
            mutation Login($username: String!, $password: String!) {
              login(username: $username, password: $password) {
                user { id, username }
                token
              }
            }
          `,
          variables: { username, password },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { data, errors } = response.data;
      if (errors) {
        setError(errors[0].message);
        return;
      }

      // Set token as cookie
      setCookie("token", data.login.token, 1); // 1 day expiration
      
      setUser({ ...data.login.user, token: data.login.token });

      // Navigate to home with login status
      router.push("/?status=login");
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during login");
      }
    }
  };

  return (
    <section className="py-5">
      <Container>
        <Card className="mx-auto shadow" style={{ maxWidth: "400px" }}>
          <Card.Body>
            <Card.Title className="text-center fw-bold mb-4">Login</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-person"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </InputGroup>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 btn-hero-cta">
                Login
              </Button>
              <p className="text-center mt-3">
                Don&apos;t have an account? <Link href="/signup" className="text-primary">Sign up</Link>
              </p>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <section className="py-5">
      <Container>
        <Card className="mx-auto shadow" style={{ maxWidth: "400px" }}>
          <Card.Body>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
              <div
                className="spinner-grow text-primary"
                role="status"
                style={{ width: "2rem", height: "2rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

// Main component with Suspense boundary
export default function Login() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}
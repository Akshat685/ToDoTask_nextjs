"use client";
import { useState } from "react";
import { Form, Button, Alert, Card, Container, InputGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { registerValidation } from "@/utils/validation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerValidation.validateAsync({ username, password });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}`,
        {
          query: `
            mutation Register($username: String!, $password: String!) {
              register(username: $username, password: $password) {
                user { id, username }
                token
              }
            }
          `,
          variables: { username, password },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { errors } = response.data;
      console.log("Signup response:", response.data); // Debug log
      if (errors) {
        setError(errors[0].message);
        toast.error(errors[0].message, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      router.push("/login?status=signup");
    } catch (err: unknown) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during signup");
      }
    }
  };

  return (
    <>
      <section className="py-5">
        <Container>
          <Card className="mx-auto shadow" style={{ maxWidth: "400px" }}>
            <Card.Body>
              <Card.Title className="text-center fw-bold mb-4">Signup</Card.Title>
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
                  Signup
                </Button>
                <p className="text-center mt-3">
                  Already have an account? <Link href="/login" className="text-primary">Log in</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </>
  );
}
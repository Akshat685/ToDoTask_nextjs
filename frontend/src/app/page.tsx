"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { Todo } from "@/types";
import { userAtom, useAuth } from "@/hooks/useAuth";
import TodoForm from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import { deleteCookie } from "@/utils/cookies";

import "react-toastify/dist/ReactToastify.css";

// Separate component that uses useSearchParams
function HomeContent() {
  const [user] = useAtom(userAtom);
  const { isLoading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const status = searchParams.get("status");

    // Show a welcome toast only once per session
    if (!toastShownRef.current) {
      if (status === "login") {
        toast.success("You've successfully logged in.", {
          position: "top-right",
          autoClose: 2000,
        });
        toastShownRef.current = true;
        router.replace("/", { scroll: false });
      }
    }
  }, [router, searchParams]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleFormSuccess = () => {
    setEditingTodo(null);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);

    // Show feedback before redirecting
    toast.info("Logout successfully", {
      position: "top-right",
      autoClose: 1500,
    });

    setTimeout(() => {
      // Clear cookie for middleware
      deleteCookie("token");
      
      logout();
      router.push("/login?status=logout");
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-grow text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="todo-app-wrapper bg-light min-vh-100">
      <header className="bg-primary text-white py-3 shadow-sm sticky-top">
        <Container fluid className="px-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold">TaskMaster</h4>
            <div className="d-flex align-items-center">
              <span className="me-3">Hello, {user.username}</span>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleLogoutClick}
                className="px-3"
              >
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <Container fluid className="py-4 px-4">
        <Row className="mb-3">
          <Col lg={5}>
            <Card className="border-0 shadow-lg">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                <h5 className="text-primary fw-bold mb-0">
                  {editingTodo ? "Edit Task" : "Create New Task"}
                </h5>
              </Card.Header>
              <Card.Body className="pt-3 todo-list-scroll">
                <TodoForm
                  todo={editingTodo}
                  onSuccess={handleFormSuccess}
                  onCancel={handleCancelEdit}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="border-0 shadow-lg">
              <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="text-primary fw-bold mb-0">Your Tasks</h5>
                <div className="task-count text-muted small">
                  Manage your daily tasks with ease
                </div>
              </Card.Header>
              <Card.Body
                className="pt-3"
                style={{ maxHeight: "550px", overflowY: "auto" }}
              >
                <TodoList onEdit={handleEditTodo} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleCancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to log out of TaskMaster?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelLogout}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="spinner-grow text-primary"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
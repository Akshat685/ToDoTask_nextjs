"use client";
import { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATE_TODO, UPDATE_TODO } from "@/graphql/mutations";
import { GET_TODOS } from "@/graphql/queries";
import { Todo } from "@/types";
import { toast } from "react-toastify";

interface TodoFormProps {
  todo?: Todo | null;
  onSuccess?: () => void; // Add callback for successful create/update
  onCancel?: () => void; // Add callback for cancel button
}

export default function TodoForm({ todo, onSuccess, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  // Update form when todo changes (for editing)
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      // Format the date string from ISO to YYYY-MM-DD for the input
      setDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
    } else {
      // Reset form when not editing
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    const dueDateObject = new Date(dueDate);
    const today = new Date();
    if (dueDateObject < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format dueDate to ISO 8601 (e.g., "2025-05-21" -> "2025-05-21T00:00:00Z")
      const formattedDueDate = dueDate ? `${dueDate}T00:00:00Z` : null;

      const input = { title, description, dueDate: formattedDueDate };
      if (todo) {
        const { errors } = await updateTodo({
          variables: { id: todo.id, ...input },
        });
        if (errors) {
          setError(errors[0].message);
          return;
        }
        toast.success("Task updated successfully!");
      } else {
        const { errors } = await createTodo({
          variables: input,
        });
        if (errors) {
          setError(errors[0].message);
          return;
        }
        toast.success("Task created successfully!");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error("Todo form error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <Form onSubmit={handleSubmit} className="todo-form">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6} className="mb-3">
          <Form.Group controlId="title">
            <Form.Label className="fw-bold">Task Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="shadow-sm border"

            />
          </Form.Group>
        </Col>

        <Col md={todo ? 3 : 3} className="mb-3">
          <Form.Group controlId="dueDate">
            <Form.Label className="fw-bold">Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="shadow-sm border"
            />
          </Form.Group>
        </Col>

        <Col md={todo ? 3 : 3} className="mb-3 d-flex align-items-end">
          <Button
            variant="primary"
            type="submit"
            className="w-100 fw-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {todo ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{todo ? "Update Task" : "Add Task"}</>
            )}
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group controlId="description">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="shadow-sm border"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Cancel button only shown when editing */}
      {todo && (
        <Row className="mt-3">
          <Col md={12} className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              className="px-4"
            >
              Cancel
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
}
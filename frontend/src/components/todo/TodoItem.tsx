"use client";
import { useMutation } from "@apollo/client";
import { Button, Card, Form, Badge, Modal } from "react-bootstrap";
import { DELETE_TODO, UPDATE_TODO } from "@/graphql/mutations";
import { GET_TODOS } from "@/graphql/queries";
import { Todo } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";

interface TodoItemProps {
  todo: Todo;
  onEdit?: (todo: Todo) => void; // Callback for parent component
}

export default function TodoItem({ todo, onEdit }: TodoItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleDelete = async () => {
    try {
      const { errors } = await deleteTodo({ variables: { id: todo.id } });
      handleCloseDeleteModal();

      if (errors) {
        console.error("Error deleting todo:", errors[0].message);
        toast.error(`Failed to delete task: ${errors[0].message}`);
      } else {
        toast.success("Task deleted successfully!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error deleting todo:", err.message);
        toast.error(`Failed to delete task: ${err.message}`);
      } else {
        console.error("Unknown error:", err);
        toast.error("Failed to delete task.");
      }
    }
  }

  const handleToggleComplete = async () => {
    try {
      const newStatus = !todo.completed;
      const { errors } = await updateTodo({
        variables: { id: todo.id, completed: newStatus },
      });

      if (errors) {
        toast.error(`Failed to update task: ${errors[0].message}`);
      } else {
        toast.info(newStatus ? "Task marked as complete!" : "Task marked as incomplete");
      }
  } catch (err: unknown) {
  if (err instanceof Error) {
    toast.error(`Failed to update task: ${err.message}`);
  } else {
    toast.error("Failed to update task due to an unknown error.");
  };
}
}

  // Calculate if task is overdue
  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    return dueDate < today;
  };

  // Format due date nicely
  const formatDueDate = () => {
    if (!todo.dueDate) return "No due date";
    const dueDate = new Date(todo.dueDate);
    return dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(todo);
    }
  };

  return (
    <>
      <Card
        className={`border-0 shadow-sm mb-3 ${todo.completed ? 'border-start border-4 border-success' :
          isOverdue() ? 'border-start border-4 border-danger' : ''}`}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div className="task-content">
              <div className="d-flex align-items-center mb-2">
                <Form.Check
                  type="checkbox"
                  checked={todo.completed}
                  onChange={handleToggleComplete}
                  className="me-2"
                  id={`task-${todo.id}`}
                />
                <h5 className={`mb-0 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {todo.title}
                </h5>
                {todo.completed && (
                  <Badge bg="success" className="ms-2">Completed</Badge>
                )}
                {isOverdue() && !todo.completed && (
                  <Badge bg="danger" className="ms-2">Overdue</Badge>
                )}
              </div>

              {todo.description && (
                <p className={`ms-4 mb-2 ${todo.completed ? 'text-muted' : ''}`}>
                  {todo.description}
                </p>
              )}

              <div className="ms-4 text-muted small">
                <i className="bi bi-calendar me-1"></i> Due: {formatDueDate()}
              </div>
            </div>

            <div className="task-actions">
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleShowDeleteModal}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the task <strong>&quot;{todo.title}&quot;</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
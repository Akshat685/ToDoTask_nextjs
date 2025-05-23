"use client";
import { useQuery } from "@apollo/client";
import { Alert, Spinner } from "react-bootstrap";
import { GET_TODOS } from "@/graphql/queries";
import TodoItem from "./TodoItem";
import { Todo } from "@/types";
import { useAtom } from "jotai";
import { userAtom } from "@/hooks/useAuth";

interface TodoListProps {
  onEdit?: (todo: Todo) => void;
}

export default function TodoList({ onEdit }: TodoListProps) {
  const [user] = useAtom(userAtom);
  const { loading, error, data } = useQuery(GET_TODOS, {
    skip: !user,
    fetchPolicy: "network-only",
  });
  
  if (!user) {
    return (
      <Alert variant="info" className="d-flex align-items-center">
        <i className="bi bi-info-circle me-2"></i>
        Please log in to see your tasks
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle me-2"></i>
        <div>
          <strong>Error loading tasks:</strong>
          <div className="mt-1 small">Please try refreshing the page.</div>
        </div>
      </Alert>
    );
  }

  // Filter todos into different categories
  const completedTodos = data.todos.filter((todo: Todo) => todo.completed);
  const pendingTodos = data.todos.filter((todo: Todo) => !todo.completed);

  if (data.todos.length === 0) {
    return (
      <div className="text-center py-5 bg-light rounded">
        <h5>No tasks yet</h5>
        <p className="text-muted">Create your first task using the form !</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {pendingTodos.length > 0 && (
        <>
          <h6 className="mb-3 text-primary fw-bold">
            Pending Tasks ({pendingTodos.length})
          </h6>
          {pendingTodos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
          ))}
        </>
      )}
      
      {completedTodos.length > 0 && (
        <div className="mt-4">
          <h6 className="mb-3 text-success fw-bold">
            Completed Tasks ({completedTodos.length})
          </h6>
          {completedTodos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
          ))}
        </div>
      )}
      
      {pendingTodos.length === 0 && data.todos.length > 0 && (
        <Alert variant="success" className="d-flex align-items-center my-2">
          <i className="bi bi-check-circle me-2"></i>
          All tasks completed! Great job!
        </Alert>
      )}
    </div>
  );
}
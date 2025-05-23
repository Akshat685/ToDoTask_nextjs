import { gql } from "@apollo/client";

export const CREATE_TODO = gql`
  mutation CreateTodo(
    $title: String!
    $description: String
    $dueDate: DateTime
  ) {
    createTodo(title: $title, description: $description, dueDate: $dueDate) {
      id
      title
      description
      completed
      dueDate
      userId
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: Int!
    $title: String
    $description: String
    $completed: Boolean
    $dueDate: DateTime
  ) {
    updateTodo(
      id: $id
      title: $title
      description: $description
      completed: $completed
      dueDate: $dueDate
    ) {
      id
      title
      description
      completed
      dueDate
      userId
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id)
  }
`;

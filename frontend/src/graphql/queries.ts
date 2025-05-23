import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query Todos {
    todos {
      id
      title
      description
      completed
      dueDate
      userId
    }
  }
`;

export const GET_TODO = gql`
  query Todo($id: Int!) {
    todo(id: $id) {
      id
      title
      description
      completed
      dueDate
      userId
    }
  }
`;
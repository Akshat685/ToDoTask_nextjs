import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar DateTime

  type User {
    id: Int!
    username: String!

    todos: [Todo!]!
  }

  type Todo {
    id: Int!
    title: String!
    description: String
    completed: Boolean!
    dueDate: DateTime

    userId: Int!
    user: User!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    # User queries
    me: User
    getAllUsers: [User!]!

    # Todo queries
    todos: [Todo!]!           # Todos of authenticated user
    todo(id: Int!): Todo     # Single todo by id (must belong to user)
    getAllTodos: [Todo!]!    # All todos (any user)
    userTodos(userId: Int!): [Todo!]!  # Todos by specific user
  }

  type Mutation {
    # User mutations
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    logout: Boolean!

    # Todo mutations
    createTodo(title: String!, description: String, dueDate: DateTime): Todo!
    updateTodo(
      id: Int!
      title: String
      description: String
      completed: Boolean
      dueDate: DateTime
    ): Todo!
    deleteTodo(id: Int!): Boolean!
    
  }
`;

export default typeDefs;

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GraphQLDateTime } from "graphql-scalars";
import {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server-express";

import {
  registerValidation,
  loginValidation,
  todoValidation,
  todoUpdateValidation,
} from "../utils.js/validation.js";

const resolvers = {
  DateTime: GraphQLDateTime,

  Query: {
    me: (_, __, { user }) => {
      return user || null;
    },

    getAllUsers: async (_, __, { prisma, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in");
      return prisma.user.findMany({
        include: {
          todos: true,
        },
      });
    },

    todos: async (_, __, { prisma, user }) => {
      if (!user)
        throw new AuthenticationError("You must be logged in to view todos");
      return prisma.todo.findMany({
        where: { userId: user.id },
        orderBy: { id: "asc" },
      });
    },

    todo: async (_, { id }, { prisma, user }) => {
      if (!user)
        throw new AuthenticationError("You must be logged in to view a todo");

      const todo = await prisma.todo.findUnique({ where: { id } });

      if (!todo) throw new UserInputError("Todo not found");
      if (todo.userId !== user.id)
        throw new ForbiddenError("You can only view your own todos");

      return todo;
    },

    userTodos: async (_, { userId }, { prisma, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in");

      // If you want to restrict to own todos only, uncomment the next line:
      if (user.id !== userId)
        throw new ForbiddenError("You can only view your own todos");

      return prisma.todo.findMany({
        where: { userId },
        orderBy: { id: "asc" },
      });
    },
  },

  Mutation: {
    register: async (_, { username, password }, { prisma, req }) => {
      try {
        await registerValidation.validateAsync({ username, password });
      } catch (error) {
        throw new UserInputError(error.details?.[0]?.message || error.message);
      }

      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) throw new UserInputError("Username is already taken");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { username, password: hashedPassword },
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return { user, token };
    },

    login: async (_, { username, password }, { prisma, req }) => {
      try {
        await loginValidation.validateAsync({ username, password });
      } catch (error) {
        throw new UserInputError(error.details?.[0]?.message || error.message);
      }

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) throw new UserInputError("Invalid username or password");

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        throw new UserInputError("Invalid username or password");

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return { user, token };
    },

    logout: (_, __, { req }) => {
      if (req?.session) {
        req.session.destroy((err) => {
          if (err) console.error("Error destroying session:", err);
        });
      }
      return true;
    },

    createTodo: async (_, args, { prisma, user }) => {
      if (!user)
        throw new AuthenticationError("You must be logged in to create a todo");

      try {
        await todoValidation.validateAsync(args);
      } catch (error) {
        throw new UserInputError(error.details?.[0]?.message || error.message);
      }

      return prisma.todo.create({
        data: {
          title: args.title,
          description: args.description || "",
          dueDate: args.dueDate,
          userId: user.id,
        },
      });
    },

    updateTodo: async (_, args, { prisma, user }) => {
      if (!user)
        throw new AuthenticationError("You must be logged in to update a todo");

      // Validate input
      try {
        await todoUpdateValidation.validateAsync(args);
      } catch (error) {
        throw new UserInputError(error.details?.[0]?.message || error.message);
      }

      // Find todo by ID
      const todo = await prisma.todo.findUnique({ where: { id: args.id } });

      if (!todo) throw new UserInputError("Todo not found");

      if (todo.userId !== user.id)
        throw new ForbiddenError("You can only update your own todos");

      // Prepare update data, ignoring undefined fields
      const updateData = {};
      if (typeof args.title !== "undefined") updateData.title = args.title;
      if (typeof args.description !== "undefined")
        updateData.description = args.description;
      if (typeof args.completed !== "undefined")
        updateData.completed = args.completed;
      if (typeof args.dueDate !== "undefined")
        updateData.dueDate = args.dueDate;

      // Update and return
      const updatedTodo = await prisma.todo.update({
        where: { id: args.id },
        data: updateData,
      });
      return updatedTodo;
    },

    deleteTodo: async (_, { id }, { prisma, user }) => {
      if (!user)
        throw new AuthenticationError("You must be logged in to delete a todo");

      const todo = await prisma.todo.findUnique({ where: { id } });

      if (!todo) throw new UserInputError("Todo not found");
      if (todo.userId !== user.id)
        throw new ForbiddenError("You can only delete your own todos");

      await prisma.todo.delete({ where: { id } });
      return true;
    },
  },

  User: {
    todos: async ({ id }, _, { prisma }) => {
      return prisma.todo.findMany({
        where: { userId: id },
        orderBy: { id: "desc" },
      });
    },
  },

  Todo: {
    user: async ({ userId }, _, { prisma }) => {
      return prisma.user.findUnique({ where: { id: userId } });
    },
  },
};

export default resolvers;

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  userId: number;
}

export interface User {
  id: number;
  username: string;
}
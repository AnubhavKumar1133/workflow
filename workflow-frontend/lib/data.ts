// Define the Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  client: string;
  status: "completed" | "pending" | "in progress";
  priority: string;
  deadline: string;
  createdAt: string;
}

export const mockTasks: Task[] = [
  // {
  //   id: "1",
  //   title: "Task 1",
  //   description: "Description for Task 1",
  //   client: "Client A",
  //   status: "pending",
  //   priority: "high",
  //   deadline: "2023-12-01",
  //   createdAt: "2023-01-01",
  // },
  // {
  //   id: "2",
  //   title: "Task 2",
  //   description: "Description for Task 2",
  //   client: "Client B",
  //   status: "in progress",
  //   priority: "medium",
  //   deadline: "2023-11-15",
  //   createdAt: "2023-02-01",
  // },
  // Other tasks...
]


export const mockClients = [
  // Example clients
];

import { Task } from "@/types/task";
import { v4 as uuidv4 } from "uuid";

export const generateMockTasks = (): Task[] => {
  return [
    {
      id: uuidv4(),
      title: "Complete project proposal",
      description: "Finish writing the project proposal for the client meeting.",
      priority: "high",
      status: "in-progress",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      tags: ["work", "client", "urgent"],
    },
    {
      id: uuidv4(),
      title: "Schedule team meeting",
      description: "Set up a weekly team sync to discuss project progress.",
      priority: "medium",
      status: "pending",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      tags: ["work", "team"],
    },
    {
      id: uuidv4(),
      title: "Buy groceries",
      description: "Get vegetables, fruits, and household supplies.",
      priority: "low",
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      tags: ["personal", "shopping"],
    },
    {
      id: uuidv4(),
      title: "Read design documentation",
      description: "Go through the UI/UX design documentation for the new mobile app.",
      priority: "medium",
      status: "pending",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      tags: ["work", "learning", "design"],
    },
    {
      id: uuidv4(),
      title: "Exercise",
      description: "Go for a 30-minute jog in the park.",
      priority: "medium",
      status: "pending",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
      tags: ["health", "personal"],
    },
    {
      id: uuidv4(),
      title: "Plan weekend trip",
      description: "Research destinations and accommodations for the weekend getaway.",
      priority: "low",
      status: "in-progress",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      tags: ["personal", "travel", "planning"],
    },
  ];
};

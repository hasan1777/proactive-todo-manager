
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Task, TaskPriority } from "@/types/task";
import { PriorityBadge } from "@/components/ui/badge-priority";
import { Calendar, Clock, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, completed: boolean) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";
  
  return (
    <Card className={cn(
      "w-full transition-all duration-200 hover:shadow-md border-l-4",
      isCompleted ? "border-l-green-500 opacity-80" : getPriorityBorderColor(task.priority)
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={(checked) => 
              onStatusChange(task.id, checked as boolean)
            }
          />
          <h3 className={cn(
            "font-medium leading-none pt-1",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
        </div>
        <PriorityBadge variant={task.priority as TaskPriority}>
          {task.priority}
        </PriorityBadge>
      </CardHeader>
      <CardContent>
        <p className={cn(
          "text-sm text-muted-foreground",
          isCompleted && "line-through"
        )}>
          {task.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive" 
            onClick={() => onDelete(task.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function getPriorityBorderColor(priority: TaskPriority): string {
  switch (priority) {
    case "high":
      return "border-l-red-500";
    case "medium":
      return "border-l-orange-500";
    case "low":
      return "border-l-green-500";
    default:
      return "border-l-gray-500";
  }
}

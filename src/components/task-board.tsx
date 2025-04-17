
import React from "react";
import { Task } from "@/types/task";
import { TaskCard } from "@/components/task-card";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Column {
  id: string;
  title: string;
}

interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onReorder: (result: DropResult) => void;
}

export function TaskBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onReorder,
}: TaskBoardProps) {
  const { t } = useLanguage();
  
  const columns: Column[] = [
    { id: "pending", title: t("status.pending") },
    { id: "in-progress", title: t("status.in-progress") },
    { id: "completed", title: t("status.completed") },
  ];

  const tasksByColumn = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <DragDropContext onDragEnd={onReorder}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <h3 className="text-md font-medium flex items-center justify-between">
                  {column.title}
                  <span className="text-sm bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                    {tasksByColumn[column.id].length}
                  </span>
                </h3>
              </CardHeader>
              <CardContent className="flex-grow">
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      className="space-y-3 min-h-[200px]"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {tasksByColumn[column.id].map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="transition-all duration-200 opacity-100"
                              style={{
                                ...provided.draggableProps.style,
                                transformOrigin: "0 0",
                              }}
                            >
                              <TaskCard
                                task={task}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onStatusChange={(id, completed) => {
                                  onStatusChange(
                                    id,
                                    completed ? "completed" : "pending"
                                  );
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

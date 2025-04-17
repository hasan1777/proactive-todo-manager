
import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { TaskList } from "@/components/task-list";
import { TaskBoard } from "@/components/task-board";
import { TaskForm } from "@/components/task-form";
import { TaskFilters } from "@/components/task-filters";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, CheckSquare, LayoutGrid, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMockTasks } from "@/utils/mock-data";
import { DropResult } from "@hello-pangea/dnd";

export default function Index() {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    setTaskStatus,
    reorderTasks,
    clearCompletedTasks
  } = useTaskContext();
  
  const { t } = useLanguage();
  
  // Initialize with mock data if tasks are empty (for demo purposes)
  useEffect(() => {
    if (tasks.length === 0) {
      const mockTasks = generateMockTasks();
      mockTasks.forEach(task => createTask(task));
    }
  }, []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  // Filter and sort tasks
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    // Tab filter
    const matchesTab = 
      (activeTab === "all") ||
      (activeTab === "pending" && task.status === "pending") ||
      (activeTab === "in-progress" && task.status === "in-progress") ||
      (activeTab === "completed" && task.status === "completed");
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortDirection === "asc") {
      return a.createdAt.getTime() - b.createdAt.getTime();
    } else {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const handleCreateTask = (taskData: Partial<Task>) => {
    createTask({
      title: taskData.title || "",
      description: taskData.description || "",
      priority: (taskData.priority as TaskPriority) || "medium",
      status: (taskData.status as TaskStatus) || "pending",
      dueDate: taskData.dueDate,
      tags: taskData.tags || [],
    });
    setIsFormOpen(false);
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setIsFormOpen(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a valid droppable
    if (!destination) return;
    
    // Reordering within the same list
    if (source.droppableId === destination.droppableId) {
      if (source.index !== destination.index) {
        reorderTasks(source.index, destination.index);
      }
    } 
    // Moving between lists (changing status)
    else {
      // Update the task status based on the destination droppable
      updateTask(draggableId, {
        status: destination.droppableId as TaskStatus
      });
    }
  };

  // Get task counts for tabs
  const taskCounts = tasks.reduce(
    (acc, task) => {
      acc.all++;
      acc[task.status]++;
      return acc;
    },
    { all: 0, pending: 0, "in-progress": 0, completed: 0 } as Record<string, number>
  );

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t("app.title")}</h1>
          <p className="text-muted-foreground">{t("app.description")}</p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              className="rounded-none"
              onClick={() => setViewMode("list")}
              size="sm"
            >
              <List className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline-block">List</span>
            </Button>
            <Button
              variant={viewMode === "board" ? "default" : "ghost"}
              className="rounded-none"
              onClick={() => setViewMode("board")}
              size="sm"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline-block">Board</span>
            </Button>
          </div>
        
          <ThemeToggle />
          <LanguageToggle />
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("action.add-task")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <TaskForm
                defaultValues={editingTask || undefined}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={handleFormClose}
                isEditing={!!editingTask}
              />
            </DialogContent>
          </Dialog>
          
          {taskCounts.completed > 0 && (
            <Button variant="outline" onClick={clearCompletedTasks}>
              <CheckSquare className="mr-2 h-4 w-4" />
              {t("action.clear-completed")}
            </Button>
          )}
        </div>
      </header>
      
      <main>
        <TaskFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
        
        {viewMode === "list" ? (
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-6"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all" className="relative">
                {t("tab.all")}
                <span className="absolute top-0 right-1 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {taskCounts.all}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                {t("tab.pending")}
                <span className="absolute top-0 right-1 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {taskCounts.pending}
                </span>
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="relative">
                {t("tab.in-progress")}
                <span className="absolute top-0 right-1 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {taskCounts["in-progress"]}
                </span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="relative">
                {t("tab.completed")}
                <span className="absolute top-0 right-1 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {taskCounts.completed}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {sortedTasks.length > 0 ? (
                <TaskList
                  tasks={sortedTasks}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                  onStatusChange={setTaskStatus}
                  onReorder={reorderTasks}
                />
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">{t("empty.no-tasks")}</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                      ? t("empty.adjust-filters")
                      : t("empty.create-new")}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-6">
            <TaskBoard
              tasks={sortedTasks}
              onEdit={handleEditTask}
              onDelete={deleteTask}
              onStatusChange={(id, status) => updateTask(id, { status: status as TaskStatus })}
              onReorder={handleDragEnd}
            />
          </div>
        )}
      </main>
    </div>
  );
}

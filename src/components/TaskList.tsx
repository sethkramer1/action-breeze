
import React, { useState } from 'react';
import Task from './Task';
import { Button } from "@/components/ui/button";

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  project: string;
  dueDate?: Date;
}

interface TaskListProps {
  tasks: TaskItem[];
  currentProject: string;
  filter: 'all' | 'active' | 'completed';
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSetDueDate: (id: string, date: Date | undefined) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  currentProject,
  filter,
  onToggleComplete,
  onDeleteTask,
  onSetDueDate
}) => {
  const filteredTasks = tasks.filter(task => {
    // Filter by project
    const projectMatch = task.project === currentProject || currentProject === 'inbox';
    
    // Filter by completion status
    const statusMatch = 
      filter === 'all' ? true :
      filter === 'active' ? !task.completed :
      task.completed;
    
    return projectMatch && statusMatch;
  });

  // Sort by priority (high to low) and then by completion status
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort completed tasks to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then sort by priority (lower number = higher priority)
    return a.priority - b.priority;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <p className="mb-4">No tasks found</p>
        <p className="text-sm">Add a task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sortedTasks.map((task) => (
        <Task
          key={task.id}
          id={task.id}
          title={task.title}
          completed={task.completed}
          priority={task.priority}
          dueDate={task.dueDate}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
          onSetDueDate={onSetDueDate}
        />
      ))}
    </div>
  );
};

export default TaskList;

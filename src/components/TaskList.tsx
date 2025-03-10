import React, { useState } from 'react';
import Task from './Task';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { CheckCircle2, ListTodo, Circle } from 'lucide-react';

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const filteredTasks = tasks.filter(task => {
    // Filter by project
    const projectMatch = 
      currentProject === 'inbox' ? true :
      currentProject === 'today' ? (task.dueDate && new Date(task.dueDate).setHours(0, 0, 0, 0) === today.getTime()) :
      task.project === currentProject;
    
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
      <div className="empty-state flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          {filter === 'completed' ? (
            <CheckCircle2 size={32} className="text-gray-300" />
          ) : filter === 'active' ? (
            <Circle size={32} className="text-gray-300" />
          ) : (
            <ListTodo size={32} className="text-gray-300" />
          )}
        </div>
        <p className="text-lg font-medium text-gray-600 mb-1">
          {filter === 'completed' 
            ? 'No completed tasks' 
            : filter === 'active'
            ? 'No active tasks'
            : 'No tasks found'}
        </p>
        <p className="text-sm text-gray-500">
          {filter === 'completed'
            ? 'Completed tasks will appear here'
            : 'Add a task to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <Task
          key={task.id}
          id={task.id}
          title={task.title}
          completed={task.completed}
          priority={task.priority}
          dueDate={task.dueDate}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onSetDueDate={onSetDueDate}
        />
      ))}
    </div>
  );
};

export default TaskList;


import React, { useState } from 'react';
import { Check, Calendar, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskProps {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDueDate: (id: string, date: Date | undefined) => void;
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  completed,
  priority,
  dueDate,
  onToggleComplete,
  onDelete,
  onSetDueDate
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const dueDateLabel = dueDate ? format(new Date(dueDate), 'MMM d') : '';
  
  const getPriorityColor = () => {
    switch (priority) {
      case 1: return 'priority-p1';
      case 2: return 'priority-p2';
      case 3: return 'priority-p3';
      default: return 'priority-p4';
    }
  };

  return (
    <div 
      className={cn(
        "group flex items-center py-3 px-4 border border-transparent rounded-md hover:bg-gray-50 transition-all animate-slide-in",
        completed && "opacity-70"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn("task-checkbox mr-3", completed && "completed")}
        onClick={() => onToggleComplete(id)}
      >
        {completed && <Check size={14} className="text-white" />}
      </div>
      
      <div className="flex items-center space-x-2 flex-1">
        <div className={`${getPriorityColor()} mr-2`}></div>
        <span 
          className={cn(
            "flex-1 text-gray-800 transition-all",
            completed && "line-through text-gray-400"
          )}
        >
          {title}
        </span>
      </div>

      {dueDateLabel && (
        <div className="text-xs text-gray-500 flex items-center mr-3">
          <Calendar size={12} className="mr-1" />
          {dueDateLabel}
        </div>
      )}

      <div 
        className={cn(
          "flex items-center space-x-1 opacity-0 transition-opacity",
          isHovered && "opacity-100"
        )}
      >
        <button 
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
          onClick={() => onSetDueDate(id, dueDate ? undefined : new Date())}
        >
          <Calendar size={16} />
        </button>
        <button 
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-all"
          onClick={() => onDelete(id)}
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default Task;

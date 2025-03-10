import React, { useState } from 'react';
import { Check, Trash2, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMobile } from "@/hooks/use-mobile";

interface TaskProps {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSetDueDate: (id: string, date: Date | undefined) => void;
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  completed,
  priority,
  dueDate,
  onToggleComplete,
  onDeleteTask,
  onSetDueDate
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isMobile = useMobile();

  const handleDateSelect = (date: Date | undefined) => {
    onSetDueDate(id, date);
    setIsCalendarOpen(false);
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent calendar from opening
    onSetDueDate(id, undefined);
  };

  const getPriorityClass = () => {
    switch (priority) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityText = () => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'None';
    }
  };

  return (
    <div 
      className={cn(
        "task-item group",
        completed && "completed"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center flex-1 min-w-0">
        <button
          className={cn(
            "task-checkbox",
            completed && "checked"
          )}
          onClick={() => onToggleComplete(id)}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && <Check size={14} className="check-icon" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={cn("priority-dot", getPriorityClass())} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getPriorityText()} priority</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className={cn("task-title", completed && "line-through text-gray-400")}>
              {title}
            </span>
          </div>
          
          {dueDate && (
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <Calendar size={12} className="mr-1" />
              {format(new Date(dueDate), 'MMM d, yyyy')}
              <button 
                onClick={handleClearDate}
                className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Clear due date"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        "task-actions",
        // Always show actions on mobile, or when hovered on desktop
        (isMobile || isHovered) ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
      )}>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8",
                dueDate && "text-todo-purple"
              )}
              aria-label="Set due date"
            >
              <Calendar size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-2 border-b border-gray-100 flex justify-between items-center">
              <span className="text-sm font-medium">Set due date</span>
              {dueDate && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                  onClick={() => handleDateSelect(undefined)}
                >
                  Clear
                </Button>
              )}
            </div>
            <CalendarComponent
              mode="single"
              selected={dueDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDeleteTask(id)}
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Task;

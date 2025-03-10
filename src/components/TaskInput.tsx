import React, { useState } from 'react';
import { Plus, Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TaskInputProps {
  onAddTask: (task: { title: string; priority: number; completed: boolean; }) => void;
  currentProject: string;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, currentProject }) => {
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [priority, setPriority] = useState<number>(4); // Default to lowest priority (P4)
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onAddTask({
        title: taskTitle,
        priority,
        completed: false
      });
      setTaskTitle('');
      setPriority(4);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const getPriorityColor = (p: number) => {
    switch (p) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityLabel = (p: number) => {
    switch (p) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'None';
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-6 animate-fade-in">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Plus size={18} className="text-gray-400" />
        </div>
        <Input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="add-task-input pl-10"
        />
      </div>
      
      <Popover open={isPriorityOpen} onOpenChange={setIsPriorityOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 border-gray-200"
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center",
              priority !== 4 ? "bg-white" : ""
            )}>
              <Flag size={12} className={cn(
                "text-gray-400",
                priority === 1 && "text-red-500",
                priority === 2 && "text-yellow-500",
                priority === 3 && "text-blue-500"
              )} />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <div className="p-2 border-b border-gray-100">
            <p className="text-sm font-medium">Set priority</p>
          </div>
          <div className="p-2">
            {[1, 2, 3, 4].map((p) => (
              <div
                key={p}
                onClick={() => {
                  setPriority(p);
                  setIsPriorityOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer",
                  priority === p ? 'bg-gray-100' : 'hover:bg-gray-50'
                )}
              >
                <div className={cn("w-3 h-3 rounded-full", getPriorityColor(p))} />
                <span className="text-sm">{getPriorityLabel(p)}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      <Button 
        onClick={handleAddTask}
        className="bg-todo-purple hover:bg-todo-purple-dark text-white"
        disabled={!taskTitle.trim()}
      >
        Add
      </Button>
    </div>
  );
};

export default TaskInput;


import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskInputProps {
  onAddTask: (task: { title: string; priority: number; completed: boolean; }) => void;
  currentProject: string;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, currentProject }) => {
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [priority, setPriority] = useState<number>(4); // Default to lowest priority (P4)

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

  return (
    <div className="flex items-center space-x-2 mb-6 animate-fade-in">
      <div className="flex-1 relative">
        <Input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 rounded-md shadow-sm focus:border-todo-purple focus:ring-1 focus:ring-todo-purple"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Plus size={18} className="text-gray-400" />
        </div>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((p) => (
          <div
            key={p}
            onClick={() => setPriority(p)}
            className={`w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all ${
              priority === p ? 'bg-gray-100 scale-110' : 'bg-transparent hover:bg-gray-50'
            }`}
          >
            <div className={`priority-dot priority-p${p}`}></div>
          </div>
        ))}
      </div>
      <Button 
        onClick={handleAddTask}
        className="bg-todo-purple hover:bg-todo-purple-dark text-white"
      >
        Add
      </Button>
    </div>
  );
};

export default TaskInput;

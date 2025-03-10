
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  currentProject: string;
  projectName: string;
  taskCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentProject, projectName, taskCount }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{projectName}</h1>
      <p className="text-gray-500">
        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
      </p>
    </div>
  );
};

export default Header;

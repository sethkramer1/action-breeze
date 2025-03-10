import React from 'react';
import { 
  Inbox, 
  Calendar, 
  List, 
  CheckCircle, 
  Plus,
  Home
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export interface Project {
  id: string;
  name: string;
  color?: string;
}

interface ProjectSidebarProps {
  projects: Project[];
  currentProject: string;
  onSelectProject: (projectId: string) => void;
  currentFilter: 'all' | 'active' | 'completed';
  onChangeFilter: (filter: 'all' | 'active' | 'completed') => void;
  onAddProject: () => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  currentProject,
  onSelectProject,
  currentFilter,
  onChangeFilter,
  onAddProject
}) => {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold text-todo-purple flex items-center">
          <Home className="mr-2" size={20} />
          TodoBreeze
        </h1>
      </div>
      
      <div className="px-2 py-4 flex-1">
        <div className="mb-6">
          <h2 className="text-xs uppercase font-semibold text-gray-500 mb-2 px-3">Views</h2>
          <ul>
            <li>
              <Button
                variant="ghost"
                onClick={() => onSelectProject('inbox')}
                className={cn(
                  "w-full justify-start font-normal mb-1 text-gray-700 text-sm hover:text-todo-purple",
                  currentProject === 'inbox' && "bg-gray-200 text-todo-purple font-medium"
                )}
              >
                <Inbox className="mr-2" size={18} />
                Inbox
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                onClick={() => onSelectProject('today')}
                className={cn(
                  "w-full justify-start font-normal mb-1 text-gray-700 text-sm hover:text-todo-purple",
                  currentProject === 'today' && "bg-gray-200 text-todo-purple font-medium"
                )}
              >
                <Calendar className="mr-2" size={18} />
                Today
              </Button>
            </li>
          </ul>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2 px-3">
            <h2 className="text-xs uppercase font-semibold text-gray-500">Projects</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAddProject}
              className="h-6 w-6 p-0 text-gray-500 hover:text-todo-purple hover:bg-gray-200"
            >
              <Plus size={16} />
            </Button>
          </div>
          
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Button
                  variant="ghost"
                  onClick={() => onSelectProject(project.id)}
                  className={cn(
                    "w-full justify-start font-normal mb-1 text-gray-700 text-sm hover:text-todo-purple",
                    currentProject === project.id && "bg-gray-200 text-todo-purple font-medium"
                  )}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: project.color || '#e44332' }}
                  ></div>
                  {project.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChangeFilter('all')}
            className={cn(
              "flex-1 text-gray-700 text-xs",
              currentFilter === 'all' && "bg-gray-200"
            )}
          >
            <List size={14} className="mr-1" />
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChangeFilter('active')}
            className={cn(
              "flex-1 text-gray-700 text-xs",
              currentFilter === 'active' && "bg-gray-200"
            )}
          >
            <Calendar size={14} className="mr-1" />
            Active
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChangeFilter('completed')}
            className={cn(
              "flex-1 text-gray-700 text-xs",
              currentFilter === 'completed' && "bg-gray-200"
            )}
          >
            <CheckCircle size={14} className="mr-1" />
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;

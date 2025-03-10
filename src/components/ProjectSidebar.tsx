import React, { useState } from 'react';
import { Inbox, Calendar, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { useMobile } from "@/hooks/use-mobile";

interface Project {
  id: string;
  name: string;
  color?: string;
}

interface ProjectSidebarProps {
  projects: Project[];
  currentProject: string;
  onSelectProject: (projectId: string) => void;
  onAddProject: (name: string) => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  currentProject,
  onSelectProject,
  onAddProject
}) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMobile();

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName);
      setNewProjectName('');
      setIsAddingProject(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddProject();
    } else if (e.key === 'Escape') {
      setIsAddingProject(false);
      setNewProjectName('');
    }
  };

  const handleProjectSelect = (projectId: string) => {
    onSelectProject(projectId);
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col",
      isMobile ? "h-auto" : "h-full"
    )}>
      {isMobile && (
        <div 
          className="p-3 border-b border-gray-200 flex items-center justify-between cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h2 className="font-medium text-gray-700">
            {currentProject === 'inbox' 
              ? 'Inbox' 
              : currentProject === 'today' 
              ? 'Today' 
              : projects.find(p => p.id === currentProject)?.name || 'All Tasks'}
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>
        </div>
      )}
      
      <div className={cn(
        "p-4 flex-1 flex flex-col overflow-auto",
        isMobile && isCollapsed ? "hidden" : "block"
      )}>
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-2 text-gray-500 uppercase tracking-wider">Views</h2>
          <div className="space-y-1">
            <button
              className={cn(
                "project-button",
                currentProject === 'inbox' && "active"
              )}
              onClick={() => handleProjectSelect('inbox')}
            >
              <Inbox size={16} className="icon" />
              <span>Inbox</span>
            </button>
            <button
              className={cn(
                "project-button",
                currentProject === 'today' && "active"
              )}
              onClick={() => handleProjectSelect('today')}
            >
              <Calendar size={16} className="icon" />
              <span>Today</span>
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Projects</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setIsAddingProject(true)}
            >
              <Plus size={14} />
            </Button>
          </div>
          
          {isAddingProject ? (
            <div className="mb-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Project name"
                  autoFocus
                  className="h-9 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddProject}
                  disabled={!newProjectName.trim()}
                  className="bg-todo-purple hover:bg-todo-purple-dark text-white"
                >
                  Add
                </Button>
              </div>
            </div>
          ) : null}
          
          <div className="space-y-1">
            {projects
              .filter(p => p.id !== 'inbox' && p.id !== 'today')
              .map((project) => (
                <button
                  key={project.id}
                  className={cn(
                    "project-button",
                    currentProject === project.id && "active"
                  )}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <div 
                    className="project-dot"
                    style={{ backgroundColor: project.color || '#6366f1' }}
                  />
                  <span>{project.name}</span>
                </button>
              ))}
          </div>
        </div>

        {!isMobile && (
          <div className="mt-auto pt-4">
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleProjectSelect('inbox')}
              >
                <Inbox size={14} className="mr-1" />
                All Tasks
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;

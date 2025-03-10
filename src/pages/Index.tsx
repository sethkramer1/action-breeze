
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import TaskInput from '@/components/TaskInput';
import TaskList, { TaskItem } from '@/components/TaskList';
import ProjectSidebar, { Project } from '@/components/ProjectSidebar';
import Header from '@/components/Header';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  // Sample initial projects
  const initialProjects: Project[] = [
    { id: 'inbox', name: 'Inbox' },
    { id: 'today', name: 'Today' },
    { id: 'personal', name: 'Personal', color: '#4073ff' },
    { id: 'work', name: 'Work', color: '#25b84c' }
  ];

  // Sample initial tasks
  const initialTasks: TaskItem[] = [
    { id: uuidv4(), title: 'Complete project proposal', completed: false, priority: 1, project: 'work' },
    { id: uuidv4(), title: 'Buy groceries', completed: false, priority: 2, project: 'personal' },
    { id: uuidv4(), title: 'Schedule dentist appointment', completed: false, priority: 3, project: 'personal' },
    { id: uuidv4(), title: 'Review quarterly report', completed: false, priority: 1, project: 'work' },
    { id: uuidv4(), title: 'Send birthday card to mom', completed: false, priority: 2, project: 'personal', dueDate: new Date(2023, 6, 15) },
    { id: uuidv4(), title: 'Fix landing page bug', completed: true, priority: 1, project: 'work' },
  ];

  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [currentProject, setCurrentProject] = useState<string>('inbox');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  const projectColors = ['#9b87f5', '#e44332', '#ff9a14', '#4073ff', '#25b84c'];

  // Get the active project's name
  const getProjectName = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'All Tasks';
  };

  const getTaskCount = (projectId: string): number => {
    return tasks.filter(task => 
      (task.project === projectId || projectId === 'inbox') && 
      (filter === 'all' || (filter === 'active' ? !task.completed : task.completed))
    ).length;
  };

  const handleAddTask = (newTask: { title: string; priority: number; completed: boolean; }) => {
    const taskItem: TaskItem = {
      id: uuidv4(),
      title: newTask.title,
      completed: newTask.completed,
      priority: newTask.priority,
      project: currentProject === 'inbox' || currentProject === 'today' ? 'personal' : currentProject
    };
    
    setTasks([...tasks, taskItem]);
    toast.success('Task added successfully');
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted');
  };

  const handleSetDueDate = (id: string, date: Date | undefined) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, dueDate: date } : task
    ));
    if (date) {
      toast.success('Due date set');
    } else {
      toast.success('Due date removed');
    }
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const randomColor = projectColors[Math.floor(Math.random() * projectColors.length)];
      const newProject: Project = {
        id: uuidv4(),
        name: newProjectName,
        color: randomColor
      };
      
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setIsAddProjectOpen(false);
      toast.success('Project added');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <ProjectSidebar 
        projects={projects}
        currentProject={currentProject}
        onSelectProject={setCurrentProject}
        currentFilter={filter}
        onChangeFilter={setFilter}
        onAddProject={() => setIsAddProjectOpen(true)}
      />
      
      <div className="flex-1 p-8 overflow-auto">
        <Header 
          currentProject={currentProject} 
          projectName={getProjectName(currentProject)}
          taskCount={getTaskCount(currentProject)}
        />
        
        <TaskInput 
          onAddTask={handleAddTask}
          currentProject={currentProject}
        />
        
        <TaskList 
          tasks={tasks}
          currentProject={currentProject}
          filter={filter}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onSetDueDate={handleSetDueDate}
        />
      </div>

      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject} className="bg-todo-purple hover:bg-todo-purple-dark">
              Add Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

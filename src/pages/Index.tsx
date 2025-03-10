import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import TaskInput from '@/components/TaskInput';
import TaskList, { TaskItem } from '@/components/TaskList';
import ProjectSidebar from '@/components/ProjectSidebar';
import Header from '@/components/Header';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

interface Project {
  id: string;
  name: string;
  color?: string;
}

const Index = () => {
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 'inbox', name: 'Inbox' },
    { id: 'today', name: 'Today' }
  ]);
  const [currentProject, setCurrentProject] = useState<string>('inbox');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const projectColors = ['#e44332', '#ff9a14', '#4073ff', '#25b84c'];

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchTasks();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match our Project interface
      const userProjects = data.map((project: any) => ({
        id: project.id,
        name: project.name,
        color: project.color
      }));
      
      // Combine with our default projects
      setProjects([
        { id: 'inbox', name: 'Inbox' },
        { id: 'today', name: 'Today' },
        ...userProjects
      ]);
    } catch (error: any) {
      toast.error(`Error fetching projects: ${error.message}`);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match our TaskItem interface
      const userTasks = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        priority: task.priority,
        project: task.project,
        dueDate: task.due_date ? new Date(task.due_date) : undefined
      }));
      
      setTasks(userTasks);
    } catch (error: any) {
      toast.error(`Error fetching tasks: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleAddTask = async (newTask: { title: string; priority: number; completed: boolean; }) => {
    if (!user) {
      toast.error('You must be logged in to add tasks');
      return;
    }

    // For regular projects, use the project ID
    // For 'inbox', don't set a specific project ID
    // For 'today', set the due date to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const projectId = currentProject !== 'inbox' && currentProject !== 'today' 
      ? currentProject 
      : null;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTask.title,
          completed: newTask.completed,
          priority: newTask.priority,
          project: projectId,
          user_id: user.id,
          due_date: currentProject === 'today' ? today : null
        }])
        .select();
      
      if (error) throw error;
      
      const newTaskItem: TaskItem = {
        id: data[0].id,
        title: data[0].title,
        completed: data[0].completed,
        priority: data[0].priority,
        project: data[0].project,
        dueDate: currentProject === 'today' ? today : undefined
      };
      
      setTasks([...tasks, newTaskItem]);
      toast.success('Task added successfully');
    } catch (error: any) {
      toast.error(`Error adding task: ${error.message}`);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (error: any) {
      toast.error(`Error updating task: ${error.message}`);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted');
    } catch (error: any) {
      toast.error(`Error deleting task: ${error.message}`);
    }
  };

  const handleSetDueDate = async (id: string, date: Date | undefined) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ due_date: date })
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, dueDate: date } : task
      ));
      
      if (date) {
        toast.success('Due date set');
      } else {
        toast.success('Due date removed');
      }
    } catch (error: any) {
      toast.error(`Error updating due date: ${error.message}`);
    }
  };

  const handleAddProject = async () => {
    if (newProjectName.trim()) {
      const randomColor = projectColors[Math.floor(Math.random() * projectColors.length)];
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert([{
            name: newProjectName,
            color: randomColor,
            user_id: user?.id
          }])
          .select();
        
        if (error) throw error;
        
        const newProject: Project = {
          id: data[0].id,
          name: data[0].name,
          color: data[0].color
        };
        
        setProjects([...projects, newProject]);
        setNewProjectName('');
        setIsAddProjectOpen(false);
        toast.success('Project added successfully');
      } catch (error: any) {
        toast.error(`Error adding project: ${error.message}`);
      }
    }
  };

  return (
    <div className="app-container">
      <ProjectSidebar 
        projects={projects}
        currentProject={currentProject}
        onSelectProject={setCurrentProject}
        onAddProject={(name) => {
          setNewProjectName(name);
          handleAddProject();
        }}
      />
      
      <div className="main-content">
        <div className="header">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {getProjectName(currentProject)}
            </h1>
            <div className="ml-3 px-2 py-1 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600 font-medium">
                {getTaskCount(currentProject)} tasks
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="bg-white border border-gray-200 rounded-lg p-1 flex shadow-sm">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'all' 
                    ? 'bg-todo-purple text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('active')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'active' 
                    ? 'bg-todo-purple text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'completed' 
                    ? 'bg-todo-purple text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
        
        <div className="content-area">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse-subtle">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-100 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-100 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          ) : (
            <TaskList 
              tasks={tasks}
              currentProject={currentProject}
              filter={filter}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onSetDueDate={handleSetDueDate}
            />
          )}
          
          <div className="mt-4">
            <TaskInput 
              onAddTask={handleAddTask}
              currentProject={currentProject}
            />
          </div>
        </div>
      </div>
      
      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

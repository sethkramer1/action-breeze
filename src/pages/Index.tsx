
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import TaskInput from '@/components/TaskInput';
import TaskList, { TaskItem } from '@/components/TaskList';
import ProjectSidebar, { Project } from '@/components/ProjectSidebar';
import Header from '@/components/Header';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

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
  
  const projectColors = ['#9b87f5', '#e44332', '#ff9a14', '#4073ff', '#25b84c'];

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

    const projectId = currentProject === 'inbox' || currentProject === 'today' ? 'personal' : currentProject;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTask.title,
          completed: newTask.completed,
          priority: newTask.priority,
          project: projectId,
          user_id: user.id,  // Make sure we set the user_id
        }])
        .select();
      
      if (error) throw error;
      
      const newTaskItem: TaskItem = {
        id: data[0].id,
        title: data[0].title,
        completed: data[0].completed,
        priority: data[0].priority,
        project: data[0].project
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
            color: randomColor
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
        toast.success('Project added');
      } catch (error: any) {
        toast.error(`Error adding project: ${error.message}`);
      }
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
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-todo-purple"></div>
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

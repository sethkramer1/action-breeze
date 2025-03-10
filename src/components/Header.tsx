
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  currentProject: string;
  projectName: string;
  taskCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentProject, projectName, taskCount }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{projectName}</h1>
        <p className="text-gray-500">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-gray-600">
            {user.email}
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSignOut}
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Header;

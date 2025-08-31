'use client';

import { useState } from 'react';
import { CheckCircle, Circle, MoreVertical, Calendar, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'L' | 'M' | 'H';
  dueDate?: Date;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const priorityColors = {
  L: 'text-success',
  M: 'text-warning',
  H: 'text-error',
};

const priorityLabels = {
  L: 'Low',
  M: 'Medium',
  H: 'High',
};

export function TaskCard({ task, onToggle, onEdit, onDelete, className }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = () => {
    onToggle(task.id);
  };

  const formatDueDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = task.dueDate && !task.completed && task.dueDate < new Date();

  return (
    <div className={cn(
      'bg-surface border border-border rounded-lg p-4 transition-all duration-150 hover:shadow-md',
      task.completed && 'opacity-60',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <button
            onClick={handleToggle}
            className="flex-shrink-0 mt-0.5"
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <Circle className="w-5 h-5 text-muted hover:text-primary transition-colors duration-150" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-sm font-medium text-text line-clamp-2',
              task.completed && 'line-through'
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={cn(
                'text-xs text-muted mt-1 line-clamp-2',
                task.completed && 'line-through'
              )}>
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-3 mt-2">
              {/* Priority */}
              <div className="flex items-center space-x-1">
                <Flag className={cn('w-3 h-3', priorityColors[task.priority])} />
                <span className={cn('text-xs font-medium', priorityColors[task.priority])}>
                  {priorityLabels[task.priority]}
                </span>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className={cn(
                  'flex items-center space-x-1',
                  isOverdue && 'text-error'
                )}>
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        {(onEdit || onDelete) && (
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-muted hover:text-text hover:bg-surface-2 rounded transition-colors duration-150"
              aria-label="Task options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-border rounded-lg shadow-lg py-1 z-10">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors duration-150"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-150"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
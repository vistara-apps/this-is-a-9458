import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, applicationsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Query keys
const QUERY_KEYS = {
  TASKS: 'tasks',
  TASK: 'task',
  USER_TASKS: 'userTasks',
  APPLICATIONS: 'applications'
};

export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS, filters],
    queryFn: () => tasksApi.getTasks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTask = (taskId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TASK, taskId],
    queryFn: () => tasksApi.getTask(taskId),
    enabled: !!taskId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserTasks = (userId, status = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_TASKS, userId, status],
    queryFn: () => tasksApi.getUserTasks(userId, status),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: (data) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.USER_TASKS, user?.id] 
      });
      
      toast.success('Task created successfully!');
      return data;
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updates }) => tasksApi.updateTask(taskId, updates),
    onSuccess: (data, variables) => {
      // Update the specific task in cache
      queryClient.setQueryData([QUERY_KEYS.TASK, variables.taskId], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_TASKS] });
      
      toast.success('Task updated successfully!');
      return data;
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: (data, taskId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.TASK, taskId] });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.USER_TASKS, user?.id] 
      });
      
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    },
  });
};

export const useApplyToTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: applicationsApi.createApplication,
    onSuccess: (data) => {
      // Invalidate task details to show new application
      if (data.task_id) {
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.TASK, data.task_id] 
        });
      }
      
      // Invalidate user applications
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.APPLICATIONS, user?.id] 
      });
      
      toast.success('Application submitted successfully!');
      return data;
    },
    onError: (error) => {
      console.error('Error applying to task:', error);
      toast.error('Failed to submit application. Please try again.');
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, updates }) => 
      applicationsApi.updateApplication(applicationId, updates),
    onSuccess: (data) => {
      // Invalidate related queries
      if (data.task_id) {
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.TASK, data.task_id] 
        });
      }
      
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLICATIONS] });
      
      const statusMessages = {
        accepted: 'Application accepted!',
        rejected: 'Application rejected.',
        withdrawn: 'Application withdrawn.'
      };
      
      toast.success(statusMessages[data.status] || 'Application updated!');
      return data;
    },
    onError: (error) => {
      console.error('Error updating application:', error);
      toast.error('Failed to update application. Please try again.');
    },
  });
};

export const useUserApplications = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, userId],
    queryFn: () => applicationsApi.getUserApplications(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

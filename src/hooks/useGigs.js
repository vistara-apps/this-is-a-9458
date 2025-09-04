import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gigsApi, applicationsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Query keys
const QUERY_KEYS = {
  GIGS: 'gigs',
  GIG: 'gig',
  USER_GIGS: 'userGigs',
  GIG_APPLICATIONS: 'gigApplications'
};

export const useGigs = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GIGS, filters],
    queryFn: () => gigsApi.getGigs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGig = (gigId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GIG, gigId],
    queryFn: () => gigsApi.getGig(gigId),
    enabled: !!gigId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserGigs = (userId, status = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_GIGS, userId, status],
    queryFn: () => gigsApi.getUserGigs(userId, status),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateGig = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: gigsApi.createGig,
    onSuccess: (data) => {
      // Invalidate and refetch gigs
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GIGS] });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.USER_GIGS, user?.id] 
      });
      
      toast.success('Gig created successfully!');
      return data;
    },
    onError: (error) => {
      console.error('Error creating gig:', error);
      toast.error('Failed to create gig. Please try again.');
    },
  });
};

export const useUpdateGig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gigId, updates }) => gigsApi.updateGig(gigId, updates),
    onSuccess: (data, variables) => {
      // Update the specific gig in cache
      queryClient.setQueryData([QUERY_KEYS.GIG, variables.gigId], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GIGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_GIGS] });
      
      toast.success('Gig updated successfully!');
      return data;
    },
    onError: (error) => {
      console.error('Error updating gig:', error);
      toast.error('Failed to update gig. Please try again.');
    },
  });
};

export const useApplyToGig = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: applicationsApi.createApplication,
    onSuccess: (data) => {
      // Invalidate gig details to show new application
      if (data.gig_id) {
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.GIG, data.gig_id] 
        });
      }
      
      // Invalidate user applications
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GIG_APPLICATIONS, user?.id] 
      });
      
      toast.success('Application submitted successfully!');
      return data;
    },
    onError: (error) => {
      console.error('Error applying to gig:', error);
      toast.error('Failed to submit application. Please try again.');
    },
  });
};

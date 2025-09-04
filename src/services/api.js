import { supabase, TABLES } from '../lib/supabase';

// Helper function to handle API responses
const handleResponse = (data, error) => {
  if (error) {
    console.error('API Error:', error);
    throw error;
  }
  return data;
};

// User API
export const userApi = {
  // Get user profile by ID
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single();
    
    return handleResponse(data, error);
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Search users by skills or location
  searchUsers: async (filters = {}) => {
    let query = supabase.from(TABLES.USERS).select('*');

    if (filters.skills && filters.skills.length > 0) {
      query = query.overlaps('skills', filters.skills);
    }

    if (filters.location) {
      query = query.ilike('location_text', `%${filters.location}%`);
    }

    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    const { data, error } = await query.limit(filters.limit || 20);
    return handleResponse(data, error);
  }
};

// Tasks API
export const tasksApi = {
  // Get all tasks with filters
  getTasks: async (filters = {}) => {
    let query = supabase
      .from(TABLES.TASKS)
      .select(`
        *,
        posted_by:posted_by_user_id(id, username, full_name, avatar_url, rating),
        assigned_to:assigned_to_user_id(id, username, full_name, avatar_url)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (filters.skills && filters.skills.length > 0) {
      query = query.overlaps('skills_required', filters.skills);
    }

    if (filters.location) {
      query = query.ilike('location_text', `%${filters.location}%`);
    }

    if (filters.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    if (filters.isPaid !== undefined) {
      query = query.eq('is_paid', filters.isPaid);
    }

    if (filters.minReward) {
      query = query.gte('reward', filters.minReward);
    }

    const { data, error } = await query.limit(filters.limit || 20);
    return handleResponse(data, error);
  },

  // Get task by ID
  getTask: async (taskId) => {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .select(`
        *,
        posted_by:posted_by_user_id(id, username, full_name, avatar_url, rating),
        assigned_to:assigned_to_user_id(id, username, full_name, avatar_url),
        applications(
          id,
          message,
          proposed_rate,
          status,
          created_at,
          applicant:applicant_id(id, username, full_name, avatar_url, rating)
        )
      `)
      .eq('id', taskId)
      .single();
    
    return handleResponse(data, error);
  },

  // Create new task
  createTask: async (taskData) => {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .insert([taskData])
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Update task
  updateTask: async (taskId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Delete task
  deleteTask: async (taskId) => {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .delete()
      .eq('id', taskId);
    
    return handleResponse(data, error);
  },

  // Get user's tasks
  getUserTasks: async (userId, status = null) => {
    let query = supabase
      .from(TABLES.TASKS)
      .select(`
        *,
        posted_by:posted_by_user_id(id, username, full_name, avatar_url, rating),
        assigned_to:assigned_to_user_id(id, username, full_name, avatar_url)
      `)
      .or(`posted_by_user_id.eq.${userId},assigned_to_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    return handleResponse(data, error);
  }
};

// Gigs API
export const gigsApi = {
  // Get all gigs with filters
  getGigs: async (filters = {}) => {
    let query = supabase
      .from(TABLES.GIGS)
      .select(`
        *,
        posted_by:posted_by_user_id(id, username, full_name, avatar_url, rating),
        assigned_to:assigned_to_user_id(id, username, full_name, avatar_url)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (filters.skills && filters.skills.length > 0) {
      query = query.overlaps('skills_required', filters.skills);
    }

    if (filters.location) {
      query = query.ilike('location_text', `%${filters.location}%`);
    }

    if (filters.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel);
    }

    if (filters.isRemote !== undefined) {
      query = query.eq('is_remote', filters.isRemote);
    }

    if (filters.minPayRate) {
      query = query.gte('pay_rate', filters.minPayRate);
    }

    const { data, error } = await query.limit(filters.limit || 20);
    return handleResponse(data, error);
  },

  // Get gig by ID
  getGig: async (gigId) => {
    const { data, error } = await supabase
      .from(TABLES.GIGS)
      .select(`
        *,
        posted_by:posted_by_user_id(id, username, full_name, avatar_url, rating),
        assigned_to:assigned_to_user_id(id, username, full_name, avatar_url),
        applications(
          id,
          message,
          proposed_rate,
          status,
          created_at,
          applicant:applicant_id(id, username, full_name, avatar_url, rating)
        )
      `)
      .eq('id', gigId)
      .single();
    
    return handleResponse(data, error);
  },

  // Create new gig
  createGig: async (gigData) => {
    const { data, error } = await supabase
      .from(TABLES.GIGS)
      .insert([gigData])
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Update gig
  updateGig: async (gigId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.GIGS)
      .update(updates)
      .eq('id', gigId)
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Get user's gigs
  getUserGigs: async (userId, status = null) => {
    let query = supabase
      .from(TABLES.GIGS)
      .select(`
        *,
        posted_by:posted_by_user_id(id, username, full_name, avatar_url, rating),
        assigned_to:assigned_to_user_id(id, username, full_name, avatar_url)
      `)
      .or(`posted_by_user_id.eq.${userId},assigned_to_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    return handleResponse(data, error);
  }
};

// Applications API
export const applicationsApi = {
  // Create application
  createApplication: async (applicationData) => {
    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .insert([applicationData])
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Update application status
  updateApplication: async (applicationId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .update(updates)
      .eq('id', applicationId)
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Get user's applications
  getUserApplications: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.APPLICATIONS)
      .select(`
        *,
        task:task_id(id, title, reward, status, location_text),
        gig:gig_id(id, title, pay_rate, status, location_text)
      `)
      .eq('applicant_id', userId)
      .order('created_at', { ascending: false });
    
    return handleResponse(data, error);
  }
};

// Skill Swaps API
export const skillSwapsApi = {
  // Get all skill swaps
  getSkillSwaps: async (filters = {}) => {
    let query = supabase
      .from(TABLES.SKILL_SWAPS)
      .select(`
        *,
        posted_by:posted_by_user_id(id, username, full_name, avatar_url, rating),
        matched_with:matched_with_user_id(id, username, full_name, avatar_url)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (filters.offeredSkill) {
      query = query.ilike('offered_skill', `%${filters.offeredSkill}%`);
    }

    if (filters.requestedSkill) {
      query = query.ilike('requested_skill', `%${filters.requestedSkill}%`);
    }

    if (filters.location) {
      query = query.ilike('location_text', `%${filters.location}%`);
    }

    if (filters.isRemote !== undefined) {
      query = query.eq('is_remote', filters.isRemote);
    }

    const { data, error } = await query.limit(filters.limit || 20);
    return handleResponse(data, error);
  },

  // Create skill swap
  createSkillSwap: async (skillSwapData) => {
    const { data, error } = await supabase
      .from(TABLES.SKILL_SWAPS)
      .insert([skillSwapData])
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Update skill swap
  updateSkillSwap: async (skillSwapId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.SKILL_SWAPS)
      .update(updates)
      .eq('id', skillSwapId)
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Get user's skill swaps
  getUserSkillSwaps: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.SKILL_SWAPS)
      .select(`
        *,
        posted_by:posted_by_user_id(id, username, full_name, avatar_url, rating),
        matched_with:matched_with_user_id(id, username, full_name, avatar_url)
      `)
      .or(`posted_by_user_id.eq.${userId},matched_with_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    return handleResponse(data, error);
  }
};

// Connections API
export const connectionsApi = {
  // Get user connections
  getConnections: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.CONNECTIONS)
      .select(`
        *,
        user1:user1_id(id, username, full_name, avatar_url, rating),
        user2:user2_id(id, username, full_name, avatar_url, rating)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    
    return handleResponse(data, error);
  },

  // Create connection request
  createConnection: async (connectionData) => {
    const { data, error } = await supabase
      .from(TABLES.CONNECTIONS)
      .insert([connectionData])
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Update connection status
  updateConnection: async (connectionId, status) => {
    const { data, error } = await supabase
      .from(TABLES.CONNECTIONS)
      .update({ status })
      .eq('id', connectionId)
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Get pending connection requests
  getPendingRequests: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.CONNECTIONS)
      .select(`
        *,
        user1:user1_id(id, username, full_name, avatar_url, rating)
      `)
      .eq('user2_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    return handleResponse(data, error);
  }
};

// Messages API
export const messagesApi = {
  // Get conversation between two users
  getConversation: async (userId1, userId2) => {
    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .select(`
        *,
        sender:sender_id(id, username, full_name, avatar_url)
      `)
      .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
      .order('created_at', { ascending: true });
    
    return handleResponse(data, error);
  },

  // Send message
  sendMessage: async (messageData) => {
    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .insert([messageData])
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Mark messages as read
  markAsRead: async (messageIds) => {
    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .update({ is_read: true })
      .in('id', messageIds);
    
    return handleResponse(data, error);
  },

  // Get user's conversations
  getConversations: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.MESSAGES)
      .select(`
        *,
        sender:sender_id(id, username, full_name, avatar_url),
        recipient:recipient_id(id, username, full_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    return handleResponse(data, error);
  }
};

// Reviews API
export const reviewsApi = {
  // Create review
  createReview: async (reviewData) => {
    const { data, error } = await supabase
      .from(TABLES.REVIEWS)
      .insert([reviewData])
      .select()
      .single();
    
    return handleResponse(data, error);
  },

  // Get user reviews
  getUserReviews: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.REVIEWS)
      .select(`
        *,
        reviewer:reviewer_id(id, username, full_name, avatar_url),
        task:task_id(id, title),
        gig:gig_id(id, title),
        skill_swap:skill_swap_id(id, title)
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });
    
    return handleResponse(data, error);
  }
};

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Eye, EyeOff, Mail, Lock, User, MapPin, Tag } from 'lucide-react';

const COMMON_SKILLS = [
  'Web Development', 'Graphic Design', 'Writing', 'Photography', 'Marketing',
  'Data Analysis', 'Teaching', 'Translation', 'Video Editing', 'Consulting',
  'Social Media', 'Project Management', 'Accounting', 'Customer Service', 'Sales'
];

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const { signIn, signUp, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setSelectedSkills([]);
    reset();
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        await signIn(data.email, data.password);
      } else {
        const userData = {
          username: data.username,
          full_name: data.fullName,
          location: data.location,
          skills: selectedSkills
        };
        await signUp(data.email, data.password, userData);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              LocalGigs
            </motion.h1>
            <p className="text-gray-600">
              {isLogin ? 'Welcome back!' : 'Join the community'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <Input
                    icon={User}
                    placeholder="Username"
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters'
                      }
                    })}
                    error={errors.username?.message}
                  />
                </div>

                <div>
                  <Input
                    icon={User}
                    placeholder="Full Name"
                    {...register('fullName', {
                      required: 'Full name is required'
                    })}
                    error={errors.fullName?.message}
                  />
                </div>

                <div>
                  <Input
                    icon={MapPin}
                    placeholder="Location (e.g., San Francisco, CA)"
                    {...register('location', {
                      required: 'Location is required'
                    })}
                    error={errors.location?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline w-4 h-4 mr-1" />
                    Skills (select up to 5)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {COMMON_SKILLS.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        disabled={!selectedSkills.includes(skill) && selectedSkills.length >= 5}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedSkills.includes(skill)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        } ${
                          !selectedSkills.includes(skill) && selectedSkills.length >= 5
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  {selectedSkills.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedSkills.length}/5 skills selected
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            <div>
              <Input
                type="email"
                icon={Mail}
                placeholder="Email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleAuthMode}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button className="text-gray-500 hover:text-gray-700 text-sm">
                Forgot your password?
              </button>
            </div>
          )}
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p>Connect, Collaborate, and Earn Locally</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tag } from './ui/Tag';
import { Avatar } from './ui/Avatar';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter,
  Search,
  Star,
  Heart
} from 'lucide-react';

const mockTasks = [
  {
    id: 1,
    title: "Help Moving Furniture",
    description: "Need help moving a couch and dining table to new apartment. Should take 2-3 hours.",
    location: "Downtown, 0.5 miles away",
    reward: "$50",
    urgency: "High",
    skills: ["Physical", "Moving"],
    timeAgo: "30 minutes ago",
    poster: { name: "Jennifer Walsh", rating: 4.8 },
    isPaid: true,
    premium: false
  },
  {
    id: 2,
    title: "Logo Design for Coffee Shop",
    description: "Looking for a creative logo design for my new coffee shop. Modern, minimalist style preferred.",
    location: "Midtown, 1.2 miles away",
    reward: "$200",
    urgency: "Medium",
    skills: ["Design", "Illustration"],
    timeAgo: "2 hours ago",
    poster: { name: "Mark Stevens", rating: 4.9 },
    isPaid: true,
    premium: true
  },
  {
    id: 3,
    title: "Dog Walking - Weekends",
    description: "Regular weekend dog walking for friendly Golden Retriever. 1 hour walks, twice daily.",
    location: "West Side, 0.8 miles away",
    reward: "$30/day",
    urgency: "Low",
    skills: ["Pet Care", "Reliable"],
    timeAgo: "1 day ago",
    poster: { name: "Lisa Chen", rating: 5.0 },
    isPaid: true,
    premium: false
  },
  {
    id: 4,
    title: "Learn Guitar - Skill Exchange",
    description: "I can teach programming/web development in exchange for guitar lessons. Beginner level.",
    location: "East End, 2.1 miles away",
    reward: "Skill Trade",
    urgency: "Low",
    skills: ["Music", "Teaching"],
    timeAgo: "3 days ago",
    poster: { name: "Alex Rivera", rating: 4.6 },
    isPaid: false,
    premium: false
  }
];

export function TaskFeed() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPremium, setShowPremium] = useState({});
  const { createSession } = usePaymentContext();

  const handlePremiumAccess = async (taskId) => {
    try {
      await createSession("$0.005");
      setShowPremium(prev => ({ ...prev, [taskId]: true }));
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-heading font-bold">Local Task Feed</h1>
          <p className="text-caption text-gray-600">Find immediate opportunities in your area</p>
        </div>
        <Button>
          Post New Task
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} variant="outlined" className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
                    {task.premium && !showPremium[task.id] && (
                      <Tag variant="primary" size="sm">Premium</Tag>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-caption text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {task.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {task.timeAgo}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag variant={task.urgency === 'High' ? 'primary' : task.urgency === 'Medium' ? 'secondary' : 'skill'}>
                    {task.urgency}
                  </Tag>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700">
                {task.premium && !showPremium[task.id] 
                  ? "This is a premium task. Connect your wallet and pay a small fee to view full details and apply." 
                  : task.description
                }
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {task.skills.map((skill) => (
                  <Tag key={skill} variant="skill" size="sm">
                    {skill}
                  </Tag>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral/20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" alt={task.poster.name} />
                    <div>
                      <p className="font-medium text-sm">{task.poster.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{task.poster.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-accent">
                    {task.isPaid && <DollarSign className="w-4 h-4" />}
                    {task.reward}
                  </div>
                </div>

                <div className="flex gap-2">
                  {task.premium && !showPremium[task.id] ? (
                    <Button onClick={() => handlePremiumAccess(task.id)}>
                      Unlock Details
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline">
                        Message
                      </Button>
                      <Button>
                        Apply Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
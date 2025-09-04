import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Tag } from './ui/Tag';
import { Avatar } from './ui/Avatar';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  TrendingUp,
  Users,
  Briefcase,
  RefreshCw
} from 'lucide-react';

const stats = [
  { name: 'Active Tasks', value: '12', icon: Briefcase, change: '+2', trend: 'up' },
  { name: 'Completed Gigs', value: '24', icon: TrendingUp, change: '+5', trend: 'up' },
  { name: 'Skill Swaps', value: '8', icon: RefreshCw, change: '+1', trend: 'up' },
  { name: 'Connections', value: '156', icon: Users, change: '+12', trend: 'up' },
];

const recentTasks = [
  {
    id: 1,
    title: "Web Design for Local Bakery",
    location: "Downtown",
    reward: "$150",
    urgency: "High",
    skills: ["Design", "HTML/CSS"],
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    title: "Photography for Wedding",
    location: "Riverside Park",
    reward: "$300",
    urgency: "Medium",
    skills: ["Photography", "Editing"],
    timeAgo: "4 hours ago"
  },
  {
    id: 3,
    title: "Tutoring Math - High School",
    location: "Central Library",
    reward: "$25/hr",
    urgency: "Low",
    skills: ["Math", "Teaching"],
    timeAgo: "1 day ago"
  }
];

const activeConnections = [
  { name: "Sarah Chen", skill: "Graphic Design", rating: 4.9, avatar: null },
  { name: "Mike Rodriguez", skill: "Web Development", rating: 4.8, avatar: null },
  { name: "Emma Thompson", skill: "Photography", rating: 5.0, avatar: null },
  { name: "David Kim", skill: "Marketing", rating: 4.7, avatar: null },
];

export function Dashboard() {
  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back to LocalGigs!</h1>
        <p className="text-primary-100">You have 3 new task opportunities and 2 skill swap requests.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-caption text-accent">
                  {stat.change} this week
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading font-semibold">Recent Tasks</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="border border-neutral/20 rounded-lg p-4 hover:bg-surface/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <Tag variant={task.urgency === 'High' ? 'primary' : task.urgency === 'Medium' ? 'secondary' : 'skill'}>
                      {task.urgency}
                    </Tag>
                  </div>
                  <div className="flex items-center gap-4 text-caption text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {task.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {task.reward}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {task.timeAgo}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.skills.map((skill) => (
                      <Tag key={skill} variant="skill" size="sm">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Active Connections */}
        <div>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading font-semibold">Active Connections</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {activeConnections.map((connection, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface/50 transition-colors">
                  <Avatar size="sm" alt={connection.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{connection.name}</p>
                    <p className="text-caption text-gray-600 truncate">{connection.skill}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-caption font-medium">{connection.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tag } from './ui/Tag';
import { Avatar } from './ui/Avatar';
import { 
  Users, 
  MessageSquare, 
  Search,
  Star,
  UserPlus,
  Hash,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';

const mockCommunities = [
  {
    id: 1,
    name: "Web Developers",
    members: 1247,
    description: "Connect with local web developers, share projects, and collaborate on code.",
    tags: ["JavaScript", "React", "Node.js", "Frontend"],
    activity: "Very Active",
    recentPost: "Looking for feedback on my portfolio site",
    postTime: "2 hours ago",
    isJoined: true
  },
  {
    id: 2,
    name: "Creative Freelancers",
    members: 892,
    description: "A community for designers, artists, and creative professionals in the area.",
    tags: ["Design", "Art", "Freelancing", "Branding"],
    activity: "Active",
    recentPost: "Client communication tips for new freelancers",
    postTime: "5 hours ago",
    isJoined: false
  },
  {
    id: 3,
    name: "Local Entrepreneurs",
    members: 634,
    description: "Network with startup founders and business owners. Share experiences and opportunities.",
    tags: ["Startup", "Business", "Networking", "Innovation"],
    activity: "Moderate",
    recentPost: "Monthly meetup location suggestions?",
    postTime: "1 day ago",
    isJoined: true
  },
  {
    id: 4,
    name: "Skill Mentors",
    members: 456,
    description: "Experienced professionals offering mentorship and guidance to newcomers.",
    tags: ["Mentoring", "Career", "Learning", "Growth"],
    activity: "Active",
    recentPost: "New mentorship matching system launched!",
    postTime: "3 days ago",
    isJoined: false
  }
];

const mockMentors = [
  {
    id: 1,
    name: "Jennifer Walsh",
    title: "Senior UX Designer",
    company: "Tech Corp",
    expertise: ["UX Design", "Product Strategy", "User Research"],
    rating: 4.9,
    sessions: 23,
    responseTime: "Within 2 hours",
    price: "$50/hour",
    bio: "10+ years designing user experiences for Fortune 500 companies. Passionate about mentoring the next generation of designers."
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    expertise: ["React", "Node.js", "System Design", "Career Growth"],
    rating: 4.8,
    sessions: 31,
    responseTime: "Within 1 hour",
    price: "$40/hour",
    bio: "Former Google engineer, now leading tech at a fast-growing startup. Love helping developers level up their skills."
  },
  {
    id: 3,
    name: "Sarah Rodriguez",
    title: "Marketing Director",
    company: "Digital Agency",
    expertise: ["Digital Marketing", "Brand Strategy", "Content Creation"],
    rating: 5.0,
    sessions: 18,
    responseTime: "Within 4 hours",
    price: "$35/hour",
    bio: "Built multiple successful marketing campaigns. Excited to share proven strategies with aspiring marketers."
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Local Web Developers Meetup",
    date: "Jan 15, 2024",
    time: "6:00 PM",
    location: "Downtown Co-working Space",
    attendees: 34,
    organizer: "Web Developers Community"
  },
  {
    id: 2,
    title: "Freelancer Networking Night",
    date: "Jan 20, 2024",
    time: "7:00 PM",
    location: "Creative Hub",
    attendees: 22,
    organizer: "Creative Freelancers"
  }
];

export function Community() {
  const [activeTab, setActiveTab] = useState('communities');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'communities', name: 'Communities', icon: Users },
    { id: 'mentors', name: 'Mentors', icon: Star },
    { id: 'events', name: 'Events', icon: Calendar },
  ];

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-heading font-bold">Community Networking</h1>
          <p className="text-caption text-gray-600">Connect with peers, mentors, and local professionals</p>
        </div>
        <Button>
          Create Community
        </Button>
      </div>

      {/* Tab Navigation */}
      <Card className="p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Communities Tab */}
      {activeTab === 'communities' && (
        <div className="space-y-4">
          {mockCommunities.map((community) => (
            <Card key={community.id} variant="outlined" className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{community.name}</h3>
                    <Tag variant={community.activity === 'Very Active' ? 'primary' : community.activity === 'Active' ? 'skill' : 'secondary'} size="sm">
                      {community.activity}
                    </Tag>
                  </div>
                  <p className="text-gray-700 mb-3">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {community.tags.map((tag) => (
                      <Tag key={tag} variant="secondary" size="sm">
                        <Hash className="w-3 h-3 mr-1" />
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-caption text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {community.members} members
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {community.recentPost}
                    </div>
                    <span>{community.postTime}</span>
                  </div>
                </div>
                <Button variant={community.isJoined ? "outline" : "primary"}>
                  {community.isJoined ? "Joined" : "Join"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Mentors Tab */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          {mockMentors.map((mentor) => (
            <Card key={mentor.id} variant="outlined" className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex items-start gap-4">
                  <Avatar size="lg" alt={mentor.name} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <p className="text-primary font-medium">{mentor.title}</p>
                    <p className="text-caption text-gray-600 mb-2">{mentor.company}</p>
                    <div className="flex items-center gap-4 text-caption text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{mentor.rating}</span>
                      </div>
                      <span>{mentor.sessions} sessions</span>
                      <span>{mentor.responseTime}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{mentor.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill) => (
                        <Tag key={skill} variant="skill" size="sm">
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 lg:w-48">
                  <div className="text-right">
                    <p className="font-bold text-lg text-accent">{mentor.price}</p>
                    <p className="text-caption text-gray-600">per session</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Button>
                      Book Session
                    </Button>
                    <Button variant="outline">
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} variant="outlined" className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-caption text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.attendees} attending
                    </div>
                  </div>
                  <p className="text-caption text-gray-600">Organized by {event.organizer}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Share
                  </Button>
                  <Button>
                    Join Event
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
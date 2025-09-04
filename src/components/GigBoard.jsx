import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tag } from './ui/Tag';
import { Avatar } from './ui/Avatar';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter,
  Search,
  Star,
  Briefcase,
  Calendar
} from 'lucide-react';

const mockGigs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechStart Inc.",
    description: "Looking for an experienced React developer to help build our MVP. Remote-friendly with occasional in-person meetings.",
    location: "Downtown Tech Hub",
    payRate: "$75/hr",
    duration: "3-6 months",
    skillsRequired: ["React", "TypeScript", "Node.js", "AWS"],
    experienceLevel: "Senior",
    applicants: 12,
    deadline: "Jan 15, 2024",
    poster: { name: "Sarah Johnson", title: "CTO", rating: 4.9 },
    isUrgent: true
  },
  {
    id: 2,
    title: "Freelance Graphic Designer",
    company: "Creative Agency Co.",
    description: "Multiple ongoing projects for brand identity, marketing materials, and web graphics. Portfolio review required.",
    location: "Creative District",
    payRate: "$50/hr",
    duration: "Ongoing",
    skillsRequired: ["Adobe Creative Suite", "Branding", "Web Design"],
    experienceLevel: "Mid-level",
    applicants: 8,
    deadline: "Jan 20, 2024",
    poster: { name: "Mike Chen", title: "Creative Director", rating: 4.7 },
    isUrgent: false
  },
  {
    id: 3,
    title: "Content Writer & SEO Specialist",
    company: "Digital Marketing Pro",
    description: "Create compelling content for blogs, social media, and website copy. SEO optimization skills essential.",
    location: "Remote",
    payRate: "$40/hr",
    duration: "6+ months",
    skillsRequired: ["Content Writing", "SEO", "WordPress", "Analytics"],
    experienceLevel: "Mid-level",
    applicants: 15,
    deadline: "Jan 12, 2024",
    poster: { name: "Emma Rodriguez", title: "Marketing Manager", rating: 5.0 },
    isUrgent: true
  },
  {
    id: 4,
    title: "Mobile App Developer",
    company: "FinTech Startup",
    description: "Native iOS and Android app development for financial services platform. Equity options available.",
    location: "Financial District",
    payRate: "$80/hr + equity",
    duration: "12+ months",
    skillsRequired: ["React Native", "Swift", "Kotlin", "API Integration"],
    experienceLevel: "Senior",
    applicants: 6,
    deadline: "Jan 25, 2024",
    poster: { name: "David Park", title: "Founder", rating: 4.8 },
    isUrgent: false
  }
];

export function GigBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  const filteredGigs = mockGigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExperience = !selectedExperience || gig.experienceLevel === selectedExperience;
    return matchesSearch && matchesExperience;
  });

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-heading font-bold">Skill-Based Gig Board</h1>
          <p className="text-caption text-gray-600">Discover paid opportunities matching your expertise</p>
        </div>
        <Button>
          Post New Gig
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search skills or job titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            variant="select"
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
          >
            <option value="">All Experience Levels</option>
            <option value="Entry-level">Entry-level</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
          </Input>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Gig List */}
      <div className="space-y-6">
        {filteredGigs.map((gig) => (
          <Card key={gig.id} variant="outlined" className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-xl text-gray-900">{gig.title}</h3>
                    {gig.isUrgent && (
                      <Tag variant="primary" size="sm">Urgent</Tag>
                    )}
                  </div>
                  <p className="font-medium text-primary mb-2">{gig.company}</p>
                  <div className="flex flex-wrap items-center gap-4 text-caption text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {gig.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {gig.experienceLevel}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {gig.duration}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 font-bold text-lg text-accent mb-1">
                    <DollarSign className="w-5 h-5" />
                    {gig.payRate}
                  </div>
                  <p className="text-caption text-gray-600">{gig.applicants} applicants</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{gig.description}</p>

              {/* Required Skills */}
              <div>
                <p className="font-medium text-sm text-gray-900 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {gig.skillsRequired.map((skill) => (
                    <Tag key={skill} variant="skill" size="sm">
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral/20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" alt={gig.poster.name} />
                    <div>
                      <p className="font-medium text-sm">{gig.poster.name}</p>
                      <p className="text-xs text-gray-600">{gig.poster.title}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{gig.poster.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Deadline: {gig.deadline}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">
                    Save Gig
                  </Button>
                  <Button>
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
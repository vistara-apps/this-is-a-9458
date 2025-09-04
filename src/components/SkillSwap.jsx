import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Tag } from './ui/Tag';
import { Avatar } from './ui/Avatar';
import { 
  RefreshCw, 
  Search, 
  Star,
  MessageSquare,
  ArrowRightLeft,
  Plus
} from 'lucide-react';

const mockSwapOffers = [
  {
    id: 1,
    user: { name: "Alex Chen", rating: 4.8, avatar: null },
    offering: ["Web Development", "JavaScript", "React"],
    seeking: ["Graphic Design", "UI/UX", "Figma"],
    description: "Experienced full-stack developer looking to improve design skills. Can help with modern web apps in exchange for design mentorship.",
    availability: "Weekends",
    responseTime: "Usually responds within 2 hours",
    completedSwaps: 12
  },
  {
    id: 2,
    user: { name: "Maria Rodriguez", rating: 5.0, avatar: null },
    offering: ["Spanish Tutoring", "Translation", "Content Writing"],
    seeking: ["Photography", "Photo Editing", "Lightroom"],
    description: "Native Spanish speaker and professional translator. Would love to learn photography for travel content creation.",
    availability: "Evenings",
    responseTime: "Usually responds within 1 hour",
    completedSwaps: 8
  },
  {
    id: 3,
    user: { name: "David Park", rating: 4.7, avatar: null },
    offering: ["Digital Marketing", "SEO", "Google Ads"],
    seeking: ["Video Editing", "After Effects", "Motion Graphics"],
    description: "Marketing professional wanting to add video skills to my toolkit. Can help grow your online presence in return.",
    availability: "Flexible",
    responseTime: "Usually responds within 3 hours",
    completedSwaps: 15
  },
  {
    id: 4,
    user: { name: "Sarah Kim", rating: 4.9, avatar: null },
    offering: ["Piano Lessons", "Music Theory", "Composition"],
    seeking: ["Coding", "Python", "Data Analysis"],
    description: "Professional musician looking to transition into tech. Happy to teach music fundamentals in exchange for programming basics.",
    availability: "Mornings",
    responseTime: "Usually responds within 4 hours",
    completedSwaps: 6
  }
];

const mySkills = ["Web Development", "JavaScript", "React", "Node.js", "Photography"];
const wantedSkills = ["Graphic Design", "Spanish", "Piano", "Video Editing"];

export function SkillSwap() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyOffers, setShowMyOffers] = useState(false);

  const filteredOffers = mockSwapOffers.filter(offer => {
    const matchesSearch = 
      offer.offering.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      offer.seeking.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      offer.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-heading font-bold">Collaborative Skill Swapping</h1>
          <p className="text-caption text-gray-600">Trade knowledge and learn from your community</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Swap Offer
        </Button>
      </div>

      {/* My Skills Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            Skills I Can Offer
          </h3>
          <div className="flex flex-wrap gap-2">
            {mySkills.map((skill) => (
              <Tag key={skill} variant="primary" size="sm">
                {skill}
              </Tag>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-2">
            Edit Skills
          </Button>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-accent" />
            Skills I Want to Learn
          </h3>
          <div className="flex flex-wrap gap-2">
            {wantedSkills.map((skill) => (
              <Tag key={skill} variant="skill" size="sm">
                {skill}
              </Tag>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-2">
            Edit Interests
          </Button>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by skills or user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={showMyOffers ? "primary" : "outline"}
              onClick={() => setShowMyOffers(!showMyOffers)}
              size="sm"
            >
              My Offers
            </Button>
            <Button variant="outline" size="sm">
              Matches
            </Button>
          </div>
        </div>
      </Card>

      {/* Swap Offers */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} variant="outlined" className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* User Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar size="md" alt={offer.user.name} />
                  <div>
                    <h3 className="font-semibold text-lg">{offer.user.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{offer.user.rating}</span>
                      </div>
                      <span className="text-caption text-gray-600">•</span>
                      <span className="text-caption text-gray-600">{offer.completedSwaps} swaps completed</span>
                    </div>
                    <p className="text-caption text-gray-600">{offer.responseTime}</p>
                  </div>
                </div>
                <Tag variant="secondary" size="sm">
                  {offer.availability}
                </Tag>
              </div>

              {/* Description */}
              <p className="text-gray-700">{offer.description}</p>

              {/* Skills Exchange */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm text-gray-900 mb-2">Offering:</p>
                  <div className="flex flex-wrap gap-2">
                    {offer.offering.map((skill) => (
                      <Tag key={skill} variant="primary" size="sm">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 mb-2">Seeking:</p>
                  <div className="flex flex-wrap gap-2">
                    {offer.seeking.map((skill) => (
                      <Tag key={skill} variant="skill" size="sm">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral/20">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Perfect Match!</span>
                  <span className="text-caption text-gray-600">You both have complementary skills</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Button>
                  <Button>
                    Propose Swap
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
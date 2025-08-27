'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Heart, Share2, Sparkles, Target, Calendar, MapPin, UserPlus, Award, TrendingUp } from 'lucide-react';

const studyGroups = [
  {
    name: 'Wisdom Seekers',
    description: 'Deep discussions on philosophy and knowledge',
    members: 47,
    activeDiscussions: 12,
    nextMeeting: 'Tomorrow, 7:00 PM',
    focus: 'Wisdom',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Courage Circle',
    description: 'Supporting each other through challenges',
    members: 32,
    activeDiscussions: 8,
    nextMeeting: 'Friday, 6:30 PM',
    focus: 'Courage',
    color: 'from-red-500 to-orange-600'
  },
  {
    name: 'Justice Advocates',
    description: 'Working together for fairness and community',
    members: 28,
    activeDiscussions: 15,
    nextMeeting: 'Sunday, 2:00 PM',
    focus: 'Justice',
    color: 'from-green-500 to-emerald-600'
  },
  {
    name: 'Temperance Tribe',
    description: 'Cultivating balance and self-control',
    members: 41,
    activeDiscussions: 6,
    nextMeeting: 'Wednesday, 8:00 PM',
    focus: 'Temperance',
    color: 'from-purple-500 to-pink-600'
  }
];

const recentDiscussions = [
  {
    title: 'How do you apply Aristotle\'s teachings in modern work?',
    author: 'Sarah M.',
    replies: 23,
    views: 156,
    time: '2 hours ago',
    tags: ['Wisdom', 'Practical']
  },
  {
    title: 'Facing fear: My experience with courage practices',
    author: 'Michael R.',
    replies: 18,
    views: 89,
    time: '4 hours ago',
    tags: ['Courage', 'Personal']
  },
  {
    title: 'Building better relationships through justice',
    author: 'Emma L.',
    replies: 31,
    views: 203,
    time: '6 hours ago',
    tags: ['Justice', 'Relationships']
  },
  {
    title: 'Finding balance in a busy world',
    author: 'David K.',
    replies: 27,
    views: 134,
    time: '1 day ago',
    tags: ['Temperance', 'Balance']
  }
];

const upcomingEvents = [
  {
    title: 'Monthly Philosophy Meetup',
    date: 'Jan 30, 2024',
    time: '7:00 PM',
    location: 'Virtual',
    attendees: 45,
    type: 'Discussion'
  },
  {
    title: 'Virtue Practice Workshop',
    date: 'Feb 5, 2024',
    time: '6:30 PM',
    location: 'Virtual',
    attendees: 28,
    type: 'Workshop'
  },
  {
    title: 'Community Service Day',
    date: 'Feb 12, 2024',
    time: '10:00 AM',
    location: 'Local Community Center',
    attendees: 15,
    type: 'Service'
  }
];

export default function CommunityPage() {
  const [selectedGroup, setSelectedGroup] = useState(studyGroups[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-violet-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Community
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with fellow seekers on the path to eudaimonia. Share wisdom, support each other, and grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Study Groups */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-600" />
                  Study Groups
                </CardTitle>
                <CardDescription>
                  Join a group focused on your preferred virtue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyGroups.map((group) => (
                    <Card
                      key={group.name}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedGroup.name === group.name
                          ? 'ring-2 ring-violet-500 bg-violet-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${group.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{group.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{group.members} members</span>
                              <span>•</span>
                              <span>{group.activeDiscussions} discussions</span>
                              <span>•</span>
                              <span className="text-violet-600">{group.focus}</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Next meeting: {group.nextMeeting}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join {selectedGroup.name}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Discussions */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-violet-600" />
                  Recent Discussions
                </CardTitle>
                <CardDescription>
                  Join the conversation with fellow community members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDiscussions.map((discussion) => (
                    <div key={discussion.title} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{discussion.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span>by {discussion.author}</span>
                            <span>{discussion.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {discussion.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{discussion.replies} replies</div>
                          <div>{discussion.views} views</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-600" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>
                  Join community events and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.title} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {event.date}
                            </span>
                            <span>{event.time}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                          <span className="inline-block px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">
                            {event.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{event.attendees}</div>
                          <div className="text-xs text-gray-500">attending</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                    <div className="text-2xl font-bold text-gray-900 mb-1">1,247</div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                    <div className="text-2xl font-bold text-gray-900 mb-1">89</div>
                    <div className="text-sm text-gray-600">Active Discussions</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                    <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
                    <div className="text-sm text-gray-600">Events This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Find Mentors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Volunteer
                </Button>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="glass-effect border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-violet-600" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Be Respectful</h4>
                      <p className="text-gray-600">Treat others with kindness and understanding</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Share Wisdom</h4>
                      <p className="text-gray-600">Contribute meaningful insights and experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Support Growth</h4>
                      <p className="text-gray-600">Encourage others on their virtue journey</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote */}
            <Card className="glass-effect border-0 shadow-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <blockquote className="text-lg italic mb-4">
                  "Man is by nature a social animal."
                </blockquote>
                <cite className="text-sm opacity-90">— Aristotle</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Eye,
  MessageCircle,
  Share2,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Filter,
  RotateCcw
} from 'lucide-react';
import { SwipeableCard, swipeActions } from '@/components/swipeable-card';
import { PullToRefresh, useRefresh } from '@/components/pull-to-refresh';
import { 
  shareContent, 
  triggerHapticFeedback, 
  showToast,
  copyToClipboard
} from '@/lib/mobile-services';
import { useNetworkStatus } from '@/components/mobile-provider';
import { ImpactStyle } from '@capacitor/haptics';
import { cn } from '@/lib/utils';

interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  mentions: number;
  verification: 'verified' | 'disputed' | 'pending' | 'unverified';
  location?: string;
  timeframe: string;
  sources: Array<{
    name: string;
    avatar?: string;
    verified: boolean;
  }>;
  tags: string[];
  lastUpdated: Date;
  engagement: {
    views: number;
    shares: number;
    discussions: number;
  };
}

interface MobileTrendingTopicsProps {
  className?: string;
  filter?: 'all' | 'verified' | 'disputed' | 'trending' | 'local';
  onTopicClick?: (topic: TrendingTopic) => void;
}

// Mock trending topics data
const mockTopics: TrendingTopic[] = [
  {
    id: '1',
    title: 'Climate Change Data Accuracy',
    description: 'New meteorological reports showing unprecedented temperature patterns across multiple regions.',
    category: 'Environment',
    trend: 'up',
    trendPercentage: 34,
    mentions: 15420,
    verification: 'verified',
    location: 'Global',
    timeframe: '24h',
    sources: [
      { name: 'NOAA', verified: true },
      { name: 'Met Office', verified: true },
      { name: 'Climate Central', verified: true }
    ],
    tags: ['climate', 'temperature', 'weather', 'science'],
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
    engagement: {
      views: 89340,
      shares: 2840,
      discussions: 1250
    }
  },
  {
    id: '2',
    title: 'Social Media Health Claims',
    description: 'Viral health supplement advertisements making unsubstantiated medical claims.',
    category: 'Health',
    trend: 'up',
    trendPercentage: 67,
    mentions: 8930,
    verification: 'disputed',
    timeframe: '12h',
    sources: [
      { name: 'Medical Review Board', verified: true },
      { name: 'Health Fact Check', verified: true }
    ],
    tags: ['health', 'supplements', 'misinformation', 'social-media'],
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000),
    engagement: {
      views: 45670,
      shares: 1890,
      discussions: 890
    }
  },
  {
    id: '3',
    title: 'Economic Policy Misinformation',
    description: 'False claims about government economic policies spreading across multiple platforms.',
    category: 'Politics',
    trend: 'down',
    trendPercentage: -12,
    mentions: 12450,
    verification: 'disputed',
    location: 'National',
    timeframe: '6h',
    sources: [
      { name: 'Economic Analysis Bureau', verified: true },
      { name: 'Policy Fact Check', verified: true }
    ],
    tags: ['politics', 'economy', 'policy', 'misinformation'],
    lastUpdated: new Date(Date.now() - 60 * 60 * 1000),
    engagement: {
      views: 67230,
      shares: 3450,
      discussions: 2340
    }
  },
  {
    id: '4',
    title: 'Technology Security Concerns',
    description: 'Reports about data breaches and privacy concerns with popular applications.',
    category: 'Technology',
    trend: 'stable',
    trendPercentage: 2,
    mentions: 6780,
    verification: 'pending',
    timeframe: '8h',
    sources: [
      { name: 'Security Research Lab', verified: true },
      { name: 'Privacy Foundation', verified: false }
    ],
    tags: ['technology', 'security', 'privacy', 'data'],
    lastUpdated: new Date(Date.now() - 90 * 60 * 1000),
    engagement: {
      views: 34560,
      shares: 1230,
      discussions: 670
    }
  }
];

export function MobileTrendingTopics({ 
  className,
  filter = 'all',
  onTopicClick 
}: MobileTrendingTopicsProps) {
  const [topics, setTopics] = useState<TrendingTopic[]>(mockTopics);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const { isOnline } = useNetworkStatus();

  const refreshTopics = async () => {
    setLoading(true);
    await triggerHapticFeedback(ImpactStyle.Light);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Shuffle and update trends
      const shuffled = [...mockTopics].map(topic => ({
        ...topic,
        mentions: topic.mentions + Math.floor(Math.random() * 100) - 50,
        trendPercentage: topic.trendPercentage + (Math.random() * 10 - 5),
        lastUpdated: new Date()
      })).sort(() => Math.random() - 0.5);
      
      setTopics(shuffled);
      
    } catch (error) {
      console.error('Failed to refresh topics:', error);
      await showToast('Failed to refresh topics');
    } finally {
      setLoading(false);
    }
  };

  const { refresh, isRefreshing } = useRefresh(refreshTopics);

  const filteredTopics = topics.filter(topic => {
    switch (filter) {
      case 'verified':
        return topic.verification === 'verified';
      case 'disputed':
        return topic.verification === 'disputed';
      case 'trending':
        return topic.trend === 'up' && topic.trendPercentage > 20;
      case 'local':
        return topic.location && topic.location !== 'Global';
      default:
        return true;
    }
  });

  const getTrendIcon = (trend: TrendingTopic['trend'], percentage: number) => {
    const size = "w-4 h-4";
    
    switch (trend) {
      case 'up':
        return <TrendingUp className={cn(size, "text-green-500")} />;
      case 'down':
        return <TrendingDown className={cn(size, "text-red-500")} />;
      default:
        return <Minus className={cn(size, "text-gray-500")} />;
    }
  };

  const getVerificationIcon = (verification: TrendingTopic['verification']) => {
    switch (verification) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disputed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleTopicAction = async (topic: TrendingTopic, actionId: string) => {
    await triggerHapticFeedback(ImpactStyle.Medium);

    switch (actionId) {
      case 'share':
        await shareContent(
          topic.title,
          topic.description,
          `https://veritas.app/topics/${topic.id}`
        );
        break;
      case 'view':
        if (onTopicClick) {
          onTopicClick(topic);
        }
        break;
      case 'bookmark':
        await showToast('Bookmarked topic');
        break;
      case 'more':
        await copyToClipboard(`https://veritas.app/topics/${topic.id}`);
        break;
      default:
        break;
    }
  };

  const handleTopicClick = async (topic: TrendingTopic) => {
    await triggerHapticFeedback(ImpactStyle.Light);
    if (onTopicClick) {
      onTopicClick(topic);
    }
  };

  return (
    <div className={cn("pb-safe-bottom", className)}>
      <PullToRefresh onRefresh={refresh} disabled={!isOnline}>
        <div className="space-y-4 p-4">
          {/* Header with Filters */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Trending Topics
              </h2>
              <p className="text-sm text-muted-foreground">
                {formatNumber(filteredTopics.length)} topics in last {selectedTimeframe}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={isRefreshing || !isOnline}
              className="tap-target"
            >
              <RotateCcw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
            </Button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['1h', '6h', '12h', '24h', '7d'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className="whitespace-nowrap tap-target"
              >
                {timeframe}
              </Button>
            ))}
          </div>

          {/* Offline Notice */}
          {!isOnline && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <p className="text-sm text-orange-700">
                  You're offline. Showing cached trending topics.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Topics List */}
          {filteredTopics.map((topic, index) => (
            <SwipeableCard
              key={topic.id}
              leftActions={[
                {
                  ...swipeActions.bookmark,
                  action: () => handleTopicAction(topic, 'bookmark')
                },
                {
                  ...swipeActions.share,
                  action: () => handleTopicAction(topic, 'share')
                }
              ]}
              rightActions={[
                {
                  ...swipeActions.view,
                  action: () => handleTopicAction(topic, 'view')
                },
                {
                  ...swipeActions.more,
                  action: () => handleTopicAction(topic, 'more')
                }
              ]}
            >
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTopicClick(topic)}
              >
                <CardHeader className="pb-3">
                  {/* Header with rank and trend */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {topic.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {getTrendIcon(topic.trend, topic.trendPercentage)}
                      <span className={cn(
                        "text-xs font-medium",
                        topic.trend === 'up' ? "text-green-500" :
                        topic.trend === 'down' ? "text-red-500" : "text-gray-500"
                      )}>
                        {topic.trendPercentage > 0 ? '+' : ''}{topic.trendPercentage.toFixed(1)}%
                      </span>
                      {getVerificationIcon(topic.verification)}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base leading-tight">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {/* Location and Time */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {topic.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{topic.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(topic.lastUpdated)}</span>
                    </div>
                  </div>

                  {/* Sources */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Sources:</span>
                    <div className="flex items-center gap-1">
                      {topic.sources.slice(0, 3).map((source, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={source.avatar} />
                            <AvatarFallback className="text-xs">
                              {source.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {source.verified && (
                            <CheckCircle className="w-2 h-2 text-blue-500" />
                          )}
                        </div>
                      ))}
                      {topic.sources.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{topic.sources.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {topic.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {topic.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {topic.tags.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{topic.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {formatNumber(topic.mentions)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(topic.engagement.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {formatNumber(topic.engagement.discussions)}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 tap-target"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTopicAction(topic, 'share');
                      }}
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SwipeableCard>
          ))}

          {/* Loading State */}
          {(loading || isRefreshing) && (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="animate-spin mx-auto w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-2" />
                <p className="text-sm text-muted-foreground">Loading trending topics...</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {filteredTopics.length === 0 && !loading && !isRefreshing && (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No trending topics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? "Pull down to refresh and check for new trending topics"
                    : `No ${filter} topics found for the selected timeframe`
                  }
                </p>
                <Button 
                  onClick={refresh} 
                  variant="outline" 
                  size="sm"
                  disabled={!isOnline}
                  className="tap-target"
                >
                  Refresh Topics
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </PullToRefresh>
    </div>
  );
}

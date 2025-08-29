"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Eye,
  Share2,
  Bookmark,
  MoreVertical,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { SwipeableCard, swipeActions } from '@/components/swipeable-card';
import { PullToRefresh, useRefresh } from '@/components/pull-to-refresh';
import { 
  shareContent, 
  triggerHapticFeedback, 
  showToast,
  copyToClipboard,
  openUrl
} from '@/lib/mobile-services';
import { useNetworkStatus } from '@/components/mobile-provider';
import { ImpactStyle } from '@capacitor/haptics';
import { cn } from '@/lib/utils';

interface VerificationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'verified' | 'disputed' | 'pending' | 'false';
  credibility: 'high' | 'medium' | 'low';
  source: string;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  timestamp: Date;
  location?: string;
  tags: string[];
  stats: {
    views: number;
    shares: number;
    verifications: number;
    disputes: number;
  };
  url?: string;
  thumbnail?: string;
  isBookmarked: boolean;
  isLiked: boolean;
  isTrending: boolean;
}

interface MobileVerificationFeedProps {
  className?: string;
  filter?: 'all' | 'verified' | 'disputed' | 'pending';
  onItemClick?: (item: VerificationItem) => void;
}

// Mock data
const mockVerifications: VerificationItem[] = [
  {
    id: '1',
    title: 'Climate Data Shows Record Temperature Increase',
    description: 'New meteorological data indicates the highest global temperature increase in recorded history for this month.',
    category: 'Climate Science',
    status: 'verified',
    credibility: 'high',
    source: 'NOAA Weather Service',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: '/placeholder-user.jpg',
      verified: true
    },
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    location: 'Global',
    tags: ['climate', 'temperature', 'weather'],
    stats: {
      views: 1247,
      shares: 89,
      verifications: 23,
      disputes: 2
    },
    url: 'https://weather.gov/climate-report',
    isBookmarked: false,
    isLiked: false,
    isTrending: true
  },
  {
    id: '2',
    title: 'Social Media Health Claim Analysis',
    description: 'Popular health supplement claims circulating on social media have been fact-checked against medical research.',
    category: 'Health & Medicine',
    status: 'disputed',
    credibility: 'medium',
    source: 'Medical Journal Review',
    author: {
      name: 'Health Fact Check Team',
      verified: true
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    tags: ['health', 'supplements', 'social-media'],
    stats: {
      views: 892,
      shares: 45,
      verifications: 12,
      disputes: 18
    },
    isBookmarked: true,
    isLiked: false,
    isTrending: false
  },
  {
    id: '3',
    title: 'Financial Market Manipulation Report',
    description: 'Investigation into alleged market manipulation tactics reveals coordinated efforts across multiple platforms.',
    category: 'Finance',
    status: 'pending',
    credibility: 'high',
    source: 'Financial Regulatory Authority',
    author: {
      name: 'FRA Investigation Team',
      verified: true
    },
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    tags: ['finance', 'markets', 'investigation'],
    stats: {
      views: 2341,
      shares: 156,
      verifications: 45,
      disputes: 8
    },
    isBookmarked: false,
    isLiked: true,
    isTrending: true
  }
];

export function MobileVerificationFeed({ 
  className,
  filter = 'all',
  onItemClick 
}: MobileVerificationFeedProps) {
  const [items, setItems] = useState<VerificationItem[]>(mockVerifications);
  const [loading, setLoading] = useState(false);
  const { isOnline } = useNetworkStatus();

  const refreshFeed = async () => {
    setLoading(true);
    await triggerHapticFeedback(ImpactStyle.Light);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would fetch new data here
      const shuffled = [...mockVerifications].sort(() => Math.random() - 0.5);
      setItems(shuffled);
      
    } catch (error) {
      console.error('Failed to refresh feed:', error);
      await showToast('Failed to refresh feed');
    } finally {
      setLoading(false);
    }
  };

  const { refresh, isRefreshing } = useRefresh(refreshFeed);

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusIcon = (status: VerificationItem['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disputed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'false':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCredibilityColor = (credibility: VerificationItem['credibility']) => {
    switch (credibility) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleItemAction = async (item: VerificationItem, actionId: string) => {
    await triggerHapticFeedback(ImpactStyle.Medium);

    switch (actionId) {
      case 'share':
        await shareContent(
          item.title,
          item.description,
          item.url
        );
        break;
      case 'bookmark':
        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, isBookmarked: !i.isBookmarked } : i
        ));
        await showToast(item.isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
        break;
      case 'like':
        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, isLiked: !i.isLiked } : i
        ));
        break;
      case 'view':
        if (onItemClick) {
          onItemClick(item);
        }
        break;
      default:
        break;
    }
  };

  const handleCardClick = async (item: VerificationItem) => {
    await triggerHapticFeedback(ImpactStyle.Light);
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleExternalLink = async (url?: string) => {
    if (url) {
      await openUrl(url);
    } else {
      await showToast('No source URL available');
    }
  };

  const copyItemLink = async (item: VerificationItem) => {
    const link = item.url || `https://veritas.app/verification/${item.id}`;
    await copyToClipboard(link);
  };

  return (
    <div className={cn("pb-safe-bottom", className)}>
      <PullToRefresh onRefresh={refresh} disabled={!isOnline}>
        <div className="space-y-4 p-4">
          {/* Offline Notice */}
          {!isOnline && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-4">
                <p className="text-sm text-orange-700">
                  You're offline. Showing cached content.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Feed Items */}
          {filteredItems.map((item) => (
            <SwipeableCard
              key={item.id}
              leftActions={[
                {
                  ...swipeActions.bookmark,
                  action: () => handleItemAction(item, 'bookmark'),
                  bgColor: item.isBookmarked ? 'bg-blue-600' : 'bg-blue-500'
                },
                {
                  ...swipeActions.share,
                  action: () => handleItemAction(item, 'share')
                }
              ]}
              rightActions={[
                {
                  ...swipeActions.view,
                  action: () => handleItemAction(item, 'view')
                },
                {
                  ...swipeActions.more,
                  action: () => copyItemLink(item)
                }
              ]}
              onSwipe={(direction, actionId) => {
                if (actionId) {
                  console.log(`Swiped ${direction} with action ${actionId} on item ${item.id}`);
                }
              }}
            >
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCardClick(item)}
              >
                <CardHeader className="pb-3">
                  {/* Header with author and status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={item.author.avatar} />
                        <AvatarFallback>
                          {item.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium truncate">
                            {item.author.name}
                          </p>
                          {item.author.verified && (
                            <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(item.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isTrending && (
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                      )}
                      {getStatusIcon(item.status)}
                    </div>
                  </div>

                  {/* Title and Category */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base leading-tight">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getCredibilityColor(item.credibility))}
                      >
                        {item.credibility} credibility
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Location */}
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.stats.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {item.stats.verifications}
                      </span>
                      <span className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {item.stats.disputes}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 tap-target"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExternalLink(item.url);
                          }}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-8 h-8 p-0 tap-target",
                          item.isBookmarked ? "text-blue-500" : ""
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemAction(item, 'bookmark');
                        }}
                      >
                        <Bookmark className={cn(
                          "w-3 h-3",
                          item.isBookmarked ? "fill-current" : ""
                        )} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 tap-target"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemAction(item, 'share');
                        }}
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
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
                <p className="text-sm text-muted-foreground">Loading new content...</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && !loading && !isRefreshing && (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No verifications found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? "Pull down to refresh and check for new content"
                    : `No ${filter} verifications available`
                  }
                </p>
                <Button 
                  onClick={refresh} 
                  variant="outline" 
                  size="sm"
                  disabled={!isOnline}
                  className="tap-target"
                >
                  Refresh Feed
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </PullToRefresh>
    </div>
  );
}

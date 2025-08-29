"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Upload, 
  Share2,
  FileText,
  Camera,
  Link as LinkIcon,
  MapPin,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { MobileCamera } from '@/components/mobile-camera';
import { 
  shareContent, 
  triggerHapticFeedback, 
  showToast,
  copyToClipboard,
  saveFile,
  getPreference,
  setPreference
} from '@/lib/mobile-services';
import { useMobile } from '@/components/mobile-provider';
import { ImpactStyle } from '@capacitor/haptics';

interface ReportData {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  location?: string;
  tags: string[];
  images: Array<{
    id: string;
    uri: string;
    timestamp: Date;
    source: 'camera' | 'gallery';
  }>;
  createdAt: Date;
  submittedAt?: Date;
  status: 'draft' | 'submitted' | 'verified' | 'disputed';
}

interface MobileVerificationReportProps {
  onSubmit?: (report: ReportData) => void;
  initialData?: Partial<ReportData>;
  mode?: 'create' | 'edit' | 'view';
}

const categories = [
  'Misinformation',
  'Fake News',
  'Doctored Media',
  'Impersonation',
  'Spam',
  'Conspiracy Theory',
  'Misleading Statistics',
  'Other'
];

const priorityConfig = {
  low: { label: 'Low', color: 'secondary' as const, icon: Clock },
  medium: { label: 'Medium', color: 'default' as const, icon: AlertTriangle },
  high: { label: 'High', color: 'destructive' as const, icon: AlertTriangle },
  critical: { label: 'Critical', color: 'destructive' as const, icon: AlertTriangle }
};

export function MobileVerificationReport({
  onSubmit,
  initialData,
  mode = 'create'
}: MobileVerificationReportProps) {
  const { isMobile } = useMobile();
  const [report, setReport] = useState<ReportData>({
    id: initialData?.id || `report_${Date.now()}`,
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    priority: initialData?.priority || 'medium',
    source: initialData?.source || '',
    location: initialData?.location || '',
    tags: initialData?.tags || [],
    images: initialData?.images || [],
    createdAt: initialData?.createdAt || new Date(),
    status: initialData?.status || 'draft'
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isReadOnly = mode === 'view';
  const canEdit = mode === 'create' || mode === 'edit';

  const updateReport = (updates: Partial<ReportData>) => {
    setReport(prev => ({ ...prev, ...updates }));
  };

  const addTag = async () => {
    if (currentTag.trim() && !report.tags.includes(currentTag.trim())) {
      const newTags = [...report.tags, currentTag.trim()];
      updateReport({ tags: newTags });
      setCurrentTag('');
      await triggerHapticFeedback(ImpactStyle.Light);
    }
  };

  const removeTag = async (tagToRemove: string) => {
    const newTags = report.tags.filter(tag => tag !== tagToRemove);
    updateReport({ tags: newTags });
    await triggerHapticFeedback(ImpactStyle.Light);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    await triggerHapticFeedback(ImpactStyle.Light);

    try {
      // Save to local storage
      await setPreference(`report_draft_${report.id}`, JSON.stringify(report));
      await showToast('Draft saved locally');
    } catch (error) {
      console.error('Failed to save draft:', error);
      await showToast('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const exportReport = async () => {
    try {
      const reportData = {
        ...report,
        exportedAt: new Date().toISOString()
      };
      
      const fileName = `veritas_report_${report.id}.json`;
      const success = await saveFile(fileName, JSON.stringify(reportData, null, 2));
      
      if (success) {
        await triggerHapticFeedback(ImpactStyle.Medium);
      }
    } catch (error) {
      console.error('Failed to export report:', error);
      await showToast('Failed to export report');
    }
  };

  const shareReport = async () => {
    try {
      const shareText = `Veritas Verification Report: ${report.title}\n\nCategory: ${report.category}\nPriority: ${report.priority}\n\n${report.description}`;
      
      await shareContent(
        'Verification Report',
        shareText,
        `https://veritas.app/reports/${report.id}`
      );
      
      await triggerHapticFeedback(ImpactStyle.Medium);
    } catch (error) {
      console.error('Failed to share report:', error);
      await showToast('Failed to share report');
    }
  };

  const submitReport = async () => {
    if (!report.title.trim() || !report.description.trim() || !report.category) {
      await showToast('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await triggerHapticFeedback(ImpactStyle.Medium);

    try {
      const submittedReport = {
        ...report,
        submittedAt: new Date(),
        status: 'submitted' as const
      };

      updateReport(submittedReport);
      
      if (onSubmit) {
        onSubmit(submittedReport);
      }

      await showToast('Report submitted successfully');
      await triggerHapticFeedback(ImpactStyle.Heavy);
    } catch (error) {
      console.error('Failed to submit report:', error);
      await showToast('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReportId = async () => {
    await copyToClipboard(report.id);
  };

  return (
    <div className="space-y-6 pb-safe-bottom">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">
                {mode === 'create' ? 'New Verification Report' : 'Verification Report'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  onClick={copyReportId}
                >
                  ID: {report.id.slice(-8)}
                </Badge>
                <Badge variant={priorityConfig[report.priority].color}>
                  {priorityConfig[report.priority].label}
                </Badge>
              </div>
            </div>
            
            {!isReadOnly && (
              <div className="flex gap-2">
                <Button
                  onClick={saveDraft}
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  className="tap-target"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={report.title}
              onChange={(e) => updateReport({ title: e.target.value })}
              placeholder="Brief title describing the issue"
              disabled={isReadOnly}
              className="tap-target"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={report.description}
              onChange={(e) => updateReport({ description: e.target.value })}
              placeholder="Detailed description of the misinformation or issue"
              rows={4}
              disabled={isReadOnly}
              className="tap-target resize-none"
            />
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={report.category}
                onValueChange={(value) => updateReport({ category: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger className="tap-target">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={report.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                  updateReport({ priority: value })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger className="tap-target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-3 h-3" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source URL or Reference</Label>
            <Input
              id="source"
              value={report.source}
              onChange={(e) => updateReport({ source: e.target.value })}
              placeholder="https://example.com/article or @username"
              disabled={isReadOnly}
              className="tap-target"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={report.location || ''}
              onChange={(e) => updateReport({ location: e.target.value })}
              placeholder="City, Country or specific location"
              disabled={isReadOnly}
              className="tap-target"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isReadOnly && (
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
                className="flex-1 tap-target"
              />
              <Button onClick={addTag} size="sm" className="tap-target">
                Add
              </Button>
            </div>
          )}

          {report.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {report.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`text-xs ${!isReadOnly ? 'cursor-pointer hover:bg-destructive/10' : ''}`}
                  onClick={!isReadOnly ? () => removeTag(tag) : undefined}
                >
                  {tag}
                  {!isReadOnly && <span className="ml-1">×</span>}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evidence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Evidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          {canEdit ? (
            <MobileCamera
              onImagesSelected={(images) => updateReport({ images })}
              maxImages={5}
              title="Evidence Collection"
              description="Capture or select images that support your verification report"
            />
          ) : (
            <div className="space-y-2">
              {report.images.length === 0 ? (
                <p className="text-muted-foreground text-sm">No evidence attached</p>
              ) : (
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                  {report.images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.uri}
                        alt="Evidence"
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      <Badge 
                        variant="outline"
                        className="absolute top-1 left-1 text-xs bg-background/80 backdrop-blur"
                      >
                        {image.source}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Status:</span>
              <Badge variant={report.status === 'submitted' ? 'default' : 'secondary'}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Created:</span>
              <span className="text-muted-foreground">
                {report.createdAt.toLocaleDateString()}
              </span>
            </div>

            {report.submittedAt && (
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Submitted:</span>
                <span className="text-muted-foreground">
                  {report.submittedAt.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {canEdit && report.status === 'draft' && (
          <Button
            onClick={submitReport}
            disabled={isSubmitting || !report.title.trim() || !report.description.trim() || !report.category}
            className="w-full tap-target"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={shareReport}
            variant="outline"
            className="tap-target"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button
            onClick={exportReport}
            variant="outline"
            className="tap-target"
          >
            <Upload className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}

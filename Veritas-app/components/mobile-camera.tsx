"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import {
  ActionSheet,
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetTrigger,
} from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Camera, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import { 
  takePicture, 
  selectImage, 
  triggerHapticFeedback, 
  showToast,
  shareContent,
  showActionSheet
} from '@/lib/mobile-services';
import { useMobile } from '@/components/mobile-provider';
import { ImpactStyle } from '@capacitor/haptics';

interface CapturedImage {
  id: string;
  uri: string;
  timestamp: Date;
  source: 'camera' | 'gallery';
}

interface MobileCameraProps {
  onImageCaptured?: (image: CapturedImage) => void;
  onImagesSelected?: (images: CapturedImage[]) => void;
  maxImages?: number;
  showPreview?: boolean;
  title?: string;
  description?: string;
}

export function MobileCamera({
  onImageCaptured,
  onImagesSelected,
  maxImages = 5,
  showPreview = true,
  title = "Capture Evidence",
  description = "Take a photo or select from gallery to add evidence for verification"
}: MobileCameraProps) {
  const { isMobile } = useMobile();
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const generateId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleTakePhoto = async () => {
    if (!isMobile) {
      await showToast('Camera not available on web platform');
      return;
    }

    setIsCapturing(true);
    await triggerHapticFeedback(ImpactStyle.Light);

    try {
      const imageUri = await takePicture();
      if (imageUri) {
        const newImage: CapturedImage = {
          id: generateId(),
          uri: imageUri,
          timestamp: new Date(),
          source: 'camera'
        };

        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        
        if (onImageCaptured) {
          onImageCaptured(newImage);
        }
        
        if (onImagesSelected) {
          onImagesSelected(updatedImages);
        }

        await showToast('Photo captured successfully');
        await triggerHapticFeedback(ImpactStyle.Light);
      }
    } catch (error) {
      console.error('Failed to take photo:', error);
      await showToast('Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSelectFromGallery = async () => {
    if (!isMobile) {
      // Web fallback - file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = maxImages > 1;
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          const newImages: CapturedImage[] = [];
          
          for (let i = 0; i < Math.min(files.length, maxImages - images.length); i++) {
            const file = files[i];
            const imageUri = URL.createObjectURL(file);
            const newImage: CapturedImage = {
              id: generateId(),
              uri: imageUri,
              timestamp: new Date(),
              source: 'gallery'
            };
            newImages.push(newImage);
          }
          
          const updatedImages = [...images, ...newImages];
          setImages(updatedImages);
          
          if (onImagesSelected) {
            onImagesSelected(updatedImages);
          }
          
          showToast(`${newImages.length} image(s) selected`);
        }
      };
      
      input.click();
      return;
    }

    setIsCapturing(true);
    await triggerHapticFeedback(ImpactStyle.Light);

    try {
      const imageUri = await selectImage();
      if (imageUri) {
        const newImage: CapturedImage = {
          id: generateId(),
          uri: imageUri,
          timestamp: new Date(),
          source: 'gallery'
        };

        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        
        if (onImageCaptured) {
          onImageCaptured(newImage);
        }
        
        if (onImagesSelected) {
          onImagesSelected(updatedImages);
        }

        await showToast('Image selected successfully');
        await triggerHapticFeedback(ImpactStyle.Light);
      }
    } catch (error) {
      console.error('Failed to select image:', error);
      await showToast('Failed to select image');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleImageAction = async (image: CapturedImage) => {
    if (isMobile) {
      const actionIndex = await showActionSheet(
        'Image Options',
        ['Share', 'Remove', 'Cancel']
      );

      switch (actionIndex) {
        case 0: // Share
          await shareContent(
            'Verification Evidence',
            'Image captured for verification',
            image.uri
          );
          break;
        case 1: // Remove
          removeImage(image.id);
          break;
        default:
          break;
      }
    } else {
      // Web fallback - simple remove
      removeImage(image.id);
    }
  };

  const removeImage = async (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    
    if (onImagesSelected) {
      onImagesSelected(updatedImages);
    }
    
    await showToast('Image removed');
    await triggerHapticFeedback(ImpactStyle.Light);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleTakePhoto}
          disabled={!canAddMore || isCapturing}
          className="flex-1 tap-target"
          variant="outline"
        >
          <Camera className="w-4 h-4 mr-2" />
          {isCapturing ? 'Capturing...' : 'Take Photo'}
        </Button>
        
        <Button
          onClick={handleSelectFromGallery}
          disabled={!canAddMore || isCapturing}
          className="flex-1 tap-target"
          variant="outline"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Select Image
        </Button>

        {images.length > 0 && (
          <Button
            onClick={() => setShowDialog(true)}
            variant="ghost"
            size="icon"
            className="tap-target"
          >
            <Info className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Image Counter */}
      {maxImages > 1 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{images.length} / {maxImages} images</span>
          {!canAddMore && (
            <Badge variant="secondary" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Maximum reached
            </Badge>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {showPreview && images.length > 0 && (
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
          {images.map((image) => (
            <Card key={image.id} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <img
                    src={image.uri}
                    alt={`Captured ${image.timestamp.toLocaleString()}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  
                  {/* Source Badge */}
                  <Badge 
                    variant={image.source === 'camera' ? 'default' : 'secondary'}
                    className="absolute top-1 left-1 text-xs"
                  >
                    {image.source === 'camera' ? 'Camera' : 'Gallery'}
                  </Badge>

                  {/* Remove Button */}
                  <Button
                    onClick={() => handleImageAction(image)}
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity tap-target"
                  >
                    <X className="w-3 h-3" />
                  </Button>

                  {/* Timestamp */}
                  <div className="absolute bottom-1 left-1 right-1">
                    <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur">
                      {image.timestamp.toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="mobile-dialog">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Total Images:</strong>
                <p className="text-muted-foreground">{images.length}</p>
              </div>
              <div>
                <strong>Sources:</strong>
                <p className="text-muted-foreground">
                  {images.filter(img => img.source === 'camera').length} Camera, {' '}
                  {images.filter(img => img.source === 'gallery').length} Gallery
                </p>
              </div>
            </div>

            {images.length > 0 && (
              <div className="space-y-2">
                <strong className="text-sm">Capture Timeline:</strong>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {images.map((image, index) => (
                    <div key={image.id} className="flex justify-between items-center text-xs">
                      <span>Image {index + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {image.timestamp.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">
                  <p>Images are stored locally on your device for privacy.</p>
                  <p className="mt-1">Tap and hold on images for more options.</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

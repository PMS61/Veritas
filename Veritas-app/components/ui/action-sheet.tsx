"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const ActionSheet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-x-0 bottom-0 z-50 bg-background border-t rounded-t-lg shadow-lg",
      className
    )}
    {...props}
  />
));
ActionSheet.displayName = "ActionSheet";

const ActionSheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("tap-target", className)}
    {...props}
  />
));
ActionSheetTrigger.displayName = "ActionSheetTrigger";

const ActionSheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-4 space-y-2 max-h-[80vh] overflow-y-auto",
      className
    )}
    {...props}
  />
));
ActionSheetContent.displayName = "ActionSheetContent";

const ActionSheetItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "w-full p-3 text-left rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors tap-target",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
ActionSheetItem.displayName = "ActionSheetItem";

export { ActionSheet, ActionSheetTrigger, ActionSheetContent, ActionSheetItem };

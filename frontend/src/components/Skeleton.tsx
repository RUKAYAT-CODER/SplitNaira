"use client";

import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "line" | "circle" | "rect";
  animated?: boolean;
}

/**
 * Base Skeleton component for displaying loading placeholders
 * Uses Tailwind CSS for styling and animations
 */
export function Skeleton({
  className,
  variant = "rect",
  animated = true,
}: SkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";
  const animationClasses = animated
    ? "animate-pulse"
    : "";

  const variantClasses = {
    line: "h-4 rounded",
    circle: "rounded-full aspect-square",
    rect: "rounded",
  };

  return (
    <div
      className={clsx(
        baseClasses,
        animationClasses,
        variantClasses[variant],
        className
      )}
    />
  );
}

/**
 * Loading skeleton for project cards
 */
export function ProjectCardSkeleton() {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 space-y-4 animate-pulse">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4 rounded bg-white/10" animated={false} />
          <Skeleton className="h-3 w-1/2 rounded bg-white/5" animated={false} />
        </div>
      </div>
      <div className="flex justify-between border-t border-white/5 pt-4">
        <Skeleton className="h-7 w-24 rounded bg-white/10" animated={false} />
        <Skeleton className="h-3 w-16 rounded bg-white/5" animated={false} />
      </div>
    </div>
  );
}

/**
 * Loading skeleton for transaction history items
 */
export function HistoryItemSkeleton() {
  return (
    <div className="relative pl-10 flex items-start gap-3 animate-pulse">
      <Skeleton className="absolute left-0 top-1 h-10 w-10 rounded-full bg-white/10" variant="circle" animated={false} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/2 rounded bg-white/10" animated={false} />
        <Skeleton className="h-3 w-2/3 rounded bg-white/5" animated={false} />
      </div>
    </div>
  );
}

/**
 * Loading skeleton for summary cards (stats/metrics)
 */
export function SummaryCardSkeleton() {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
      <Skeleton className="h-4 w-1/2 rounded" />
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-3 w-2/3 rounded" />
    </div>
  );
}

/**
 * Loading skeleton for a list of items
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <HistoryItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for a detailed project view
 */
export function ProjectDetailSkeleton() {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 space-y-8 animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-9 w-1/2 rounded bg-white/10" animated={false} />
          <Skeleton className="h-3 w-2/3 rounded bg-white/5" animated={false} />
        </div>
        <Skeleton className="h-10 w-32 rounded bg-white/10" animated={false} />
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        <ListSkeleton count={3} />
        <ListSkeleton count={4} />
      </div>
    </div>
  );
}

/**
 * Loading skeleton for dashboard grid
 */
export function DashboardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for a modal/dialog content
 */
export function ModalSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <Skeleton className="h-6 w-1/2 rounded" />

      {/* Fields */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-1/4 rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-8 flex-1 rounded" />
        <Skeleton className="h-8 flex-1 rounded" />
      </div>
    </div>
  );
}

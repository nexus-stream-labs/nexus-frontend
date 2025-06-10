import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoadingSkeleton({ className, children, ...props }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="space-y-4">
        <LoadingSkeleton className="h-4 w-1/3" />
        <LoadingSkeleton className="h-8 w-1/2" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-3 w-full" />
          <LoadingSkeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <LoadingSkeleton className="h-4 w-1/4 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <LoadingSkeleton className="h-4 w-1/4" />
              <LoadingSkeleton className="h-4 w-1/4" />
              <LoadingSkeleton className="h-4 w-1/4" />
              <LoadingSkeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
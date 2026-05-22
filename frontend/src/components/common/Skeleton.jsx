// Skeleton loading placeholder
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

export const TicketCardSkeleton = () => (
  <div className="glass-card space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);

export default Skeleton;

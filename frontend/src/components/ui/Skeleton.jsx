/**
 * Base skeleton block. Compose with width/height/rounded via className.
 */
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`skeleton-shimmer rounded-md bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCircle({ className = "" }) {
  return <Skeleton className={`rounded-full ${className}`} />;
}

export function SkeletonText({ lines = 1, className = "", lineClassName = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"} ${lineClassName}`}
        />
      ))}
    </div>
  );
}

/** Row skeleton for a list item: avatar + two lines of text */
export function SkeletonListItem({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 ${className}`}>
      <SkeletonCircle className="w-9 h-9 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2.5 w-1/5" />
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 5, className = "" }) {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  );
}

/** Generic card skeleton: header line + block + footer line */
export function SkeletonCard({ className = "" }) {
  return (
    <div className={`rounded-lg bg-[#111214]/60 p-3 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <SkeletonCircle className="w-8 h-8" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-4 pb-2 mb-2 border-b border-white/10">
        {Array.from({ length: columns }).map((_, c) => (
          <Skeleton key={c} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2.5">
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;

import { Skeleton, SkeletonCircle, SkeletonList } from "./Skeleton.jsx";

/** Full-app loading skeleton shown while the auth/session check is in flight. */
export default function AppSkeleton() {
  return (
    <div className="flex h-screen bg-[#070707] overflow-hidden">
      {/* Server rail */}
      <div className="hidden sm:flex w-[66px] p-2.5 py-6 flex-col items-center gap-3 bg-[#1e1f22]">
        <SkeletonCircle className="w-11 h-11" />
        <div className="w-5 h-[2px] bg-[#3f4147] rounded-full my-1" />
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCircle key={i} className="w-10 h-10" />
        ))}
      </div>

      {/* Channel sidebar */}
      <div className="hidden md:flex w-[240px] p-3 flex-col bg-[#03030373] gap-3">
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-6 w-2/3 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <div className="mt-4">
          <Skeleton className="h-3 w-1/3 mb-3" />
          <SkeletonList rows={4} />
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        <Skeleton className="h-10 w-1/3 rounded-md" />
        <div className="flex-1 rounded-2xl bg-[#27282a]/60 p-4">
          <SkeletonList rows={6} />
        </div>
      </div>

      {/* Active now panel */}
      <div className="hidden lg:flex w-[360px] p-4 flex-col gap-3 bg-[#1a1b1f93]">
        <Skeleton className="h-5 w-1/2 mb-2" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-[#111214]/60 p-3 flex items-center gap-3">
            <SkeletonCircle className="w-8 h-8" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl bg-deep-navy p-6">
          <div className="mb-4 h-8 w-8 rounded-full bg-navy" />
          <div className="mb-2 h-5 w-3/4 rounded bg-navy" />
          <div className="mb-1 h-3 w-full rounded bg-navy" />
          <div className="h-3 w-5/6 rounded bg-navy" />
        </div>
      ))}
    </>
  )
}

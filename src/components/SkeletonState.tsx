export function SkeletonState() {
  const shimmer = 'animate-pulse bg-[#11153a]'

  return (
    <section className="space-y-6">
      <div className={`h-64 rounded-[32px] ${shimmer}`} />
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={`h-28 rounded-2xl ${shimmer}`} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className={`h-40 rounded-2xl ${shimmer}`} />
        <div className={`h-40 rounded-2xl ${shimmer}`} />
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className={`h-28 rounded-2xl ${shimmer}`} />
        <div className={`h-72 rounded-2xl ${shimmer}`} />
      </div>
    </section>
  )
}


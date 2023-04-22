interface SkeletonProps {
  count: number;
}

export default function GroupSkeleton({ count }: SkeletonProps) {
  function getRandomSpan() {
    let width: number;
    width = Math.floor(Math.random() * 80 + 40);
    let widthClass = `${width.toString()}%`

    return widthClass
  }

  function getRandomTitle() {
    let width: number;
    width = Math.floor(Math.random() * 50 + 30);
    let widthClass = `${width.toString()}%`

    return widthClass
  }

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <div className="h-24 w-24 rounded-md animate-pulse bg-gray-200 border border-gray-200">
          </div>
          <div className="flex flex-col w-1/3 justify-between">
            <div className="flex flex-col gap-3 mt-1 w-full">
              <div className="animate-pulse h-5 rounded bg-gray-200 w-2/5"></div>
              <div key={index} className={`animate-pulse h-4 rounded bg-gray-200 w4/5`}></div>
            </div>
            <footer className="flex">
              <div
                className="border-gray-400 border-2 box-border text-gray-400 px-4 py-1 rounded text-xs font-semibold">
                Entrar
              </div>
            </footer>
          </div>
        </div>
      ))}
    </div>
  )
}
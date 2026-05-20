export default function Skeleton({ lines = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="surface h-32 animate-pulse bg-white/60 dark:bg-white/5" />
      ))}
    </div>
  );
}

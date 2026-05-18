export function ProfileLoading({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-white">
      <p className="text-sm text-muted">{label ?? "Loading company profile…"}</p>
    </div>
  );
}

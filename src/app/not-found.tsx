import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-7xl font-extrabold text-muted">404</p>
      <h1 className="font-display text-3xl font-bold uppercase text-ink">Off the pitch</h1>
      <p className="text-muted">That page doesn&apos;t exist, or the match was never scheduled.</p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-canvas outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        Back to the league
      </Link>
    </main>
  );
}

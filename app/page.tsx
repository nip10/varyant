import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center bg-linear-to-b from-background to-muted/80 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Varyant Demo
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access the dashboard and the AI copilot.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Go to login
        </Link>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Don’t have access? Use the demo credentials configured for this env.
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-[8rem] font-bold leading-none tracking-tighter text-primary sm:text-[12rem]">
        404
      </h1>
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-foreground sm:text-3xl">
        Page Not Found
      </h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved. Check
        the URL or head back to the homepage.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}

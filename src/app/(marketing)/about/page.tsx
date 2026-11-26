export const metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[800px] space-y-6 px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-semibold text-text">About Prism: Interview</h1>
      <p className="text-text-muted">
        Prism: Interview is an honest interview preparation platform. We combine published
        rubrics, adaptive AI follow-up questioning, deterministic speech delivery analytics, and
        role-specific technical rounds in a single workspace.
      </p>
      <p className="text-text-muted">
        We strictly refuse to build live-interview copilots, stealth overlays, or hidden answer
        helpers. Real confidence comes from structured practice and clear feedback.
      </p>
    </div>
  );
}

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[800px] space-y-6 px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-semibold text-text">Terms of Service</h1>
      <p className="text-sm text-text-muted">
        {/* TODO: Replace with lawyer-reviewed terms of service before public launch */}
        Prism: Interview is provided exclusively for interview preparation and practice. You retain
        ownership of your stories, resumes, and session transcripts.
      </p>
    </div>
  );
}

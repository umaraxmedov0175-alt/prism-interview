export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[800px] space-y-6 px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-semibold text-text">Privacy Policy</h1>
      <p className="text-sm text-text-muted">
        {/* TODO: Replace with lawyer-reviewed privacy policy before public launch */}
        Prism: Interview stores only the data required to run your practice sessions, transcripts,
        and feedback reports. Optional recordings are stored in private storage and auto-deleted
        after 90 days unless pinned. Eye-contact estimation runs on-device in your browser; video
        frames are never sent to our servers for gaze tracking.
      </p>
      <p className="text-sm text-text-muted">
        You can export your data, delete recordings, or delete your account at any time from your
        account settings.
      </p>
    </div>
  );
}

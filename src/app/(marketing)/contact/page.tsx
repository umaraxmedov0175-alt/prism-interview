export const metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[800px] space-y-6 px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-semibold text-text">Contact</h1>
      <p className="text-text-muted">
        Questions about Prism: Interview, team cohorts, or feedback? Reach out at{' '}
        <span className="font-mono text-text">support@prisminterview.com</span>.
      </p>
    </div>
  );
}

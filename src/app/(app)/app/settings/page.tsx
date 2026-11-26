import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export const metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Settings</h1>
        <p className="text-sm text-text-muted">
          Manage your appearance, interview language, and privacy controls.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Switch between light and dark mode.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-text">Theme</span>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  );
}

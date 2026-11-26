'use client';

import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { clearAllUserData, exportAllUserData } from '@/lib/storage/local-sessions';

export default function SettingsPage() {
  const [statusMsg, setStatusMsg] = useState('');

  function handleExport() {
    const json = exportAllUserData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prism-interview-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Your data export has been downloaded.');
  }

  function handleDeleteAll() {
    clearAllUserData();
    setStatusMsg('All local sessions, reports, stories, and plans have been deleted.');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Settings</h1>
        <p className="text-sm text-text-muted">
          Manage your appearance, plan status (100% Free), and privacy controls.
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Privacy & Data Control</CardTitle>
          <CardDescription>
            Export your sessions, reports, and stories as JSON, or delete all stored data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export my data (JSON)
            </Button>
            <Button type="button" variant="danger" onClick={handleDeleteAll}>
              <Trash2 className="h-4 w-4" />
              Delete all sessions & data
            </Button>
          </div>
          {statusMsg && (
            <p role="status" className="text-xs text-success">
              {statusMsg}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

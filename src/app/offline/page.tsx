import { Card, CardBody, CardTitle } from "@/components/Card";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-[var(--space-6)]">
      <Card className="max-w-md">
        <CardTitle>You're offline</CardTitle>
        <CardBody>
          Reconnect and we'll pick up where you left off. Your library content requires an active connection to stream securely.
        </CardBody>
      </Card>
    </main>
  );
}

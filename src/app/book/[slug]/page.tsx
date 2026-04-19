import { Card, CardBody, CardTitle } from "@/components/Card";

type PageParams = Promise<{ slug: string }>;

export default async function BookStubPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  return (
    <main className="min-h-screen flex items-center justify-center p-[var(--space-6)]">
      <Card className="max-w-md">
        <CardTitle>Book a session — coming soon</CardTitle>
        <CardBody>
          Booking flow for <strong>{slug}</strong> is scheduled in BD-008.
        </CardBody>
      </Card>
    </main>
  );
}

import Link from "next/link";

import { Button } from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";

export default function CheckoutStubPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-[var(--space-6)]">
      <Card className="max-w-md">
        <CardTitle>Checkout — dev stub</CardTitle>
        <CardBody className="flex flex-col gap-[var(--space-3)]">
          <p>
            No <code>STRIPE_SECRET_KEY</code> configured, so checkout is stubbed.
            Set a test-mode key in <code>.env.local</code> to exercise the real flow.
          </p>
          <Link href="/shop">
            <Button variant="ghost" className="w-full">
              Back to shop
            </Button>
          </Link>
        </CardBody>
      </Card>
    </main>
  );
}

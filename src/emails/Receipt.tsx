import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export interface ReceiptEmailProps {
  productName: string;
  amountCents: number;
  accessUrl: string;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ReceiptEmail({ productName, amountCents, accessUrl }: ReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your {productName} is ready</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#fafafa", padding: "32px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px", maxWidth: "480px" }}>
          <Heading>Thanks for your purchase</Heading>
          <Text>
            You purchased <strong>{productName}</strong> for {formatPrice(amountCents)}.
          </Text>
          <Text>Your content is available in your library:</Text>
          <Button href={accessUrl} style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none" }}>
            Open library
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

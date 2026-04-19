import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export interface MagicLinkEmailProps {
  url: string;
  host: string;
}

export default function MagicLinkEmail({ url, host }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to {host}</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#fafafa", padding: "32px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px", maxWidth: "480px" }}>
          <Heading>Sign in to {host}</Heading>
          <Text>Click below to finish signing in. This link expires in 24 hours.</Text>
          <Button href={url} style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none" }}>
            Sign in
          </Button>
          <Text style={{ color: "#6b7280", marginTop: "24px", fontSize: "14px" }}>
            If you didn't request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

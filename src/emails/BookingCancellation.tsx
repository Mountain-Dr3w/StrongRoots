import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export interface BookingCancellationEmailProps {
  productName: string;
  startAtIso: string;
}

export default function BookingCancellationEmail({ productName, startAtIso }: BookingCancellationEmailProps) {
  const when = new Date(startAtIso).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
  return (
    <Html>
      <Head />
      <Preview>Booking cancelled</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#fafafa", padding: "32px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px", maxWidth: "480px" }}>
          <Heading>Booking cancelled</Heading>
          <Text>Your {productName} on {when} has been cancelled.</Text>
          <Text>Book again anytime from the shop.</Text>
        </Container>
      </Body>
    </Html>
  );
}

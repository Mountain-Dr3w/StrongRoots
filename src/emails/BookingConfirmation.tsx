import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export interface BookingConfirmationEmailProps {
  productName: string;
  startAtIso: string;
  forAdmin: boolean;
  userEmail?: string;
}

export default function BookingConfirmationEmail({
  productName,
  startAtIso,
  forAdmin,
  userEmail,
}: BookingConfirmationEmailProps) {
  const when = new Date(startAtIso).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
  return (
    <Html>
      <Head />
      <Preview>{forAdmin ? "New booking" : "Booking confirmed"}</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#fafafa", padding: "32px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px", maxWidth: "480px" }}>
          <Heading>{forAdmin ? "New booking" : "You're booked"}</Heading>
          <Text>
            {productName} · {when}
          </Text>
          {forAdmin && userEmail ? <Text>Customer: {userEmail}</Text> : null}
          {!forAdmin ? <Text>We'll send a reminder 24 hours before.</Text> : null}
        </Container>
      </Body>
    </Html>
  );
}

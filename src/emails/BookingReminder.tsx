import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export interface BookingReminderEmailProps {
  productName: string;
  startAtIso: string;
}

export default function BookingReminderEmail({ productName, startAtIso }: BookingReminderEmailProps) {
  const when = new Date(startAtIso).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
  return (
    <Html>
      <Head />
      <Preview>Reminder: {productName}</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#fafafa", padding: "32px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px", maxWidth: "480px" }}>
          <Heading>Session tomorrow</Heading>
          <Text>{productName} · {when}</Text>
          <Text>If you need to reschedule, head to your bookings page.</Text>
        </Container>
      </Body>
    </Html>
  );
}

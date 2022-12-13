import * as MailComposer from "expo-mail-composer";
import { Text } from "react-native";

export async function composeMail(
  subject: string,
  body: string,
  recipients: string[],
  image: string
) {
  await MailComposer.composeAsync({
    subject: subject,
    body: body,
    recipients: recipients,
    attachments: [image],
  });
}

export function createRecipients(recipients: string[], email: string) {
  let newRecipients: string[] = [...recipients];
  newRecipients.push(email);
  return newRecipients;
}

export async function checkAvailability() {
  const isMailAvailable = await MailComposer.isAvailableAsync();
  return isMailAvailable;
}

export function showRecipients(recipients: string[]) {
  return recipients.map((recipient, index) => {
    return (
      <Text style={{ fontSize: 22 }} key={index}>
        {recipient}
      </Text>
    );
  });
}

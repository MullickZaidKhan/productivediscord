// Groups raw API messages by the day they were sent, for the date dividers
export function groupMessagesByDay(messages) {
  const groups = [];
  if (!Array.isArray(messages)) return groups;

  let currentKey = null;
  let currentGroup = null;

  messages.forEach((message) => {
    const date = new Date(message.createdAt);
    const key = date.toDateString();
    const label = date.toLocaleDateString([], {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (key !== currentKey) {
      currentKey = key;
      currentGroup = { label, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(message);
  });

  return groups;
}
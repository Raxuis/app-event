// Function to handle goBack buttons
export default function goBack(action, eventId) {
  window.location.href = `my-events?action=${action}&eventId=${eventId}`;
}

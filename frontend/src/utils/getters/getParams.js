export default function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    eventId: urlParams.get('eventId'),
    resourceId: urlParams.get('resourceId')
  };
}

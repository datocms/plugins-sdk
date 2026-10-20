// Stops the propagation of an event. Use it as a handler when a parent must
// not receive the event.
export function stopPropagation(event: { stopPropagation: () => void }) {
  event.stopPropagation();
}

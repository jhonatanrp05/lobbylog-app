export function formatDate(dateString: string | null) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

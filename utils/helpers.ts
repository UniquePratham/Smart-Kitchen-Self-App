export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTimeAgo(dateString?: string): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getStatusColor(status?: string): string {
  switch (status) {
    case "ok":
      return "#10B981";
    case "expiring_soon":
      return "#F59E0B";
    case "expired":
    case "spoilt":
      return "#EF4444";
    case "consumed":
      return "#6B7280";
    default:
      return "#9CA3AF";
  }
}

export function isDeviceOnline(lastPing?: string): boolean {
  if (!lastPing) return false;
  const diffMs = new Date().getTime() - new Date(lastPing).getTime();
  return diffMs < 300000;
}

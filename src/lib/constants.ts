export const ALLOWED_SERVICE_ICONS = [
  "Package",
  "TrendingUp",
  "ClipboardList",
  "UsersRound",
  "Sprout",
  "Leaf",
  "Globe2",
  "Handshake",
] as const;

export type ServiceIconName = (typeof ALLOWED_SERVICE_ICONS)[number];

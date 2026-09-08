// Deterministic color per name, used only as an avatar fallback background
const AVATAR_PALETTE = [
  "#5865f2",
  "#3ba55d",
  "#c07a3e",
  "#eb459e",
  "#faa61a",
  "#ed4245",
  "#9b59b6",
];

export function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
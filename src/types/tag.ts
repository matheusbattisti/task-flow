export interface Tag {
  id: string;
  name: string;
  color: string; // hex, e.g. "#3b82f6"
}

export const TAG_PRESET_COLORS: { label: string; value: string }[] = [
  { label: "Vermelho", value: "#ef4444" },
  { label: "Laranja",  value: "#f97316" },
  { label: "Amarelo",  value: "#eab308" },
  { label: "Verde",    value: "#22c55e" },
  { label: "Teal",     value: "#14b8a6" },
  { label: "Azul",     value: "#3b82f6" },
  { label: "Índigo",   value: "#6366f1" },
  { label: "Roxo",     value: "#a855f7" },
  { label: "Rosa",     value: "#ec4899" },
  { label: "Cinza",    value: "#64748b" },
];

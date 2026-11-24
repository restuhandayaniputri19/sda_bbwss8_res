import {
  AlertTriangle,
  BookOpen,
  Building2,
  Database,
  Download,
  FileText,
  Globe,
  Map,
  MessageSquare,
  ShieldAlert,
  Smartphone,
} from "lucide-react";

export const LAYANAN_ICON_OPTIONS = [
  { value: "Globe", label: "Globe", Icon: Globe },
  { value: "FileText", label: "FileText", Icon: FileText },
  { value: "Database", label: "Database", Icon: Database },
  { value: "AlertTriangle", label: "AlertTriangle", Icon: AlertTriangle },
  { value: "MessageSquare", label: "MessageSquare", Icon: MessageSquare },
  { value: "ShieldAlert", label: "ShieldAlert", Icon: ShieldAlert },
  { value: "BookOpen", label: "BookOpen", Icon: BookOpen },
  { value: "Building2", label: "Building2", Icon: Building2 },
  { value: "Download", label: "Download", Icon: Download },
  { value: "Map", label: "Map", Icon: Map },
  { value: "Smartphone", label: "Smartphone", Icon: Smartphone },
];

export const LAYANAN_ICON_MAP = Object.fromEntries(
  LAYANAN_ICON_OPTIONS.map(({ value, Icon }) => [value, Icon])
);

export const LAYANAN_COLOR_PALETTE = [
  { color: "text-blue-600", background: "bg-blue-50" },
  { color: "text-amber-600", background: "bg-amber-50" },
  { color: "text-green-600", background: "bg-green-50" },
  { color: "text-purple-600", background: "bg-purple-50" },
  { color: "text-red-600", background: "bg-red-50" },
  { color: "text-indigo-600", background: "bg-indigo-50" },
];

export const isLayananIcon = (value) =>
  typeof value === "string" && Object.hasOwn(LAYANAN_ICON_MAP, value);

export const isLayananImageUrl = (value) =>
  typeof value === "string" && /^https?:\/\//i.test(value);

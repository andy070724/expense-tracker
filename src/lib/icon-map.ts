import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Popcorn,
  HeartPulse,
  MoreHorizontal,
  Tag,
  Home,
  Plane,
  GraduationCap,
  Gift,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Popcorn,
  HeartPulse,
  MoreHorizontal,
  Tag,
  Home,
  Plane,
  GraduationCap,
  Gift,
};

export function getIcon(name?: string | null): LucideIcon {
  if (!name) return Tag;
  return ICONS[name] ?? Tag;
}

export const ICON_NAMES = Object.keys(ICONS);

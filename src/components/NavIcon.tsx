import { Home, Info, Calendar, Users, Mail, Phone, MapPin, Heart, Star } from "lucide-react";

const iconMap = {
  home: Home,
  info: Info,
  calendar: Calendar,
  users: Users,
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  heart: Heart,
  star: Star,
};

export function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = iconMap[icon as keyof typeof iconMap];
  if (!Icon) return null;
  return <Icon className={className} size={16} />;
}

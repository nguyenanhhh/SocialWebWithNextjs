import { LucideIcon, LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  icon: LucideIcon;
  size?: number;
}

export default function Icon({ icon: IconComponent, size = 24, ...props }: IconProps) {
  return <IconComponent size={size} {...props} />;
}

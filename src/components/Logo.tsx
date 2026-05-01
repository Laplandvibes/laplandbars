import { Wine } from 'lucide-react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export default function Logo({ className = '', light = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Wine size={22} className="text-amber" />
      <span className="font-heading text-2xl tracking-wider leading-none">
        <span className={light ? 'text-white' : 'text-white'}>LAPLAND</span>
        <span className="text-amber">BARS</span>
      </span>
    </div>
  );
}

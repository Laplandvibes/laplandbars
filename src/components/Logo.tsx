interface LogoProps {
  className?: string;
  light?: boolean;
}

/**
 * #LAPLANDBARS wordmark — LV brand signature.
 * Pattern per CLAUDE.md: # accent (amber) + LAPLAND (snow/white) + BARS (amber).
 */
export default function Logo({ className = '', light = false }: LogoProps) {
  void light;
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-heading text-3xl md:text-4xl tracking-wider leading-none">
        <span className="text-amber">#</span>
        <span className="text-white">LAPLAND</span>
        <span className="text-amber">BARS</span>
      </span>
    </div>
  );
}

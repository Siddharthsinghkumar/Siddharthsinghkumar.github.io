interface ScreenshotFrameProps {
  caption: string;
  /** Placeholder SVG to show until Sid captures real screenshots */
  placeholder?: string;
}

export default function ScreenshotFrame({ caption, placeholder }: ScreenshotFrameProps) {
  return (
    <div className="aspect-video rounded-[--r-md] bg-[--surface-2] border border-[--line] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Corner ticks */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[--accent]" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[--accent]" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[--accent]" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[--accent]" />

      {placeholder && (
        // eslint-disable-next-line @next/next/no-img-element -- static export: next/image optimization unavailable
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          aria-hidden="true"
        />
      )}

      <p className="font-mono text-[11px] text-[--muted] text-center relative z-10">
        {caption}
      </p>
    </div>
  );
}

export default function ImageBackdrop({ src }: { src: string }) {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, var(--bg) 0%, var(--bg) 25%, color-mix(in srgb, var(--bg) 70%, transparent) 50%, transparent 70%, color-mix(in srgb, var(--accent) 12%, transparent) 100%)`,
        }}
      />
    </div>
  );
}

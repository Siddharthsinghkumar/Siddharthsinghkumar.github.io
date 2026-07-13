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
          background: `
            radial-gradient(ellipse 50% 50% at 25% 50%, color-mix(in srgb, var(--accent) 60%, var(--bg)) 0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 75% 30%, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 50% 100%, color-mix(in srgb, var(--accent) 35%, var(--bg)) 0%, transparent 60%),
            linear-gradient(160deg, var(--bg) 0%, var(--bg) 25%, color-mix(in srgb, var(--accent) 30%, var(--bg)) 40%, transparent 55%, color-mix(in srgb, var(--accent) 20%, transparent) 100%)
          `,
        }}
      />
    </div>
  );
}

interface SkillsRowProps {
  label: string;
  skills: string;
  dominant?: boolean;
}

export default function SkillsRow({
  label,
  skills,
  dominant = false,
}: SkillsRowProps) {
  return (
    <div className={dominant ? "md:col-span-2" : ""}>
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-2">
        {label}
      </p>
      <p className="text-[--text] text-sm leading-relaxed">{skills}</p>
    </div>
  );
}

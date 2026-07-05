import type { Metadata } from "next";
import Section from "@/components/Section";
import Eyebrow from "@/components/Eyebrow";
import ProjectCard from "@/components/ProjectCard";
import GridBackdrop from "@/components/GridBackdrop";

export const metadata: Metadata = {
  title: "Projects | Siddharth Singh",
  description: "More systems, shipped and documented.",
  openGraph: {
    title: "Projects | Siddharth Singh",
    description: "More systems, shipped and documented.",
    images: [{ url: "/og/projects.png", width: 1200, height: 630 }],
  },
};

export default function Projects() {
  return (
    <div className="pt-24 pb-24">
      {/* ── Project Grid ────────────────────────────────────── */}
      <Section className="relative overflow-hidden min-h-screen">
        <GridBackdrop />
        <div className="relative z-[1]">
          <Eyebrow>INDEX / ALL SYSTEMS</Eyebrow>
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-[--text] mb-8">
            Projects
          </h1>
          <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] mb-8 max-w-[68ch]">
            Systems beyond the flagships — a shipped client platform, published hardware, security research, and the lab work that taught me the most.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <ProjectCard
              title="Sindhey Pathology"
              description="Production healthcare booking platform: payments, OTP auth, DPDP-compliant erasure. Live at sindheypathology.com."
              status="SHIPPED · CLIENT WORK"
              href="https://www.sindheypathology.com"
            />
            <ProjectCard
              title="Autonomous Firefighting Robot"
              description="25–28 kg tracked robot that finds and extinguishes fires: FPGA-deployed CNN, multi-sensor fusion. Published in IJFMR 2024."
              status="HARDWARE · PUBLISHED"
              href="https://github.com/Siddharthsinghkumar/autonomous-firefighting-robot"
              repo="autonomous-firefighting-robot"
              fallbackStars={2}
              fallbackPush=""
            />
            <ProjectCard
              title="MTK Firmware Unlock"
              description="Python toolchain for MediaTek bootloader unlock, firmware extraction, and root — security research."
              status="SYSTEMS · SECURITY"
              href="https://github.com/Siddharthsinghkumar/mtk-firmware-unlock"
              repo="mtk-firmware-unlock"
              fallbackStars={8}
              fallbackPush=""
            />
            <ProjectCard
              title="TrueNAS ZFS Recovery Lab"
              description="Deliberately destroyed a RAID-Z array, then recovered it with CLI and forensic tooling."
              status="STORAGE · FORENSICS"
              href="https://github.com/Siddharthsinghkumar/truenas-zfs-recovery-lab"
              repo="truenas-zfs-recovery-lab"
              fallbackStars={3}
              fallbackPush=""
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

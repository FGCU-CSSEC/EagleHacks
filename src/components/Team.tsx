import fs from "node:fs";
import path from "node:path";
import TeamCarousel from "@/components/TeamCarousel";
import { team } from "@/config/site";

const exts = ["webp", "jpg", "jpeg", "png"];

function headshot(key: string): string | undefined {
  for (const ext of exts) {
    if (fs.existsSync(path.join(process.cwd(), "public", "photos", "headshots", `${key}.${ext}`))) {
      return `/photos/headshots/${key}.${ext}`;
    }
  }
  return undefined;
}

export default function Team() {
  const members = team.map((m) => ({ name: m.name, role: m.role, linkedin: m.linkedin, photo: headshot(m.key) }));

  return (
    <section id="team" aria-labelledby="team-h" className="scroll-mt-4">
      <div className="mx-auto max-w-[1240px] px-5 py-[72px] desk:px-8 desk:py-28">
        <h2 id="team-h" className="h-display text-[clamp(56px,8vw,120px)]">
          The team
        </h2>
        <div className="mt-8 desk:mt-10">
          <TeamCarousel members={members} />
        </div>
      </div>
    </section>
  );
}

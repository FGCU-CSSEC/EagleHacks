import fs from "node:fs";
import path from "node:path";
import TeamCarousel from "@/components/TeamCarousel";
import { team } from "@/config/site";

const HEADSHOT_DIR = path.join(process.cwd(), "public", "photos", "headshots");

/** Maps each team key in site.ts to its headshot file (e.g. allison.webp), if one exists. */
function headshotsByKey() {
  const found = new Map<string, string>();
  for (const file of fs.existsSync(HEADSHOT_DIR) ? fs.readdirSync(HEADSHOT_DIR) : []) {
    const { name, ext } = path.parse(file);
    if (/^\.(webp|jpe?g|png)$/i.test(ext)) found.set(name.toLowerCase(), `/photos/headshots/${file}`);
  }
  return found;
}

export default function Team() {
  const photos = headshotsByKey();
  const members = team.map(({ key, name, role, linkedin }) => ({ name, role, linkedin, photo: photos.get(key) }));

  return (
    <section id="team" aria-labelledby="team-h" className="scroll-mt-4">
      <div className="wrap-wide sec-pad pt-0">
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

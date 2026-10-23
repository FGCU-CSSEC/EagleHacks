// Admins type times in Eastern (FGCU); the database stores UTC ISO strings.
const TZ = "America/New_York";

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

// "YYYY-MM-DDTHH:mm" as shown on an Eastern wall clock
function wallClock(ms: number): string {
  const p = Object.fromEntries(fmt.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

// ISO (UTC) -> value for <input type="datetime-local">
export function toEasternInput(iso: string): string {
  return wallClock(Date.parse(iso));
}

// <input type="datetime-local"> value (Eastern) -> ISO (UTC), or null if invalid
export function fromEasternInput(local: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return null;
  const wanted = Date.parse(`${local}:00Z`);
  if (Number.isNaN(wanted)) return null;
  // Shift by the zone offset; the second pass settles times near a DST change.
  let t = wanted;
  for (let i = 0; i < 2; i++) t += wanted - Date.parse(`${wallClock(t)}:00Z`);
  return new Date(t).toISOString();
}

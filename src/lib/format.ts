const timeZone = "Europe/Lisbon";
const dateFmt = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" });

export function formatKickoff(iso: string) {
  const d = new Date(iso);
  return { date: dateFmt.format(d), time: timeFmt.format(d) };
}

export function formatMinute(minute: number, stoppage?: number) {
  return stoppage ? `${minute}+${stoppage}'` : `${minute}'`;
}

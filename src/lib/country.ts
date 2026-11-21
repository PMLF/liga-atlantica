export function flagEmoji(iso2: string): string {
  return String.fromCodePoint(
    ...iso2
      .toUpperCase()
      .split("")
      .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

const names = new Intl.DisplayNames(["en"], { type: "region" });

export function countryName(iso2: string): string {
  return names.of(iso2.toUpperCase()) ?? iso2;
}

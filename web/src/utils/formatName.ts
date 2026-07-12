export function formatName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toLocaleUpperCase("es-PE") + word.slice(1).toLocaleLowerCase("es-PE"))
    .join(" ");
}

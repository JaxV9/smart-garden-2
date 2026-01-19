export const normalize = (s?: string) => (s ?? "").trim().toLowerCase();

export const extractScientific = (specs?: string[]) => {
    const spec = specs?.find((x) => normalize(x).includes("nom scientifique"));
    if (!spec) return "";
    const parts = spec.split(":");
    return (parts[1] ?? "").trim();
};

export const extractFamily = (specs?: string[]) => {
    const spec = specs?.find((x) => normalize(x).includes("famille"));
    if (!spec) return "";
    const parts = spec.split(":");
    return (parts[1] ?? "").trim();
};

export const cleanImageUri = (raw?: string) => {
    const rawUri = (raw ?? "") as string;
    return rawUri ? rawUri.replace(/([^:]\/\/+)\/+/g, "$1") : "";
};

export const seasonToString = (season: unknown) => {
    if (Array.isArray(season)) return season.join(", ");
    return (season as string) ?? "";
};
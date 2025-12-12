export const MONTHS_SHORT = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export const monthToIndex = (m?: string) => {
    const s = (m ?? "").toLowerCase().trim();
    const map: Record<string, number> = {
        janvier: 0,
        janv: 0,
        "janv.": 0,
        février: 1,
        fevrier: 1,
        fév: 1,
        fev: 1,
        "fév.": 1,
        "fev.": 1,
        mars: 2,
        avril: 3,
        mai: 4,
        juin: 5,
        juillet: 6,
        août: 7,
        aout: 7,
        septembre: 8,
        sept: 8,
        "sept.": 8,
        octobre: 9,
        oct: 9,
        "oct.": 9,
        novembre: 10,
        nov: 10,
        "nov.": 10,
        décembre: 11,
        decembre: 11,
        déc: 11,
        dec: 11,
        "déc.": 11,
        "dec.": 11,
    };
    return map[s];
};

export function rangeFromMonths(list?: string[]) {
    const idxs = (list ?? [])
        .map((m) => monthToIndex(m))
        .filter((v) => typeof v === "number") as number[];
    if (idxs.length === 0) return null;
    idxs.sort((a, b) => a - b);
    return { start: idxs[0], end: idxs[idxs.length - 1] };
}
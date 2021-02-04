export function generateMap<T>(arr: T[], hashFn: (t: T) => string): {[key: string]: T} {
    const map = {};

    for (const item of arr) {
        map[hashFn(item)] = item;
    }

    return map;
}
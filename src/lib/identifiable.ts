export default interface Identifiable {
    id: string;
}

export function isIdentifiable(obj: any): obj is Identifiable {
    return 'id' in obj;
}

export function hash(obj: any): string {
    if (typeof(obj) === 'string') return obj;
    else if (typeof(obj) === 'number') return obj.toString()
    else if (isIdentifiable(obj)) return obj.id;
    else return obj.valueOf();
}

export function equals(a: any, b : any): boolean {
    return hash(a) === hash(b);
}
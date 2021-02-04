import Identifiable from "./identifiable";
import List from "./List";

export default class Set<T> {
    private set: List<T>;

    constructor(set: T[] = []) {
        this.set = new List<T>([]);

        for (const item of set) {
            this.insert(item);
        }
    }

    public insert(item: T) {
        if (!this.contains(item)) {
            this.set.insert(item);
        }
    }

    public contains(item: T) {
        return this.set.contains(item);
    }

    public remove(item: T) {
        if (this.contains(item)) {
            this.set.remove(item);
        }
    }

    public union(set: Set<T>): Set<T> {
        const u = new Set<T>();
        for (const item of this.values) {
            u.insert(item);
        }
        for (const item of set.values) {
            u.insert(item);
        }
        return u;
    }

    public intersection(set: Set<T>): Set<T> {
        const i = new Set<T>();
        for (const item of this.values) {
            if (set.contains(item)) {
                i.insert(item);
            }
        }
        return i;
    }

    public concat(set: Set<T>) {
        for (const item of set.values) {
            this.insert(item);
        }
    }

    public copy() {
        return new Set<T>([...this.values]);
    }

    public get values() {
        return this.set.values;
    }
}
import { equals } from "./identifiable";

export default class List<T> {

    private list: T[];

    constructor(list: T[] = []) {
        this.list = list;
    }

    public get length() {
        return this.list.length;
    }

    public indexOf(item: T) {
        for (let i = 0; i < this.length; i++) {
            if (this.isEqual(item, this.list[i])) {
                return i;
            }
        }
        return -1;
    }

    public contains(item: T) {
        return this.indexOf(item) !== -1;
    }

    public insert(item: T) {
        this.list.push(item);
    }

    public pop() {
        return this.list.pop();
    }

    public popFront() {
        return this.list.shift();
    }

    public remove(item: T) {
        const idx = this.indexOf(item);
        if (idx !== -1) {
            this.list.splice(idx, 1);
        }
    }

    public removeAll(item: T) {
        const list = [];
        for (let i = 0; i < this.length; i++) {
            if (!this.isEqual(this.list[i], item)) {
                list.push(this.list[i]);
            }
        }
        this.list = list;
    }

    public isEqual(a: T, b: T) {
        return equals(a, b);
    }
    
    public copy() {
        return new List<T>([...this.list]);
    }

    public get values() {
        return this.list;
    }
}
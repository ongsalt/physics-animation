export class Vec2d {
    constructor(public x: number, public y: number) { }

    add(b: Vec2d) {
        return new Vec2d(this.x + b.x, this.y + b.y)
    }

    substract(b: Vec2d) {
        return new Vec2d(this.x - b.x, this.y - b.y)
    }

    multiply(s: number) {
        return new Vec2d(this.x * s, this.y * s)
    }

    clone() {
        return new Vec2d(this.x, this.y)
    }

    static ZERO = new Vec2d(0, 0);
}

export class Rect {
    constructor(public w: number, public h: number, public x: number, public y: number) { }

    css(): string {
        return `width: ${this.w}px; height: ${this.h}px; translate: ${this.x}px ${this.y}px`
    }

    center(): Vec2d {
        return new Vec2d(this.x + this.w / 2, this.y + this.h / 2)
    }

    static ZERO = new Rect(0, 0, 0, 0);
}

export function rangeMap(value: number, s1: number, s2: number, t1: number, t2: number) {
    return (value - s1) / (s2 - s1) * (t1 - t2) + t2
}

export function limitDecay(value: number, limit: number) {
    let sign = 1
    if (value < 0) {
        sign = -1
    } 
    value *= sign
    if (value < limit) {
        return value * sign
    }
    return limit * sign
}
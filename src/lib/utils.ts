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

    static ZERO = new Vec2d(0, 0);
}
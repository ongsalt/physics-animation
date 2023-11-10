import type { PhysicsObject } from "./runner";
import { Vec2d } from "./utils";

export class VerletObject implements PhysicsObject {
    public previousPosition: Vec2d
    public currentPosition: Vec2d
    public acceleration: Vec2d = Vec2d.ZERO
    public afterUpdates: ((pos: Vec2d) => void)[]

    constructor(x: number, y: number) {
        this.previousPosition = new Vec2d(x, y)
        this.currentPosition = new Vec2d(x, y)
        this.afterUpdates = []
    }

    onUpdate(dt: number) {
        // Damper
        const velocity = this.currentPosition.substract(this.previousPosition)

        // Update Position
        this.previousPosition = this.currentPosition
        this.currentPosition = this.currentPosition.add(velocity).add(this.acceleration.multiply(dt * dt))

        // reset
        this.acceleration = Vec2d.ZERO

        // console.log(velocity)
        this.afterUpdates.forEach(it => it(this.currentPosition))
    }

    accelerate(a: Vec2d) {
        this.acceleration = this.acceleration.add(a)
    }

    applyGravity() {
        this.accelerate(new Vec2d(0, 1000));
    }

    registerAfterUpdate(setter: (pos: Vec2d) => void) {
        this.afterUpdates.push(setter)
    }

}

export class SpringDampingMass extends VerletObject {
    public SPRING_CONSTANT = 100
    public SPRING_CENTER = new Vec2d(100, 50)
    public DAMPING = 100
    public SIGNIFICANT_VELOCITY = 1

    // TODO


    onUpdate(dt: number) {
        // this.applyGravity()

        // Spring acceleration | reverse 
        const displacement = this.SPRING_CENTER.substract(this.currentPosition)
        this.accelerate(displacement.multiply(this.SPRING_CONSTANT))

        // Damper
        let velocity = this.currentPosition.substract(this.previousPosition)

        if ((Math.abs(velocity.x) < this.SIGNIFICANT_VELOCITY && Math.abs(velocity.y) < this.SIGNIFICANT_VELOCITY) &&
            (Math.abs(this.acceleration.x) < this.SIGNIFICANT_VELOCITY && Math.abs(this.acceleration.y) < this.SIGNIFICANT_VELOCITY)) {
            velocity = Vec2d.ZERO
            this.acceleration = Vec2d.ZERO

            // goto center
        }

        this.accelerate(velocity.multiply(-this.DAMPING))

        // Update Position
        this.previousPosition = this.currentPosition
        this.currentPosition = this.currentPosition.add(velocity).add(this.acceleration.multiply(dt * dt))

        // reset
        this.acceleration = Vec2d.ZERO

        // console.log(velocity)
        this.afterUpdates.forEach(it => it(this.currentPosition))
    }

}
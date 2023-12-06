import type { PhysicsObject } from "./runner";
import { Vec2d, limitDecay } from "./utils";

export class VerletObject implements PhysicsObject {
    public previousPosition: Vec2d
    public currentPosition: Vec2d
    public acceleration: Vec2d = Vec2d.ZERO
    public afterUpdates: ((pos: Vec2d, vel: Vec2d, dt: number) => void)[]
    public onStops: (() => void)[] = []

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
        this.afterUpdates.forEach(it => it(this.currentPosition, velocity, dt))
    }

    accelerate(a: Vec2d) {
        this.acceleration = this.acceleration.add(a)
    }

    applyGravity() {
        this.accelerate(new Vec2d(0, 1000));
    }

    registerAfterUpdate(setter: (pos: Vec2d, velocity: Vec2d, dt: number) => void) {
        this.afterUpdates.push(setter)
    }

    setPosition(position: Vec2d) {
        this.previousPosition = this.currentPosition.clone()
        this.currentPosition = position.clone()
    }

    registerOnStop(it: () => void) {
        this.onStops.push(it)
    }

}

export class SpringDampingMass extends VerletObject {

    public SPRING_CENTER = new Vec2d(100, 50)
    public SPRING_CONSTANT = 100
    public DAMPING = 100
    public SIGNIFICANT_VELOCITY = 0.3
    public MAX_VELOCITY = 1000

    private _naturalFreq = 0
    private _dampingRatio = 0

    private velocityWeight = 1

    // TODO
    set naturalFreq(val: number) {
        this._naturalFreq = val

        // w = sqrt k
        this.SPRING_CONSTANT = val * val

        this.afterControlUpdated()
    }

    get naturalFreq() {
        return Math.sqrt(this.SPRING_CONSTANT)
    }

    set dampingRatio(val: number) {
        this._dampingRatio = val
        this.afterControlUpdated()
    }

    get dampingRatio() {
        return this.DAMPING / (2 * this.naturalFreq)
    }

    private afterControlUpdated() {
        this.DAMPING = this._naturalFreq * this._dampingRatio * 2
    }

    setVelocityWeight(val: number) {
        this.velocityWeight = val
    }

    onUpdate(dt: number) {
        // this.applyGravity()

        // Spring acceleration | reverse 
        const displacement = this.SPRING_CENTER.substract(this.currentPosition)
        this.accelerate(displacement.multiply(this.SPRING_CONSTANT))

        // Damper
        let velocity = this.currentPosition.substract(this.previousPosition).multiply(this.velocityWeight)

        velocity.x = limitDecay(velocity.x / dt, this.MAX_VELOCITY) * dt
        velocity.y = limitDecay(velocity.y / dt, this.MAX_VELOCITY) * dt

        if ((Math.abs(velocity.x) < this.SIGNIFICANT_VELOCITY && Math.abs(velocity.y) < this.SIGNIFICANT_VELOCITY) &&
            (Math.abs(this.acceleration.x) < this.SIGNIFICANT_VELOCITY && Math.abs(this.acceleration.y) < this.SIGNIFICANT_VELOCITY)) {
            velocity = Vec2d.ZERO
            this.acceleration = Vec2d.ZERO
            this.onStops.forEach(it => it())
            // goto equalibrum
            this.currentPosition = this.SPRING_CENTER
            this.afterUpdates.forEach(it => it(this.currentPosition, velocity, dt))
            return
        }

        // Apply damping
        this.accelerate(velocity.multiply(-this.DAMPING))

        // Update Position
        this.previousPosition = this.currentPosition
        this.currentPosition = this.currentPosition.add(velocity).add(this.acceleration.multiply(dt * dt))

        // reset
        this.acceleration = Vec2d.ZERO
        this.velocityWeight = 1 // Use only on release

        // console.log(velocity)
        this.afterUpdates.forEach(it => it(this.currentPosition, velocity, dt))
    }

}
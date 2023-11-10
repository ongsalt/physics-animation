import { expoOut } from "svelte/easing";
import type { EasingFunction } from "svelte/transition";
import { toAbsoluteVelocity, toMatrixVelocity } from "./arithmetic";

export class ValueAnimator {
    public value: number
    public progress: number = 0 // from 0 to 1
    public timeProgress: number = 0

    constructor(
        private setter: (value: number) => void,
        /** in millisecond */
        private duration: number,
        private initialValue: number,
        private targetValue: number,
        public easing: EasingFunction = expoOut,
        public onDone?: () => void
    ) {
        this.value = initialValue
    }

    start() {
        const range = this.targetValue - this.initialValue
        let startTime = Date.now()
        const t = () => {
            const now = Date.now()
            this.timeProgress = now - startTime

            this.progress = this.easing(this.timeProgress / this.duration)

            this.value = this.progress * range + this.initialValue
            this.setter(this.value)

            // console.log(this.value)
            if (this.timeProgress < this.duration) {
                requestAnimationFrame(t)
            } else {
                this.setter(this.targetValue)
                if (this.onDone) {
                    this.onDone()
                }
            }
        }

        t()
    }
}

type Position = {
    x: number,
    y: number
}

export type Velocity = Position

export class PhysicsValueAnimator {
    public value: Position
    public velocity: Velocity
    public progress: number = 0 // from 0 to 1
    /** in second */
    public time: number = 0

    // mass, gravity, friction combined
    private damping = 10
    private springConstant: number = 0.5

    constructor(
        private setter: (value: Position) => void,
        /** in millisecond */
        private initialValue: Position,
        private targetValue: Position,
        private startingVelocity: Velocity,
        // private mass: number,
        // private gravity: number,
        // private friction: number,
        // private springConstant: number,
        private abortController?: AbortController,
        public onDone?: () => void
    ) {
        this.value = initialValue
        this.velocity = startingVelocity
    }

    start() {

        let startTime = Date.now()
        const t = () => {
            try {
                this.abortController?.signal.throwIfAborted()
            } catch {
                return
            }

            const now = Date.now()
            this.time = (now - startTime) / 1000

            // deacceleration due to friction(damping) = 10 px/s2
            // it should stop when original speed is no longer affect
            const deacceleration = 0
            const aVelocity = toAbsoluteVelocity(this.startingVelocity)
            aVelocity.velocity -= deacceleration * this.time

            const v = toMatrixVelocity(aVelocity)

            console.log("velocity", v, aVelocity)

            this.setter(this.value)

            this.value.x += v.x * this.time
            this.value.y += v.y * this.time

            // console.log(this.value)
            if (aVelocity.velocity > 0) {
                requestAnimationFrame(t)
            } else {
                // this.setter(this.targetValue)
                if (this.onDone) {
                    this.onDone()
                }
            }
        }
        t()


    }
}


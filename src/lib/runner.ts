import { Vec2d } from "./utils"

export class AnimationRunner {
    willStop: boolean = false
    objects: PhysicsObject[]

    constructor() {
        this.willStop = false
        this.objects = []
    }

    addObject(o: PhysicsObject) {
        this.objects.push(o)
    }

    start() {
        let lastTime = Date.now()
        const t = () => {
            const now = Date.now()
            const dt = (now - lastTime) / 1000
            if (dt < .01) {
                requestAnimationFrame(t)
                return
            }

            lastTime = now

            this.objects.forEach(it => {
                it.onUpdate(dt)
            })

            if (!this.willStop) {
                this.didStop()
                requestAnimationFrame(t)
            }
        }
        t()
    }

    stop() {
        this.willStop = true
    }

    didStop() {

    }
}

export interface PhysicsObject {
    onUpdate(dt: number): void
}
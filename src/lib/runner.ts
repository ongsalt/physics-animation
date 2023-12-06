import { Vec2d } from "./utils"

export class AnimationRunner {
    willStop: boolean = false
    onGoing = false
    pausing = false
    lowPowerMode = false
    objects: PhysicsObject[]

    constructor() {
        this.willStop = false
        this.objects = []
    }

    addObject(o: PhysicsObject) {
        o.registerOnStop(() => {
            this.stop()
        })
        this.objects.push(o)
    }

    start() {
        if (this.onGoing) {
            return
        } else {
            this.onGoing = true
        }
        let lastTime = Date.now()
        const t = () => {
            const now = Date.now()
            const dt = (now - lastTime) / 1000
            if (dt < .01) {
                requestAnimationFrame(t)
                return
            }

            lastTime = now
            if (this.pausing) {
                requestAnimationFrame(t)
                return
            }


            const subStep = 80
            let sdt = dt / subStep
            for (let i = 0; i < subStep; i++) {
                this.objects.forEach(it => {
                    it.onUpdate(sdt)
                })
            }

            if (this.willStop) {
                this.didStop()
            } else {
                requestAnimationFrame(t)
            }
        }
        t()
    }

    pause() {
        this.pausing = true
    }

    continue() {
        this.pausing = false
    }

    stop() {
        console.log('Motion: stopping')
        this.willStop = true
    }
    
    didStop() {
        console.log('Motion: stopped')
        this.willStop = false
        this.onGoing = false
    }
}

export interface PhysicsObject {
    onUpdate(dt: number): void,
    registerOnStop(it: () => void): void
}
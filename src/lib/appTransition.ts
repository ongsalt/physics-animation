import { Rect, Vec2d } from "./utils";

export class TargetRect {
    listeners: ((rect: Rect) => void)[]
    scale = 1
    isExpand = false
    public current: Rect

    constructor(public start = Rect.ZERO, public end = Rect.ZERO) {
        this.listeners = []
        this.current = Rect.ZERO
    }

    expand() {
        this.isExpand = true
        this.update()
    }

    collapse() {
        this.isExpand = false
        this.update()
    }

    toggle() {
        this.isExpand = !this.isExpand
        this.update()
    }

    update() {
        this.listeners.forEach(it => {
            if (this.isExpand) {
                it(this.end)
            } else {
                it(this.start)
            }
        })

    }

    getTranslate() {

    }

    onChange(callback: (s: Rect) => void) {
        this.listeners.push(callback)
    }
}


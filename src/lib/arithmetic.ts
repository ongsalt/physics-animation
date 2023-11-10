import type { Velocity } from "./animator";

type AbsoluteVelocity = {
    velocity: number,
    direction: number
}

export function toAbsoluteVelocity(velocity: Velocity): AbsoluteVelocity {
    return {
        velocity: Math.sqrt(velocity.x ** 2 + velocity.y ** 2),
        direction: Math.atan(velocity.y / velocity.x)
    }
}

export function toMatrixVelocity({ velocity, direction }: AbsoluteVelocity): Velocity {
    return {
        x: velocity * Math.cos(direction),
        y: velocity * Math.sin(direction)
    }
}

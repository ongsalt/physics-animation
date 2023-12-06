<script lang="ts">
    import { TargetRect } from "$lib/appTransition";
    import { AnimationRunner } from "$lib/runner";
    import { Rect, Vec2d } from "$lib/utils";
    import { SpringDampingMass } from "$lib/verlet";
    import { onMount } from "svelte";

    let deviceFrame: HTMLDivElement;
    let box: HTMLDivElement;
    let isDragging = false;
    let didRelease = false;

    let position = new Vec2d(0, 0);
    let dragOffset = new Vec2d(0, 0);
    let velocity = new Vec2d(0, 0);
    let prevVelocity = new Vec2d(0, 0);
    let lastTime = Date.now();

    let yDistance = 0;

    const runner = new AnimationRunner();
    const v = new SpringDampingMass(0, 0);
    const s = new SpringDampingMass(0, 0);

    v.dampingRatio = 5000;
    v.naturalFreq = 15;

    console.log(v.dampingRatio);
    console.log(v.naturalFreq);

    let targetRect = new TargetRect();

    let targetBoxCss = "";

    function updatePositionFromMouse(event: MouseEvent, doUpdatePosition = false) {
        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        position.x = event.clientX + dragOffset.x;
        position.y = event.clientY + dragOffset.y;
        prevVelocity = velocity;
        velocity = position.substract(v.previousPosition).multiply(1 / dt);
        if (doUpdatePosition) {
            v.setPosition(position)
        }
        console.log(velocity);
        // On release this should center at the bottom
        box.style.translate = `${position.x - targetRect.current.w / 2}px ${
            position.y - targetRect.current.h / 2
        }px`;

        yDistance = targetRect.start.center().y - position.y;

        return dt;
    }

    function dragHandler(event: MouseEvent) {
        if (isDragging) {
            updatePositionFromMouse(event, true);
        }
    }

    function onDragStart(event: MouseEvent) {
        console.log("start");
        runner.pause();
        isDragging = true;
        dragOffset.x = position.x - event.clientX;
        dragOffset.y = position.y - event.clientY;
    }

    function onDragEnd(event: MouseEvent) {
        if (isDragging) {
            const dt = updatePositionFromMouse(event);
            // v.setPosition(position);
            yDistance = targetRect.start.center().y - position.y;

            console.log("Release", velocity);
            console.log(
                "Release",
                v.currentPosition.substract(v.previousPosition).multiply(1 / dt)
            );

            // v.setVelocityWeight(0.2);

            // v.accelerate(velocity.substract(prevVelocity).multiply(1 / dt));

            runner.start(); // if not yet
            runner.continue();

            targetRect.collapse();
        }

        didRelease = true;
        isDragging = false;
    }

    onMount(() => {
        const iconRect = new Rect(42, 42, 42, 42);
        const screenRect = new Rect(
            deviceFrame.clientWidth,
            deviceFrame.clientHeight,
            0,
            0
        );

        targetRect.start = iconRect;
        targetRect.end = screenRect;

        yDistance = targetRect.start.center().y - targetRect.end.center().y;

        targetRect.onChange((rect) => {
            console.log(rect.css());
            targetBoxCss = rect.css();
            v.SPRING_CENTER = rect.center();
        });
        targetRect.update();

        v.registerAfterUpdate((pos, vel, dt) => {
            position = pos.clone();
            prevVelocity = velocity;
            velocity = vel.multiply(1 / dt);

            // Change on relaese

            let scaleProgress =
                (targetRect.start.center().y - position.y) / yDistance;

            let scale = // currentRect.w
                1 + scaleProgress * (targetRect.end.w / targetRect.start.w - 1);

            if (scale < -1) {
                scale = -1;
            }

            const maxH =
                (targetRect.end.h / targetRect.end.w) * targetRect.start.w;
            let h = Math.abs(42 + scaleProgress * (maxH - 42));

            box.style.height = `${h * scale}px`;
            box.style.width = `${42 * scale}px`;

            const x1 = (pos.x - 42 / 2) * (1 - scaleProgress);
            const y1 = (pos.y - h / 2) * (1 - scaleProgress);

            targetRect.current = new Rect(42 * scale, h * scale, x1, y1);
            box.style.translate = `${position.x - targetRect.current.w / 2}px ${
                position.y - targetRect.current.h / 2
            }px`;

            box.style.borderRadius = `${scaleProgress * (28 - 21) + 21}px`;
        });

        runner.addObject(v);
        runner.start();
        v.registerOnStop(() => {
            didRelease = false;
            yDistance = targetRect.start.center().y - targetRect.end.center().y;
        });
    });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:mousemove={dragHandler} on:mouseup={onDragEnd}>
    <div id="canvas" class="device" bind:this={deviceFrame}>
        <div class="box target" style={targetBoxCss} />
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="box" bind:this={box} on:mousedown={onDragStart} />
    </div>
    <div id="settings" class="control">
        <h2>Settings</h2>
        <div>
            <label for="damping"> Damping </label>
            <input name="damping" type="number" bind:value={v.DAMPING} />
        </div>

        <div>
            <label for="k-c"> Spring constant </label>
            <input name="k-c" type="number" bind:value={v.SPRING_CONSTANT} />
        </div>
        <div>
            <label for="x"> x </label>
            <input name="x" type="number" bind:value={position.x} />
        </div>
        <div>
            <label for="y"> y </label>
            <input name="y" type="number" bind:value={position.y} />
        </div>
        <div>
            <h3>Velocity</h3>
            <p>x: {velocity.x}</p>
            <p>x: {velocity.y}</p>
        </div>
        <div>
            <h3>yDistance</h3>
            <p>distance: {yDistance}</p>
            <p>position: {targetRect.start.center().y - position.y}</p>
            <p>
                progress: {(targetRect.start.center().y - position.y) /
                    yDistance}
            </p>
        </div>
        <div>
            <h3>MotionEngine</h3>
            <button on:click={() => runner.start()}> Start </button>
            <button on:click={() => runner.stop()}> Stop </button>
            <button
                on:click={() => {
                    v.setPosition(v.SPRING_CENTER);
                    v.setPosition(v.SPRING_CENTER);
                }}
            >
                Reset
            </button>
        </div>
        <div>
            <h3>Transition</h3>
            <button
                on:click={() => {
                    targetRect.toggle();
                    runner.start();
                    yDistance =
                        targetRect.start.center().y - targetRect.end.center().y;
                }}
            >
                Toggle
            </button>
        </div>
    </div>
</main>

<style>
    html,
    body {
        /* height: 100vh; */
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    * {
        margin: 0;
        padding: 0;
    }

    main {
        display: grid;
        grid-template-columns: 3fr 1fr;
        height: 100vh;
        background-color: #ededed;
        place-items: center;
    }

    .box {
        position: absolute;
        border-radius: 21px;
        background-color: blue;
        width: 42px;
        height: 42px;

        &.target {
            background-color: #ff000040;
        }
    }

    .device {
        position: relative;
        border: 1px solid #00000030;
        border-radius: 28px;
        aspect-ratio: 9/19.5;
        /* padding: 12px; */
        width: 280px;
        overflow: hidden;
        box-shadow: 0px 4px 24px #00000035;
        box-sizing: border-box;
    }

    .control {
        background-color: white;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 4px;
    }
</style>

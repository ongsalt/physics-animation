<script lang="ts">
    import { AnimationRunner } from "$lib/runner";
    import { Vec2d } from "$lib/utils";
    import { SpringDampingMass } from "$lib/verlet";

    let isDragging = false;

    let position = new Vec2d(0, 0);
    let dragOffset = new Vec2d(0, 0);
    let velocity = new Vec2d(0, 0);
    let lastTime = Date.now();

    function dragHandler(event: MouseEvent) {
        if (isDragging) {
            const dt = (Date.now() - lastTime) / 1000;
            lastTime = Date.now();

            position.x = event.clientX + dragOffset.x;
            position.y = event.clientY + dragOffset.y;
            velocity = position.substract(v.previousPosition).multiply(1 / dt);
            v.setPosition(position);
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
        console.log("fejubyb");
        runner.continue();
        isDragging = false;
    }

    const runner = new AnimationRunner();
    const v = new SpringDampingMass(0, 0);

    v.dampingRatio = 500;
    v.naturalFreq = 10;

    console.log(v.dampingRatio);
    console.log(v.naturalFreq);

    v.registerAfterUpdate((pos, vel) => {
        position = pos.clone();
        velocity = vel.clone();
    });

    runner.addObject(v);

    $: translate = `${position.x}px ${position.y}px`;

    $: translateTarget = `${v.SPRING_CENTER.x}px ${v.SPRING_CENTER.y}px`;
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:mousemove={dragHandler} on:mouseup={onDragEnd}>
    <div id="canvas" class="card">
        <div class="box target" style="translate: {translateTarget}" />
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="box"
            style="translate: {translate}"
            on:mousedown={onDragStart}
        />
    </div>
    <div id="settings" class="card">
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
            <h3>Control</h3>
            <button on:click={() => runner.start()}> Start </button>
            <button on:click={() => runner.stop()}> Stop </button>
        </div>
    </div>
</main>

<style>
    main {
        background-color: rgb(242, 244, 247);
        height: 100vh;
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 1rem;
        padding: 1rem;
        box-sizing: border-box;
    }

    .box {
        position: fixed;
        background-color: #ff0000;
        height: 42px;
        width: 42px;

        &.target {
            background-color: #ff000050;
            /* z-index: -1; */
            pointer-events: none;
        }
    }

    .card {
        background-color: white;
        border: 1px solid #00000020;
        padding: 1rem;
        border-radius: 0.8rem;
    }

    @media (prefers-color-scheme: dark) {
        main {
            background: #000;
            color: white;
        }
        .card {
            background-color: #111;
            border: 1px solid #ffffff20;
            padding: 1rem;
            border-radius: 0.8rem;
        }
    }
</style>

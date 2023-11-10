<script lang="ts">
    import { AnimationRunner } from "$lib/runner";
    import { Vec2d } from "$lib/utils";
    import { SpringDampingMass, VerletObject } from "$lib/verlet";

    let isDragging = false;

    let position = new Vec2d(0, 0);
    let velocity = new Vec2d(0, 0);

    let tx = 640;
    let ty = 240;

    $: translate = `${position.x}px ${position.y}px`;

    $: translateTarget = `${tx}px ${ty}px`;

    function dragHandler(event: MouseEvent) {
        if (isDragging) {
        }
    }

    function onDragStart(event: MouseEvent) {
        isDragging = true;
    }

    function onDragEnd(event: MouseEvent) {
        isDragging = false;
    }

    const runner = new AnimationRunner();
    const v = new SpringDampingMass(0, 0);

    v.registerAfterUpdate((pos) => {
        // console.log(pos)
        position = pos;
    });

    runner.addObject(v);

    runner.start()
</script>

<main on:mousemove={dragHandler}>
    <div id="canvas" class="card">
        <div class="box target" style="translate: {translateTarget}" />
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="spring-boundary">
            <div
                class="box"
                style="translate: {translate}"
                on:mousedown={onDragStart}
                on:mouseup={onDragEnd}
            />
        </div>
    </div>
    <div id="settings" class="card">
        <h2>Settings</h2>
        <div>
            <label for="friction"> Friction </label>
            <input name="friction" type="number" />
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
            <p>x: {"velocityX"}</p>
            <p>x: {"velocityY"}</p>
        </div>
        <div>
            <h3>Control</h3>
            <button> Start </button>
            <button> Stop </button>
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

    .spring-boundary {
        background-color: #ff000010;
        width: 500px;
    }

    .card {
        background-color: white;
        border: 1px solid #00000020;
        padding: 1rem;
        border-radius: 0.8rem;
    }
</style>

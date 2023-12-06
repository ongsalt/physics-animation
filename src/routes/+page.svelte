<script lang="ts">
    import { PhysicsValueAnimator, ValueAnimator } from "$lib/animator";

    // 1m = 100px

    // kinetic factor
    let mass = 1;
    let gravity = 9.8;
    let friction = 0;

    let isDragging = false;
    let isFlinging = false;
    let lastUpdateTime = Date.now();
    let timeDiff = 0;

    const abortController = new AbortController()

    const startPadding = {
        x: 0,
        y: 0,
    };

    let x = 0;
    let y = 0;
    let dx = 1;
    let dy = 1;

    let tx = 640;
    let ty = 240;

    $: translate = `${x}px ${y}px`;

    $: translateTarget = `${tx}px ${ty}px`;

    let velocityX = 0; // px s
    let velocityY = 0;

    // $: {
    //     console.log(velocityX, velocityY);
    // }

    function dragHandler(event: MouseEvent) {
        if (isDragging) {
            timeDiff = (Date.now() - lastUpdateTime) / 1000;
            lastUpdateTime = Date.now();
            const newX = event.clientX - startPadding.x;
            const newY = event.clientY - startPadding.y;
            dx = newX - x;
            dy = newY - y;
            velocityX = dx / timeDiff
            velocityY = dy / timeDiff
            x = newX;
            y = newY;
        }
    }

    function onDragStart(event: MouseEvent) {
        isDragging = true;
        startPadding.x = event.clientX - x;
        startPadding.y = event.clientY - y;
    }

    function onDragEnd(event: MouseEvent) {
        isDragging = false;
        aStart()
    }

    async function aStart() {
        console.log("start");

        // Deep copy
        const startPos = {
            x: x,
            y: y
        }
        const startVelocity = {
            x: velocityX,
            y: velocityY
        }
        
        console.log(startPos, startVelocity)
    }

    function aStop() {
        abortController.abort()
    }
</script>

<main on:mousemove={dragHandler}>
    <div id="canvas" class="card">
        <div class="box target" style="translate: {translateTarget}" />
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="box"
            style="translate: {translate}"
            on:mousedown={onDragStart}
            on:mouseup={onDragEnd}
        />
    </div>
    <div id="settings" class="card">
        <h1>
            This shit dont work. Pls go to <a href="/verlet">verlet</a>
        </h1>
        <h2>
            Also <a href="/sizeTransform">iOS app opening animation</a>
        </h2>
        <h2>Settings</h2>
        <div>
            <label for="friction"> Friction </label>
            <input name="friction" type="number" bind:value={friction} />
        </div>
        <div>
            <label for="x"> x </label>
            <input name="x" type="number" bind:value={x} />
        </div>
        <div>
            <label for="y"> y </label>
            <input name="y" type="number" bind:value={y} />
        </div>
        <div>
            <h3>Velocity</h3>
            <p>x: {velocityX}</p>
            <p>x: {velocityY}</p>
            
        </div>
        <div>
            <h3>Control</h3>
            <button on:click={aStart}> Start </button>
            <button on:click={aStop}> Stop </button>
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

    #settings {
    }

    #canvas {
    }

    .card {
        background-color: white;
        border: 1px solid #00000020;
        padding: 1rem;
        border-radius: 0.8rem;
    }
</style>

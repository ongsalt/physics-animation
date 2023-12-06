<div class="app" id="app">
    <div class="statusbar app-statusbar" id="app-statusbar">
        <p>12.30</p>
        <div>
            <svg
                id="wifi"
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentColor"
                    d="M12 21q-1.05 0-1.775-.725T9.5 18.5q0-1.05.725-1.775T12 16q1.05 0 1.775.725T14.5 18.5q0 1.05-.725 1.775T12 21Zm-5.65-5.65l-2.1-2.15q1.475-1.475 3.463-2.337T12 10q2.3 0 4.288.875t3.462 2.375l-2.1 2.1q-1.1-1.1-2.55-1.725T12 13q-1.65 0-3.1.625T6.35 15.35ZM2.1 11.1L0 9q2.3-2.35 5.375-3.675T12 4q3.55 0 6.625 1.325T24 9l-2.1 2.1q-1.925-1.925-4.463-3.013T12 7Q9.1 7 6.562 8.088T2.1 11.1Z"
                />
            </svg>
            <svg
                id="battery"
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentColor"
                    fill-opacity=".3"
                    d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V9h10V5.33z"
                />
                <path
                    fill="currentColor"
                    d="M7 9v11.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V9H7z"
                />
            </svg>
        </div>
    </div>
    <div class="app-clip" id="app-clip">
        <h1>Settings</h1>
        <div class="search">Search</div>
        <div class="list">
            <p class="list-item">Wifi</p>
            <p class="list-item">Bluetooth</p>
            <p class="list-item">Sound</p>
            <p class="list-item">Notification</p>
        </div>
        <div class="list">
            <p class="list-item">hfughiufeg</p>
            <p class="list-item">hfughiufeg</p>
            <p class="list-item">hfughiufeg</p>
            <p class="list-item">hfughiufeg</p>
        </div>
        <div class="list">
            <p class="list-item">Test</p>
            <p class="list-item">Test</p>
            <p class="list-item">Test</p>
            <p class="list-item">Test</p>
        </div>
        <div class="navbar-area" id="navbar-area">
            <div class="navbar" id="app-navbar" />
        </div>
    </div>
</div>

<style scoped>
    :root {
        --app-bg: #f3f2f7;
    }

    .app {
        position: absolute;
        height: 100%;
        width: 100%;
        border-radius: 28px;
    }

    .app-clip {
        position: relative;
        background-color: var(--app-bg);
        padding: 16px;
        box-sizing: border-box;
        padding-top: 48px;
        overflow: hidden;
        border-radius: 28px;
        height: 100%;
        width: 100%;
    }

    .search {
        margin-top: 16px;
        background-color: #00000010;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 0.8rem;
        color: #00000040;
    }

    .list {
        margin-top: 16px;
        border-radius: 6px;
        background-color: white;
        padding: 0 12px;

        &>.list-item {
            font-size: 0.9rem;
            padding: 10px 0;

            &:not(:last-child) {
                border-bottom: 1px solid #00001015;
            }
        }
    }

    .navbar {
        background-color: black;
        border-radius: 2px;
        height: 4px;
        bottom: 4px;
        width: 110px;
    }

    .navbar-area {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

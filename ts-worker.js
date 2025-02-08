const { parentPort } = require("worker_threads");
const { spawnSync } = require("child_process");

parentPort.on("message", ({ code, input }) => {
    try {
        // Run TypeScript code directly using ts-node
        const execProcess = spawnSync("ts-node", ["-e", code], {
            input,
            encoding: "utf-8",
            timeout: 2000,
        });

        if (execProcess.status !== 0) {
            return parentPort.postMessage({
                error: { fullError: `Runtime Error:\n${execProcess.stderr}` },
            });
        }

        parentPort.postMessage({
            output: execProcess.stdout.trim() || "No output received!",
        });
    } catch (err) {
        parentPort.postMessage({
            error: { fullError: `Server error: ${err.message}` },
        });
    }
});

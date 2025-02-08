const { parentPort } = require("worker_threads");
const { spawnSync } = require("child_process");

parentPort.on("message", ({ code, input }) => {
    try {
        // Execute TypeScript code using ts-node with a higher timeout
        const execProcess = spawnSync("ts-node", ["--transpile-only", "-e", code], {
            input,
            encoding: "utf-8",
            timeout: 10000, // Increased timeout to 5 seconds
        });

        if (execProcess.error) {
            return parentPort.postMessage({
                error: { fullError: `Execution Error:\n${execProcess.error.message}` },
            });
        }

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

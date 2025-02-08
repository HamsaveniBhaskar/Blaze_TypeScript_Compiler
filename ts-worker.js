const { parentPort } = require("worker_threads");
const { spawnSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

parentPort.on("message", ({ code, input }) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ts-"));
    const tsFile = path.join(tmpDir, "script.ts");
    const jsFile = path.join(tmpDir, "script.js");

    try {
        fs.writeFileSync(tsFile, code);

        // Compile TypeScript code
        const compileProcess = spawnSync("tsc", [tsFile], { encoding: "utf-8" });
        if (compileProcess.status !== 0) {
            return parentPort.postMessage({
                error: { fullError: `Compilation Error:\n${compileProcess.stderr}` },
            });
        }

        // Run the compiled JavaScript file
        const execProcess = spawnSync("node", [jsFile], {
            input,
            encoding: "utf-8",
            timeout: 2000,
        });

        // Clean up temporary files
        fs.rmSync(tmpDir, { recursive: true, force: true });

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

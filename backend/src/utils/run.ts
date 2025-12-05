import { spawn } from "child_process";

interface RunOptions {
  env?: Record<string, string>;
  cwd?: string; // optional working directory
}

export default function run(
  command: string,
  onLiveLog?: (line: string) => void,
  options: RunOptions = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(" ");

    let logs = "";

    const child = spawn(cmd, args, {
      shell: true,
      cwd: options.cwd || process.cwd(),
      env: {
        ...process.env, // inherit current env
        ...options.env, // merge custom env vars
      },
    });

    // LIVE STDOUT
    child.stdout.on("data", (data) => {
      const text = data.toString();
      logs += text;
      if (onLiveLog) onLiveLog(text);
    });

    // LIVE STDERR
    child.stderr.on("data", (data) => {
      const text = data.toString();
      logs += text;
      if (onLiveLog) onLiveLog(text);
    });

    child.on("close", () => resolve(logs));

    child.on("error", reject);
  });
}

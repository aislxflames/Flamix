import run from "../utils/run.js";
import { io } from "../server.js";

interface CmdOptions {
  env?: Record<string, string>;
  cwd?: string;
}

export async function runCmd(
  cmd: string,
  channel: string,
  options: CmdOptions = {},
) {
  return run(
    cmd,
    (line) => {
      io.emit(channel, line);
    },
    options,
  );
}

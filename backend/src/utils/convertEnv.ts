export const convertEnvToEnvFile = (
  env: Record<string, string> | Map<string, string> | undefined,
) => {
  if (!env) return "";

  // Convert Map → normal object
  const envObject = env instanceof Map ? Object.fromEntries(env) : env;

  let envText = "";
  for (const [key, value] of Object.entries(envObject)) {
    envText += `${key}=${value}\n`;
  }

  return envText;
};

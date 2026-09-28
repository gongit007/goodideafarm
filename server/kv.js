export function kvEnv() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

export function hasKv() {
  return Boolean(kvEnv());
}

let client = null;

export async function getKv() {
  const env = kvEnv();
  if (!env) throw new Error("KV_NOT_CONFIGURED");
  if (!client) {
    const { createClient } = await import("@vercel/kv");
    client = createClient({ url: env.url, token: env.token });
  }
  return client;
}

export function storageMode() {
  if (hasKv()) return "kv";
  if (process.env.VERCEL) return "missing-kv";
  return "file";
}

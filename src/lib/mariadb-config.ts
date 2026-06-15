const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export type MariaDbPoolConfig = {
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  allowPublicKeyRetrieval?: boolean;
  [key: string]: string | number | boolean | undefined;
};

export function createMariaDbPoolConfig(databaseUrl: string): MariaDbPoolConfig {
  const url = new URL(databaseUrl);
  const config: MariaDbPoolConfig = {
    host: url.hostname,
    port: url.port ? Number(url.port) : undefined,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
  };

  for (const [key, value] of url.searchParams) {
    config[key] = parseConnectionValue(value);
  }

  if (
    process.env.NODE_ENV !== "production" &&
    LOCAL_DATABASE_HOSTS.has(url.hostname) &&
    config.allowPublicKeyRetrieval === undefined
  ) {
    config.allowPublicKeyRetrieval = true;
  }

  return config;
}

function parseConnectionValue(value: string): string | number | boolean {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }

  return value;
}

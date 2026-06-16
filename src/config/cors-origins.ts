/**
 * Browser origins allowed for credentialed CORS. Merge `CORS_ORIGINS` (comma-separated)
 * from the environment with this default list.
 */
const DEFAULT_CORS_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:5173",
  "https://www.hirehelpinghand.com",
  "https://hirehelpinghand.com",
  "https://hire-helping-hand-fron-git-e86bff-prem-sagars-projects-34ff8684.vercel.app",
  "https://hire-helping-hand-frontend-kj522zad3.vercel.app",
];

export function getCorsOrigins(): string[] {
  const fromEnv =
    process.env.CORS_ORIGINS?.split(",")
      .map((o) => o.trim())
      .filter(Boolean) ?? [];
  return [...new Set([...DEFAULT_CORS_ORIGINS, ...fromEnv])];
}

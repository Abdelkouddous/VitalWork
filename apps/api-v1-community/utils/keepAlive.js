import https from "https";
import http from "http";

/**
 * Production Keep-Alive Worker
 *
 * Computer Science & Cloud Infrastructure Concept:
 * Render's free tier idles web services after 15 minutes of inactivity on their
 * edge ingress proxy. Internal localhost pings (127.0.0.1) bypass Render's proxy
 * and fail to reset the idle countdown.
 *
 * This worker issues an external HTTP(S) request to the public deployment URL
 * every 10 minutes (600,000 ms), traversing the edge load balancer and
 * keeping the container in an active state.
 */
export function startKeepAliveWorker() {
  if (process.env.NODE_ENV === "test") {
    return null;
  }

  const rawUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.APP_URL ||
    "https://medcareer.onrender.com";

  // Target the lightweight health-check endpoint
  const targetUrl = `${rawUrl.replace(/\/$/, "")}/api/v1/health`;
  const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes (strictly < 15m threshold)

  console.log(`[KeepAlive] Initializing 10-minute heartbeat targeting: ${targetUrl}`);

  const pingServer = () => {
    try {
      const client = targetUrl.startsWith("https") ? https : http;
      
      const req = client.get(targetUrl, { timeout: 20000 }, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[KeepAlive] Heartbeat acknowledged (Status: ${res.statusCode}) at ${new Date().toISOString()}`);
        } else {
          console.warn(`[KeepAlive] Heartbeat returned unexpected status: ${res.statusCode}`);
        }
        res.resume(); // Consume response data to free memory
      });

      req.on("error", (err) => {
        console.warn(`[KeepAlive] Heartbeat ping failed gracefully: ${err.message}`);
      });

      req.on("timeout", () => {
        req.destroy();
        console.warn("[KeepAlive] Heartbeat ping timed out after 20s");
      });
    } catch (err) {
      console.warn(`[KeepAlive] Worker exception: ${err.message}`);
    }
  };

  // Schedule initial warm-up ping after 3 minutes, then recurring every 10 minutes
  const initialTimer = setTimeout(pingServer, 3 * 60 * 1000);
  initialTimer.unref();

  const intervalTimer = setInterval(pingServer, PING_INTERVAL_MS);
  intervalTimer.unref(); // Ensure process can exit gracefully without being held by timer

  return { initialTimer, intervalTimer };
}

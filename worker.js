// ============================================
// RajaKumar18.in — Cloudflare Worker (FINAL)
// ============================================

const BOT_TOKEN = "8718819406:AAFAnYJDYXfBKiUNfYLUUgTUXvZ2O2MV91I"; 
const CHANNEL_ID = "-1008528668387"; // ✅ आपकी आईडी के साथ एकदम सटीक
const ADMIN_PASS = "968231"; 

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
  const url = new URL(request.url);
  const path = url.pathname;
  
  if (path === "/upload" && request.method === "POST") return uploadVideo(request);
  if (path === "/videos" && request.method === "GET") return getVideos();
  
  return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: CORS });
}

async function uploadVideo(request) {
  try {
    const formData = await request.formData();
    const video = formData.get("video");
    const title = formData.get("title") || "New Video";

    if (!video) return new Response(JSON.stringify({ error: "No video" }), { status: 400, headers: CORS });

    const tgForm = new FormData();
    tgForm.append("chat_id", CHANNEL_ID);
    tgForm.append("video", video);
    tgForm.append("caption", `🎬 ${title}\n\n#rajakumar18`);
    tgForm.append("supports_streaming", "true");

    const tgRes = await fetch(`${TELEGRAM_API}/sendVideo`, { method: "POST", body: tgForm });
    const tgData = await tgRes.json();
    return new Response(JSON.stringify({ success: tgData.ok, data: tgData }), { headers: CORS });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
  }
}

async function getVideos() {
  const res = await fetch(`${TELEGRAM_API}/getUpdates?limit=50`);
  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: CORS });
}

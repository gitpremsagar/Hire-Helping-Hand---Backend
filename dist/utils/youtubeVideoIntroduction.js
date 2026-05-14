/**
 * Parse a YouTube video id from a watch URL, embed URL, shorts URL, or iframe snippet.
 * Does not accept arbitrary URLs — only known YouTube hosts and paths.
 */
const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;
function isValidVideoId(id) {
    return VIDEO_ID_RE.test(id);
}
function isAllowedYouTubeHost(hostname) {
    const h = hostname.toLowerCase();
    return (h === "youtube.com" ||
        h === "www.youtube.com" ||
        h === "m.youtube.com" ||
        h === "music.youtube.com" ||
        h === "youtu.be" ||
        h === "www.youtube-nocookie.com" ||
        h === "youtube-nocookie.com");
}
/**
 * Returns the 11-character video id or null if the input is not a recognized YouTube reference.
 */
export function parseYoutubeVideoIdFromInput(raw) {
    if (!raw || typeof raw !== "string")
        return null;
    let input = raw.trim();
    if (!input)
        return null;
    const iframeMatch = input.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (iframeMatch?.[1]) {
        input = iframeMatch[1].trim();
    }
    let href = input;
    if (!/^https?:\/\//i.test(href)) {
        href = `https://${href}`;
    }
    let url;
    try {
        url = new URL(href);
    }
    catch {
        return null;
    }
    if (!isAllowedYouTubeHost(url.hostname))
        return null;
    const host = url.hostname.toLowerCase();
    if (host === "youtu.be") {
        const seg = url.pathname.split("/").filter(Boolean)[0];
        return seg && isValidVideoId(seg) ? seg : null;
    }
    const path = url.pathname;
    const embed = path.match(/^\/embed\/([^/?]+)/);
    if (embed?.[1] && isValidVideoId(embed[1]))
        return embed[1];
    const shorts = path.match(/^\/shorts\/([^/?]+)/);
    if (shorts?.[1] && isValidVideoId(shorts[1]))
        return shorts[1];
    const live = path.match(/^\/live\/([^/?]+)/);
    if (live?.[1] && isValidVideoId(live[1]))
        return live[1];
    if (path === "/watch" || path.startsWith("/watch")) {
        const v = url.searchParams.get("v");
        if (v && isValidVideoId(v))
            return v;
    }
    return null;
}
export function canonicalYoutubeEmbedUrl(videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
}
//# sourceMappingURL=youtubeVideoIntroduction.js.map
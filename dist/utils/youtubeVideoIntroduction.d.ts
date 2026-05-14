/**
 * Parse a YouTube video id from a watch URL, embed URL, shorts URL, or iframe snippet.
 * Does not accept arbitrary URLs — only known YouTube hosts and paths.
 */
/**
 * Returns the 11-character video id or null if the input is not a recognized YouTube reference.
 */
export declare function parseYoutubeVideoIdFromInput(raw: string): string | null;
export declare function canonicalYoutubeEmbedUrl(videoId: string): string;
//# sourceMappingURL=youtubeVideoIntroduction.d.ts.map
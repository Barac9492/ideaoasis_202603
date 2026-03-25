/** Unified post type that both ProductHunt and Reddit posts map to */
export interface SourcePost {
  id: string;
  source: "producthunt" | "reddit";
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  thumbnailUrl: string | null;
  createdAt: string;
}

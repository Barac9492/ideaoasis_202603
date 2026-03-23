import fs from "node:fs";
import path from "node:path";
import { Feed } from "feed";
import { getAllDigestDates, getDigestByDate } from "@/lib/data";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export function generateRSS() {
  const feed = new Feed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: "ko",
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `${new Date().getFullYear()} ${SITE_NAME}`,
    feedLinks: {
      atom: `${SITE_URL}/feed.xml`,
    },
    author: { name: SITE_NAME, link: SITE_URL },
  });

  const dates = getAllDigestDates().slice(0, 30);

  for (const date of dates) {
    const digest = getDigestByDate(date);
    if (!digest) continue;

    const content = digest.ideas
      .map(
        (idea) =>
          `<h3>#${idea.rank} ${idea.title_ko}</h3><p>${idea.summary_ko}</p>`
      )
      .join("");

    feed.addItem({
      title: `IdeaOasis ${date} — 오늘의 TOP 5`,
      id: `${SITE_URL}/?date=${date}`,
      link: `${SITE_URL}/`,
      description: digest.ideas.map((i) => i.title_ko).join(" · "),
      content,
      date: new Date(digest.generated_at),
    });
  }

  const outPath = path.join(process.cwd(), "public", "feed.xml");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, feed.atom1());
  console.log(`[IdeaOasis] RSS feed written to ${outPath}`);
}

// Run directly
generateRSS();

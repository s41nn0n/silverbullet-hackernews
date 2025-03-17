import { editor, system } from "@silverbulletmd/silverbullet/syscalls";

type hnData = {
  title: string;
  author?: string;
  text?: string;
  url: string;
  points: number;
  comment_count: number;
  source_url?: string;
  created_at?: string;
  children?: hnData;
};

export async function hide() {
  await editor.hidePanel("lhs");
}

export async function searchHackerNews() {
  const query = await editor.prompt("Search Hacker News:");
  if (!query) return;

  await searchAndSave(
    `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}`,
    `Hacker News Results for "${query}"`,
    `🔍 HN ${query}`,
  );
}

//
// Search Hacker News and return results as clickable links
export async function searchAndSave(
  uri: string,
  pageTitle: string,
  filePath: string,
) {
  const config = await system.getSpaceConfig("hackernews");
  const inline = config?.inline || false;
  const panelType = config?.panelType || "lhs";
  const basePath = config?.baseOutPath || "";

  if (!uri) {
    await editor.flashNotification("Unable to fetch empty URL");
    return;
  }

  if (!pageTitle) {
    await editor.flashNotification("Unknown Page Title", "error");
    return;
  }

  if (!filePath) {
    await editor.flashNotification("Unknown File", "error");
    return;
  }

  try {
    const results = await queryHN(uri);

    if (results.length === 0) {
      await editor.flashNotification(`No results for ${pageTitle}`, "info");
      return;
    }

    if (!inline) {
      const output = generateStoryHtml(results);

      const text = await editor.getText();
      if (text) {
        const lineCount = text.split("\n").length;
        await editor.moveCursor(lineCount);
      }

      await editor.showPanel(
        panelType,
        1,
        `<h1 onclick="syscall('system.invokeFunction', 'hackernews.hide');"> ${pageTitle} ❌ </h1> <br> <h2>URI</h2>: <a href="${uri}">${uri}</a> ${output}`,
      );
    } else {
      const output = generateStoryMarkdown(results);

      if (basePath != "" && !basePath.endsWith("/")) {
        filePath = `${basePath}${filePath}`;
        filePath = `${basePath}/${filePath}`;
      } else {
        filePath = `${basePath}${filePath}`;
      }

      await editor.navigate({ kind: "page", page: filePath });
      await editor.insertAtCursor(
        `\n## ${pageTitle}\nURI: [${uri}](${uri})\n${output}\n`,
      );
    }

    await editor.flashNotification(`${pageTitle} inserted!`, "info");
  } catch (error) {
    console.error("Error In searchAndSave:", error);
    await editor.flashNotification(`Error getting ${pageTitle}!`, "error");
    return [];
  }
}

function generateStoryHtml(data: hnData[]): string {
  return data.map((item: hnData) =>
    `<br> <a href="${item.source_url}" target="_blank">🌐 ${item.title} (${item.points} points)</a> - <a href="${item.url}" target="_blank">💬 (${item.comment_count} points)</a> `
  )
    .join("<br>");
}

function generateStoryMarkdown(data: hnData[]): string {
  return data.map((item: hnData) =>
    `- [🌐 ${item.title} (${item.points} points)](${item.source_url}) - [💬 (${item.comment_count} points)](${item.url})`
  )
    .join("\n");
}

// Search Hacker News and return results
export async function queryHN(uri: string): Promise<hnData[]> {
  if (!uri) return [];
  try {
    const response = await fetch(`${uri}`);
    const data = await response.json();
    console.log(data);

    await editor.flashNotification(`There are ${data.nbHits} hits`, "info");

    return data.hits.map((item: any) => ({
      title: item.title,
      url: `https://news.ycombinator.com/item?id=${item.objectID}`,
      points: item.points,
      comment_count: item.num_comments,
      source_url: item.url,
    }));
  } catch (error) {
    console.error("Error fetching Hacker News data:", error);
    return [];
  }
}

// Command to list today's top stories
export async function frontPage() {
  const today = new Date().toISOString().split("T")[0];
  await searchAndSave(
    `https://hn.algolia.com/api/v1/search_by_date?tags=front_page`,
    `🏆 Front Page ${today}`,
    "Front Page",
  );
}

type Comment = {
  By: string;
  Text: string;
  Time: number;
  Kids: Comment[];
  Parent: string;
  ID: string;
};

// This will return the comment and parse it so it returns the params for the body
function parseBodyText(
  bodyText: string,
): { id: number; depth: number; children: number } | null {
  if (!bodyText) return null;

  console.log(bodyText);

  // At this point we should get the config and parse it here
  // Default values
  let parsed = {
    id: 0, // Required
    depth: 1,
    children: -1,
  };

  // Check if the data is the ID
  const singleComment = Number(bodyText.trim());
  if (!isNaN(singleComment)) {
    parsed.id = singleComment;
    return parsed;
  }

  // Search for each of the keys
  const commentMatch = bodyText.match(/id:\s*(\d+)/i);
  const depthMatch = bodyText.match(/depth:\s*(\d+)/i);
  const childrenMatch = bodyText.match(/children:\s*(\d+)/i);

  // Assign values if found
  if (commentMatch) parsed.id = Number(commentMatch[1]);
  if (depthMatch) parsed.depth = Number(depthMatch[1]);
  if (childrenMatch) parsed.children = Number(childrenMatch[1]);

  if (parsed.depth >= 1) parsed.depth++

  // If comment is still 0, return null (invalid input)
  return parsed.id ? parsed : null;
}

// Search Hacker News and return results
// commentId is the parent id
// childrenLeft is the number of children left
// depth is the max depth we can fetch
export async function queryHNComments(
  commentId: number,
  childrenLeft: number = -1,
  depth: number = -1,
): Promise<Comment | null> {
  if (!commentId) return null;
  if (depth == 0) {
    return null;
  }
  try {
    const currentDepth = depth - 1;

    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`,
    );
    const data = await response.json();

    if (!data) return null;

    let children: Comment[] = [];
    if (data.kids) {
      let currentChild = childrenLeft;
      for (const childId of data.kids) {
        if (currentChild == 0) {
          break;
        }
        currentChild = currentChild - 1;
        const childComment = await queryHNComments(
          childId,
          currentChild,
          currentDepth,
        );
        if (childComment) children.push(childComment);
      }
    }

    return {
      By: data.by,
      Text: data.text || "",
      Time: data.time,
      Kids: children,
      Parent: data.parent || "",
      ID: data.id,
    };
  } catch (error) {
    console.error("Error fetching Hacker News data:", error);
    return null;
  }
}

// This is the core widget!
export async function widget(
  bodyText: string,
): Promise<CodeWidgetContent> {
  if (!bodyText) return { html: "", script: "" };

  try {
    const parsed = parseBodyText(bodyText);
    if (!parsed) return { html: "<p>Invalid input format.</p>", script: "" };

    const rootComment = await queryHNComments(parsed.id, parsed.children, parsed.depth);
    console.log(rootComment);

    if (!rootComment) return { html: "<p>No comments found.</p>", script: "" };

    return {
      html: `
        <div class="hn-comments">
          ${generateCommentHTML(rootComment)}
        </div>
        <style>
          .hn-comments { font-family: Arial, sans-serif; max-width: 600px; }
          .comment { border-left: 2px solid #ccc; margin: 10px 0; padding: 10px; }
          .meta { font-size: 12px; color: #555; }
          .replies { margin-left: 20px; }
        </style>
      `,
      script: "",
    };
  } catch (e) {
    return { html: "<p>Error loading comments.</p>", script: "" };
  }
}

function generateCommentHTML(comment: Comment): string {
  return `
    <div class="comment">
      <p class="meta"><strong><a href="https://news.ycombinator.com/user?id=${comment.By}" target="_blank">${comment.By}</a></strong> - ${
    new Date(comment.Time * 1000).toLocaleString()
  }</p>
      <p>${comment.Text}</p>
      <div class="replies">
        ${comment.Kids.map(generateCommentHTML).join("")}
      </div>
    </div>
  `;
}

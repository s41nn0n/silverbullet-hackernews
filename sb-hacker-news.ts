import { editor, system } from "@silverbulletmd/silverbullet/syscalls";
// import type { FileMeta } from "@silverbulletmd/silverbullet/plug-api/tuy";

type hnData = {
  title: string;
  url: string;
  points: number;
  comment_count: number;
  source_url: string;
};

export async function hide() {
  await editor.hidePanel("lhs")
}

export async function searchHackerNews() {
  const query = await editor.prompt("Search Hacker News:");
  if (!query) return;

  await searchAndSave(
    `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}`,
    `Hacker News Results for "${query}"`,
    `🔍 HN ${query}`,
  );

  // const results = await queryHN(
  //   `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}`,
  // );
  //
  // if (results.length === 0) {
  //   await editor.flashNotification("No results found", "error");
  //   return;
  // }
  //
  // console.log(results);
  //
  // const output = results
  //   .map((item) =>
  //     `- [${item.title} (${item.points} points)](${item.source_url})\n  - [(${item.comment_count} points)](${item.url})`
  //   )
  //   .join("\n");
  //
  // await editor.navigate({ kind: "page", page: `HN ${query}` });
  //
  // await editor.insertAtCursor(
  //   `\n## Hacker News Results for "${query}"\n${output}\n`,
  // );
  // await editor.flashNotification("Results added!", "info");
}

//
// Search Hacker News and return results as clickable links
export async function searchAndSave(
  uri: string,
  pageTitle: string,
  filePath: string,
) {
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

    // const output = results
    //   .map((item) => `- [${item.title} (${item.points} points)](${item.url})`)
    //   .join("\n");
    const isHtml = await system.getSpaceConfig(
      "isHtml",
    );
    // let output: string;
    console.log("isHtml", isHtml, !!isHtml);
    if (!(!!isHtml)) {
      const output = results
        .map((item) =>
          `<br> <a href="${item.source_url}}">🌐 ${item.title} (${item.points} points)</a> - <a href="${item.url}}">💬 (${item.comment_count} points)</a> `
        )
        .join("<br>");

      const text = await editor.getText();
      if (text) {
        const lineCount = text.split("\n").length;
        await editor.moveCursor(lineCount);
      }

      console.log( `<h1 onclick="syscall('system.invokeFunction', 'hello.hide');"> ${pageTitle} ❌ </h1> <br> <h2>URI</h2>: <a href="${uri}">${uri}</a> ${output}`);

      await editor.showPanel(
        "lhs",
        1,
        `<h1 onclick="syscall('system.invokeFunction', 'hello.hide');"> ${pageTitle} ❌ </h1> <br> <h2>URI</h2>: <a href="${uri}">${uri}</a> ${output}`,
      );
    } else {
      const output = results
        .map((item) =>
          `- [🌐 ${item.title} (${item.points} points)](${item.source_url}) - [💬 (${item.comment_count} points)](${item.url})`
        )
        .join("\n");

      await editor.navigate({ kind: "page", page: filePath });
      await editor.insertAtCursor(
        `\n## ${pageTitle}\nURI: [${uri}](${uri})\n${output}\n`,
      );
    } `<h1 onclick="syscall('system.invokeFunction', 'hello.hide');"> ${pageTitle} ❌ </h1> <br> <h2>URI</h2>: <a href="${uri}">${uri}</a> ${output}`

    await editor.flashNotification(`${pageTitle} inserted!`, "info");
  } catch (error) {
    console.error("Error In searchAndSave:", error);
    await editor.flashNotification(`Error getting ${pageTitle}!`, "error");
    return [];
  }
}
// Search Hacker News and return results
export async function queryHN(uri: string): Promise<hnData[]> {
  if (!uri) return [];
  try {
    // const maxResults = await system.getSpaceConfig(
    //   "maxResults",
    // );
    //
    // const minPoints = await system.getSpaceConfig(
    //   "minPoints",
    // );

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

  // if (results.length === 0) {
  //   await editor.flashNotification("No top stories found for today", "error");
  //   return;
  // }
  //
  // const output = results
  //   .map((item) => `- [${item.title} (${item.points} points)](${item.url})`)
  //   .join("\n");
  //
  // await editor.insertAtCursor(
  //   `\n## Top Hacker News Stories for Today\n${output}\n`,
  // );
  // await editor.flashNotification("Top stories inserted!", "info");
}

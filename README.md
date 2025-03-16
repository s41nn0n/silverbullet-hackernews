
# SilverBullet plug for Hacker News

## Installation
If you would like to install this plug straight from Github, make sure you have the `.js` file committed to the repo and simply add

```
- github:s41nn0n/silverbullet-hackernews/sb-hacker-news.plug.js
```

## Build
To build this plug, make sure you have [SilverBullet installed with Deno](https://silverbullet.md/Install/Deno). Then, build the plug with:

```shell
deno task build
```

Or to watch for changes and rebuild automatically

```shell
deno task watch
```

Then, copy the resulting `.plug.js` file into your space's `_plug` folder. Or build and copy in one command:

```shell
deno task build && cp *.plug.js /my/space/_plug/
```

SilverBullet will automatically sync and load the new version of the plug, just watch the logs (browser and server) to see when this happens.

to your `PLUGS` file, run `Plugs: Update` command and off you go!


Top 🏆 🔝
Search 🔍 🕵️‍♂️
Comment 💬 📝
Link 🔗 🌐

🖊️ ✍️ (Writing-related)
👤 🧑‍💻 (Person-related)
🏗️ 🎨 (Creator-related)
📖 📝 (Author-related)


❌ 🔴 (General "close" or "stop")
🔒 🛑 (Locking or stopping)
🏁 ✖️ (Ending something)


❌ (Close button)
🔙 (Back)
🔻 (Collapse)
🚪 (Exit)
🔒 (Lock, if closing means restricting access)

💾 (Classic save/disk icon)
📥 (Download/save)
✅ (Confirm/save changes)
🔖 (Bookmark/save for later)
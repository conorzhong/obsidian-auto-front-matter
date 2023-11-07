# Obsidian Auto Front Matter

自动化 Obsidian Markdown 的 Front Matter

## V2

1. 取消了“保存时修改”的功能，推荐结合 Commander 的宏命令 + 快捷键使用，例如：
   1. 在 Commander 新增宏命令，名称可以为“保存文件 + Auto Front Matter”
   1. 打开快捷键配置
   1. 取消默认保存文件的快捷键
   1. 增加宏命令“保存文件 + Auto Front Matter”的快捷键
1. 取消了排序功能，推荐使用 Linter 的 YAML 排序功能
1. 新增了自定义 Front Matter 功能，可以自定义 Front Matter 的内容

当 Action Type 为 Append 时，默认新增 Key 为 Array 类型，否则进行 Append 时，Obsidian 会提示类型不匹配

## FAQ

Q: 为什么取消了“保存时修改”的功能？

A: 因为修改 Front Matter 本身也是对 Markdown 的一种修改，会导致监听修改的事件函数无限触发

Q: 为什么取消了排序功能

A: 因为 Linter 的排序很好用

---

# ObsidianAutoFrontMatter

Automating Front Matter for Obsidian Markdown

## V2

1. The "modify while saving" function has been cancelled. It is recommended to use it in combination with Commander's macro commands + shortcut keys, for example:
   1. Add a new macro command in Commander, the name can be "Save File + Auto Front Matter"
   1. Open shortcut key configuration
   1. Cancel the default shortcut key for saving files
   1. Added shortcut key for macro command "Save File + Auto Front Matter"
1. The sorting function has been cancelled. It is recommended to use Linter’s YAML sorting function.
1. Added custom Front Matter function to customize the content of Front Matter

When the Action Type is Append, the new Key is Array type by default. Otherwise, Obsidian will prompt that the type does not match when Append is performed.

## FAQ

Q: Why was the "modify while saving" function canceled?

A: Because modifying Front Matter itself is also a modification of Markdown, it will cause the event function that monitors the modification to trigger infinitely.

Q: Why was the sorting function cancelled?

A: Because Linter sorting is very easy to use.

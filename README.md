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

## 已知 Bug

1. Name 修改时意外失去焦点，目前可以考虑通过粘贴方式修改 Name

## TODO

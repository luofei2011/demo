Git & Svn工具介绍及高级介绍
=====

# Git使用及github介绍

=====

## GIT是什么？

- 版本控制
- 协同开发
- 分布式（和svn的区别）

=====

## 基本命令

- git init
- git add
- git commit
- git pull
- git push

=====

## git的服务器（github）

- 从github上克隆一个代码仓库
- 把本地项目提交到github上
- gh-pages静态博客`username.github.io`

=====

# Git高级使用

=====

## 高级命令

- git status（当前工作区状态）
- git log（commit id的用处）

=====

## 回滚代码

- 工作区、暂存区、本地数据库、远程数据库
- git数据库版本标识：HEAD、HEAD^、HEAD^^、HEAD~N  `git reset --hard HEAD^`
- git reset利用commit id进行回滚
- 恢复文件修改：`git checkout -- <file>`
- 删除文件：`git rm [--cached] <file>`

=====

## Git真正强大的地方：分支管理

- git branch -b dev（为什么要用分支：dev、feature、bug、issue……）
- git branch -d dev

=====

## 分支合并

- git merge dev（fast-forward？）
- --no-ff

## 干坏事儿了，警察要保护现场！

- git stash（when？how？）
- git stash pop（世界终于安静了~）

=====

# 如果利用学到的知识优雅的提问问题^_^|

=====

## 每个人的时间都很宝贵

- 加入我们俱乐部在github的组织（不是每个人都能加）
- 我会在官网地址中开放`questions`目录供大家提问问题（目录下文件名任意建）
- 编辑好问题后给我们发送一个`pull request`
- 大牛们在线预览并解决你的问题
- 问题解决后我们定期删除

=====

# THE END, THANKS!
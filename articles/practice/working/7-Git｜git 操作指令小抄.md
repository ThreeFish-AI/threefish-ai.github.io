---
id: auth
sidebar_position: 7
title: Git｜git 操作指令小抄
description: Git｜git 操作指令小抄
last_update:
  author: Aurelius
  date: 2024-09-20
tags:
  - Git
  - 操作指令
---

_Global Git configuration is stored in $HOME/.gitconfig (git config --help)_

```sh
git command --help
```

- Notation
  - `$id`，represent either a commit id, branch or a tag name；
  - `$file`，arbitrary file name；
  - `$branch`，arbitrary branch name；

@[toc]

### 1. Git Concepts

- `master`，default development branch；
- `origin`，default upstreamrepository；
- `HEAD`，current branch；
- `HEAD^`，parent of HEAD；
- `HEAD~4`，the great-great grandparent of HEAD；

### 2. Create

```sh
# from existing data
git init
git add .
git add *
git add <filename>
# remove/delete
git rm <filename>

# Save the current state.
git stash

# Return to the saved state.
git stash pop

# from existing repo
git clone ~/existing/repo ~/new/repo
git clone username@host:/path/to/repository
git clone git://host.org/project.git
git clone ssh://you@host.org/proj.git

# Pull the Repo through the access token
# clone with access_token
git clone https://oauth2:access_token@github.com/username/xxx.git

# clone without access_token
git clone https://github.com/xxx/xxx.git
```

### 3. Show

```sh
# Files changed in working directory
git status

# Changes to tracked files
git diff

# What changed between $ID1 and $ID2
git diff $id1 $id2

# History of changes
git log

# History of changes for file with diffs
git log -p $file $dir/ec/tory/

# View branch merge graph.
git log --graph --pretty=oneline --abbrev-commit

# In regular mode, merging branches will reveal the merge history.
git merge --no-ff -m "merge with no-ff" dev

# Who changed what and when in a file
git blame $file

# A commit identified by $ID
git show $id

# A specific file from a specific $ID
git show $id:$file

# All local branches
git branch

# View command history.
git reflog
```

### 4. Revert

```sh
# Return to the last committed state (cannot undo a hard reset)
git reset --hard

# Traveling between versions in history, the version pointed to by HEAD is the current version.
git reset --hard commit_id

# Revert the last commit (create a new commit)
git revert HEAD

# Revert specific commit (create a new commit)
git revert $id

# Fix the last commit (after editing the broken files)
git commit -a --amend

# Checkout the $id version of a file
git checkout $id $file

# replace working copy with latest from HEAD
# Discard modifications in the working directory.
git checkout -- <filename>
```

**放弃所有更改**

```sh
# 确认当前的修改；
git status

# 将所有修改的文件从暂存区中移除；
git reset HEAD .

# 将所有修改的文件恢复到最新的提交状态；
git checkout .
```

### 5. Branch

```sh
# Switch to the $id branch
git checkout $id

# Merge branch1 into branch2
git checkout $branch2
git merge branch1

# Create branch named $branch based on the HEAD
git branch $branch

# Create branch $new_branch based on branch $other and switch to it
git checkout -b $new_branch $other

# Create a local branch corresponding to a remote branch.
git checkout -b branch-name origin/branch-name

# Establish an association between a local branch and a remote branch.
git branch --set-upstream branch-name origin/branch-name

# view changes between two branches
git diff <source_branch> <target_branch>

# Delete branch $branch
git branch -d $branch

# Force delete branch.
git branch -D $branch
```

### 6. Update

```sh
# Fetch latest changes from origin (but this does not merge them).
git fetch

# Fetch all branches from origin.
git featch --all

# Fetch all branches from origin.
git pull --all

# Pull latest changes from origin (does a fetch followed by a merge)
git pull

# Apply a patch that some sent you (in case of a conflict, resolve and use git am --resolved )
git am -3 patch.mbox
```

### 7. Publish

```sh
# Commit all your local changes
git commit -a

# commit changes
git commit -m "Commit message"

# connect local repository to remote repository
git remote add origin <server>
git remote add origin git@server-name:path/repo-name.git

# View remote repository information.
git remote -v

# push changes to remote repository
git push origin master
git push origin branch-name

# Prepare a patch for other developers
git format-patch origin

# Push changes to origin
git push

# push branch to remote repository
git push origin <branch>

# Mark a version / milestone
git tag v1.0 <commit ID>

# Specify tag information.
git tag -a <tagname> -m "blablabla..."

# fetch all tags from remote
git fetch --tags

# View all tags.
git tag

# 从 tag 创建分支
git branch <new-branch-name> <tag-name>

# Push a local tag.
git push origin <tagname>

# Push all local tags that have not been pushed before.
git push origin --tags

# Delete a local tag.
git tag -d <tagname>

# Delete a remote tag.
git push origin :refs/tags/<tagname>
```

### 8. Resolve Merge Conflicts

```sh
# To view the merge conclicts
git diff                    # (complete conflict diff)
git diff --base $file       # (against base file)
git diff --ours $file       # (against your changes)
git diff --theirs $file     # (against other changes)

# To discard conflicting patch
git reset --hard
git rebase --skip

# After resolving conflicts, merge with
git add $conflicting_file   # (do for all resolved files)
git rebase --continue
```

**continue to merge**

```sh
git merge --continue
```

### 9. Usefull Commands

```sh
# Finding regressions
git bisect start            # (to start)
git bisect good $id         # ($id is the last working version)
git bisect bad $id          # ($id is a broken version)
git bisect bad/good         # (to mark it as bad or good)
git bisect visualize        # (to launch gitk and mark it)
git bisect reset            # (once you're done)

# Check for errors and cleanup repository
git fsck
git gc --prune

# Search working directory for foo()
git grep "foo()"
```

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、评论、赞！**

---

**参考资料：**

- [1] [Git Cheat Sheet](http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf)

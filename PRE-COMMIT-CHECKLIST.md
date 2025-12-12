# Pre-Commit Checklist

Before committing and pushing to the repository, verify these items:

## Security ✅

- [ ] **No `.env` files in git status**
  ```bash
  git status | grep -E "\.env$"
  # Should return nothing
  ```

- [ ] **`.env.example` files are included**
  ```bash
  git status | grep -E "\.env\.example$"
  # Should show .env.example files as staged
  ```

- [ ] **No hardcoded credentials in code**
  ```bash
  grep -r "client_id.*f064e3c1" --exclude-dir=node_modules --exclude-dir=.git .
  grep -r "client_secret.*48bef0f9" --exclude-dir=node_modules --exclude-dir=.git .
  # Should only find matches in documentation files (if any)
  ```

## Files to Commit ✅

These files SHOULD be committed:
- ✅ `.env.example`
- ✅ `proxy-server/.env.example`
- ✅ `.gitignore`
- ✅ `SECURITY.md`
- ✅ All source code files
- ✅ Documentation files

These files should NOT be committed:
- ❌ `.env`
- ❌ `proxy-server/.env`
- ❌ `node_modules/`
- ❌ `dist/`
- ❌ Any files with actual credentials

## Quick Commands

### 1. Check git status
```bash
git status
```

### 2. Verify .env files are ignored
```bash
# Should show: .gitignore:.env
git check-ignore -v .env
git check-ignore -v proxy-server/.env
```

### 3. See what will be committed
```bash
git diff --staged --name-only
```

### 4. Search for sensitive data
```bash
# Search for potential credentials
git diff --staged | grep -i -E "(client_id|client_secret|password|api_key)" --color
```

## If You Accidentally Committed Credentials

1. **DO NOT PUSH!** Stop immediately
2. Unstage the file:
   ```bash
   git reset HEAD .env
   git reset HEAD proxy-server/.env
   ```
3. Verify it's unstaged:
   ```bash
   git status
   ```
4. If already committed but not pushed:
   ```bash
   git reset --soft HEAD~1
   ```

## If You Already Pushed Credentials

1. **Immediately rotate the credentials** at the API provider
2. Remove from history (dangerous - be careful):
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env proxy-server/.env" \
     --prune-empty --tag-name-filter cat -- --all
   git push origin --force --all
   ```
3. Contact your team/security officer
4. Update `.env` with new credentials

## Safe Commit Flow

```bash
# 1. Check status
git status

# 2. Add files (be specific!)
git add src/
git add proxy-server/proxy-server.js
git add .env.example
git add proxy-server/.env.example
git add README.md
git add SECURITY.md

# 3. Verify what's staged
git diff --staged --name-only

# 4. Double-check no .env files
git status | grep -E "\.env$"

# 5. Commit
git commit -m "Your commit message"

# 6. Push
git push origin main
```

## All Clear? ✅

If all checks pass:
- ✅ No `.env` files in `git status`
- ✅ `.env.example` files are present
- ✅ No hardcoded credentials in source
- ✅ `.gitignore` is properly configured

**You're safe to commit and push!** 🚀


#!/usr/bin/env bash
# cleanup.sh
set -euo pipefail

# 1) Remove top-level cruft
rm -rf .github .vscode docs scripts verify CHANGELOG.md CONTRIBUTING.md LICENSE \
       .editorconfig .gitpod.yml .dockerignore

# 2) In packages/, keep only wrapper, wrapper-react, client, vscode-ws-jsonrpc, examples
cd packages
for pkg in *; do
  case "$pkg" in
    wrapper|wrapper-react|client|vscode-ws-jsonrpc|examples) ;;
    *) rm -rf "$pkg";;
  esac
done

# 3) Prune wrapper tests & test-TS config
cd wrapper
rm -rf test tsconfig.test.json
# Patch its package.json so build only runs the src compile:
jq '.scripts.build = "npm run clean && npm run compile:src" |
    .scripts["compile:src"] = "tsc --build tsconfig.src.json" |
    del(.scripts.compile)' package.json > tmp.json && mv tmp.json package.json

# 4) Prune wrapper-react tests & test-TS config
cd ../wrapper-react
rm -rf test tsconfig.test.json
# Patch its package.json similarly:
jq '.scripts.build = "npm run clean && npm run compile:src" |
    .scripts["compile:src"] = "tsc --build tsconfig.src.json" |
    del(.scripts.compile)' package.json > tmp.json && mv tmp.json package.json

# 5) Back to examples: remove unused src folders
cd ../examples/src
for d in *; do
  if [[ "$d" != "common" && "$d" != "groovy" && "$d" != "eclipse.jdt.ls" ]]; then
    rm -rf "$d"
  fi
done

# 6) Remove all resources except scripts, groovy & eclipse.jdt.ls
cd ../resources
for d in *; do
  if [[ "$d" != "scripts" && "$d" != "groovy" && "$d" != "eclipse.jdt.ls" ]]; then
    rm -rf "$d"
  fi
done

# 7) Remove all example HTML except groovy.html & eclipse.jdt.ls.html
cd ..
for f in *.html; do
  [[ "$f" == "groovy.html" || "$f" == "eclipse.jdt.ls.html" ]] || rm -f "$f"
done

# 8) Patch examples/package.json to skip the broken extract step
cd ..
jq '
  .scripts.build = "npm run build:msg && npm run clean && npm run resources:download && npm run compile" |
  del(.scripts["extract:docker"])
' package.json > tmp.json && mv tmp.json package.json

echo "Cleanup complete: only wrapper(+react), client, vscode-ws-jsonrpc, and the Java/Groovy examples remain."

#!/usr/bin/env bash
# run.sh
set -euo pipefail

# 1) Start the two LSP servers
docker-compose -f packages/examples/resources/eclipse.jdt.ls/docker-compose.yml up -d
docker-compose -f packages/examples/resources/groovy/docker-compose.yml up -d

# 2) Install dependencies
npm install

# 3) Build only the core workspaces (skip examples to avoid their build steps)
npm run build --workspaces \
  --workspace monaco-languageclient \
  --workspace vscode-ws-jsonrpc \
  --workspace monaco-editor-wrapper \
  --workspace @typefox/monaco-editor-react

# 4) Launch the dev server (Vite will serve groovy.html & eclipse.jdt.ls.html)
npm run dev

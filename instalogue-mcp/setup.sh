#!/usr/bin/env bash
# Installs dependencies and registers the MCP server with Claude CLI.
# Run once: bash setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_CONFIG="$HOME/.claude.json"

echo "→ Installing npm dependencies..."
cd "$SCRIPT_DIR"
npm install

echo "→ Creating .env from .env.example (if not already present)..."
if [ ! -f "$SCRIPT_DIR/.env" ]; then
  cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
  echo "  Created .env — fill in your Cloudinary API key and secret before running."
else
  echo "  .env already exists, skipping."
fi

echo "→ Registering MCP server in Claude CLI config ($CLAUDE_CONFIG)..."

# If ~/.claude.json doesn't exist, create a minimal one
if [ ! -f "$CLAUDE_CONFIG" ]; then
  echo '{}' > "$CLAUDE_CONFIG"
fi

# Use node to safely merge the mcpServers entry without overwriting anything else
node - "$SCRIPT_DIR" "$CLAUDE_CONFIG" <<'EOF'
const fs = require('fs');
const scriptDir = process.argv[2];
const configPath = process.argv[3];

let config = {};
try { config = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch {}

if (!config.mcpServers) config.mcpServers = {};

config.mcpServers['instalogue'] = {
  command: 'node',
  args: [`${scriptDir}/index.js`],
  env: {}
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('  Registered "instalogue" MCP server.');
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit $SCRIPT_DIR/.env and add your Cloudinary API key + secret"
echo "  2. Restart Claude CLI (claude) — it will auto-connect the MCP server"
echo "  3. Test with: 'call instalogue_auth' in a Claude CLI session"

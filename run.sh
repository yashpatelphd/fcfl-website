#!/usr/bin/env bash
# --------------------------------------------------------------------------
# FCFL website: start a local web server and open the site in your browser.
#
#   ./run.sh          -> http://localhost:8000
#   ./run.sh 8080     -> use another port if 8000 is busy
#
# Needs only python3, which comes with Ubuntu 24.04. Press Ctrl+C to stop.
# --------------------------------------------------------------------------
set -e
cd "$(dirname "$0")"

PORT="${1:-8000}"
URL="http://localhost:${PORT}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 was not found. Install it with:  sudo apt install python3"
  exit 1
fi

echo ""
echo "  Futuristic Cyber Forensics Lab website"
echo "  Running at: ${URL}"
echo "  Press Ctrl+C to stop."
echo ""

# open the browser a moment after the server starts
( sleep 1; xdg-open "${URL}" >/dev/null 2>&1 || true ) &

exec python3 -m http.server "${PORT}" --bind 127.0.0.1

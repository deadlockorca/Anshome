#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MYSQLD="${MYSQLD:-/opt/homebrew/opt/mysql/bin/mysqld}"
MYSQL="${MYSQL:-mysql}"
PORT="${MYSQL_PORT:-3307}"
DATA_DIR="$ROOT_DIR/.mysql/data"
RUN_DIR="$ROOT_DIR/.mysql/run"
LOG_DIR="$ROOT_DIR/.mysql/logs"
SOCKET="$RUN_DIR/mysql.sock"
PID_FILE="$RUN_DIR/mysql.pid"
LOG_FILE="$LOG_DIR/mysql.err"

start_mysql() {
  mkdir -p "$DATA_DIR" "$RUN_DIR" "$LOG_DIR"

  if [[ ! -d "$DATA_DIR/mysql" ]]; then
    "$MYSQLD" --initialize-insecure --datadir="$DATA_DIR" --basedir="$(dirname "$(dirname "$MYSQLD")")"
  fi

  if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "MySQL local is already running on port $PORT."
    exit 0
  fi

  "$MYSQLD" \
    --datadir="$DATA_DIR" \
    --basedir="$(dirname "$(dirname "$MYSQLD")")" \
    --port="$PORT" \
    --socket="$SOCKET" \
    --pid-file="$PID_FILE" \
    --log-error="$LOG_FILE" \
    --mysqlx=0 \
    --daemonize

  echo "MySQL local started on port $PORT."
}

stop_mysql() {
  if [[ ! -f "$PID_FILE" ]]; then
    echo "MySQL local is not running."
    exit 0
  fi

  local pid
  pid="$(cat "$PID_FILE")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid"
    echo "MySQL local stopped."
  else
    echo "MySQL local pid file exists but process is not running."
  fi
}

status_mysql() {
  if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "MySQL local is running on port $PORT."
    "$MYSQL" --protocol=tcp -h127.0.0.1 -P"$PORT" -uroot -e "SELECT VERSION();" 2>/dev/null || true
  else
    echo "MySQL local is not running."
  fi
}

case "${1:-}" in
  start)
    start_mysql
    ;;
  stop)
    stop_mysql
    ;;
  restart)
    stop_mysql || true
    start_mysql
    ;;
  status)
    status_mysql
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

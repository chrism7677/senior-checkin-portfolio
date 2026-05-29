#!/bin/bash
set -e

export HOME=/home/ubuntu
export GIT_SSH_COMMAND="ssh -i /home/ubuntu/.ssh/senior_checkin_deploy_key -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"


cd "$APP_DIR"

git -c safe.directory="$APP_DIR" pull origin main

docker compose down
docker compose up -d --build
docker image prune -f




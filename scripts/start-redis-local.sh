#!/bin/bash
set -e

SERVER="redis_container";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name redis_container \
  -p 6379:6379 \
  -d redis


# wait for pg to start
echo "sleep wait for redis-server [$SERVER] to start";
SLEEP 3;

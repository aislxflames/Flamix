#!/bin/bash

echo "Starting frontend..."
cd flamix-frontend
pnpm dev &

sleep 2  # wait 2 seconds to let frontend start

echo "Starting backend with root permissions"
cd ../backend
sudo pnpm dev


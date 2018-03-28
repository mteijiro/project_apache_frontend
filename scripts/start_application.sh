#!/usr/bin/env bash
cd /home/ubuntu/www/apache_frontend/
sudo fuser -k 8080/tcp
npm run build
forever start -c /bin/bash scripts/runserver.sh

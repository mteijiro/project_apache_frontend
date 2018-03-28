#!/usr/bin/env bash
cd /home/ubuntu/www/apache_frontend/
npm run build
forever start -c /bin/bash scripts/runserver.sh

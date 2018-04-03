#!/usr/bin/env bash
cd /home/ubuntu/www/apache_frontend/dist/
python3 -m http.server 443 --bind 0.0.0.0
sleep 3
sudo fuser -k 443/tcp

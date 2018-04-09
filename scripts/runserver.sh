#!/usr/bin/env bash
cd /home/ubuntu/www/apache_frontend/dist/
sudo python3 -m http.server 80 --bind 0.0.0.0

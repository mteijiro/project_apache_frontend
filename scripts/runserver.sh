#!/usr/bin/env bash
cd /home/ubuntu/www/apache_frontend/dist/
python -m http.server 8080 --bind 0.0.0.0

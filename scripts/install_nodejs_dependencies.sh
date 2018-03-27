#!/usr/bin/env bash
sudo su
chown ubuntu:ubuntu /home/ubuntu/www
cd /home/ubuntu/www/apache_frontend/
npm install
npm install vue-router
npm install vue-resource
npm install forever -g


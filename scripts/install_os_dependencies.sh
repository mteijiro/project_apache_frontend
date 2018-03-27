#!/usr/bin/env bash
sudo su
apt-get -y update
apt-get -y upgrade
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
npm i -g npm

#!/bin/bash

CERTBOT=~/.docker/certbot

mkdir -p ${CERTBOT}/www

if [ ! -e "${CERTBOT}/dhparam.pem" ]; then
  openssl dhparam -out ${CERTBOT}/dhparam.pem 2048
fi

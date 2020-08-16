#!/bin/bash

CERT_PATH=.custom/ssl-certs

mkdir -p $CERT_PATH/certs

openssl dhparam -out $CERT_PATH/certs/dhparam.pem 2048

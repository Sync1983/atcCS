#!/bin/bash
echo "Compile"
cc -I/usr/include/postgresql/9.4/server -fpic -c utils.c
echo "Link"
cc -shared -L/usr/lib/postgresql/9.4/lib/ -lpq -o utils.so utils.o
echo "Copy"
cp utils.so /usr/lib/postgresql/9.4/lib/


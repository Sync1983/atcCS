#!/bin/bash

echo "Phpize ... \r\n"
phpize
echo "Configure ... \r\n"
./configure
echo "Make ... \r\n"
make
echo "Make install ... \r\n"
make install

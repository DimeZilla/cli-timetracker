#!/bin/bash

DIR=$(pwd)
#this will move our file into our bin
cp $DIR/bin/timelog /usr/local/bin/
#this will move our man script into our man1 folder
if [ ! -d /usr/local/man ]; then
    mkdir /usr/local/man
fi
if [ ! -d /usr/local/man/man1 ]; then
    mkdir /usr/local/man/man1
fi
cp $DIR/lib/timelog.1.gz /usr/local/man/man1

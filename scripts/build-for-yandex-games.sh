#!/bin/bash

export PUBLIC_URL='.' IS_YANDEX_GAMES=1
yarn build

BUILD_ARCHIVE_NAME='build.zip'
rm -rf $BUILD_ARCHIVE_NAME
zip -vr9 $BUILD_ARCHIVE_NAME build
file_size_in_mib="$(bc -l <<< "scale=2; $(stat -f "%z" $BUILD_ARCHIVE_NAME) / 1024^2")"
echo $BUILD_ARCHIVE_NAME size: "$file_size_in_mib" MiB

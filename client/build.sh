#!/bin/bash

cd ../../coalesce;
npm run-script build;
cd ../coalesce-ember;
# Hack to use the latest version of Coalesce
cp ../coalesce/dist/* bower_components/coalesce/
npm run-script build;
cd ../ember-cli-coalesce-todos/client;
mkdir -p vendor/coalesce-ember
cp -R ../../coalesce-ember/dist/* vendor/coalesce-ember;
ember build;

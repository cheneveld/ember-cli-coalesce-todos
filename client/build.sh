#!/bin/bash

cd ../../coalesce;
npm run-script build;
cd ../coalesce-ember;
npm run-script build;
cd ../ember-cli-coalesce-todos/client;
mkdir vendor/coalesce-ember;
cp -R ../../coalesce-ember/dist/* vendor/coalesce-ember;
ember build;

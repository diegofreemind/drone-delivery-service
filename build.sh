#!/bin/bash

npm install
npx tsc

chmod +x ./dist/index.js
npm link
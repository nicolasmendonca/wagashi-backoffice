const {series} = require('async');
const {exec} = require('child_process');

series([
  // Initialize workspaces
  () => exec('yarn'),
  // Build core app
  () => exec('yarn workspace @wagashi-backoffice/core build'),
])

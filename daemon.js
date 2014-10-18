'use strict';
var daemonizer = require('daemonize2');

var daemon = daemonizer.setup({
	main: 'index.js',
	name: 'twitterstream',
	pidfile: 'twitterstream.pid'
});

switch (process.argv[2]) {

    case 'start':
        daemon.start();
        break;

    case 'stop':
        daemon.stop();
        break;

    default:
        console.log('Usage: [start|stop]');
}
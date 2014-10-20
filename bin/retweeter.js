#!/usr/bin/env node

'use strict';

var Liftoff = require('liftoff');
var daemonizer = require('daemonize2');

var cli = new Liftoff({
	  name: 'retweeter',
	  processTitle: 'retweeter',
	  moduleName: 'retweeter',
	  configName: 'retweeter',
	  extensions: {
	    '.json': null,
	  },
});

cli.launch({}, invoke);

function invoke (env) {
	var configPath = env.configPath;

	// var daemon = daemonizer.setup({
	// 	main: env.modulePath,
	// 	name: 'twitterstream',
	// 	pidfile: 'twitterstream.pid',
	//	argv: [configPath]
	// });

	// switch (process.argv[2]) {

	//     case 'start':
	//         daemon.start();
	//         break;

	//     case 'stop':
	//         daemon.stop();
	//         break;

	//     default:
	//         console.log('Usage: [start|stop]');
	// }
}
'use strict';

var _ = require('underscore');
var Kefir = require('kefir');
var builder = require('./src/builder.js');
var twitter = require('./src/twitter.js');
var parser = require('./src/parser.js');
var collector = require('./src/collector.js');

var twitterStream = twitter.getStream();
var twitterConditions = builder.map(function(value) {
	return _.reduce(value, function(prev, current) {
		if(current.condition.type === 'location') {
			prev.locations.push(current.condition.value);
		} else {
			prev.track.push(current.condition.value);
		}
		return prev;
	}, {track: [], locations: []});
});

function updateFilters(value) {
	collector.commit();
	twitter.setParams(value);
}

twitterConditions.onValue(updateFilters);
var parsedStream = twitterStream.map(parser.beforeFilter);
var collectorStream = Kefir.combine([builder, parsedStream], collector.collect);

collectorStream.onValue(collector.push);


function exitHandler(options, err) {
	twitterConditions.offValue(updateFilters);
	collectorStream.offValue(collector.push);
    if (options.cleanup) {
    	console.log('clean');
    }
    if (err) {
    	console.log(err.stack);
    }
    if (options.exit) {
    	process.exit();
    }
}

process.stdin.resume();

//do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
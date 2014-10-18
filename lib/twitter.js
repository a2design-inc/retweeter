'use strict';

var Twitter = require('twitter');
var Kefir = require('kefir');
var config = require('./../config.js');
var _ = require('underscore');

var client = new Twitter(config.twitter_credentials);

var _stream = null;
var _params = {};
var _emitter = null;

function updateTwitterStream() {
	if(!_.isNull(_stream)) {
		_stream.destroy();
	}

	client.stream('filter', _params, function saveStream(stream) {
		_stream = stream;
	});
}

function emitTweet(emitter) {
	console.log('activation');
	_emitter = emitter;
	updateTwitterStream();
	contact(_emitter, _stream);
	
	return function destroyStream() {
		if(!_.isNull(_stream)) {
			_stream.destroy();
		}
	};
};

function contact(kefirEmitter, twitterStream) {
	twitterStream.on('data', kefirEmitter.emit);
	twitterStream.on('error', function(error) {
		console.log(error);
	});
}

var twitterStream = Kefir.fromBinder(emitTweet);

module.exports = {
	setParams: function(params) {
		_params = params;
		updateTwitterStream();
		contact(_emitter, _stream);
	},
	getStream: function() {
		return twitterStream;
	}
};
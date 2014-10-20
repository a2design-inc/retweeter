'use strict';

var Twitter = require('twitter');
var Kefir = require('kefir');
var _ = require('underscore');

var TwitterStream = function (credential, params) {
	this.client = new Twitter(credential);
	this.params = params;
	this.twitter = null;
	this.stream = null;
};

TwitterStream.prototype.getStream = function () {
	if (_.isNull(this.stream)) {
		this.stream = Kefir.fromBinder(this.emitTweet.bind(this));
	};

	return this.stream;
};

TwitterStream.prototype.emitTweet = function (emitter) {
	var self = this;

	this.client.stream('filter', self.params, function createStream(stream) {
		self.twitter = stream;

		self.twitter.on('data', emitter.emit);
		self.twitter.on('error', function(err) {
			console.log(err);
		});
	});

	return function destroyStream() {
		if(!_.isNull(self.twitter)) {
			self.twitter.destroy();
		}
	};
};

TwitterStream.prototype.getClient = function () {
	return this.client;
};

module.exports = TwitterStream;
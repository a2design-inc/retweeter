'use strict';

var config = require(process.argv[2]);

var _ = require('underscore');
var Builder = require('./lib/builder.js');
var TwitterStream = require('./lib/twitter.js');

var builder = new Builder(config.positive, config.negative || []);
var positive = builder.getParams();
var negative = builder.getFilters();
var twitterStream = new TwitterStream(config.twitter_credentials, positive);
var retweeter = twitterStream.getClient();
var stream = twitterStream.getStream();
var filteredStream = stream.filter(function filter(tweet) {
	
	// Prevent recursive retweeting
	if (tweet.retweeted_status !== undefined) {
		return false;
	}

	// Return false if one of negative filters matches with tweet 
	for(var i = 0; i < negative.length; i += 1) {
		if(negative[i](tweet) === true) {
			return false;
		}
	}

	return true;
});

filteredStream.onValue(function (tweet) {
	var url = '/statuses/retweet/' + tweet.id_str + '.json';
	retweeter.post(url, function(result) {
		console.log(result);
	});
})
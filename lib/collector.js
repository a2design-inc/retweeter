'use strict';

var _ = require('underscore');
var connection = require('./connection.js');
var parser = require('./parser.js');
var config = require('./../config.js');

var SYNC_LIMIT = config.post_limit;

var _bunch = [];
var _count = 0;

function insert(data) {
	if(data.length === 0) {
		return;
	}
	var keys = _.keys(data[0]);
	var queryStart = ''
		+ 'INSERT INTO `posts` \n'
        	+ ' ('
        		+ getKeysString(keys)
            + ' ) VALUES \n';
    var queryEnd = ''
    	+ '\n ON DUPLICATE KEY UPDATE'
    		+ ' `keyword_id` = VALUES(`keyword_id`),'
            + ' `page_id` = VALUES(`page_id`),'
            + ' `post_id` = VALUES(`post_id`),'
            + ' `likes_count` = VALUES(`likes_count`),'
            + ' `content` = VALUES(`content`),'
            + ' `author_id` = VALUES(`author_id`),'
            + ' `author_name` = VALUES(`author_name`),'
            + ' `author_picture` = VALUES(`author_picture`),'
            + ' `media` = VALUES(`media`),'
            + ' `network` = VALUES(`network`),'
            + ' `link` = VALUES(`link`),'
            + ' `created` = VALUES(`created`)';
    var values = getValuesString(keys, data);
    var query = queryStart + ' ' + values + ' ' + queryEnd;
    console.log(query)

    connection
    	.query(query)
    	.spread(function syncLog() {
    		// TODO add logging
    		console.log('commited');
    	});	
}

function commit() {
	insert(_.clone(_bunch));
	_count = 0;
	_bunch = [];
}

function escapeKey(key) {
	return '`' + key + '`';
} 

function getKeysString(keys) {
	return _.map(keys, escapeKey).join(',');
}

function getValuesString(keys, data) {
	var results = [];

	_.each(data, function colectValues(obj) {
		results.push(getValuesRow(keys, obj));
	});

	return results.join(',');
}

function getValuesRow(keys, obj) {
	var results = [];

	_.each(keys, function collectValuesRow(item) {
		results.push(connection.pool.escape(obj[item]));
	});

	return  '(' + results.join(',') + ')';
}

module.exports = {
	push: function (items) {
		if(items.length === 0) {
			return;
		}
		_count += items.length;
		_bunch = _bunch.concat(items);
		console.log(_count);
		if(_count >= SYNC_LIMIT) {
			commit();
		}
	},
	commit: commit,
	collect: function(filters, data) {
		var result = []

		_.each(filters, function test(filter) {
			if(filter.test(data)) {
				result.push(parser.beforeSave(_.extend(data, {
					page_id: filter.page_id,
					keyword_id: filter.keyword_id
				})));
			}
		});

		return result;
	}
};
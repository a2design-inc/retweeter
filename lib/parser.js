'use strict';

var _ = require('underscore');

var map = {
	post_id: 'id_str',
    likes_count: 'favorite_count',
    content: 'text',
    author_id: 'user.id',
    author_name: 'user.screen_name',
    author_picture: 'user.profile_image_url',
    media: 'entities.media.0.media_url',
    created: 'created_at',
    lat: 'geo.coordinates.0',
    lng: 'geo.coordinates.1'
};
var keys = _.keys(map);

function take(key, item) {
	var props = key.split('.');
    for (var i = 0; i < props.length; i++) {
        item = item[props[i]];
        if(_.isNull(item) || item === undefined) {
            return null;
        }
    }
    return item;
};

function rawToFilter(tweet) {
	return _.reduce(keys, function doItHave(prev, key) {
		prev[key] = take(map[key], tweet);
		return prev;
	}, {});
}

function filterToDb(tweet) {
    var result = _.omit(tweet, 'lat', 'lng');
    result.created = new Date(result.created).toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, ''); // delete the dot and everything after
    result.network = 'twitter';
    result.trash = 0;
    result.published = 0;
    result.commited = 0;
    result.inserted = (Date.now() /1000 | 0);
    result.link = ''
        + 'https://twitter.com/' 
        + result.author_id
        + '/status/'
        + result.post_id;
    console.log(result);
    return result;
}

module.exports = {
	beforeFilter: rawToFilter,
    beforeSave: filterToDb
};
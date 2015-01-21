'use strict';

/* global UniCalendar: true */

UniCalendar = new UniPlugin('UniCalendar');

/**
 * Creates a FullCalendar-compatible eventSource object
 * @param settings
 * @param settings.collection Mongo.Collection collection that we fetch from
 * @param settings.selector Object additional query executed on the minimongo when we fetch events
 * @param settings.subscription null|String pass publication name, work-in-progress
 * @param settings.options Object you can add any FC eventSource options over here
 * @see http://fullcalendar.io/docs/event_data/Event_Source_Object/
 * @returns {}
 */
UniCalendar.eventSource = function (settings) {
    check(settings, Object);

    var eventsFunction;
    var collection = settings.collection;
    check(collection, Mongo.Collection);

    var subscription = _.isString(settings.subscription) ? settings.subscription : null;
    var selector = _.isObject(settings.selector) ? settings.selector : {};

    if (subscription) {
        // with subscription mode, TODO
        eventsFunction = null;

    } else {
        // without subscription mode, assume that we have everything in the minimongo

        eventsFunction = function (start, end, timezone, callback) {
            var query = _({}).extend(selector, {
                start: {$lte: end.toDate()},
                end: {$gte: start.toDate()}
            });
            var events = collection.find(query, {reactive: false}).fetch();

            callback(events);
        };
    }

    var options = settings.options || {};
    options.events = eventsFunction;
    options._collection = collection;

    return options;

};
'use strict';

Template.UniCalendar.created = function () {
    this.observedCollections = {};
};
Template.UniCalendar.rendered = function () {
    var self = this;

    // default UniCalendar FullCalendar config
    var fcConfig = _(_.clone(this.data.fcConfig) || {}).defaults({
        header: {
            right: 'month,agendaWeek,agendaDay prev,next',
            left: 'title'
        },
        timezone: 'local',
        allDaySlot: false,
        selectable: true,
        lazyFetching: false
    });

    // get all event sources
    fcConfig.eventSources = [].concat(fcConfig.eventSources || [], this.data.eventSources || []);
    //fcConfig.eventSources = fcConfig.eventSources ? fcConfig.eventSources : this.data.eventSources || [];

    // add every collection from event sources to observed collections
    // observed collections will refresh calendar when there is a change in minimongo
    _(fcConfig.eventSources).each(function (eventSource) {
        if (eventSource._collection && eventSource._collection instanceof Mongo.Collection) {
            self.observedCollections[eventSource._collection._name] = eventSource._collection;
        }
    });

    // propagate FullCalendar's events so we can use them in template event maps
    var firstNode = this.firstNode;
    /* @see http://fullcalendar.io/docs/selection/select_callback/ */
    fcConfig.select = function (start, end, jsEvent, view) {
        $(jsEvent && jsEvent.target || firstNode).trigger('fc.select', arguments);
    };
    /* @see http://fullcalendar.io/docs/selection/unselect_callback/ */
    fcConfig.unselect = function (view, jsEvent) {
        $(jsEvent && jsEvent.target || firstNode).trigger('fc.unselect', arguments);
    };
    /* @see http://fullcalendar.io/docs/mouse/dayClick/ */
    fcConfig.dayClick = function (date, jsEvent, view) {
        $(jsEvent && jsEvent.target || firstNode).trigger('fc.dayClick', arguments);
    };
    /* @see http://fullcalendar.io/docs/mouse/eventClick/ */
    fcConfig.eventClick = function (event, jsEvent, view) {
        $(jsEvent && jsEvent.target || firstNode).trigger('fc.eventClick', arguments);
    };

    // init the FullCalendar
    var fc = this.fc = $(firstNode).fullCalendar(fcConfig);

    // make calendar reactive - refetch events when something changes in minimongo
    var refreshCalendar = function () {
        fc.fullCalendar('refetchEvents');
    };
    this.autorun(function () {
        _(self.observedCollections).each(function (collection) {
            collection.find().fetch(); //we need this to induce re-computation
        });
        refreshCalendar();
    });

};

Template.UniCalendar.destroyed = function () {
    if (this.fc) {
        this.fc.fullCalendar('destroy');
    }
};

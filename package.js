Package.describe({
    name: 'vazco:universe-calendar',
    summary: 'Universe Calendar Plugin',
    version: '0.0.1'
});

Package.onUse(function (api) {
    api.versionsFrom('1.0.1');

    api.use([
        'check',
        'templating',
        'underscore',
        'jquery',
        'vazco:tools-common',
        'vazco:universe-core',
        'vazco:universe-core-plugin'
    ], ['client', 'server']);

    api.addFiles([
        'UniCalendar.js'
    ]);

    api.addFiles([], 'server');

    api.addFiles([
        'vendors/fullcalendar/fullcalendar.css',
        'vendors/fullcalendar/fullcalendar.js',
        'client/templates.html',
        'client/templates.js',
    ], 'client');

    api.export('UniCalendar');
});


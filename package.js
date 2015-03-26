Package.describe({
    name: 'vazco:universe-calendar',
    summary: 'Universe Calendar Plugin',
    version: '0.0.4'
});

Package.onUse(function (api) {
    api.versionsFrom('1.0.1');

    api.use([
        'check',
        'templating',
        'underscore',
        'jquery',
        'momentjs:moment@2.8.4',
        'vazco:universe-core@1.5.2',
        'vazco:universe-core-plugin@0.0.3',
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


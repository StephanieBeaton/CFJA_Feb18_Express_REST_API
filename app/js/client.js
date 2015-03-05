'use strict';

require('angular/angular');

var platypusApp = angular.module('platypusApp', []);

require('./platypus/controllers/platypus_controller')(platypusApp);


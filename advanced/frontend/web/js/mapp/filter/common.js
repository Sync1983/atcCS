/* global atcCS, cqEvents, eventsNames, ObjectHelper */

atcCS.filter('ObjectLength', function() {
  return function(object) {
    return Object.keys(object).length;
  };
});

//
// App Helpers
//

simpleApp.service('Cookie', function () {
  return function (cookieName, value) {
    if (value) {
      $.cookie(cookieName, value);
    } else {
      var result;

      try {
        result = JSON.parse($.cookie(cookieName));
      } catch (e) {
        console.error(e);
        result = null;
      }

      return result;
    }
  }
})


simpleApp.service('Session', ['Cookies', function (Cookie) {
  return Cookie('session');

}])
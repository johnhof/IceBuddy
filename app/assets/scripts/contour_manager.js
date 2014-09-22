//
// set of contour components
//
var components = {};


// Header component
components['nav-header'] = {

  mobile : function ($header) {
    // fade out the links
    var $links = $header.find('a:not(.logo)');
    $links.fadeOut('fast', function () {

      // add the header if necesary
      if (!$header.find('#hamburger').length) {
        $header.append('<div id="hamburger" display="none"></div><div id="slider"></div>');
      }

      // fade the hamburger in
      $header.find('#hamburger').fadeIn('fast', function () {
        registerHbgrListener();
console.log('registering listener');
$('#hamburger').click(function () {
  console.log('test')
  $(this).toggleClass('open');
});
      });
    });
  },

  desktop : function ($header) {
    // fade the hamburger out
    $header.find('#hamburger').fadeOut('fast', function () {
      var $links = $header.find('a:not(.logo)');

      // fade the links in
      $links.fadeIn('fast', function () {
        
      });
    });
  }
}

//
// execute the contour constructor with custom states
//

var states = {
  mobile  : 0,
  desktop : 700
}; 

new contour(states, components);

//
//
// Listeners for basic functionality
//
//

function registerHbgrListener () {
  $('#hamburger').on('click', function () {
    console.log('test')
    $(this).toggleClass('open');
  });
}


////////////////////////////////////////////////////////////////////////
//
//  Material design directives
//
////////////////////////////////////////////////////////////////////////



// Ripple effect for buttons
//
simpleApp.directive('ripple', ['Patterns', function (Patterns) {
  return {
    restrict : 'C',
    link     : function(scope, element, attrs, ctrl) {
      element.on('click', function (event) {
        // event.preventDefault();
        var dark = element.hasClass('dark');

        var $div      = $('<div/>');
        var btnOffset = element.offset();
        var xPos      = event.pageX - btnOffset.left;
        var yPos      = event.pageY - btnOffset.top;

        $div.addClass('ripple-effect');
        if (dark) { $div.addClass('dark'); }

        var $ripple = $(".ripple-effect");

        $ripple.css("height", $(this).height());
        $ripple.css("width", $(this).height());

        $div.css({
          top: yPos - ($ripple.height()/2),
          left: xPos - ($ripple.width()/2),
          background: $(this).data("ripple-color")
        }).appendTo($(this));

        window.setTimeout(function(){
          $div.remove();
        }, 1000);
      });
    }
  };
}]);
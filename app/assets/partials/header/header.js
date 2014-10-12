//
// Controller
//


var headerCtrl = angular.module('simpleApp').controller('HeaderCtrl', ['$scope', function ($scope) {

}]);



//
// Directives
//

//
// nav bar directive for handling a window resize
headerCtrl.directive('navBar', ['$window', '$compile', function ($window, $compile) {
  return {
    restrict : 'A',
    link     : function ($scope, $element, $attrs) {
      // set up transition handlers
      var handlers = {
        //
        // convert the nav bar to desktop
        desktop : function () {
          console.log('desktop');
          //
          // remove the mobile menu's button and move the links to the second container    
          $element.find('#mobile-nav-button').remove();
          var $containers = $element.find('.container')
          var $rightCont  = $containers.last();

          if (!$rightCont.find('a').length) {
            var $links      = $element.find('a');
            var $rightLinks = $links.splice(0, Math.floor($links.length/2));

            // move the second half of the links to the second conatiner
            _.each($rightLinks, function ($link) {
              $link.remove(); 
              $rightCont.append($link);
            });
          }

          // cleanup and show links
          $element.find('[slider-open], [slider-close]').remove();
          $containers.show();
        },
        mobile : function () {
          console.log('mobile')
          //
          // convert the nav bar to mobile
          var $containers = $element.find('.container');
          $containers.hide();
          $containers.last().find('a').appendTo($containers.first());
          var test = $element.prepend('<div slider-open></div>');
          $compile($element.find('[slider-open]'))($scope);
        }
      };

      simpleApp.helpers.onPageBreak($scope, $window, handlers);
    }
  }
}]);


//
// slider-open button directive to handle press
headerCtrl.directive('slider-open', function () {
  return {
    restrict : 'A',
    link     : function($scope , $element){
      console.log('ahhhhh')

      $element.bind("click", function(e){
        // add modal
        var $slideMenu = $element.next('.container');
        $slideMenu.height($( window ).height());
        $slideMenu.show();

        $slideMenu.prepend('<div slider-close>✖</div>');
        $compile($slideMenu.find('[slider-close]'))($scope);
      });
    }
  }
});

// //
// // slide menu close directive to handle press
// headerCtrl.directive('slider-close', function () {
//   return {
//     restrict : 'A',
//     link     : function($scope , $element){
//       $element.bind("click", function(e){
//         // add modal
//         var $slideMenu = $element.closest('.container');
//         $slideMenu.hide();
//         $element.remove();
//       });
//     }
//   }
// });
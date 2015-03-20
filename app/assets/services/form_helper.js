////////////////////////////////////////////////////////////////////////
//
//  Form Helper
//
////////////////////////////////////////////////////////////////////////

simpleApp.service('FormHelper', ['Spinner', function (Spinner) {
  return function (formObj) {
    var $form = angular.element('form[name="' + formObj.$name + '"]');
    var form  = {
      // validate and perform passed in action
      apiAction : function (inputs, resourceReq, onSuccess, onError) {
        formObj.submitted = true;

        if (form.validate()) {
          Spinner.open();
          resourceReq(inputs, function () {
            Spinner.close();
            onSuccess(arguments)
          }, onError || form.resErrHandler);
        }
      },

      // validate by pairing visible inputs with their angular model counterparts to find validation errors
      validate : function () {
        var inputsArr = form.visibleInputs();
        var valErrors;

        // only validate visible inputs
        _.each(inputsArr, function ($input) {
          var angInput = formObj[$input.attr('name')]; // pair name to angular input obj
          if (angInput && Object.keys(angInput.$error || {}).length) {
            valErrors =  true;
          }
        });

        return !valErrors;
      },

      visibleInputs : function () {
        return _.compact($form.find('input[ng-show]:not(.ng-hide), input:not([ng-show])').map(function () {
          var $input = $(this);
          // make sure our parent isnt hidden either
          if (!$input.closest('[ng-show].ng-hide').length) { return $input; }
        }));
      },

      // error handler which appends api errors to the form
      resErrHandler : function (apiError) {
        var errorObj = _.defaults(apiError.data || {}, {
          error   : 'Failed to complete action',
          details : []
        });

        Spinner.close();

        // if its a validation error, set the error text for each problem input
        if (errorObj.error === 'ValidationError') {
          _.each(errorObj.details, function (valError) {
            if (!(valError && valError.path && valError.message)) { return; }
            var $input = $dom.find('.error[data-matches="' + valError.path + '"], .error[data-matches="inputs.' + valError.path + '"], .error[data-matches="fomr.' + valError.path + '"]');
            $input.text(valError.message.capitalize());
          });

        // if its not a validation error, just display add the error to the form
        } else {
          formObj.globalError = errorObj.error;
        }
      },
    }

    return form;
  }
}]);
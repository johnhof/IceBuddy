//
// Contour constructor
//
//   initStates - overwrite the defaults with { 'pixels' : 'stateName'} pairings
//   components - add/overwrite defaults
//      false -> ignore all default components
//        - OR - 
//      { 
//        componentName : {
//          stateName1 : function () {/* handlerBody */} // executes for the given state
//          stateName2 : function () {/* handlerBody */} // executes for the given state
//          include    : ['componentName'] // include only these components
//          exclude    : ['componentName'] // exclude these components
//          noDefault  : true // remove the default components
//        }
//      }
var contour = function (initStates, components) {
  //
  // Globals
  //
  this.date     = null;
  this.breakPt  = 700; // break to mobile at 800px
  var $window   = $(window);
  var _state     = null

  var STATES  = {}; // default to break at 800
  STATES['mobile']  = 0;
  STATES['desktop'] = this.breakPt;

  //
  // Config variables
  //
  var _states = this.states =  initStates || STATES;


  // push each state into an array for sorting
  var sortable = [];
  for (var state in _states) { sortable.push([state, _states[state]]); }
  sortable.sort(function (a, b) { return b[1] - a[1]; });//perform sort by value
  _states = {};
  for (var state in sortable) {  _states[sortable[state][0]] = sortable[state][1]; } // reconstruct array to be sorted
  this.states = _states;

  updateState();
  registerListeners();


  //
  // END -- initializing
  //


  //
  // state variables
  //
  this.getState = getState;
  function getState () {
    for(var state in _states) {
      if ($window.width() > _states[state]) { return state; }
    }
  }
  this.updateState = updateState;
  function updateState () { _state = getState(); }

  //
  // register any listeners required for functionality
  //
  this.registerListeners = registerListeners;
  function registerListeners () {
    // start by listening for a resize
    $(window).on('resize', function(event){
      // if the state differs from teh cached value, update it and re-render the elements
      if (_state !== getState()) {
        updateState();
        render(_state, $window.width(), $window.height());
      }
    });
  };

  // render the given state for each manager
  this.render = render;
  function render (renderState, x, y) {
    renderState = renderState || this.getState();
    for (var component in _components) { _components[component].render(_state, x, y); }
  }

  //
  // component manipulators
  //

  var _components = this.components = {};
  this.register = register;
  function register (component, handlers) {
    // add the component to the list of managers and store its handlers
    _components[component] = {
      handlers : handlers,

      // render the states for a given component
      render : function (state) {
        // if the state exists for the component, and the state is a handler, execute the handler, giving it an instance of itself
        if (handlers[state] && typeof handlers[state] === 'function') { 
          handlers[state]($('.' + component)); }
      }
    }
  }


  //
  //  Registering components
  //


  // default components
  if (!(components === false && components.noDefaults)) { 
    // if all defaults are included
    if (!(components.exclude && components.include)) {
      _components = new _ctComponents();

    // if only specific defaults are included
    } else if (components.include  && components.include.length) {
      components = new _ctComponents();
      for (var included in components.include) { _components = components[included]; } // loop over and cache the desired componentd

    // if defaults are excluded
    } else if (components.exclude && components.exclude.length) {
      _components = new _ctComponents();
      for (var included in components.include) { delete components[included]; } // loop over and delete the desired components
    }
  }

  // user specified components
  for (var component in components) { register(component, components[component]); }
}


//
// _ctComponents
//
//   A set of default components which can be overwritten, manipulated, etc
//
var _ctComponents = function () { return {};};
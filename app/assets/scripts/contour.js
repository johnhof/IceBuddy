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
  this.breakPt  = 800; // break to mobile at 800px
  this.$window  = $(window)
  this._states  = { // default to break at 800
    '0'          : 'mobile',
    this.breakPt : 'desktop'
  };

  //
  // Config variables
  //
  this.states = initStates || _states;

  this.updateState();
  this.registerListeners();


  //
  // register any listeners required for functionality
  //
  this.registerListeners = function (states) {
    this.states = states || this.states;


    // start by listening for a resize
    $(window).on('resize', function(event){

      // if the state differs from teh cached value, update it and re-render the elements
      if (this.state !== this.getState()) {
        this.updateState();
        this.render(this.state, $window.width(), $window.height();
      }
    });
  };

  //
  // state variables
  //
  this.getState    = function () { return this.states[this.$window.width()] }
  this.updateState = function() { this.state = this.getState(); }


  // render the given state for each manager
  this.render = function (renderState, x, y) {
    renderState = renderState || this.getState();

    for (manager in this.managers) {
      this.manager.render(state, x, y);
    }
  },

  //
  // component manipulators
  //

  this.components = {};
  this.register = function (component, handlers) {
    // add the component to the list of managers and store its handlers
    this.component[component] = {
      handlers : handlers,

      // render the states for a given component
      render : function (state) {
        // if the state exists for the component, and the state is a handler, execute the handler, giving it an instance of itself
        if (handlers[state] && handlers[state] === 'function') { handlers[state]($('.' + component)); }
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
      this.component = new _ctComponents();

    // if only specific defaults are included
    } else if (components.include  && components.include.length) {
      components = new _ctComponents();
      for (included in components.include) { this.components = components[included]; } // loop over and cache the desired componentd

    // if defaults are excluded
    } else if (components.exclude && components.exclude.length) {
      this.component = new _ctComponents();
      for (included in components.include) { delete components[included]; } // loop over and delete the desired components
    }
  }

  // user specified components
  for (component in components) { this.register(component.name, component); }

  console.log('------ components ------');
  console.log(this.components);   
}


//
// _ctComponents
//
//   A set of default components which can be overwritten, manipulated, etc
//
_ctComponents = function () {};
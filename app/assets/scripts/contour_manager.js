//
// set of contour components
//
var components = {};


// Header component
components.header : {
  mobile : function ($this, x, y) {
    $this.hide();
  },
  desktop : function ($this, x, y) {
    $this.show();
  }
}

//
// execute the contour constructor
//
new contour(null, components);

//
// App configuration
//

simpleApp.appConfig = {};
simpleApp.helpers   = {};

// page break constants
var pageBreaks  = {
  '0'   : 'mobile',
  '500' : 'desktop', // or tablet
  // 1000 : 'desktop' // if tablet is used
};

// sort the page breaks
var sortable = [];
for (var pageBreak in pageBreaks) { sortable.push([pageBreak, pageBreaks[pageBreak]]); }
sortable.sort(function (a, b) { return b[1] - a[1]; });//perform sort by value

pageBreaks = {};
for (var state in sortable) {  pageBreaks[sortable[state][0]] = sortable[state][1]; } // reconstruct array to be sorted
simpleApp.appConfig._pageBreaks = pageBreaks;


simpleApp.config([function () {}]);
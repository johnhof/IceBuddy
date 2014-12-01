module.exports = function parse (urlObj, next) {
  return next(null, { parser: 'standard'});
}
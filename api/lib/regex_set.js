
module.exports = {
  email      : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password   : /^(?=.*\d).{4,8}$/,
  domainName : /\.(com|edu|net|org|info|coop|int|co\.uk|org\.uk|ac\.uk|uk)$/
}


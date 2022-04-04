var path = require('path');
var fs = require('fs');

exports.privateKey = fs.readFileSync(path.join(__dirname, './team.finance.key')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, './team.finance.pem')).toString();

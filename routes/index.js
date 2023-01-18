var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET paper-wallet. */
router.get('/paper-wallet', function(req, res, next) {
	res.render('paper-wallet');
});

module.exports = router;
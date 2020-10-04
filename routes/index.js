var express = require('express');
var router = express.Router();
var db = require('../database/db.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  new db().getList((res)=>{console.log(res)})
  res.render('index', { title: '5mok' });
});

router.get('/test', function(req, res, next) {
  res.render('index2', { title: 'test2' });
});

module.exports = router;

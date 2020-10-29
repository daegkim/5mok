var express = require('express');
var router = express.Router();
var db = require('../database/db.js')

var id = 0

/* GET home page. */
router.get('/', function(req, res, next) {
  id += 1
  res.render('index', {title: '5mok', rooms: [], userId: 'dgsoul' + String(id), pos: 'index'})
});

router.post('/game', function(req, res, next) {
  res.render('game', { title: '5mok', roomId: req.body.roomId, userId: req.body.userId, pos: 'game' });
});

module.exports = router;

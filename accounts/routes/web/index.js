const express = require('express');
const AccountModel = require('../../models/AccountModel');
const moment = require('moment/moment');

const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  //重定向 /account
  res.redirect('/account');
});

router.get('/account', checkLoginMiddleware, function (req, res, next) {
  // res.send('账本列表');
  AccountModel.find()
    .sort({ time: -1 })
    .exec((err, data) => {
      if (err) {
        res.status(500).send('插入失败~~');
        return;
      }
      res.render('list', { accounts: data, moment: moment });
    });
});

router.get('/account/create', checkLoginMiddleware, function (req, res, next) {
  res.render('create');
});

router.post('/account', checkLoginMiddleware, (req, res) => {
  //插入数据库
  AccountModel.create(
    {
      ...req.body,
      //修改 time 属性的值
      time: moment(req.body.time).toDate()
    },
    (err, data) => {
      if (err) {
        res.status(500).send('插入失败~~');
        return;
      }
      //成功提醒
      res.render('success', { msg: '添加成功哦~~~', url: '/account' });
    }
  );
});

router.get('/account/:id', checkLoginMiddleware, (req, res) => {
  //获取 params 的 id 参数
  let id = req.params.id;
  //删除
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send('删除失败~');
      return;
    }
    //提醒
    res.render('success', { msg: '删除成功~~~', url: '/account' });
  });
});

module.exports = router;

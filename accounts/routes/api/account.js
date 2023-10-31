var express = require('express');
const moment = require('moment/moment');
var router = express.Router();
const AccountModel = require('../../models/AccountModel');
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');

/* GET home page. */
router.get('/account', checkTokenMiddleware, function (req, res, next) {
  // res.send('账本列表');
  AccountModel.find()
    .sort({ time: -1 })
    .exec((err, data) => {
      if (err) {
        res.json({
          code: '1001',
          msg: '读取失败~~',
          data: null
        });
        return;
      }
      // res.render('list', { accounts: data, moment: moment });
      //响应成功的提示
      res.json({
        //响应编号
        code: '0000',
        //响应的信息
        msg: '读取成功',
        //响应的数据
        data: data
      });
    });
});

router.post('/account', checkTokenMiddleware, (req, res) => {
  //插入数据库
  AccountModel.create(
    {
      ...req.body,
      //修改 time 属性的值
      time: moment(req.body.time).toDate()
    },
    (err, data) => {
      if (err) {
        res.json({
          code: '1002',
          msg: '创建失败~~',
          data: null
        });
        return;
      }
      //成功提醒
      res.json({
        code: '0000',
        msg: '创建成功',
        data: data
      });
    }
  );
});

//删除记录
router.delete('/account/:id', checkTokenMiddleware, (req, res) => {
  //获取 params 的 id 参数
  let id = req.params.id;
  //删除
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.json({
        code: '1003',
        msg: '删除账单失败',
        data: null
      });
      return;
    }
    //提醒
    res.json({
      code: '0000',
      msg: '删除成功',
      data: {}
    });
  });
});

//获取单个账单信息
router.get('/account/:id', checkTokenMiddleware, (req, res) => {
  //获取 id 参数
  let { id } = req.params;
  //查询数据库
  AccountModel.findById(id, (err, data) => {
    if (err) {
      res.json({
        code: '1004',
        msg: '读取失败~~',
        data: null
      });
      return;
    }
    //成功响应
    res.json({
      code: '0000',
      msg: '读取成功',
      data: data
    });
  });
});

// 更新单个账单信息
router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
  //获取 id 参数值
  let { id } = req.params;
  //更新数据库
  AccountModel.updateOne({ _id: id }, req.body, (err, data) => {
    if (err) {
      res.json({
        code: '1005',
        msg: '更新失败~~',
        data: null
      });
      return;
    }
    //再次查询数据库 获取单条数据
    AccountModel.findById(id, (err, data) => {
      if (err) {
        res.json({
          code: '1004',
          msg: '读取失败~~',
          data: null
        });
        return;
      }
      //成功响应
      res.json({
        code: '0000',
        msg: '更新成功',
        data: data
      });
    });
  });
});

module.exports = router;

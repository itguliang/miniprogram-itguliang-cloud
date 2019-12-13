// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request');
const access_token = require('AccessToken');

cloud.init()

let appid = 'wx708bfca66ef4ee3e';//微信公众号开发者id
let secret = '85a306736b2adfe22fcbdba6bf83c505';//微信公众号开发者secret_key

// 云函数入口函数
exports.main = async (event, context) => {
  let at = new access_token({
    appid,
    secret
  });
  return at.getCachedWechatAccessToken();
}
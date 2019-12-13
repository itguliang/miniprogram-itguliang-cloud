const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init()

async function getWechatPosts(accessToken, offset, count) {
  let url = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken}`
  var options = {
    method: 'POST',
    json: true,
    uri: url,
    body: {
      "type": "news",
      "offset": offset,
      "count": count
    }
  }
  const rp = options =>
    new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  const result = await rp(options)
  let rbody = (typeof result === 'object') ? result : JSON.parse(result);
  return rbody;
}

// 云函数入口函数
exports.main = async (event, context) => {
  let token = null;
  await cloud.callFunction({
    name: 'getAccessToken'
  }).then(function (data) {
    token = data.result;
  });

  // let offset = event.offset;
  // let count = event.count;
  let res = getWechatPosts(token,0,10);
  return res;
}
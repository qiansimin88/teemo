'use strict';
var CaptchaGener = require('./lib/gen_captcha');

var model = require('./models/index');

const DB = require('./models');



class Captcha {
  constructor(config) {
    this.config = config || {}
    this.db = new DB(this.config)
  }
  generat(){
    return new Promise((resolve, reject) => {
      CaptchaGener((cap_json) => {
        this.db.set(cap_json.token,JSON.stringify({
          select_arr: cap_json.select_arr
        })).then(() => {
          return resolve(cap_json)
        }).catch(reject)
      })
    })
  }
  check(token,select){
    return new Promise((resolve, reject) => {
      this.db.get(token).then((rs) => {
        try {
          rs = JSON.parse(rs)
        } catch (e) {
          rs = null
        }
        if(rs){
          rs = rs.select_arr.sort().join('|')
          select = select.sort().join('|')
          select === rs ? resolve() : reject()
        }else{
          reject()
        }
      }).catch(reject)
    })
  }
}

module.exports = Captcha;

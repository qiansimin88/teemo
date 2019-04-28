'use strict';
const redis = require("redis")
const set = require('./set');
const get = require('./get');
class RedisDB {
  /**
   * { host , port }
   */
  constructor(config) {
    this.config = config || { expire: 3600 * 2 /**2 hours**/}
    this.config.expire = this.config.expire || 3600 * 2
    this.clien = null
    this.connect()
  }
  connect(){
    this.client = redis.createClient(this.config)
    this.client.on('ready',() => {
      console.log('redis ready');
    })
    this.client.on('error',(e) => {
      this.connect()
    })
  }
  set(){
    return set.apply(this,arguments)
  }
  get(){
    return get.apply(this,arguments)
  }
}

module.exports = RedisDB;

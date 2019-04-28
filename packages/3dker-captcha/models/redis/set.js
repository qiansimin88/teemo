module.exports = function (key, value) {
  return new Promise((resolve, reject) => {
    if(this.client){
      console.log(key,value);
      this.client.set(key, value, (err,rs) => {
        if(err) return reject(err)
        this.client.expire(key, this.config.expire)
        return resolve()
      })
    }else{
      return reject(new Error('client is not defined'))
    }
  })
};

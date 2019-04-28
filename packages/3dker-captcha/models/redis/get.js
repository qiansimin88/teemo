module.exports = function (key) {
  return new Promise((resolve, reject) => {
    if(this.client){
      this.client.get(key,(err,rs) => {
        if(err) return reject(err)
        return resolve(rs)
      })
    }else{
      return reject(new Error('client is not defined'))
    }
  })
};

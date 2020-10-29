class util {
  constructor() {

  }

  getTimeStamp() {
    var date = new Date();
  
    var result =
      this.leadingZeros(date.getFullYear(), 4) + '-' +
      this.leadingZeros(date.getMonth() + 1, 2) + '-' +
      this.leadingZeros(date.getDate(), 2) + ' ' +
  
      this.leadingZeros(date.getHours(), 2) + ':' +
      this.leadingZeros(date.getMinutes(), 2) + ':' +
      this.leadingZeros(date.getSeconds(), 2);
  
    return result;
  }
  
  leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }
}

module.exports = util
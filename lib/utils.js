var os = require('os')

module.exports = {
  isProd: function () {
    return os.platform() === 'linux'
  }
}


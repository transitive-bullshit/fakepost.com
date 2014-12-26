var os = require('os')

module.exports = {
  isProd: function () {
    return os.platform() === 'linux'
    //return fs.existsSync('/proc/xen') && fs.existsSync('/etc/ec2_version')
  }
}


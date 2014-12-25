var os = require('os')

module.exports = {
  isEC2: function () {
    return os.platform() === 'linux'
    //return fs.existsSync('/proc/xen') && fs.existsSync('/etc/ec2_version')
  }
}


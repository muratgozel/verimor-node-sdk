const https = require('https')

function sdk() {
  function createClient(config) {
    const username = config.username
    const password = config.password

    function send(payload) {
      return new Promise(function(resolve, reject) {
        payload.username = username
        payload.password = password

        const reqopts = {
          hostname: 'sms.verimor.com.tr',
          path: '/v2/send.json',
          method: 'POST',
          headers: {
            'Host': 'sms.verimor.com.tr',
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
        const req = https.request(reqopts, function(res) {
          res.setEncoding('utf8')
          let body = ''
          res.on('data', chunk => body += chunk)
          res.on('end', function() {
            if (res.statusCode !== 200) {
              return resolve({
                error: body
              })
            }
            else {
              return resolve({
                id: body
              })
            }
          })
        })

        req.on('error', function(e) {
          return resolve({
            error: e.message
          })
        })

        req.write(JSON.stringify(payload))

        req.end()
      })
    }

    return {
      send: send
    }
  }

  return {
    createClient: createClient
  }
}

module.exports = sdk()

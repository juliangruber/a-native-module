const path   = require('path')
    , fs     = require('fs')
    , rimraf = require('rimraf')

var dbidx = 0

  , location = function () {
      return path.join(__dirname, '_leveldown_test_db_' + dbidx++)
    }

  , lastLocation = function () {
      return path.join(__dirname, '_leveldown_test_db_' + dbidx)
    }

  , cleanup = function (callback) {
      fs.readdir(__dirname, function (err, list) {
        if (err) return callback(err)

        list = list.filter(function (f) {
          return (/^_leveldown_test_db_/).test(f)
        })

        if (!list.length)
          return callback()

        var ret = 0

        list.forEach(function (f) {
          rimraf(f, function () {
            if (++ret == list.length)
              callback()
          })
        })
      })
    }

  , setUp = function (t) {
      cleanup(function (err) {
        t.notOk(err, 'cleanup returned an error')
        t.end()
      })
    }

  , tearDown = function (t) {
      setUp(t) // same cleanup!
    }

  , collectEntries = function (iterator, callback) {
      var data = []
        , next = function () {
            iterator.next(function (err, key, value) {
              if (err) return callback(err)
              if (!arguments.length) {
                return iterator.end(function (err) {
                  callback(err, data)
                })
              }
              if (key == +key) key = +key
              data.push({ key: key, value: value })
              process.nextTick(next)
            })
          }
      next()
    }

module.exports = {
    location       : location
  , lastLocation   : lastLocation
  , setUp          : setUp
  , tearDown       : tearDown
  , collectEntries : collectEntries
}
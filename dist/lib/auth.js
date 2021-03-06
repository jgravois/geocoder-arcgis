'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');

var ArcGISAuth = function () {
  function ArcGISAuth() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ArcGISAuth);

    this.options = options;
    this.options.client_secret = options.client_secret || null;
    this.options.client_id = options.client_id || null;
    this.authendpoint = options.authendpoint || 'https://www.arcgis.com/sharing/oauth2/token';

    if (!this.options.client_id || !this.options.client_secret) {
      throw new Error('Please specify client_id and client_secret!');
    }
    this.cache = {};
  }

  _createClass(ArcGISAuth, [{
    key: 'putToken',
    value: function putToken(token, experation) {
      this.cache.token = token;
      // Shave 30 secs off experation to ensure that we expire slightly before the actual expiration
      this.cache.tokenExp = new Date().getTime() + (experation - 30);
    }
  }, {
    key: 'getToken',
    value: function getToken() {
      if (!this.cache) return null;
      if (new Date().getTime() <= this.cache.tokenExp) return this.cache.token;
      return null;
    }

    /**
     *  Authenticate with OAuth
     *  @return token OAuth token
     */

  }, {
    key: 'auth',
    value: function auth() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var cachedToken = _this.getToken();

        if (cachedToken !== null) {
          resolve(cachedToken);
          return;
        }

        var options = {
          url: _this.authendpoint,
          qs: {
            client_secret: _this.options.client_secret,
            client_id: _this.options.client_id,
            grant_type: 'client_credentials',
            expiration: 1440,
            f: 'json'
          }
        };

        request.post(options, function (error, response, body) {
          if (error) reject({ code: 404, msg: error });else if (response.statusCode !== 200) reject({ code: response.statusCode, msg: 'Unable to connect to endpoint ' + options.url });else if (response.body.error) reject(response.body);else if (body) {
            var result = JSON.parse(response.body);
            var tokenExpiration = new Date().getTime() + result.expires_in;
            var token = result.access_token;
            _this.putToken(token, tokenExpiration);
            resolve(token);
          }
        });
      });
    }
  }]);

  return ArcGISAuth;
}();

module.exports = ArcGISAuth;
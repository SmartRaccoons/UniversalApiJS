// Generated by CoffeeScript 1.8.0
(function() {
  var GET, UniversalApi, _GET;

  GET = (function(a) {
    var b, p, pr, _i, _len;
    b = {};
    if (a === '') {
      return b;
    }
    for (_i = 0, _len = a.length; _i < _len; _i++) {
      pr = a[_i];
      p = pr.split('=');
      if (p.length === 2) {
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  _GET = function(p) {
    if (p in GET) {
      return GET[p];
    }
    return false;
  };

  window.UniversalApi = UniversalApi = (function() {
    UniversalApi.prototype.url = 'http://uniapi.raccoons.lv/user.json';

    function UniversalApi(params) {
      this._url_params = params;
      if (_GET('dr_auth_code')) {
        this._url_params['dr_auth_code'] = _GET('dr_auth_code');
      }
    }

    UniversalApi.prototype._url = function(additional) {
      var k, url, v, _ref;
      if (additional == null) {
        additional = {};
      }
      url = [];
      _ref = this._url_params;
      for (k in _ref) {
        v = _ref[k];
        url.push("" + k + "=" + (decodeURIComponent(v)));
      }
      for (k in additional) {
        v = additional[k];
        url.push("" + k + "=" + (decodeURIComponent(v)));
      }
      return url.join('&');
    };

    UniversalApi.prototype.authorize = function(callback) {
      return this._request(callback);
    };

    UniversalApi.prototype.session = function() {
      return this._url_params.session;
    };

    UniversalApi.prototype.data = function(k, v) {
      var additional;
      if (v == null) {
        v = false;
      }
      if (v) {
        additional = {};
        additional["data." + k] = v;
        return this._request((function() {}), additional);
      }
      if (this.user) {
        return this.user.data[k];
      }
      return false;
    };

    UniversalApi.prototype._request = function(callback, additional) {
      if (additional == null) {
        additional = {};
      }
      return $.ajax({
        url: "" + this.url + "?" + (this._url(additional)),
        dataType: 'jsonp',
        success: (function(_this) {
          return function(data) {
            if (data.session) {
              _this._url_params['session'] = data.session;
              _this.user = data;
            }
            return callback(data);
          };
        })(this),
        error: function() {
          return callback({});
        }
      });
    };

    return UniversalApi;

  })();

}).call(this);

GET = ((a)->
  b = {}
  if a is ''
    return b
  for pr in a
    p = pr.split('=')
    if p.length is 2
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "))
  b
)(window.location.search.substr(1).split('&'))

add_script = (url, callback=->)->
  script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  callback(script)
  document.getElementsByTagName('head')[0].appendChild script

loadJSONP = do ->
  unique = 0
  (url, callback, context) ->
    name = '_jsonp_' + unique++
    if url.match(/\?/)
      url += '&callback=' + name
    else
      url += '?callback=' + name
    add_script url, (script)=>
      window[name] = (data) ->
        callback.call context or window, data
        document.getElementsByTagName('head')[0].removeChild script
        script = null
        delete window[name]


_GET = (p)->
  if p of GET
    return GET[p]
  return false

window.UniversalApi = class UniversalApi
  constructor: (params)->
    @_url_params = params
    @options = {
      url: params.url
    }
    delete params.url
    if _GET('dr_auth_code')
      add_script '//ifrype.com/applications/external/draugiem.js'
      @_media = 'draugiem'
      @_url_params['dr_auth_code'] = _GET('dr_auth_code')

  _url: (additional = {})->
    url = []
    for k, v of @_url_params
      url.push "#{k}=#{decodeURIComponent(v)}"
    for k, v of additional
      url.push "#{k}=#{decodeURIComponent(v)}"
    url.join('&')

  authorize: (callback)->
    @_request(callback)

  session: -> @_url_params.session

  share: (options, callback=->)->
    if @_media is 'draugiem'
      draugiemSay(options.title, options.url, '', options.text, callback)

  data: (k, v=false)->
    if v
      additional = {}
      additional["data.#{k}"] = v
      return @_request((->), additional)
    if @user
      return @user.data[k]
    return false

  _request: (callback, additional={})->
    loadJSONP "#{@options.url}?#{@_url(additional)}", (data)=>
      if data.session
        @_url_params['session'] = data.session
        @user = data
      callback(data)

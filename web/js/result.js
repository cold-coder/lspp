document.addEventListener("DOMContentLoaded", function(event) {
  var app = new Vue({
    el: '#pp',
    data: {
      code: '',
      photoList: [],
      isFromPicking: false, // 控制输入框显示
      api: {
        GET_PHOTO: API_URL + '/result'
      }
    },
    created: function() {
      var qs = location.search
      if (qs && qs.indexOf('code') > -1) {
        this.code = qs.split('=')[1]
        this.isFromPicking = true
        this.queryPhotos()
      } else {
      }
    },
    methods: {
      queryPhotos: function() {
        if (this.code !== '') {
          axios.get(this.api.GET_PHOTO, {
            params: {
              code: this.code.trim()
            }
          }).then(function(res) {
            if (res.data) {
              this.photoList = res.data.photos
              this.isFromPicking = true
            }
          }.bind(this)).catch(function(err) {
            console.error(err)
          })
        }
      }
    },
    filters: {
      extractFilename: function(url) {
        var lastSlash = url.lastIndexOf('/')
        return url.substr(lastSlash + 1, url.length)
      }
    }
  })
});

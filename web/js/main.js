document.addEventListener("DOMContentLoaded", function(event) {
  var API_URL = 'http://192.168.31.104:9001'
  var IMG_DOMAIN = 'http://img.bananasusu.com'
  var app = new Vue({
    el: '#pp',
    data: {
      code: '',
      photoList: [],
      pickedPhoto: [],
      limit: 0,
      isPicking: false, // 控制输入框显示
      api: {
        GET_PHOTO: API_URL + '/photo'
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
              this.photoList = res.data.photoList.map(function(f) {
                return IMG_DOMAIN + '/' + f
              })
              this.limit = res.data.limit

              this.isPicking = true
            }
          }.bind(this)).catch(function(err) {
            console.error(err)
          })
        }
      },
      doPick: function () {
        if (this.pickedPhoto.length > this.limit) {
          alert('您最多选择'+ this.limit + '张照片')
          return
        } else {
          console.log(this.pickedPhoto);
        }
      }
    }
  })
});

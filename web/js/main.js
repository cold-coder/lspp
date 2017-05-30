document.addEventListener("DOMContentLoaded", function(event) {
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
    watch: {
      pickedPhoto: function(n) {
        if (n.length > this.limit) {
          alert('您最多选择'+ this.limit + '张照片')
        }
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
          axios.post(this.api.GET_PHOTO, {
            code: this.code.trim(),
            photos: this.pickedPhoto
          }).then(function(res) {
            console.log(res);
            window.location.href="result.html?code=" + this.code.trim()
          }.bind(this))
        }
      }
    }
  })
});

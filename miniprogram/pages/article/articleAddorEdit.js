Page({
  data: {
    placeholder: '在此输入文章内容...',
    articleTitle: "",
    articleContent: "",
    readOnly: false,
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  onArticleTitleChange(e) {
    this.setData({
      articleTitle: e.detail
    })
  },
  onArticleContentChange(e) {
    this.setData({
      articleContent: e.detail.html
    })
  },
  // 保存文章
  saveArticle: function(event) {
    if (!this.data.articleTitle) {
      wx.showToast({
        title: '文章标题不能为空',
      })
      return
    }
    if (!this.data.articleContent) {
      wx.showToast({
        title: '文章内容不能为空',
      })
      return
    }
    if (!this.data.articleId) {
      this.addArticle();
    } else {
      this.updateArticle();
    }
  },
  addArticle() {
    const db = wx.cloud.database()
    db.collection('articles').add({
      data: {
        title: this.data.articleTitle,
        content: this.data.articleContent,
        commentNum: 0,
        viewNum: 0,
        likeNum:0
      },
      success: res => {
        wx.showToast({
          title: '发布成功',
        });
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        wx.navigateBack({
          delta: 1, 
          success: function() {
            if (prevPage.route == 'pages/home/home') {
              prevPage.loadData(); 
            }
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '发布失败'
        })
      }
    })
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function() {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function(res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function() {
            console.log('insert image success')
          }
        })
      }
    })
  }
})
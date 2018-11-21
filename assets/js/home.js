// const WechatJSSDK = require('wechat-jssdk/dist/client');


(function($, PM, Account, WechatJSSDK) {
  PM.request({
    url: '/wechat/get-signature',
    type: 'GET',
    dataType: "json",
    data:{url:location.href.split('#')[0]}
  }).then(function(res) {
    const config = {
      'appId': res.appId,
      'nonceStr': res.nonceStr,
      'signature': res.signature,
      'timestamp': res.timestamp,
      'success': jssdkInstance => {
        // alert(jssdkInstance)
        /*jssdkInstance.wx.onMenuShareAppMessage({
          title: 'test title',
          type: 'link',
          desc: 'share description',
          success: function () {
            alert('share on chat success');
          },
          cancel: function () {
            console.log('share on chat canceled');
          },
          imgUrl: "http://pic1.ooopic.com/uploadfilepic/shiliang/2009-10-05/OOOPIC_00cyl_20091005e2c6eb1c889e342e.jpg"
        });*/
        jssdkInstance.shareOnChat({
          type:'link',
          title: '张定军&雍菊蓉的婚礼请柬',
          link: window.location.href,
          imgUrl: 'http://pc5e9xq7v.bkt.clouddn.com/1-740.jpg',
          // imgUrl: 'http://bkcdn.fecstec.com/1/20181121/131023568c7537.jpg',
          // imgUrl: 'http://bkcdn.fecstec.com/1/20181121/1305042199ed3.jpg',
          desc: '我们将在12月26日举行婚礼，诚挚邀请您及其家人的到来',
          success: function (res){
            // alert("ok")
          },
          cancel: function (){
            // alert("fail")
          }
        });
        jssdkInstance.shareOnMoment({
          title: '张定军&雍菊蓉的婚礼请柬',
          link: window.location.href,
          imgUrl: 'http://bkcdn.fecstec.com/1/20181121/131023568c7537.jpg',
          success: function (res){
            // alert("ok")
          }
        });

      },
      //invoked if sign failed, in v3.0.10+, jssdk instance will be pass to the func, (err, wxObj) => {}
      'error': (err, jssdkInstance) => {},
      //enable debug mode, same as debug
      'debug': false,
      'jsApiList': ['checkJsApi',
        'onMenuShareTimeline',
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'], //optional, pass all the jsapi you want, the default will be ['onMenuShareTimeline', 'onMenuShareAppMessage']
      'customUrl': '' //set custom weixin js script url, usually you don't need to add this js manually
    };
    // const wechatObj = new WechatJSSDK(config);
    const wechatObj = new WechatJSSDK(config);
  });

  //------------------------------------------------------------------------------------

  if (location.href.indexOf('wall') > 0) return;

  PM.tilt.init();

  //getMusicUrl

  PM.request({
    url: '/home/getMusicUrl',
    type: 'get',
    dataType: "json",
    data:{ID: Math.floor(Math.random()*10+1)} //1-10随机整数
  }).then(function (res) {

    PM.bgm = new PM.BGM($('#bgm-audio'), {
      // src: '/audios/pm_bgm2.mp3',
      // src: 'https://qnvideo.hunliji.com/o_1bn854ujc17nkj0q1fff9b2v29v.mp3',
      src: res.musicUrl,
      // src: 'https://qnvideo.hunliji.com/o_1bo9vjd7m5pd1gl115gmbou9k14.mp3',
      // src: 'http://cdnoss.zhizuoh5.com/syspic/mp3/e07b470fc2ff4927a2ddd0ec9ad73f74.mp3',
      autoplay: true
    });
  })




  var slick = $('.gallery').slick({
    arrows: false,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 4000,
    lazyLoad: 'ondemand'
  }).on('afterChange', function(e, slick, index) {
    var $img = $(slick.$slides[index]).find('img').addClass('disable-tilt');
    PM.tilt.pause();
    PM.tilt.setTilt($img.data('tiltObj').reset()).update();
    PM.tilt.play();
    $img.removeClass('disable-tilt');
  }).slick('getSlick');

  if (slick.$slides) {
    slick.$slides.find('img').each(function() {
      $(this).data('tiltObj', new PM.Tilt($(this)));
    });

    // update first when init
    PM.tilt.setTilt($(slick.$slides[0]).find('img').data('tiltObj')).update();
    $(slick.$slides[0]).find('img').removeClass('disable-tilt');
  }

  $('#btn-back').on('tap', function(e) {
    $('#pnl-fullpage .slide').removeClass('slideup');
    e.preventDefault();
  });

  $('#btn-map').on('tap', function(e) {
    var $btn = $(this);
    if ($btn.hasClass('weui_btn_disabled')) {
      return;
    }
    $btn.addClass('weui_btn_disabled');
      $('#pnl-fullpage .slide').addClass('slideup');

    PM.map.open().always(function() {
      $btn.removeClass('weui_btn_disabled');
    });
    e.preventDefault();
  });

  $('#btn-wish').on('tap', function(e) {
    $('#btn-group').removeClass('dock-show').addClass('dock-hide');
    $('#wish-box').removeClass('dock-hide').addClass('dock-show');
    e.preventDefault();
  });

  $('#btn-close-wish').on('tap', function(e) {
    $('#ipt-wish').blur();
    $('#wish-box').removeClass('dock-show').addClass('dock-hide');
    $('#btn-group').removeClass('dock-hide').addClass('dock-show');
    e.preventDefault();
  });

  $('#btn-checkin').on('tap', function(e) {
    var mask = $('#checkin-mask');
    var weuiActionsheet = $('#checkin-actionsheet');
    var remainDays = Math.floor((new Date(2016, 9, 5) - new Date())/(24*3600*1000));
    if (remainDays > 0) {
      weuiActionsheet.find('[data-status="present"]').addClass('disabled').find('small').html('还有' + remainDays + '天');
    }
    if (Account.lastCheckin && Account.lastCheckin.status) {
      weuiActionsheet.find('[data-status="' + Account.lastCheckin.status + '"]').addClass('disabled').find('small').html('已签到');
    }
    weuiActionsheet.addClass('weui_actionsheet_toggle');
    mask.show()
      .focus()
      .addClass('weui_fade_toggle').one('tap', function (e) {
        hideActionSheet(weuiActionsheet, mask);
        e.preventDefault();
      });

    weuiActionsheet.one('tap', 'a', function (e) {
      if ($(this).data('status') && !$(this).hasClass('disabled')) {
        PM.request({
          url: '/home/api_checkin',
          type: 'POST',
          data: {
            accountID: Account.accountID,
            status: $(this).data('status')
          }
        }).then(function(checkin) {
          Account.lastCheckin = checkin;
          PM.toast(checkin.status == 'absent' ? '实在太遗憾了' : '恭候您的光临', 3000);
        });
      }

      hideActionSheet(weuiActionsheet, mask);
      e.preventDefault();
    });
    mask.off('transitionend').off('webkitTransitionEnd');

    PM.tilt.disable();

    function hideActionSheet(weuiActionsheet, mask) {
        weuiActionsheet.removeClass('weui_actionsheet_toggle');
        mask.removeClass('weui_fade_toggle');
        mask.on('transitionend webkitTransitionEnd', function () {
          weuiActionsheet.find('[data-status]').removeClass('disabled').find('small').empty();
          mask.hide();
          PM.tilt.enable();
        });
    }

    e.preventDefault();
  });

  var getPlaceholder = (function() {
    var last = 0;

    return function() {
      var ps = [
        '为我们送上祝福吧',
        '新郎帅不帅',
        '新娘美不美',
        '来，在这输入，我带你飞',
        '听说你知道新郎的秘密',
        '听说你知道新娘的秘密',
        '来不及解释了，快上车',
        '据说12月26号弹幕会下红包雨',
        '你怎么才来啊',
        '终于等到你，还好我没放弃',
        '让祝福飞一会儿',
        '你知道新郎和新娘是怎么认识的吗',
        '执子之手，与子一起抢红包',
        '天将降红包于斯人也',
        '百年好合，红包大额'
      ];
      var curr = last;

      while (true) {
        curr = Math.floor(Math.random()*ps.length);
        if (curr != last) {
          break;
        }
      }

      last = curr;
      return ps[curr];
    };
  }());

  $('#ipt-wish').fittextarearows(1, 5).on('focus', function() {
    PM.tilt.disable();
  }).on('blur', function() {
    PM.tilt.enable();
    $(this).attr('placeholder', getPlaceholder());
  }).on('touchmove touchstart', function (e) {
      e.stopPropagation();
  }).attr('placeholder', getPlaceholder());

  $('#btn-send-wish').on('tap', function(e) {
    e.preventDefault();
    var $t = $(this);
    var $ipt = $('#ipt-wish');
    var msg = $.trim($ipt.val());



    // 多个敏感词，这里直接以数组的形式展示出来
    var arrMg = ["fuck", "tmd", "他妈的","鸟","尿","睾丸","阴","死","屎","靠","鬼","龟","骂","痴","操","屁","臀","奶","乳房","乳","日你妈","rnm","cnm","TMD","RNM","CNM","Cnm","Rnm","孙子","狗","猪八戒","厕所","wc","WC","Wc","wC","哈皮","bi","你妹","妹","干","娘","牛逼","逼","瓜婆娘","去你妈的","老母","买","pi","p","狗日的","SB","sb","sB","Sb","道","傻","煞笔","神经病","病","神经","打死你","牛皮","锤","精神病","神精","儿子","儿","AV","黄片","黄","色","咪咪","瓜娃子","cao","草","球"];

    // 正则表达式
    for (var i = 0; i < arrMg.length; i++) {
      // 创建一个正则表达式
      var r = new RegExp(arrMg[i], "ig");
      msg = msg.replace(r, "🎈");
    }


    if ($t.prop('disabled') || !msg) {
      return;
    }

    $t.prop('disabled', true);

    PM.request({
      url: '/home/api_wish',
      type: 'POST',
      data: {
        accountID: Account.accountID,
        msg: msg
      }
    }).then(function(wish) {
      $ipt.val('').blur();
      // PM.board.pendingMsg.push(wish);
      PM.toast('感谢您的祝福', 3000);
    }).always(function() {
      $t.prop('disabled', false);
    });
  });

  $('.fullpage').on('touchmove', function(e) {
    e.preventDefault();
  });

  if ($('#wish-board').size() > 0) {
    PM.poller.poll();
    PM.board.init($('#wish-board'));
  }

  function filterxx() {

    // 获取输入框的内容inputContent
    var inputContent = input.value;

    // 多个敏感词，这里直接以数组的形式展示出来
    var arrMg = ["fuck", "tmd", "他妈的"];

    // 显示的内容--showContent
    var showContent = inputContent;

    // 正则表达式
    // \d 匹配数字

    for (var i = 0; i < arrMg.length; i++) {

      // 创建一个正则表达式
      var r = new RegExp(arrMg[i], "ig");

      showContent = showContent.replace(r, "祝福");
    }
    // 显示的内容--showInput
    showInput.value = showContent;
  }

}(jQuery, PM, Account, WechatJSSDK));


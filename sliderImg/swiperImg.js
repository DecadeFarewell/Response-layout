(function ($) {

    var obj = {
        init: function (options) {
            this.options = options;
            this.father = options.father;
            this.imgList = options.imgList;
            // 轮播图片的数量
            this.imgNum = options.imgList.length;
            // 图片的宽度
            this.imgWidth = options.width || $(options.father).width();
            this.imgHeight = options.height ||  $(options.father).height();
            // 当前图片索引值
            this.nowIndex = options.nowIndex || 0;
            // 定时器
            this.timer = null;
            // 锁
            this.lock = false;
            this.createDom();
            this.bindEvent();
            this.sliderAutoMove();
        },
        bindEvent: function () {
            var self = this;
            $(this.father).find('.btn .leftBtn').click(function () {
                self.sliderMove('pre');
            });
            $(this.father).find('.btn .rightBtn').click(function () {
                self.sliderMove('next');
            });
            $(this.father).find('.spot li').click(function () {
                // console.log(self.nowIndex)
                if (!(self.nowIndex == self.imgNum && $(this).index() == 0)) {
                    self.sliderMove($(this).index());
                }
            })
        },
        createDom: function () {
            var imgListUl = $('<ul class="swiperUl" id="swiperUl"></ul>')
            var imgLiStr = '';
            var spotStr = '';
            for (var i = 0; i < this.imgList.length; i ++) {
                imgLiStr += '<li class="imgLi">\
                <img src="' + this.imgList[i] + '" alt="">\
            </li>';
                if (i == this.nowIndex) {
                    spotStr += ' <li class="active"></li>';
                } else {
                    spotStr += ' <li></li>';
                }
            }
            imgLiStr +=  '<li class="imgLi">\
            <img src="' + this.imgList[0] + '" alt="">\
        </li>';
            imgListUl.append($(imgLiStr));
            var btnDiv = $('<div class="btn">\
            <div class="leftBtn">&lt;</div>\
            <div class="rightBtn">&gt;</div>\
        </div>');
            var spotUl = $('<ul class="spot"></ul>');
            spotUl.append($(spotStr));
            $(this.father).append(imgListUl);
            $(this.father).append(btnDiv);
            $(this.father).append(spotUl);
            this.addCss(this.options);
        },
        addCss(options) {
            this.imgWidth = options.width || $(options.father).width();
            this.imgHeight = options.height ||  $(options.father).height();
            $('.swiperUl', $(this.father)).css({
                width: this.imgWidth * (this.imgNum + 1) + 'px',
                height: this.imgHeight + 'px',
                position: 'absolute',
            });
            $('.swiperUl li', $(this.father)).css({
                float: 'left',
                width: this.imgWidth + 'px',
                height: this.imgHeight + 'px',
            })
            $('.swiperUl li img', $(this.father)).css({
                width: this.imgWidth + 'px',
                height: this.imgHeight + 'px',
            })
        },
        sliderAutoMove: function () {
            this.addCss(this.options);
            clearTimeout(this.timer);
            var self = this;
            this.timer = setTimeout(function () {
                // 默认顺序轮播
                self.sliderMove('next');
            }, 1000)
        },
        sliderMove: function (dir) {
            this.addCss(this.options);
            // console.log(this);
            var self = this;
            // dir -> 运动方向 pre代表向前移动  next代表向后移动  index跳转到图片的索引值
            if (!this.lock) {
                // return false;
                this.lock = true;
                if (dir == 'pre') {
                    if (this.nowIndex == 0) {
                        $(this.father).find('#swiperUl').css('left', -this.imgNum * this.imgWidth + 'px');
                        this.nowIndex = this.imgNum;
                    }
                    this.nowIndex --;
                    $(this.father).find('#swiperUl').animate({
                        left: - this.nowIndex * this.imgWidth + 'px',
                    }, 1000, function () {
                        self.lock = false;
                        self.sliderAutoMove();
                        self.changeIndex(self.nowIndex);
                    })
                } else if (dir == 'next') {
                    self.nowIndex ++;
                    $(this.father).find('#swiperUl').animate({
                        left: - self.nowIndex * self.imgWidth + 'px',
                    }, 1000, function () {
                        if (self.nowIndex == self.imgNum) {
                            $(self.father).find('#swiperUl').css('left', '0px');
                            self.nowIndex = 0;
                        }
                        self.changeIndex(self.nowIndex);
                        self.lock = false;
                        self.sliderAutoMove();
                       
                    })
                } else {
                    if (self.nowIndex == self.imgNum - 1 && dir == 0) {
                        dir = self.imgNum;
                    }
                    self.nowIndex = dir;
                    $(this.father).find('#swiperUl').animate({
                        left: - self.nowIndex * self.imgWidth + 'px',
                    }, 1000, function () {
                        if (self.nowIndex == self.imgNum) {
                            $(self.father).find('#swiperUl').css('left', '0px');
                            self.nowIndex = 0;
                        }
                        self.lock = false;
                        self.sliderAutoMove();
                        self.changeIndex(self.nowIndex);
                    })
                }
            }
           
        },
        changeIndex: function (index) {
            $(this.father).find('.spot .active').removeClass('active');
            $(this.father).find('.spot li').eq(index).addClass('active');
        }
    }
    
    $.fn.extend({
        swiperImg: function (options) {
            options.father = this;
            obj.init(options);
        }
    })
})(jQuery)
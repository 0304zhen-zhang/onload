(function ($) {
    var myScroll,
        pullDownEl,
        pullDownOffset,
        pullUpEl,
        pullUpOffset;

    //todo 自己定义的变量
    var userDataSum,//存储数据的变量
        addNum = 0,
        stepLength = 10,//每次加载的步长
        sumL=0;//数据的长度
    /**
     *  刷新滚动区域的滚动条的位置（此方法在添加数据后调用）
     **/
    function refreshScrollBar() {
        console.log("刷新滚动条");
        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
        }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
    }

    function pullDownAction () {
        console.log("下拉");
        //alert('pullDown')
        setTimeout(function () {
            (function reloadPage() {
                if (GetQueryString("_rf")) {
                    window.location.href = window.location.href.replace(GetQueryString("_rf"), Math.random());
                } else {
                    window.location.href = window.location.href + (window.location.href.indexOf("?") > -1 ? "&" : "?") + "_rf=" + Math.random();
                }
            })();
            myScroll.refresh();
            console.log($("#thelist").height())
        }, 1000);
    }
    //初始化数据
    function pullUpAction () {
        console.log("上拉");
        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            //TODO 上拉添加数据
            add(userDataSum);
            console.log($("#thelist").height())
            myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
        }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
    }

    function loaded() {
        pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight;
        pullUpEl = document.getElementById('pullUp');
        pullUpOffset = pullUpEl.offsetHeight;
        myScroll = new iScroll('wrapper', {
            useTransition: true,
            //隐藏下拉出现的提示语  通过topOffset参数属性设置IScroll已经滚动的基准值
            topOffset: pullDownOffset,
           //通过onRefresh参数方法调整刷新后的界面结构
            onRefresh: function () {
                if (pullDownEl.className.match('loading')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                } else if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                }
            },
             //通过onScrollMove参数方法判断当前滚动是到顶端还是底端
            onScrollMove: function () {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                    this.minScrollY = 0;
                } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                    this.minScrollY = -pullDownOffset;
                } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'flip';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                    this.maxScrollY = pullUpOffset;
                }
            },
            //通过onScrollEnd参数方法触发加载新数据，再通过refresh方法重新渲染界面
            onScrollEnd: function () {
                //alert(1)
                if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';

                    refreshScrollBar();
                    pullDownAction();	// Execute custom function (ajax call?)
                } else if (pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                    if(addNum<sumL){
                        pullUpAction();	// Execute custom function (ajax call?)

                    }else{
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '数据已全部加载完毕';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML ="数据已全部加载完毕！";
                    }
                }
            }
        });

        setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
    }

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        return (r != null && r.length >= 2) ? decodeURI(r[2]) : null;
    }

    user();

    function user() {
		var num=1;
		$.ajax({
          url:'https://s.m.taobao.com/search?event_submit_do_new_search_auction=1&_input_charset=utf-8&topSearch=1&atype=b&searchfrom=1&action=home%3Aredirect_app_action&from=1&sst=1&n=20&buying=buyitnow&m=api4h5&abtest=16&wlsort=16&style=list&closeModues=nav%2Cselecthot%2Conesearch&page='+ num +" ' ",
            dataType:'jsonp',
            jsonp: 'callback',
            success:function(data){
                userDataSum = data;
                console.log(data);
                add(userDataSum)
            }
        })
    }

    function add(data){
        sumL = data.totalPage;
        //总的长度减去已加载的长度是否小于每次加载的长度
        if ((sumL - addNum) < stepLength) {
            stepLength = sumL % stepLength;
        }
        //每次加载的步长长度
        addNum += stepLength;
        if (addNum >= sumL) {
            addNum = sumL;
        }
		str1 = '';
        for(var i=0;i<data.listItem.length;i++){
            str1+='<li><div><img src="'+data.listItem[i].pic_path+'" alt="" class="tu"></div><div><p class="title">'+data.listItem[i].title+'</p><p><span><em>￥</em><i class="prece">'+data.listItem[i].price+'</i></span><span>￥<em></em><i class="prece1">199</i></span></p> <p>2折</p><p class="iconfont add">&#xe615;</p></div></li>';

        }
        //添加进详情列别里面
       	$('#thelist').append(str1);
        
        //TODO 首次添加数据以后调用（刷新滚动条高度）
        refreshScrollBar();
    }


})(jQuery);
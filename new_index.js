// ==UserScript==
// @name         B站首页推荐视频屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// ==/UserScript==

// 屏蔽词
const hasSpace = true; // 是否屏蔽带空格，比如：当有关键词为“张三爱学习”时同时屏蔽“张 三 爱 学 习”
const keyWord = [
    ["舟","罗德","博士","突袭","危机","干员","鹰角","刀客塔","凯尔","阿米娅","合成玉"],// 舟批
    ["原神","蒙德","璃月","稻妻","可莉","旅行者","炸鱼","宵宫","派蒙","云堇","劈观","八重神子"],// 原批
    ["嘉然","吃什么","嘉心糖","tuber"],// V批
    ["必出","许愿","玄学","抽不到","欧"],// 豹批
    ["结婚","领证","在一起", "老婆", "老公"],// 秀恩爱批
    ["华为","小米"],// 数码魔怔批
    // 百大UP（非褒义）
    ["吃素的狮子","爱喝冰阔落","TOM表哥","啊吗粽","阿幕降临","敖厂长","拜托了小翔哥","宝剑嫂","不正经老丝","才疏学浅的才浅","-纯黑-","大祥哥来了","盗月社食遇记","电影最TOP",
     "东尼ookii","逗比的雀巢","EdmundDZhang","阿斗归来了","二喵的饭","芳斯塔芙","冯提莫","孤独的美食基","hanser","韩小四April","盒子酸奶","鹤吱菌","黄龄","黑猫厨房","红色激情",
     "花少北丶","回形针PaperClip","机智的党妹","极速拍档","假美食po主","敬汉卿","卡特亚","靠脸吃饭的徐大王","靠谱电竞","科技美学","克里米亚野生动物园","LexBurner","蜡笔和小勋",
     "老番茄","老师好我叫何同学","老坛胡说","力元君","历史调研室","凉风Kaze","泠鸢yousa","刘老师说电影","罗汉解说","★⑥檤轮囬★","绵羊料理","某幻君","纳豆奶奶","奶糕成精档案社",
     "努力的Lorre","女胖胖","哦呼w","帕梅拉PamelaReif","瓶子君152","齐天大肾余潇洒","奇闻观察室","枪弹轨迹","上海滩许Van强","渗透之C君","食贫道","水无月菌","兔叭咯","推背兔の",
     "丸子叨叨叨","文不叮","文西与阿漆","我是郭杰瑞","逍遥散人","小艾大叔","小潮院长","小片片说大片","-欣小萌-","徐大虾咯","=咬人猫=","一只小仙若","伊丽莎白鼠","音乐制作人Kurt",
     "硬核的半佛仙人","与山0v0","雨哥到处跑","远古时代装机猿","zettaranc","在下哲别","智能路障","中国BOY超级大猩猩","周六野Zoey","主厨农国栋","祖娅纳惜"],
    ["高质量","人类","❤","⚡","绝绝子","对不起","不要笑","要是火了","如果火了","能火吗", "读评论"],// 烂梗
    ["冒死","上传","绝美","画质","硬币","白嫖","抽奖","白送","考研", "考试", "考前", "爆肝", "我把", "刷题", "面试", "黑客", "程序", "学会" ,"学不会" ,"耗时"]// 傻逼标题党
];
const regList = initRegList();
(function() {
    'use strict';
    videosRepalce();
    // 删除下面一大堆东西 等待500ms加载
    window.setTimeout(function(){
        $("section").each(function(index, value){
            if(index !== 0){
                $(value).remove();
            }
        });
        $(".eva-banner").each(function(index, value){
            $(value).remove();
        });
    }, 500);
    // 切换按钮
    $(document).on('click','.roll-btn-wrap',function(){
        window.setTimeout(function(){videosRepalce()}, 500);
    });
    //
})();
function videosRepalce(){
    // 首页推荐
    let videos = $(".bili-video-card");
    videos.each(function(i){
        let _this = $(this);
        let text = _this.text();
        if(regList.test(text)){
            _this.html("<div class='bili-video-card'><div class='bili-video-card__wrap __scale-wrap'><a href='javascript:void(0)'><div class='bili-video-card__image __scale-player-wrap'><div class='bili-video-card__image--wrap'><picture class='v-img bili-video-card__cover'><img class='logo-img' width='162' height='78' src='//i0.hdslb.com/bfs/archive/ca375eb31fa90b8e23b88ed3433c2f60de1c2e6e.png'/></picture></div></div></a><div class='bili-video-card__info __scale-disable'><div class='bili-video-card__info--right'><a href='javascript:void(0)' \><h3class='bili-video-card__info--tit' title='视频已屏蔽'><span style='color:#f55'>视频已屏蔽</span></h3></a></div></div></div></div>");
        }
    });

}
function initRegList(){
    let regStr = "";
    for (let i = 0; i < keyWord.length; i++) {
        for (let j = 0; j < keyWord[i].length; j++) {
            regStr += ".*";
            if(hasSpace){
                let keyWordArr = [...keyWord[i][j]];
                if(keyWordArr.length > 1){
                    for (let k = 0; k < keyWordArr.length; k++) {
                        if(k < keyWordArr.length -1){
                            regStr += "(" + keyWordArr[k] + "|" + keyWordArr[k] + ".?\\ )";
                        } else {
                            regStr += keyWordArr[k];
                        }
                    }
                } else {
                    regStr += keyWord[i][j];
                }
            } else {
                regStr += keyWord[i][j];
            }
            regStr += ".*|";
        }
        if(i == keyWord.length -1){
            regStr = regStr.substring(0, regStr.length -1);
        }
    }
    return new RegExp(regStr);
}

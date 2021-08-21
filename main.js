// ==UserScript==
// @name         B站首页推荐视频屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// ==/UserScript==

// 屏蔽词
const hasSpace = true; // 是否屏蔽带空格，比如：当有关键词为“张三爱学习”时同时屏蔽“张 三 爱 学 习”
const keyWord = [
    ["舟","罗德岛","博士","突袭","鹰角"],// 舟批
    ["原神","蒙德","璃月","稻妻","可莉"],// 原批
    ["必出","许愿","玄学","抽不到"],// 豹批
    ["结婚","领证"],// 恩爱批
    ["华为","小米"],// 数码魔怔UP
    ["爱喝冰阔落","盗月","TOM表哥"],// 百大UP（非褒义）
    ["高质量","人类","❤","⚡"],// 烂梗,烂标题
    ["冒死","上传","教程"]// 傻逼教材
];
const regList = initRegList();
(function() {
    'use strict';
    videosRepalce();
    // 切换按钮
    document.getElementsByClassName("change-btn")[0].addEventListener('click', function(){
        // 等待0.5秒视频更新
        window.setTimeout(function(){videosRepalce(regList)}, 500);
    });
})();
function videosRepalce(){
    let videos = document.getElementsByClassName("rcmd-box")[0].childNodes;
    videos.forEach(function(value, index){
        // 删除稍后再看按钮
        value.childNodes[1].remove();
        let title = value.innerText.trim();
        if(regList.test(title)){
            // 移除超链接
            value.childNodes[0].childNodes[0].removeAttribute("href");
            // 封面替换成批站logo
            value.childNodes[0].childNodes[0].childNodes[0].src = "https://i0.hdslb.com/bfs/archive/9e5f278027ae7f1e1933b6e4002870361da6c20b.png";
            // 标题替换成已屏蔽
            let info= value.childNodes[0].childNodes[0].childNodes[1];
            info.innerHTML = "<span style='color:#f55'>视频已屏蔽</span>";
        }
    });
}
function initRegList(){
    let regStr = "";
    for (let i = 0; i < keyWord.length; i++) {
        for (let j = 0; j < keyWord[i].length; j++) {
            regStr += ".*";
            if(hasSpace){
                console.log(keyWord[i][j]);
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

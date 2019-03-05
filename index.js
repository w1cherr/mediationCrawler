var express  = require('express')
var https = require('https')
const superagent = require('superagent');
var cheerio = require('cheerio')
var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块
var url = 'https://cs.xzl.anjuke.com/zu/yuhuah-p1/'
var link = 'https://cs.xzl.anjuke.com/zu/70565603/?pt=2'
const links = []
const peoples = []

async function getUrlInfo (url) {
    superagent.get(url).end((err, res) => {
        if (err) {
            console.log(err)
            return
        }
        let $ = cheerio.load(res.text)
        $('.list-item').each(function (idx, element) {
            let $element = $(element)
            links.push($element.attr('link'))
        })
        for (i in links) {
            let people = await getpeopleInfo(links[i])
            console.log(people)
            peoples.push(getpeopleInfo(links[i]))
        }
    })
}
async function getpeopleInfo (url) {
    let people = {}
    superagent.get(url).end((err, res) => {
        if (err) {
            console.log(err)
        }
        let $ = cheerio.load(res.text)
        let $name = $('.name')
        people.name = $name.first().text()
        let $comp = $('.comp_info')
        people.comp = $comp.children().last().text()
        let $phone = $('.broker_tel')
        people.phone = $phone.text()
        return people
    })
}

class Ut {
    /**
    * 异步延迟
    * @param {number} time 延迟的时间,单位毫秒
    */
    static sleep(time = 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, time);
      })
    }
}

// async function main () {
//     await getUrlInfo(url)
//     await Ut.sleep(10000)
//     peoples = peoples.reduce((preVal, curVal) => {
//         hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal); 
//         return preVal 
//     }, [])
//     var file = path.join(__dirname, 'data.json'); 

//     fs.writeFile(file, JSON.stringify(peoples), function(err) {
//         if (err) {
//             return console.log(err);
//         }
//         console.log('文件创建成功，地址：' + file);
//     });
// }
async function main () {
    for (let i = 1; i<=1; i++) {
        console.log('获取第' + i+ '页数')
        await getUrlInfo('https://cs.xzl.anjuke.com/zu/yuhuah-p' + i + '/')
        await Ut.sleep(10000)
    }
}
(async () => {
    await main()
    let hash = {};
    console.log(peoples)
    peoples = peoples.reduce((preVal, curVal) => {
        hash[curVal.name] ? '' : hash[curVal.name] = true && preVal.push(curVal); 
        return preVal 
    }, [])
    var file = path.join(__dirname, 'data.json'); 

    fs.writeFile(file, JSON.stringify(peoples), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('文件创建成功，地址：' + file);
    });
})()
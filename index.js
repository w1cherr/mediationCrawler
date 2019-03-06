const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, 'info1.json')
const target = 'http://daily.zhihu.com/story/9708430'
// const target = 'https://www.cnblogs.com/
const anjukeUrl = 'https://cs.xzl.anjuke.com/zu/yuhuah-p1/'
const titles = []
const peoples = []


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
// superagent.get(target)
//   .end( (error,res) => {
//     if (error) {
//       console.log(error)
//     }
//     let $ = cheerio.load(res.text);
//     let question = $('.question-title')
//     let titles = []
//     question.each((i) => {
//       console.log(question[i])
//     })
//     console.log(titles)
//     // fs.writeFile(file, JSON.stringify(question), function(err) {
//     //   if (err) {
//     //     return console.log(err);
//     //   }
//     //   console.log('文件创建成功，地址：' + file);
//     // })
//   })
// async function getCrawlerInfo() {
//   console.log('start')
//   await Ut.sleep(1000)
//   console.log('end sleep')
//   let res = await superagent.get(target)
//   let $ = cheerio.load(res.text)
//   let questions = $('.question-title')
//   questions.each((i,  element) => {
//     titles.push($(element).text())
//   })
//   console.log(titles)
// }
// getCrawlerInfo()

// 获取一页链接信息
async function getUrlInfo(url) {
  let res = undefined
  let links = []
  try {
    res = await superagent.get(url)
  } catch (e) {
    console.log('error')
    console.log(e)
    return
  }
  let $ = cheerio.load(res.text)
  $('.list-item').each(function (idx, element) {
    links.push($(element).attr('link'))
  })
  for (let i in links) {
    let people = {}
    try {
      people = await getPeopleInfo(links[i])
    } catch (e) {
      console.log('error')
      console.log(e)
      return
    }
    console.log(people)
    if (people) {
      if (people.name) {
        peoples.push(people)
      }
    }
    await Ut.sleep(3000)
  }
}

// 获取中介人信息
async function getPeopleInfo(url) {
  let people = {}
  let res = undefined
  try {
    res = await superagent.get(url)
  } catch (e) {
    console.log('error')
    console.log(e)
    return
  }
  let $ = cheerio.load(res.text)
  let $name = $('.name')
  people.name = $name.first().text()
  let $comp = $('.comp_info')
  people.comp = $comp.children().last().text()
  let $phone = $('.broker_tel')
  people.phone = $phone.text()
  return people
}
function savaInfo (data) {
  fs.writeFile(file, JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('文件创建成功，地址：' + file);
  })
}

async function getMediations () {
  for (let i = 10; i<=20; i++) {
    console.log('获取第' + i + '页')
    let url = 'https://cs.xzl.anjuke.com/zu/yuhuah-p'+ i+'/'
    try {
      await getUrlInfo(url)
    } catch (e) {
      console.log('error')
      console.log(e)
      return
    }
    await Ut.sleep(5000)
  }
  let hash = {};
  let info = peoples.reduce(function(item, next) {
    hash[next.name] ? '' : hash[next.name] = true && item.push(next);
    return item;
  }, []);
  savaInfo(info)
}
getMediations()

const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '58yuhua.json')
// const target = 'https://cs.58.com/csyuhua/zhaozu/pn2/?PGTID=0d30000d-001a-35f5-2d8f-0231935dcabb&ClickID=6'
const target = 'https://cs.58.com/zhaozu/37268811256480x.shtml'
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
      .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
      .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36')
      .set('cookie', 'f=n; commontopbar_new_city_info=414%7C%E9%95%BF%E6%B2%99%7Ccs; commontopbar_ipcity=cs%7C%E9%95%BF%E6%B2%99%7C0; id58=c5/nn1x/ebE4Gtdh05X9Ag==; 58tj_uuid=90217e04-21c4-4afe-b738-38e99a18af2a; als=0; f=n; xxzl_deviceid=I3hpHetTwi3DWouEAqIF92iqWIi3T0LIExgYLG11lTY0CL61JbSyjzUaMYGfLGob; new_uv=2; __utma=253535702.1842373447.1551941118.1551941118.1551941118.1; __utmc=253535702; __utmz=253535702.1551941118.1.1.utmcsr=blog.csdn.net|utmccn=(referral)|utmcmd=referral|utmcct=/qq_43371004/article/details/83720426; JSESSIONID=F9A9F70B72EDBFB349F59446C29C040D; ppStore_fingerprint=73E4F9374466CC60035E26777A0C80D5195CFB0460FBFDFC%EF%BC%BF1551941199434')
  } catch (e) {
    console.log('error')
    console.log(e)
    return
  }
  let $ = cheerio.load(res.text)
  $('.title').each(function (idx, element) {
    links.push($(element).find('a').attr('href'))
  })
  // 遍历这一页的链接
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


// 获取单个中介人信息
async function getPeopleInfo(url) {
  let people = {}
  let res = undefined
  try {
    res = await superagent.get(url)
      .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
      .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36')
      .set('cookie', 'f=n; commontopbar_new_city_info=414%7C%E9%95%BF%E6%B2%99%7Ccs; commontopbar_ipcity=cs%7C%E9%95%BF%E6%B2%99%7C0; id58=c5/nn1x/ebE4Gtdh05X9Ag==; 58tj_uuid=90217e04-21c4-4afe-b738-38e99a18af2a; als=0; f=n; xxzl_deviceid=I3hpHetTwi3DWouEAqIF92iqWIi3T0LIExgYLG11lTY0CL61JbSyjzUaMYGfLGob; new_uv=2; __utma=253535702.1842373447.1551941118.1551941118.1551941118.1; __utmc=253535702; __utmz=253535702.1551941118.1.1.utmcsr=blog.csdn.net|utmccn=(referral)|utmcmd=referral|utmcct=/qq_43371004/article/details/83720426; JSESSIONID=F9A9F70B72EDBFB349F59446C29C040D; ppStore_fingerprint=73E4F9374466CC60035E26777A0C80D5195CFB0460FBFDFC%EF%BC%BF1551941199434')
  } catch (e) {
    console.log('error')
    console.log(e)
    return
  }
  let $ = cheerio.load(res.text)
  let $name = $('.jjr-name-txt')
  people.name = $name.text()
  let $comp = $('.jjr-belong')
  people.comp = $comp.children().last().text()
  let $phone = $('.phone-num')
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
  for (let i = 1; i<=3; i++) {
    console.log('获取第' + i + '页')
    let url = 'https://cs.58.com/csyuhua/zhaozu/pn'+ i+'/?PGTID=0d30000d-001a-35f5-2d8f-0231935dcabb&ClickID=6'
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

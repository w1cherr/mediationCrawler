var express  = require('express')
var https = require('https')
const superagent = require('superagent');
var cheerio = require('cheerio')
var url = 'https://cs.xzl.anjuke.com/zu/yuhuah-p1/'
var link = 'https://cs.xzl.anjuke.com/zu/70565603/?pt=2'
const links = []
const peoples = []

superagent.get(url).end((err, res) => {
    if (err) {
        console.log(err)
    }
    let $ = cheerio.load(res.text)
    $('.list-item').each(function (idx, element) {
        let $element = $(element)
        links.push($element.attr('link'))
    })
    for (i in links) {
        peoples.push(getpeopleInfo(links[i]))
    }
    console.log(peoples)
})
function getpeopleInfo (url) {
    let people = {}
    superagent.get(url).end((err, res) => {
        if (err) {
            console.log(err)
        }
        let $ = cheerio.load(res.text)
        let $name = $('.name')
        people.name = $name.text()
        let $comp = $('.comp_info')
        people.comp = $comp.children().text()
        let $phone = $('.broker_tel')
        people.phone = $phone.text()
        console.log(people)
        return people
    })
}
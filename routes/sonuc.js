var express = require('express');
var router = express.Router();
function sonucVer(metin){
    var punctuation = ['!','"','#','$','%','&','\'','(',')','*','+',',','-','/',':',';','.','<','=','>','?','@','[',']','^','_','`','{','|','}','~'];
    var sentenceRegex = new RegExp('[.?!]', 'g');
    var vowels = ['a','e','ı','i','ö','ü','u','o'];
    var obj = [];
    var grade = [];
    var textClear = ((text=>{
        return text.split('').filter((c=>{
            return punctuation.indexOf(c) === -1;
        })).join('');
    }));


    var sentencesArray = ((text=>{
        return text.split(sentenceRegex).filter(item=>item.trim() !== '');
    }));

    var wordsArray = ((text=>{
        return textClear(text).split(' ').filter(item=>item.trim() !== '');
    }));

    var letterCount = ((text=>{
        var temp = 0;
        textClear(text).split(' ').filter((item=>{
            temp+=item.length;
        }));
        return temp;
    }));

    var syllableCount = ((text=>{
        var temp = 0;
        var item = text.split(' ');
        for(var i=0;i<item.length;i++){
            for (var j=0;j<item[i].length;j++) {
                if (vowels.includes(item[i][j].toLowerCase())) {
                    temp++;
                }}}
        return temp;
    }));

    var charCount = ((text=>{
        var temp = 0;
        text.split(' ').filter((item=>{
            temp+=item.length;
        }));
        return temp;
    }));

    var avgSentenceLength = ((text=>{
        return wordsArray(text).length / sentencesArray(text).length;
    }));

    var avgSyllablesPerWord = ((text=>{
        return syllableCount(text) / wordsArray(text).length;
    }));
    var avgCharactersPerWord = ((text=>{
        return charCount(text) / wordsArray(text).length;
    }));

    var avgLettersPerWord = ((text=>{
        return letterCount(text) / wordsArray(text).length;
    }));

    var longSyllables = ((text=>{
        var temp = 0;
        var item = text.split(' ');
        for(var i=0;i<item.length;i++){
            var cache = 0;
            for (var j=0;j<item[i].length;j++) {

                if (vowels.includes(item[i][j].toLowerCase())) {
                    cache++;

                    if(cache>2){

                        temp++;
                    }
                }}}
        return temp;
    }));

    var fleschReadingEase = ((text=>{
        var sentenceLength = avgSentenceLength(text);
        var syllablesPerWord = avgSyllablesPerWord(text);
        return (206.835 - 1.015 * sentenceLength - 84.6 * syllablesPerWord).toFixed(2);
    }));

    var fleschKincaidGrade = ((text=>{
        var sentenceLength = avgSentenceLength(text);
        var syllablesPerWord = avgSyllablesPerWord(text);
        return (0.39 * sentenceLength + 11.8 * syllablesPerWord - 15.59).toFixed(2);
    }));

    var smogIndex = ((text=>{
        var sentences = sentencesArray(text).length;
        if (sentences >= 30) {
            var polySyllables = longSyllables(text);
            var smog = 1.043 * (Math.pow(polySyllables * (30 / sentences), 0.5)) + 3.1291;
            return smog.toFixed(2);
        }
        return 0.0;
    }));

    var avgSentencesPerWord = ((text=>{
        var avg = sentencesArray(text).length / wordsArray(text).length;
        return avg;
    }));

    var colemanLiauIndex = ((text=>{
        var letters = avgLettersPerWord(text) * 100;
        var sentences = avgSentencesPerWord(text) * 100;
        var coleman = 0.0588 * letters - 0.296 * sentences - 15.8;
        return coleman.toFixed(2);
    }));

    var automatedReadabilityIndex = ((text=>{
        var chars = charCount(text);
        var words = wordsArray(text).length;
        var sentences = sentencesArray(text).length;
        var a = chars / words;
        var b = words / sentences;
        var readability = (
            4.71 * a +
            0.5 * b -
            21.43
        );
        return readability.toFixed(2);
    }));

    var linsearWriteFormula = ((text=>{
        var easyWord = 0;
        var difficultWord = 0;
        var roughTextFirst100 = text.split(' ').slice(0,100).join(' ');
        var plainTextListFirst100 = sentencesArray(text).slice(0,100);
        plainTextListFirst100.forEach(function(word) {
            if (syllableCount(word) < 3) {
                easyWord += 1;
            } else {
                difficultWord += 1;
            }
        });
        var number = (easyWord + difficultWord * 3) / sentencesArray(roughTextFirst100).length;
        if (number <= 20) {
            number -= 2;
        }
        return (number / 2).toFixed(2);

    }));

   var veridondur =  function(name,score,grade){
       return {
           "name":name,
           "score":score,
           "grade":grade
       };
   };




    var readingTime = function(text) {
        var wordsPerSecond = 4.17;
        return (wordsArray(text).length / wordsPerSecond).toFixed(2);
    };


    var atesman = ((text=>{
        return (198.825-(40.175*avgSyllablesPerWord(text))-(2.610*avgSentenceLength(text))).toFixed(2);
    }));
    var aS = atesman(metin);

    if(aS>0 && aS<30){
        obj.push(veridondur("Ateşman",aS,"Çok zor"));
    }else if(aS>=30 && aS<50){
        obj.push(veridondur("Ateşman",aS,"Zor"));
    }else if(aS>=50 && aS<70){
        obj.push(veridondur("Ateşman",aS,"Orta güçlükte"));

    }else if(aS>=70 && aS<90){
        obj.push(veridondur("Ateşman",aS,"Kolay"));
    }else if(aS>=90){
        obj.push(veridondur("Ateşman",aS,"Çok kolay"));
    }


    var fre  = fleschReadingEase(metin);
    if (fre < 100 && fre >= 90) {
        obj.push(veridondur("Flesch Reading Ease",fre,"Çok kolay"));
    } else if (fre < 90 && fre >= 80) {
        obj.push(veridondur("Flesch Reading Ease",fre,"Kolay"));
    } else if (fre < 80 && fre >= 70) {
        obj.push(veridondur("Flesch Reading Ease",fre,"Kısmen kolay"));
    } else if (fre < 70 && fre >= 60) {
        obj.push(veridondur("Flesch Reading Ease",fre,"Standart"));

    } else if (fre < 60 && fre >= 50) {
        obj.push(veridondur("Flesch Reading Ease",fre,"Kısmen zor"));
    } else if (fre < 50 && fre >= 30) {
        obj.push(veridondur("Flesch Reading Ease",fre,"Zor"));
    } else {
        obj.push(veridondur("Flesch Reading Ease",fre,"Çok zor"));
    }


    var fk =fleschKincaidGrade(metin);
    if(fk>=0 &&fk<6){
        obj.push(veridondur("Flesch Kincaid Grade",fk,"Kolay"));
    }else if(fk>=6 && fk<12){
        obj.push(veridondur("Flesch Kincaid Grade",fk,"Orta"));
    }else{
        obj.push(veridondur("Flesch Kincaid Grade",fk,"Zor"));

    }



    var smog =smogIndex(metin);
    if(smog == 0){
        obj.push(veridondur("SMOG",smog,"Yetersiz veri"));

    }else if(smog>0 && smog<=30){
        obj.push(veridondur("SMOG",smog,"Kolay"));

    }else if(smog>30 && smog<=90){
        obj.push(veridondur("SMOG",smog,"Orta"));

    }else if(smog>90){
        obj.push(veridondur("SMOG",smog,"Zor"));

    }


    var cl = colemanLiauIndex(metin);
    if(cl<=5){
        obj.push(veridondur("Coleman Liau",cl,"Çok kolay"));
    }else if(cl>5 && cl<=6){
        obj.push(veridondur("Coleman Liau",cl,"Kolay"));
    }else if(cl>6 && cl<=7){
        obj.push(veridondur("Coleman Liau",cl,"Kısmen kolay"));

    }else if(cl>7 && cl<=10){
        obj.push(veridondur("Coleman Liau",cl,"Konuşma dili"));
    }else if(cl>10 && cl<=12){
        obj.push(veridondur("Coleman Liau",cl,"Kısmen zor"));

    }else if(cl>12 && cl<=16){
        obj.push(veridondur("Coleman Liau",cl,"Zor"));

    }else if(cl>16){
        obj.push(veridondur("Coleman Liau",cl,"Çok zor"));

    }



    var ari = automatedReadabilityIndex(metin);
    if(ari>0 && ari<2){
        obj.push(veridondur("Automated Readability Index",ari,"Okul öncesi seviyesi"));
    }else if(ari>=2 && ari<5){
        obj.push(veridondur("Automated Readability Index",ari,"İlkokul seviyesi"));

    }else if(ari>=5 && ari<9){
        obj.push(veridondur("Automated Readability Index",ari,"Ortaokul seviyesi"));

    }else if(ari>=9 && ari<13){
        obj.push(veridondur("Automated Readability Index",ari,"Lise seviyesi"));

    }else if(ari>=13 && ari<14){
        obj.push(veridondur("Automated Readability Index",ari,"Üniversite seviyesi"));

    }else if(ari>=14){
        obj.push(veridondur("Automated Readability Index",ari,"Uzman seviyesi"));

    }

    var lwf = obj.linsearWriteFormula = linsearWriteFormula(metin);
    obj.push(veridondur("Linsear Write Formula",lwf,"----"));




    var reading_time = readingTime(metin);
    obj.push(veridondur("Okuma Süresi",reading_time,"saniye"));
    return obj;
}

router.post('/', function(req, res, next) {
    var text = req.body.text;
    var sonuc = sonucVer(text);
    var onay = 1
    res.render('index', { sonuc:sonuc , onay:1});
});

module.exports = router;

//Скрипт "Новые кавычки на елочки"
//Автор Sclex
//Подробности тут: http://www.fictionbook.org/forum/viewtopic.php?f=7&t=4412
//И тут: http://scripts.fictionbook.org

function Run() {

 var versionStr="Скрипт «Расстановка только елочек v2.9»\nАвтор Sclex.\n\n";
 var otstupSverhu=60;
 var debug=false;
 try { var nbspChar=window.external.GetNBSP(); }
 catch(e) { var nbspChar=String.fromCharCode(160); }
 var searchSymbolNum,currentQuotesLevel,el,indexOfQuotes,myNodeValue,myNodeValue2,range,range1,range2;
 var mode,el,el2,selectionbeginEl,selectionEndEl,myIndex,collectedSymbolsCnt,firstTimeInNodeType3,k;
 var neighborChars,abcd,itIsLeftQuotes,itIsRightQuotes,anLeft,anRight,range3,notReplacedQuotes;
 var leftQuotes=new Array("«","„","„","‘");
 var rightQuotes=new Array("»","“","“","’");
 var leftQuotesCnt=0;
 var rightQuotesCnt=0;
 var blockCodename=new Array;
 var blockInitQuotesLevel=new Array;
 var currentBlockIndex=-1;

 var re1=new RegExp("\\s|[-–—("+nbspChar+"]","i");
 var re2=new RegExp("\\w|[а-яёa-z?!)“,°ÀÁÂÃÄÅÆÇÈÉÊËÌÍÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƏƒƠơƯưƷǤǥǦǧǨǩǪǫǮǯǺǻǼǽǾǿȘșȚțȨȩəʒ"+
  "ΆΈΉΊΌΎΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏ"+
  "ѐђѓєѕіїјљњћќѝўџҐґҒғҖҗҚқҜҝҢңҮүҰұҲҳҸҹҺһӘәӨө"+
  "ḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕẖẗẘẙẚẛẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹἀἁἂἃἄἅἆἇἈἉἊἋἌἍἎἏἐἑἒἓἔἕἘἙἚἛἜἝἠἡἢἣἤἥἦἧἨἩἪἫἬἭἮἯἰἱἲἳἴἵἶἷἸἹἺἻἼἽἾἿὀὁὂὃὄὅὈὉὊὋὌὍὐὑὒὓὔὕὖὗὙὛὝὟὠὡὢὣὤὥὦὧὨὩὪὫὬὭὮὯὰάὲέὴήὶίὸόὺύὼώᾀᾁᾂᾃᾄᾅᾆᾇᾈᾉᾊᾋᾌᾍᾎᾏᾐᾑᾒᾓᾔᾕᾖᾗᾘᾙᾚᾛᾜᾝᾞᾟᾠᾡᾢᾣᾤᾥᾦᾧᾨᾩᾪᾫᾬᾭᾮᾯᾰᾱᾲᾳᾴᾶᾷᾸᾹᾺΆᾼ"+
  "ῂῃῄῆῇῈΈῊΉῌ"+
  "ῐῑῒΐῖῗῘῙῚΊῠῡῢΰῤῥῦῧῨῩῪΎῬῲῳῴῶῷῸΌῺΏῼ"+
  "ªº%‰©µ¶ℓ™℗⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉£¤¢¥€$¼½¾]","i");

 function analyseSymbolOnTheLeft(ch) {
  if (ch==undefined) {/*if (debug) alert("lkj11");*/ return "left quotes";}
  else if (ch.search(re1)==0) {/*if (debug) alert("lkj12");*/ return "left quotes";}
  else if (ch.search(re2)==0) {/*if (debug) alert("lkj13")*/; return "right quotes";}
 }

 var re3=new RegExp("[-?!,;\–—)"+nbspChar+"]|\\s","i");
 var re4=new RegExp("\w|[а-яёa-zÀÁÂÃÄÅÆÇÈÉÊËÌÍÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƏƒƠơƯưƷǤǥǦǧǨǩǪǫǮǯǺǻǼǽǾǿȘșȚțȨȩəʒ"+
  "ΆΈΉΊΌΎΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏ"+
  "ѐђѓєѕіїјљњћќѝўџҐґҒғҖҗҚқҜҝҢңҮүҰұҲҳҸҹҺһӘәӨө"+
  "ḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕẖẗẘẙẚẛẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾếỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹἀἁἂἃἄἅἆἇἈἉἊἋἌἍἎἏἐἑἒἓἔἕἘἙἚἛἜἝἠἡἢἣἤἥἦἧἨἩἪἫἬἭἮἯἰἱἲἳἴἵἶἷἸἹἺἻἼἽἾἿὀὁὂὃὄὅὈὉὊὋὌὍὐὑὒὓὔὕὖὗὙὛὝὟὠὡὢὣὤὥὦὧὨὩὪὫὬὭὮὯὰάὲέὴήὶίὸόὺύὼώᾀᾁᾂᾃᾄᾅᾆᾇᾈᾉᾊᾋᾌᾍᾎᾏᾐᾑᾒᾓᾔᾕᾖᾗᾘᾙᾚᾛᾜᾝᾞᾟᾠᾡᾢᾣᾤᾥᾦᾧᾨᾩᾪᾫᾬᾭᾮᾯᾰᾱᾲᾳᾴᾶᾷᾸᾹᾺΆᾼ"+
  "ῂῃῄῆῇῈΈῊΉῌ"+
  "ῐῑῒΐῖῗῘῙῚΊῠῡῢΰῤῥῦῧῨῩῪΎῬῲῳῴῶῷῸΌῺΏῼ"+  
  "ªº©µ¶ℓ⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉£¤¢¥€$¼½¾]","i");
  var re5=new RegExp("[-–—]","i");

 function analyseSymbolOnTheRight(ch) {
  if (ch==undefined) {/*if (debug) alert("lkj21");*/ return "right quotes";}
  else if (ch.search(re3)==0) {/*if (debug) alert("lkj22");*/ return "right quotes";}
  else if (ch.search(re4)==0) {/*if (debug) alert("lkj23");*/ return "left quotes";}
 }

 function decideIsItLeftOrRightQuotes() {
  itIsLeftQuotes=false;
  itIsRightQuotes=false;
  if (neighborChars[-1]=="." && neighborChars[-2]=="." && neighborChars[-3]!=".")
   anLeft=analyseSymbolOnTheLeft(neighborChars[-3]);
  else if (neighborChars[-1]=="." && neighborChars[-2]=="." && neighborChars[-3]==".")
   anLeft=analyseSymbolOnTheLeft(neighborChars[-4]);
  else if (neighborChars[-1]=="…")
   anLeft=analyseSymbolOnTheLeft(neighborChars[-2]);
  else 
   anLeft=analyseSymbolOnTheLeft(neighborChars[-1]);
  if (anLeft=="left quotes") itIsLeftQuotes=true;
  else if (anLeft=="right quotes") itIsRightQuotes=true;
  if (neighborChars[1]=="." && neighborChars[2]=="." && neighborChars[3]==".")
   anRight=analyseSymbolOnTheRight(neighborChars[4]);
  else if (neighborChars[1]=="…")
   anRight=analyseSymbolOnTheRight(neighborChars[2]);
  else 
   anRight=analyseSymbolOnTheRight(neighborChars[1]);
  if (anRight=="left quotes") itIsLeftQuotes=true;
  else if (anRight=="right quotes") itIsRightQuotes=true;
  if (neighborChars[-1]=="." && neighborChars[1]==".") itIsRightQuotes=true;
  if (neighborChars[-1]=="…" && neighborChars[1]=="…") itIsRightQuotes=true;
  if (neighborChars[1]=="." && neighborChars[2]!=".") itIsRightQuotes=true;
  if (neighborChars[-1]=="." && neighborChars[-2]!=".") itIsRightQuotes=true;
  if (itIsRightQuotes && itIsLeftQuotes && 
      (
       (neighborChars[1]=="." && neighborChars[2]=="." && neighborChars[3]==".")
       ||
       (neighborChars[1]=="…")
      )
     )
   { 
    itIsRightQuotes=false;
    return;
   } 
  if (itIsRightQuotes && itIsLeftQuotes && 
      (
       (neighborChars[-1]=="." && neighborChars[-2]=="." && neighborChars[-3]==".")
       ||
       (neighborChars[-1]=="…")
      )
     )
   {  
    itIsLeftQuotes=false;   
    return;
   }  
  if (itIsRightQuotes && itIsLeftQuotes && neighborChars[1]!=undefined && neighborChars[1].search(re5)>=0) 
  {
   itIsRightQuotes=false;
   return;
  } 
 }

 function setCursorIntoTextNode(noteNode,offset) {
  if (offset!=0) {
   var s1=noteNode.nodeValue;
   var s2=s1.substr(offset);
   var s1=s1.substr(0,offset);
   var node2=document.createTextNode(s2);
   node2=noteNode.parentNode.insertBefore(node2,noteNode.nextSibling);
   noteNode.nodeValue=s1;
   noteNode=node2;
  }
  var tmpLabelNode=noteNode.parentNode.insertBefore(document.createElement("B"),noteNode);
  tmpLabelNode.scrollIntoView(true);
  window.scrollBy(0,-otstupSverhu);
  var range=document.body.createTextRange();
  range.moveToElementText(tmpLabelNode);
  range.select();
  tmpLabelNode.removeNode();
 }

 function getNeighborSymbolsBackward(myNode,symbolIndex,howManySymbolsToCollect) {
  myIndex=symbolIndex;
  collectedSymbolsCnt=0;
  firstTimeInNodeType3=true;
  while (true) {
   //if (myNode.nodeType==1) alert("111:\n"+myNode.outerHTML)
   //else if (myNode.nodeType==3) alert("222:\n"+myNode.nodeValue);
   if (myNode.nodeType==3) {
    //определим текущую позицию в текстовом узле
    myNodeValue2=myNode.nodeValue;
    if (firstTimeInNodeType3) {
     firstTimeInNodeType3=false;
     myIndex-=1;
     /*if (debug) alert("myIndex:"+myIndex);*/
    } else myIndex=myNodeValue2.length-1;

    //прочитаем, сколько можно, символов, соседних с кавычкой
    if (myIndex!=-1) {
     abcd=Math.min(howManySymbolsToCollect-collectedSymbolsCnt,myIndex+1);
     for (k=1;k<=abcd;k++)  {
      collectedSymbolsCnt++;
      neighborChars[-collectedSymbolsCnt]=myNodeValue2.charAt(myIndex);
      //alert("Нашли символ слева: "+myNodeValue2.charAt(myIndex));
      myIndex--;
      if (collectedSymbolsCnt==howManySymbolsToCollect) return;
     }
    }
   }
   if (myNode.hasChildNodes() && !(myNode.nodeType==1 && myNode.nodeName=="A" && myNode.className.toLowerCase()=="note"))
    myNode=myNode.lastChild;
   else {
    while (myNode!=fbw_body && myNode.nodeName!="P" && myNode.previousSibling==null) myNode=myNode.parentNode;
    if (myNode!=fbw_body && myNode.nodeName!="P") myNode=myNode.previousSibling;
    if (myNode==fbw_body || myNode.nodeName=="P" || myNode.nodeName=="BR") return;
   }
  }
 }

 function getNeighborSymbolsForward(myNode,symbolIndex,howManySymbolsToCollect) {
  myIndex=symbolIndex;
  collectedSymbolsCnt=0;
  firstTimeInNodeType3=true;
  while (true) {
   //if (myNode.nodeType==1) alert("111:\n"+myNode.outerHTML)
   //else if (myNode.nodeType==3) alert("222:\n"+myNode.nodeValue);
   if (myNode.nodeType==3) {
    //определим текущую позицию в текстовом узле
    myNodeValue2=myNode.nodeValue;
    if (firstTimeInNodeType3) {
     firstTimeInNodeType3=false;
     myIndex+=1;
    } else myIndex=0;

    //прочитаем, сколько можно, символов, соседних с кавычкой
    if (myIndex<myNodeValue2.length) {
     abcd=Math.min(howManySymbolsToCollect-collectedSymbolsCnt,myNodeValue2.length-myIndex);
     for (k=1;k<=abcd;k++)  {
      collectedSymbolsCnt++;
      neighborChars[collectedSymbolsCnt]=myNodeValue2.charAt(myIndex);
      myIndex++;
      if (collectedSymbolsCnt==howManySymbolsToCollect) return;
     }
    }
   }
   if (myNode.hasChildNodes() && !(myNode.nodeType==1 && myNode.nodeName=="A" && myNode.className.toLowerCase()=="note"))
    myNode=myNode.firstChild;
   else {
    while (myNode!=fbw_body && myNode.nodeName!="P" && myNode.nextSibling==null) myNode=myNode.parentNode;
    if (myNode!=fbw_body && myNode.nodeName!="P") myNode=myNode.nextSibling;
    if (myNode==fbw_body || myNode.nodeName=="P" || myNode.nodeName=="BR") return;
   }
  }
 }

 function getInfoStr() {
  return "Расставлено елочек:\n\n"+
  "   левых – « – "+leftQuotesCnt+"\n"+
  "   правых – » – "+rightQuotesCnt+"\n"+
  "  ———————————\n"+
  "   Всего: "+(leftQuotesCnt+rightQuotesCnt);
 }

 function getElementCodename(el) {
  if (el.nodeName!="DIV") return "non-div";
  if (el.className=="section") return "section";
  if (el.className=="body") return "body";
  if (el.className=="epigraph") return "epigraph";
  if (el.className=="cite") return "cite";
  if (el.className=="poem") return "poem";
  if (el.className=="annotation") return "annotation";
  if (el.className=="history") return "history";
  return "unknown div";
 }
 
 function mainReplaces() {
  //try {
  //замена имеющихся кавычек всех типов в выделении на прямые кавычки: НАЧАЛО
  selectionBeginEl=document.getElementById(selectionBeginId);
  selectionEndEl=document.getElementById(selectionEndId);
  el=selectionBeginEl;
  while (el!=selectionEndEl && el!=fbw_body) {
   if (el.nodeType==3) el.nodeValue=el.nodeValue.replace(new RegExp("[«»„“”]","g"),'"');
   if (el.hasChildNodes()) el=el.firstChild;
   else {
    while (el!=selectionEndEl && el!=fbw_body && el.nextSibling==null) el=el.parentNode;
    if (el!=selectionEndEl && el!=fbw_body) el=el.nextSibling;
   }
  }
  //замена имеющихся кавычек всех типов в выделении на прямые кавычки: КОНЕЦ
  el=selectionBeginEl;
  while (el!=selectionEndEl && el!=fbw_body) {
   if (el.nodeType==3) {
    searchSymbolNum=0;
    myNodeValue=el.nodeValue;
    indexOfQuotes=myNodeValue.indexOf('"');
    while (indexOfQuotes>=0) {
     neighborChars=new Array();
     getNeighborSymbolsBackward(el,indexOfQuotes,4);
     getNeighborSymbolsForward(el,indexOfQuotes,4);
     /*if (debug) alert(neighborChars[-3]+","+neighborChars[-2]+","+neighborChars[-1]+',",'+neighborChars[1]+","+neighborChars[2]+","+neighborChars[3]);*/
     //решим, на какую кавычку заменять, левую или правую
     decideIsItLeftOrRightQuotes();
     /*if (debug) alert("itIsLeftQuotes: "+itIsLeftQuotes+"\nitIsRightQuotes: "+itIsRightQuotes);*/
     if (itIsLeftQuotes && !itIsRightQuotes) {
     //заменяем прямую кавычку на левую
      myNodeValue=myNodeValue.substr(0,indexOfQuotes)+"«"+myNodeValue.substr(indexOfQuotes+1);
      el.nodeValue=myNodeValue;
      leftQuotesCnt++;
     }
     if (!itIsLeftQuotes && itIsRightQuotes) {
      //заменяем прямую кавычку на правую
      myNodeValue=myNodeValue.substr(0,indexOfQuotes)+"»"+myNodeValue.substr(indexOfQuotes+1);
      el.nodeValue=myNodeValue;
      rightQuotesCnt++;
     }
     if (itIsLeftQuotes == itIsRightQuotes)
      notReplacedQuotes++;
     indexOfQuotes=myNodeValue.indexOf('"',indexOfQuotes+1);
     //getNeighborSymbolsForward();
    }
   }
   //теперь надо перейти на следующий элемент
   if (el.hasChildNodes()) {
    //или переходим на сыновний элемент...
    if (el.nodeName=="DIV") {
     currentBlockIndex++;
     blockCodename[currentBlockIndex]=getElementCodename(el);
     //alert("Зашли в:\n"+el.outerHTML+"\n\nКодовое имя: "+getElementCodename(el));
    }
    el=el.firstChild;
   } 
   else {
    //...или поднимаемся и переходим на сиблинга
    if (blockCodename[currentBlockIndex]!=undefined && el.nodeName=="DIV" && blockCodename[currentBlockIndex]!=getElementCodename(el)) {
     alert(versionStr+"Ошибка в алгоритме скрипта:\n\nкодовое имя блока не совпало.\n\nЗапомненное кодовое имя: "+blockCodename[currentBlockIndex]+"\nТекущее кодовое имя: "+getElementCodename(el)+"\n\n"+getInfoStr());
     return "error";
    }
    if (el.nodeName=="DIV") currentBlockIndex--;
    while (el!=selectionEndEl && el!=fbw_body && el.nextSibling==null) {
     el=el.parentNode;
     if (blockCodename[currentBlockIndex]!=undefined && el.nodeName=="DIV" && blockCodename[currentBlockIndex]!=getElementCodename(el)) {
      alert(versionStr+"Ошибка в алгоритме скрипта:\n\nкодовое имя блока не совпало.\n\nЗапомненное кодовое имя: "+blockCodename[currentBlockIndex]+"\nТекущее кодовое имя: "+getElementCodename(el)+"\n\n"+getInfoStr());
      return "error";
     }
     //alert("qwieupry1\n\nel:\n"+el.outerHTML+"\n\ncurrentQuotesLevel:"+currentQuotesLevel);
     //alert("Вышли из:\n"+el.outerHTML+"\n\nКодовое имя: "+getElementCodename(el));
     if (el.nodeName=="DIV") currentBlockIndex--;
    } 
    if (el!=selectionEndEl && el!=fbw_body) el=el.nextSibling;
   }
  }
 //}
 //catch (exception) {
  //alert("При выполнении скрипта произошла какая-то ошибка.");
 //}
 }

 window.external.BeginUndoUnit(document,"Кавычки на елочки v2.0");
 var randomNum=Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString()+Math.floor((Math.random()*9)).toString();
 var selectionBeginId="sclexQuotesBeginId"+randomNum;
 var selectionEndId="sclexQuotesEndId"+randomNum;
 var fbw_body=document.getElementById("fbw_body");
 if (!fbw_body) {alert(versionStr+"Ошибка! fbw_body не найдено."); return}
 if (document.selection.type=="Text") {
  range=document.selection.createRange();
  processingMode="selection only";
 } else {
  range=document.body.createTextRange();
  range.moveToElementText(fbw_body);
  processingMode="all text";
 }
 range1=range.duplicate();
 range1.collapse(true);
 range1.pasteHTML("<B id="+selectionBeginId+"></B>");
 range2=range.duplicate();
 range2.collapse(false);
 range2.pasteHTML("<B id="+selectionEndId+"></B>");
 notReplacedQuotes=0;
 //alert(fbw_body.innerHTML);
 if (mainReplaces()!="error") 
  if (notReplacedQuotes==0) MsgBox(versionStr+"Ура! Расстановка елочек прошла без ошибок.\n\n"+getInfoStr());
  else alert(versionStr+"Елочки расставлены, но...\n"+
             "\n"+
             "...в некоторых случаях было непонятно,\n"+
             "левые или правые елочки нужно делать,\n"+
             "поэтому скрипт оставлял прямые кавычки.\n"+
             "\n"+
             "   Осталось прямых кавычек – \" – "+notReplacedQuotes+"\n\n"+
             getInfoStr());
 try {
  document.getElementById(selectionBeginId).removeNode(true);
 }
 catch (exception) {
  alert(versionStr+"Ошибка в алгоритме скрипта:\n\nне удалось удалить маркер начала выделения.");
 }
 try {
  document.getElementById(selectionEndId).removeNode(true);
 }
 catch (exception) {
  alert(versionStr+"Ошибка в алгоритме скрипта:\n\nне удалось удалить маркер конца выделения.");
 }
 window.external.EndUndoUnit(document);
}
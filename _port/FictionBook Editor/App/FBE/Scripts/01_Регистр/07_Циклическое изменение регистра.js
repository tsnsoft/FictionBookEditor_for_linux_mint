//скрипт смены регистра by Sclex
//v1.4

function Run() {
 //вид обработки, которой подвергается выделенный текст
 // 1 - перевод в верхний регистр
 // 2 - перевод в нижний регистр
 var ObrabotkaType=2;
 //имя тэга, который будет использован для маркеров начала и конца выделения
 var MyTagName="B";

 function replaceFunc(full_match, offset_of_match, string_we_search_in) {
  if (lastSymbolLetter || !firstCapitalization) return full_match.toLowerCase();
  else {
   firstCapitalization=false;
   return full_match.substr(0,1).toUpperCase()+full_match.substr(1).toLowerCase();
  } 
 }

 function checkFunc(full_match, offset_of_match, string_we_search_in) {
  if (full_match.length>1 || lastSymbolLetter) oneLetterWords=false;
  return full_match;
 }

 capCol={};
 var k=0;
 var firstCapitalization=true;
 var oneLetterWords=true;
 var letterRE=new RegExp("[а-яёa-z]+","gi");
 var bigLetterRE=new RegExp("[А-ЯЁA-Z]","g");
 var smallLetterRE=new RegExp("[а-яёa-z]","g");

 var tr;
 var errMsg="Нет выделения.\n\nПеред запуском скрипта нужно выделить текст, который будет обработан.";
 tr=document.selection.createRange();
 if (!tr) {
  MsgBox(errMsg);
  return;
 }
 window.external.BeginUndoUnit(document,"Циклическое изменение регистра");
 if (tr.parentElement().nodeName=="TEXTAREA") {
   //код для обработки выделения в INPUT'е
  var tr1=document.body.createTextRange();
  tr1.moveToElementText(tr.parentElement());
  tr1.setEndPoint("EndToStart",tr);
  var tr2=document.body.createTextRange();
  tr2.moveToElementText(tr.parentElement());
  tr2.setEndPoint("StartToEnd",tr);
  s=tr.text;
  //код обработки: начало
  if (s.search(bigLetterRE)>=0) bigLetterFlag=true;
  if (s.search(smallLetterRE)>=0) smallLetterFlag=true;
  if (bigLetterFlag && smallLetterFlag) ObrabotkaType=2
  else if (bigLetterFlag) ObrabotkaType=3
  else ObrabotkaType=1;
  if (ObrabotkaType==1) {s=s.toUpperCase();}
  else if (ObrabotkaType==2) {s=s.toLowerCase();}
  else if (ObrabotkaType==3) {
   lastSymbolLetter=false;
   var re12 =  new RegExp("[а-яёa-z]+","gi"); 
   s=s.replace(re12,replaceFunc);
  }     
  //код обработки: конец
  tr.parentElement().value=tr1.text+s+tr2.text;
 }
 else if (tr.parentElement().nodeName!="INPUT") {
  var body=document.getElementById("fbw_body");
  var coll=tr.getClientRects();
  var ttr1 = body.document.selection.createRange();
  var el=body.document.elementFromPoint(coll[0].left, coll[0].top);
  
  var cursorPos=null;
  if (tr.compareEndPoints("StartToEnd",tr)==0) {
   var el2=document.getElementById("CursorPosition");
   if (el2) el2.removeAttribute("id");
   ttr1.pasteHTML("<"+MyTagName+" id=CursorPosition></"+MyTagName+">");
   cursorPos=document.getElementById("CursorPosition");
   ttr1.expand("word");
   ttr1.select();
  } 
  
  // поставим маркеры блока в виде пустых ссылок
  tr=ttr1.duplicate();
  tr.collapse();
  tr.pasteHTML("<"+MyTagName+" id=BlockStart></"+MyTagName+">");
  tr=ttr1.duplicate();
  tr.collapse(false);
  tr.pasteHTML("<"+MyTagName+" id=BlockEnd></"+MyTagName+">");
  // поднимаемся вверх по дереву, пока не найдем DIV или P,
  // в который входит начало выделения
  while (el && el.nodeName!="DIV" && el.nodeName!="P") { el=el.parentNode; }
  var InsideP = false; // true, если находимся внутри тэга P
  var InsideSelection = false; // true, когда текущая позиция внутри выделенного текста
  var bigLetterFlag=false;
  var smallLetterFlag=false;
  var ProcessingEnded=false; // true, когда обработка закончена и пора выходить
  ptr=el;
  var lastSymbolLetter=false;
  while (!ProcessingEnded) {
   // напомню: nodeType=1 для элемента (тэга) и nodeType=3 для текста
   // если встретили тэг P, меняем флаг, что мы внутри P
   if (ptr.nodeType==1 && ptr.nodeName=="P") {
    InsideP=true;
    lastSymbolLetter=false;
   }
   // если встретили маркер начала блока, ...
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")=="BlockStart") {
    // меняем флаг, т.к. попали внутрь выделения
    InsideSelection=true;
    // запомним ноду ссылки, чтобы потом удалить ее
    var BlockStartNode=ptr;
   }
   // аналогично для маркера конца выделения
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")=="BlockEnd") {
    InsideSelection=false;
    ProcessingEnded=true;
    var BlockEndNode=ptr;
   }
   // если нашли текст и находимся внутри P и внутри выделения...
   if (ptr.nodeType==3 && InsideP && InsideSelection) {
     // получаем текстовое содержимое узла
     var s=ptr.nodeValue;
     // проверим какие буквы (маленькие, большие) есть в выделении
     if (s.search(bigLetterRE)>=0) bigLetterFlag=true;
     if (s.search(smallLetterRE)>=0) smallLetterFlag=true;
     if (bigLetterFlag && bigLetterFlag) ProcessingEnded=true;
     s.replace(letterRE,checkFunc);
     if (s.substr(s.length-1).search(letterRE)>=0) lastSymbolLetter=true;
     if (oneLetterWords) ProcessindEnded=true;
     ptr.nodeValue=s;
   }
   // теперь надо найти следующий по дереву узел для обработки
   if (ptr.firstChild!=null) {
     ptr=ptr.firstChild; // либо углубляемся...
   } else {
     while (ptr.nextSibling==null) {
      ptr=ptr.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
      // поднявшись до элемента P, не забудем поменять флаг
      if (ptr && ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=false}
     }
    ptr=ptr.nextSibling; //и переходим на соседний элемент
   }
  }
  
  //решим, какую обработку производить
  if (bigLetterFlag && smallLetterFlag) ObrabotkaType=2 //и большие и маленькие буквы
  else if (smallLetterFlag) ObrabotkaType=1; //только маленькие буквы
  else if (!oneLetterWords) ObrabotkaType=3; //только большие буквы
  else ObrabotkaType=2;
  
  var ptr=body.document.elementFromPoint(coll[0].left, coll[0].top);
  while (ptr && ptr.nodeName!="DIV" && ptr.nodeName!="P") { ptr=ptr.parentNode; }
  
  var ProcessingEnded=false; // true, когда обработка закончена и пора выходить
  var InsideSelection=false;
  var InsideP=false;
  while (!ProcessingEnded) {
   // напомню: nodeType=1 для элемента (тэга) и nodeType=3 для текста
   // если встретили тэг P, меняем флаг, что мы внутри P
   if (ptr.nodeType==1 && ptr.nodeName=="P") {
    InsideP=true;
    lastSymbolLetter=false;
   }
   // если встретили маркер начала блока, ...
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")=="BlockStart") {
    // меняем флаг, т.к. попали внутрь выделения
    InsideSelection=true;
    // запомним ноду ссылки, чтобы потом удалить ее
    var BlockStartNode=ptr;
   }
   // аналогично для маркера конца выделения
   if (ptr.nodeType==1 && ptr.nodeName==MyTagName &&
       ptr.getAttribute("id")=="BlockEnd") {
    InsideSelection=false;
    ProcessingEnded=true;
    var BlockEndNode=ptr;
   }
   // если нашли текст и находимся внутри P и внутри выделения...
   if (ptr.nodeType==3 && InsideP && InsideSelection) {
     // получаем текстовое содержимое узла
     var s=ptr.nodeValue;
     // обрабатываем как надо
     if (ObrabotkaType==1) {s=s.toUpperCase();}
     else if (ObrabotkaType==2) {s=s.toLowerCase();}
     else if (ObrabotkaType==3) {
      lastSymbolLetter=false;
      var re12 = new RegExp("[а-яёa-z]+","gi"); 
      s=s.replace(re12,replaceFunc);
     }
     // и возвращаем на место
     ptr.nodeValue=s;
   }
   // теперь надо найти следующий по дереву узел для обработки
   if (ptr.firstChild!=null) {
     ptr=ptr.firstChild; // либо углубляемся...
   } else {
     while (ptr.nextSibling==null) {
      ptr=ptr.parentNode; // ...либо поднимаемся (если уже сходили вглубь)
      // поднявшись до элемента P, не забудем поменять флаг
      if (ptr && ptr.nodeType==1 && ptr.nodeName=="P") {InsideP=false}
     }
    ptr=ptr.nextSibling; //и переходим на соседний элемент
   }
  }
  // удаляем маркеры блока
  var tr1=document.body.createTextRange();
  if (!cursorPos) {
   tr1.moveToElementText(BlockStartNode);
   var tr2=document.body.createTextRange();
   tr2.moveToElementText(BlockEndNode);
   tr1.setEndPoint("StartToStart",tr2);
   tr1.select();
  } else {
   tr1.moveToElementText(cursorPos);
   tr1.select();
  }
  BlockStartNode.parentNode.removeChild(BlockStartNode);
  BlockEndNode.parentNode.removeChild(BlockEndNode);
 }
 window.external.EndUndoUnit(document);
}
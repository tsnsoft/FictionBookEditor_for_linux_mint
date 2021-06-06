//======================================
//               Инициалы до и после фамилий
//                                    Engine by ©Sclex
//                                                                   02.05.2008
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.2 — включена обработка аннотации
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.3 — переход на следующий абзац — "ready for FBE"
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// v.1.4 — кастомизированные неразрывные пробелы — Sclex (20.03.2010)
//======================================
// v.1.5 — прерывание процесса 
//======================================
// v.2.0 — самообучение — jurgennt, май 2010
//======================================
// v.2.1 — проверка от курсора — sclex, май 2010
//======================================
// v.2.2 — доработка движкапод прерывание и выход — sclex, май 2010
//======================================
var VersionNumber="2.2";

//обрабатывать ли history
var ObrabotkaHistory=true;
//обрабатывать ли annotation
var ObrabotkaAnnotation=true;


function Run() {
  try { var nbspChar=window.external.GetNBSP(); var nbspEntity; if (nbspChar.charCodeAt(0)==160) nbspEntity="&nbsp;"; else nbspEntity=nbspChar;}
  catch(e) { var nbspChar=String.fromCharCode(160); var nbspEntity="&nbsp;";}

  var Ts=new Date().getTime();
  var TimeStr=0;

  var count=0;                                                  //  счётчик

          Col = new Object();                               // коллекция временных замен
          NoCol = new Object();                          // коллекция «отменённых», чтобы по десять раз от них не отмахиваться
          YesCol = new Object();                         // коллекция одобренных изменений
          var k = 0;

                                    // Тройные инициалы до фамилии — «И.И.О.Фамилия»  или «Пр.Вт.Тр. Фамилия» (для иноземцев с прибитыми именами)
 var re10 = new RegExp("^(.*?[^А-яЁёA-z;]){0,1}([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.\\\s{0,1})([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.\\\s{0,1})([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.\\\s{0,1})([А-ЯЁA-Z][А-яЁёA-z]+)(.*?)$","g");
 var re11 = "$2."+nbspChar+"$4."+nbspChar+"$6."+nbspChar+"$8";               // собственно Инициалы и Фамилия
 var re12 = "$1";                               // всё до начала абзаца
 var re13 = "$9";                               // всё до конца абзаца
 var re14 = "$2$3$4$5$6$7$8";          // инициалы и фамилия, включая пробелы и точки, для отображения в запросе
 var re15 = "$1$2$3$4$5$6$7";          // всё от начала абзаца до фамилии
 var re16 = "$8";                               // фамилия, на случай временной замены при «Отмене»

                                    // Двойные инициалы до фамилии — «И.О.Фамилия»  или «Им.От. Фамилия»
 var re20 = new RegExp("^(.*?[^А-яЁёA-z;]){0,1}([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.\\\s{0,1})([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.(\\\s|"+nbspEntity+"){0,1})([А-ЯЁA-Z][А-яЁёA-z]+)(.*?)$","g");
 var re21 = "$2."+nbspChar+"$4."+nbspChar+"$7";
 var re22 = "$1"; 
 var re23 = "$8";
 var re24 = "$2$3$4$5$7";
 var re25 = "$1$2$3$4$5";
 var re26 = "$7";

                                    // Одинарные инициалы до фамилии — «И.Фамилия»  или «Им.Фамилия»
 var re30 = new RegExp("^(.*?[^А-яЁёA-z;]){0,1}([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.\\\s{0,1})([А-ЯЁA-Z][А-яЁёA-z]+)(.*?)$","g");
 var re31 = "$2."+nbspChar+"$4";
 var re32 = "$1"; 
 var re33 = "$5";
 var re34 = "$2$3$4";
 var re35 = "$1$2$3";
 var re36 = "$4";


                                       // Тройные инициалы после фамилии — Фамилия П.В.Т.
 var re40 = new RegExp("^(.*?[^А-яЁёA-z]){0,1}([А-ЯЁA-Z][а-яёa-z]+) ([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.\\\s{0,1})([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.\\\s{0,1})([А-ЯЁA-Z][а-яёa-z]{0,1})\\\.([^&].*?){0,1}$","g");
 var re41 = "$2"+nbspChar+"$3."+nbspChar+"$5."+nbspChar+"$7.";              // чисто Фамилия и инициалы
 var re42 = "$1";                              // от начала абзаца до Фамилии
 var re43 = "$8";                               // от Инициалов до конца абзаца
 var re44 = "$2 $3$4$5$6$7.";           // отображение в промпте
 var re45 = "$2";                              // одна фамилия на замену
 var re46 = " $3$4$5$6$7.$8";           // инициалы + до конца абзаца (ин-лы могут пригодиться при повторной проверке — вдруг они "до", а не "после"

                                       // Двойные инициалы после фамилии — Фамилия И.О.
 var re50 = new RegExp("^(.*?[^А-яЁёA-z]){0,1}([А-ЯЁA-Z][а-яёa-z]+) ([А-ЯЁA-Z][а-яёa-z]{0,1})(\\\.\\\s{0,1})([А-ЯЁA-Z][а-яёa-z]{0,1})\\\.([^&].*?){0,1}$","g");
 var re51 = "$2"+nbspChar+"$3."+nbspChar+"$5.";
 var re52 = "$1";
 var re53 = "$6";
 var re54 = "$2 $3$4$5.";
 var re55 = "$2";
 var re56 = " $3$4$5.$6";

                                       // Одинарные инициалы после фамилии — Фамилия И.
 var re60 = new RegExp("^(.*?[^А-яЁёA-z]){0,1}([А-ЯЁA-Z][а-яёa-z]+) ([А-ЯЁA-Z][а-яёa-z]{0,1})\\\.([^&].*?){0,1}$","g");
 var re61 = "$2"+nbspChar+"$3.";
 var re62 = "$1";
 var re63 = "$4";
 var re64 = "$2 $3.";
 var re65 = "$2";
 var re66 = " $3.$4";

                                       // Пётр I и всякие другие пронумерованные личности
 var re70 = new RegExp("^(.*?[^А-яЁёA-z\\\d]){0,1}([А-ЯA-Z][а-яёa-z]+) ([IVX])(.+)$","g");
 var re71 = "$2"+nbspChar+"$3";
 var re72 = "$1";
 var re73 = "$4";
 var re74 = "$2 $3";


  var re_fin1 = new RegExp("col1¦\\\d¦","g");
  var re_fin2 = new RegExp("col2¦\\\d{2}¦","g");


 var s="";

 // функция, обрабатывающая абзац P
 function HandleP(ptr) {
  s=ptr.innerHTML;
/*
ptr2=ptr;                                      // следующий абзац за совпадением — переход на него, чтобы в FBE было видно  проблемное место
if (ptr2.hasChildNodes()) {
   ptr2=ptr2.firstChild;
} else {
   while (ptr2!=fbw_body && !ptr2.nextSibling) ptr2=ptr2.parentNode;
   if (ptr2!=fbw_body) ptr2=ptr2.nextSibling;
}
while (ptr2!=fbw_body && ptr2.nodeName!="P") {
   if (ptr2.hasChildNodes() && ptr2.nodeName!="P") {
     ptr2=ptr2.firstChild;
   } else {
     while (ptr2!=fbw_body && !ptr2.nextSibling) ptr2=ptr2.parentNode;
     if (ptr2!=fbw_body) ptr2=ptr2.nextSibling;
   }
}
*/

// Попытался отменить переход на следующий абзац за совпадением, но всё равно оно подлазит под окошко

       if (s.search(re10)!=-1 || s.search(re20)!=-1 || s.search(re30)!=-1 || s.search(re40)!=-1 || s.search(re50)!=-1 || s.search(re60)!=-1 || s.search(re70)!=-1 )  
         { GoTo(ptr);
//           if (ptr2==fbw_body) GoTo(ptr); else GoTo(ptr2);


//                    ===================   ДО   ==============


        while (s.search(re10)!=-1)                                   // тройные инициалы "до"
				{
    var v1  = s.replace(re10, re11);
    var vv1  = s.replace(re10, re14);
    var sl1   = s.replace(re10, re12);
    var sp1   = s.replace(re10, re13);
    var sll1   = s.replace(re10, re15);
    var vvv1  = s.replace(re10, re16);

  if (NoCol[vv1]==true)  {
        if (k<10)   { Col[k] = vvv1;    s=sll1+("col1¦" +k+ "¦")+sp1; } 
        if (k>10)   { Col[k] = vvv1;    s=sll1+("col2¦" +k+ "¦")+sp1; }
		 k++;} 
  if (YesCol[vv1]!=null)  {
        if (k<10)   { Col[k] = YesCol[vv1];    s=sl1+("col1¦" +k+ "¦")+sp1; count++; } 
        if (k>10)   { Col[k] = YesCol[vv1];    s=sl1+("col2¦" +k+ "¦")+sp1; count++; }
		 k++;}
 var r=Object();
	 if (k<10 && NoCol[vv1]==null && YesCol[vv1]==null)
	 { if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv1,v1, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv1]=r.$; s=sl1+("col1¦" +k+ "¦")+sp1; count++; } 
	 else { Col[k] = vvv1;  NoCol[vv1]=true;  s=sll1+("col1¦" +k+ "¦")+sp1; } }
	 if (k>=10 && NoCol[vv1]==null && YesCol[vv1]==null)
		 { if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv1,v1, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv1]=r.$; s=sl1+("col2¦" +k+ "¦")+sp1; count++; } 
		 else { Col[k] = vvv1;  NoCol[vv1]=true;  s=sll1+("col2¦" +k+ "¦")+sp1; } }
 k++;  }


        while (s.search(re20)!=-1)                                 // двойные инициалы "до"
				{
    var v2  = s.replace(re20, re21);
    var vv2  = s.replace(re20, re24);
    var sl2   = s.replace(re20, re22);
    var sp2   = s.replace(re20, re23);
    var sll2   = s.replace(re20, re25);
    var vvv2  = s.replace(re20, re26);

  if (NoCol[vv2]==true)  {
        if (k<10)   { Col[k] = vvv2;    s=sll2+("col1¦" +k+ "¦")+sp2; } 
        if (k>10)   { Col[k] = vvv2;    s=sll2+("col2¦" +k+ "¦")+sp2; }
		 k++;}                                                                                                                              //                            MsgBox ('после автозамен: \n' +s );

  if (YesCol[vv2]!=null)  {
        if (k<10)   { Col[k] = YesCol[vv2];    s=sl2+("col1¦" +k+ "¦")+sp2; count++; } 
        if (k>10)   { Col[k] = YesCol[vv2];    s=sl2+("col2¦" +k+ "¦")+sp2; count++; }
		                                                                                                                                         //      MsgBox ('после автозамен: \n' +s+ '\n\nvv2 =  ' +vv2+ '\n\nYesCol: =  ' +YesCol[vv2] );
		 k++;}

 var r=Object();
	 if (k<10 && NoCol[vv2]==null && YesCol[vv2]==null)
	 {  if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv2,v2, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv2]=r.$; s=sl2+("col1¦" +k+ "¦")+sp2; count++; } 
	 else { Col[k] = vvv2;  NoCol[vv2]=true;  s=sll2+("col1¦" +k+ "¦")+sp2; } }
	 		//                                      MsgBox ('      И где это я?     \n\nv2:  ' +v2+ '\nvv2:  ' +vv2+ '\n\nNoCol: =  ' +NoCol[vv2]+ '\n\nCol [' +k+ '] =  ' +Col[k]+ '\n\nабзац:\n' +s+ '\n\nYesCol[' +vv2+']: =  ' +YesCol[vv2]  );
	 if (k>=10 && NoCol[vv2]==null && YesCol[vv2]==null)
		 {  if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv2,v2, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv2]=r.$; s=sl2+("col2¦" +k+ "¦")+sp2; count++; } 
		 else { Col[k] = vvv2;  NoCol[vv2]=true;  s=sll2+("col2¦" +k+ "¦")+sp2; } }
 k++;  }                                                                                                                                     //                                       MsgBox ('вручную: \n' +s );


        while (s.search(re30)!=-1)                                 // одинарные инициалы "до"
				{
    var v3      = s.replace(re30, re31);
    var vv3    = s.replace(re30, re34);
    var sl3     = s.replace(re30, re32);
    var sp3    = s.replace(re30, re33);
    var sll3     = s.replace(re30, re35);
    var vvv3  = s.replace(re30, re36);

  if (NoCol[vv3]==true)  {
        if (k<10)   { Col[k] = vvv3;    s=sll3+("col1¦" +k+ "¦")+sp3; } 
        if (k>10)   { Col[k] = vvv3;    s=sll3+("col2¦" +k+ "¦")+sp3; }
		 k++;} 
  if (YesCol[vv3]!=null)  {
        if (k<10)   { Col[k] = YesCol[vv3];    s=sl3+("col1¦" +k+ "¦")+sp3; count++; } 
        if (k>10)   { Col[k] = YesCol[vv3];    s=sl3+("col2¦" +k+ "¦")+sp3; count++; }
		 k++;}
 var r=Object();
	 if (k<10 && NoCol[vv3]==null && YesCol[vv3]==null)
	 { if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv3,v3, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv3]=r.$; s=sl3+("col1¦" +k+ "¦")+sp3; count++; } 
	 else { Col[k] = vvv3;  NoCol[vv3]=true;  s=sll3+("col1¦" +k+ "¦")+sp3; } }
	 if (k>=10 && NoCol[vv3]==null && YesCol[vv3]==null)
		 { if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv3,v3, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv3]=r.$; s=sl3+("col2¦" +k+ "¦")+sp3; count++; } 
		 else { Col[k] = vvv3;  NoCol[vv3]=true;  s=sll3+("col2¦" +k+ "¦")+sp3; } }
 k++;  }


//                 =================== ПОСЛЕ =================


       while (s.search(re40)!=-1)                                  // тройные инициалы "после"
				{
    var v4  = s.replace(re40, re41);
    var vv4  = s.replace(re40, re44);
    var sl4   = s.replace(re40, re42);
    var sp4   = s.replace(re40, re43);
    var vvv4  = s.replace(re40, re45);
    var spp4   = s.replace(re40, re46);

  if (NoCol[vv4]==true)  {
        if (k<10)   { Col[k] = vvv4;    s=sl4+("col1¦" +k+ "¦")+spp4; } 
        if (k>10)   { Col[k] = vvv4;    s=sl4+("col2¦" +k+ "¦")+spp4; }
		 k++;} 
  if (YesCol[vv4]!=null)  {
        if (k<10)   { Col[k] = YesCol[vv4];    s=sl4+("col1¦" +k+ "¦")+sp4; count++; } 
        if (k>10)   { Col[k] = YesCol[vv4];    s=sl4+("col2¦" +k+ "¦")+sp4; count++; }
		 k++;}
 var r=Object();
	 if (k<10 && NoCol[vv4]==null && YesCol[vv4]==null)
					{ if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv4,v4, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv4]=r.$; s=sl4+("col1_" +k)+sp4; count++; }
					 else { Col[k] = vvv4;  NoCol[vv4]=true;  s=sl4+("col1¦" +k+ "¦")+spp4; } }
	 if (k>=10 && NoCol[vv4]==null && YesCol[vv4]==null)
					{ if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv4,v4, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv4]=r.$; s=sl4+("col2¦" +k+ "¦")+spp4; count++; }
					 else { Col[k] = vvv4;  NoCol[vv4]=true;  s=sl4+("col2¦" +k+ "¦")+spp4; } }
 k++; }


       while (s.search(re50)!=-1)                                  // двойные инициалы "после"
				{
    var v5  = s.replace(re50, re51);
    var vv5  = s.replace(re50, re54);
    var sl5   = s.replace(re50, re52);
    var sp5   = s.replace(re50, re53);
    var vvv5  = s.replace(re50, re55);
    var spp5   = s.replace(re50, re56);

  if (NoCol[vv5]==true)  {
        if (k<10)   { Col[k] = vvv5;    s=sl5+("col1¦" +k+ "¦")+spp5; } 
        if (k>10)   { Col[k] = vvv5;    s=sl5+("col2¦" +k+ "¦")+spp5; }
		 k++;} 
  if (YesCol[vv5]!=null)  {
        if (k<10)   { Col[k] = YesCol[vv5];    s=sl5+("col1¦" +k+ "¦")+sp5; count++; } 
        if (k>10)   { Col[k] = YesCol[vv5];    s=sl5+("col2¦" +k+ "¦")+sp5; count++; }
		 k++;}
 var r=Object();
	 if (k<10 && NoCol[vv5]==null && YesCol[vv5]==null)
					{ if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv5,v5, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv5]=r.$; s=sl5+("col1¦" +k+ "¦")+sp5; count++; }
					 else { Col[k] = vvv5;  NoCol[vv5]=true;  s=sl5+("col1¦" +k+ "¦")+spp5; } }
	 if (k>=10 && NoCol[vv5]==null && YesCol[vv5]==null)
					{ if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv5,v5, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv5]=r.$; s=sl5+("col2¦" +k+ "¦")+sp5; count++; }
					 else { Col[k] = vvv5;  NoCol[vv5]=true;  s=sl5+("col2¦" +k+ "¦")+spp5; } }
 k++; }


       while (s.search(re60)!=-1)                                  // одинарные инициалы "после"
				{
    var v6  = s.replace(re60, re61);
    var vv6  = s.replace(re60, re64);
    var sl6   = s.replace(re60, re62);
    var sp6   = s.replace(re60, re63);
    var vvv6  = s.replace(re60, re65);
    var spp6   = s.replace(re60, re66);

  if (NoCol[vv6]==true)  {
        if (k<10)   { Col[k] = vvv6;    s=sl6+("col1¦" +k+ "¦")+spp6; } 
        if (k>10)   { Col[k] = vvv6;    s=sl6+("col2¦" +k+ "¦")+spp6; }
		 k++;} 
  if (YesCol[vv6]!=null)  {
        if (k<10)   { Col[k] = YesCol[vv6];    s=sl6+("col1¦" +k+ "¦")+sp6; count++; } 
        if (k>10)   { Col[k] = YesCol[vv6];    s=sl6+("col2¦" +k+ "¦")+sp6; count++; }
		 k++;}
 var r=Object();
	 if (k<10 && NoCol[vv6]==null && YesCol[vv6]==null)
					{ if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv6,v6, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv6]=r.$; s=sl6+("col1¦" +k+ "¦")+sp6; count++; }
					 else { Col[k] = vvv6;  NoCol[vv6]=true;  s=sl6+("col1¦" +k+ "¦")+spp6; } }
	 if (k>=10 && NoCol[vv6]==null && YesCol[vv6]==null)
					{ if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv6,v6, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv6]=r.$; s=sl6+("col2¦" +k+ "¦")+sp6; count++; }
					 else { Col[k] = vvv6;  NoCol[vv6]=true;  s=sl6+("col2¦" +k+ "¦")+spp6; } }
 k++; }


        while (s.search(re70)!=-1)                                  // "Екатерины-Людовики"
				{
    var v7  = s.replace(re70, re71);
    var vv7  = s.replace(re70, re74);
    var sl7   = s.replace(re70, re72);
    var sp7   = s.replace(re70, re73);

  if (NoCol[vv7]==true)  {
        if (k<10)   { Col[k] = vv7;    s=sl7+("col1¦" +k+ "¦")+sp7; } 
        if (k>10)   { Col[k] = vv7;    s=sl7+("col2¦" +k+ "¦")+sp7; }
		 k++;} 
  if (YesCol[vv7]!=null)  {
        if (k<10)   { Col[k] = YesCol[vv7];    s=sl7+("col1¦" +k+ "¦")+sp7; count++; } 
        if (k>10)   { Col[k] = YesCol[vv7];    s=sl7+("col2¦" +k+ "¦")+sp7; count++; }
		 k++;}
 var r=Object();
	 if (k<10 && NoCol[vv7]==null && YesCol[vv7]==null)
					{ if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv7,v7, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv7]=r.$; s=sl7+("col1¦" +k+ "¦")+sp7; count++; }
					 else { Col[k] = vv7;  NoCol[vv7]=true;  s=sl7+("col1¦" +k+ "¦")+sp7; } }
	 if (k>=10 && NoCol[vv7]==null && YesCol[vv7]==null)
					{ if (InputBox(" Предлагается следующий           При «Отмене» останется:        … "+count+" …\n вариант :. v .:                                      " +vv7,v7, r) == IDCANCEL) return "exit";
		 if(r!=null && r.$!="")  { Col[k] = r.$; YesCol[vv7]=r.$; s=sl7+("col2¦" +k+ "¦")+sp7; count++; }
					 else { Col[k] = vv7;  NoCol[vv7]=true;  s=sl7+("col2¦" +k+ "¦")+sp7; } }
 k++; }

				}                                                                                                          // конец поиска и расстановки заглушек



if ( s.search(re_fin1)!=-1 || s.search(re_fin2)!=-1) {                                                 // Восстановление временных замен
for (z=0;z<k;z++)  {
                     if (z<10)     { var re100 = new RegExp("col1¦("+z+")¦","g");
                                        var re101 = Col[z];
                                           s=s.replace(re100,re101); }
                  if (z>=10)      {var re200 = new RegExp("col2¦("+z+")¦","g");
                                        var re201 = Col[z];
                                           s=s.replace(re200,re201); }            } k=0; }

   ptr.innerHTML=s;
   return true;
  } 

    window.external.BeginUndoUnit(document,"«Фамилия И.О.»");                               // ОТКАТ (UNDO) начало

 var body=document.getElementById("fbw_body");
 var ptr=body;
 var ProcessingEnding=false;

 var tr=document.selection.createRange();
 if (!tr) return;
 tr.collapse();
 var ptr=tr.parentElement();
 if (!body.contains(ptr)) return;
 var ptr2=ptr;
 while (ptr2 && ptr2.nodeName!="BODY" && ptr2.nodeName!="P")
  ptr2=ptr2.parentNode;
 if (ptr2 && ptr2.nodeName=="P") ptr=ptr2;

 while (!ProcessingEnding && ptr) {
  SaveNext=ptr;
  if (SaveNext.firstChild!=null && SaveNext.nodeName!="P" && 
      !(SaveNext.nodeName=="DIV" && 
        ((SaveNext.className=="history" && !ObrabotkaHistory) || 
         (SaveNext.className=="annotation" && !ObrabotkaAnnotation))))
  {    SaveNext=SaveNext.firstChild; }                                                         // либо углубляемся...

  else {
    while (SaveNext && SaveNext!=body && SaveNext.nextSibling==null)  {
     SaveNext=SaveNext.parentNode;                                                           // ...либо поднимаемся (если уже сходили вглубь)
                                                                                                                // поднявшись до элемента P, не забудем поменять флаг
     if (SaveNext==body) {ProcessingEnding=true;}
                                                         }
   if (SaveNext && SaveNext!=body) SaveNext=SaveNext.nextSibling; //и переходим на соседний элемент
         }
  if (ptr.nodeName=="P") 
   if (HandleP(ptr)=="exit") break;
  ptr=SaveNext;
 }

    window.external.EndUndoUnit(document);                               // undo конец

var Tf=new Date().getTime();
var Thour = Math.floor((Tf-Ts)/3600000);
var Tmin  = Math.floor((Tf-Ts)/60000-Thour*60);
var Tsec = Math.ceil((Tf-Ts)/1000-Tmin*60-Thour*3600);
var Tsec1 = Math.ceil(10*((Tf-Ts)/1000-Tmin*60))/10;
var Tsec2 = Math.ceil(100*((Tf-Ts)/1000-Tmin*60))/100;
var Tsec3 = Math.ceil(1000*((Tf-Ts)/1000-Tmin*60))/1000;

           if (Tsec3<1 && Tmin<1)    TimeStr=Tsec3+ " сек"
 else { if (Tsec2<10 && Tmin<1)   TimeStr=Tsec2+ " сек"
 else { if (Tsec1<30 && Tmin<1)   TimeStr=Tsec1+ " сек"
 else { if (Tmin<1)                       TimeStr=Tsec+ " сек" 
 else { if (Tmin>=1 && Thour<1)   TimeStr=Tmin+ " мин " +Tsec+ " с"
 else { if (Thour>=1)                    TimeStr=Thour+ " ч " +Tmin+ " мин " +Tsec+ " с"  }}}}}

   MsgBox ('  –= Jürgen Script =– \n'+
                 ' «Фамилия И. О.» v'+VersionNumber+'  	 \n\n'+
                 ' Произведено замен: ' +count+'\n\n'+
                 ' Время: ' +TimeStr+ '.\n' ); 

} 
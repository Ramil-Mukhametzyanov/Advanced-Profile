// 7:19 06.04.2020
/*
 tasks:
: program (type every symbol correctly). If typed a wrong symbol, it is a mistake. Each mistake requires users to type the word correctly twice additionaly.
: [done] call insrease word level program by clicking on a word
: SQL! - time for this?
: [done] drag&drop text to text (apply vocabulary to text)
:  fix - words are duplicated in Vocabulary
: coloring words and symbols by frequency and mastering
: quick sort
: [done] add mastering level
: [done] add alphabet
: [done] make vocabulary as class
: [done] hightlight unknown word in the text  
: [done] find a word in the text
*/

var mouseDown = false;

document.body.onmousedown = function() { 
  console.log("MOUSE DOWN");
  mouseDown = true;

}
document.body.onmouseup = function() {
  console.log("MOUSE UP");
  mouseDown = false;
}

var BUF = {};


function o(id){
 BUF.from = id;
 BUF.to = "";
 console.log(BUF);
 for(var i = 0; i < 4; i++){
  document.getElementById('out' + i).style.cursor = "move";
 }
}
function u(id){
 BUF.to = id;
 console.log(BUF);
 A[BUF.to].compare(V[BUF.from]);
 A[BUF.to].show('out' + id)
 for(var i = 0; i < 4; i++){
  document.getElementById('out' + i).style.cursor = "pointer";
 }
}

function Text(ref='text'){
 this.name = "onetext";
 this.words = [];
 this.cur = 0; 
 this.ref = ref;
 this.skips = [" ", "\n"];
 this.scheme = {'-1':'red'};
 this.set_scheme = function(scheme){
  this.scheme = scheme;
 }
 this.output = "";
 this.set_out = function(out){
  this.output = out;
 }
 this.program = "";
 this.set_program = function(program){
  this.program = program;
 }
 
// next
 this.next = function (){
  if(this.words[this.cur] && this.words[this.cur].word != ""){
   this.cur++;
  }
 },
// symbol
 this.symbol = function (v){
  if(!this.words[this.cur]) this.words[this.cur] = {word: "", es: -1};
  if(this.words[this.cur].word != "") this.words[this.cur].word+=v;
  else this.words[this.cur].word = v;
//  this.abc.update_and_sort(v);
  this.abc.update(v);

 },
// gather
 this.abc = new Vocabulary();
 this.gather = function (){
  var m = document.getElementById(this.ref).value;
  for(var i = 0; i < m.length; i++){
   var v = m.substr(i,1);
    if(v == " "){
     this.next();
     continue;
    }
    if(v == "\n"){
     this.next();
     continue;
    }
   for(var j = 0; j < this.skips.length; j++){
    if(v == this.skips[j]){
     this.next();
     break;
    }
   }
   this.symbol(v);
  }
 },
// compare
 this.compare = function (V){
  var m = -1;
  for(var i = 0; i < this.words.length; i++){
   id = V.find(this.words[i].word);
   if(id == -1)
	{}
   else this.words[i].es = V.level(id);

  }
 };
 this.show = function (ref=this.output, P=this.program, scheme=this.scheme){
  var t = "";
  
  for(var i=0; i < this.words.length; i++){
   if(i != 0) t += " ";
   var word = this.words[i].word;
   var m = this.words[i].es;
//   if(m == -1){
    t += "<span style='color: " + scheme[m] + ";' ";
    t += "<span ";
    t += "id=" + this.name + i + " ";
    t += "style='color: " + scheme[m] + ";' ";
    if(P != "") t += "onclick=\"" + P + ".method('" + word + "');\" ";
    t += ">"; 
    t += word;
    t += "</span>"
//   }else t += word;
  }
  document.getElementById(ref).innerHTML = t;
 },
// take
 this.take = function (item){
  var f = -1;
  for(var i = 0; i < this.words.length; i++){
   if(this.words[i].word == item){
    f = i;
    break;
   }
  }
  return f;
 }
// alphabet
 this.alphabet = function(){
  this.abc.sort();
  return this.abc.show();
 } 
}
function Program(Vocabulary){
 this.name = "P";
 this.V = Vocabulary;
 this.levelup = function(word){
  var id = this.V.find(word);
  this.V.up(id);
  console.log("levelup " + word + " --> " + this.V.level(id));
  var el = document.getElementById('in');
  el.parentNode.removeChild(el);
/////-----!!!!!
  A[0].compare(this.V);
  A[0].show()
/////!!!!!-----
 }
 this.method = function(word){
// this.method = function(id){
  var el = document.getElementById('pro0');
  var func = function(id, word){
   alert(document.getElementById(id).value == word);
  }
  el.innerHTML = " <div id=in><div>" + word+ "</div>" + "<textarea id=t></textarea>" + "<div onclick=\"if(document.getElementById('t').value=='" + word + "') " + this.name + ".levelup('" + word + "');\">Done</div>";//"</input type=text id=t></input></div>";
 }
}

function Vocabulary(){
 this.words = [];
 this.level = function (id){
  return this.words[id].m;
 }
 this.add = function(w){
  var l = this.words.length;
  this.words[l] = {w:w,c:1,m:0}; // c=count, m=mastering
 }
 this.increase = function (w_ind){
  this.words[w_ind].c++;
  console.log("increase " + w_ind + " -> " + this.words[w_ind].c);
 }
 this.up = function (w_ind){
  this.words[w_ind].m++;
  console.log("up " + w_ind + " -> " + this.words[w_ind].m);
 }
 this.find = function (w){
  var w_ind = -1; 
  for(var i = 0; i < this.words.length; i++){
   if(this.words[i].w == w){
    w_ind = i; break;
   }
  }
  console.log("find '" + w + "' -> " + w_ind);
  return w_ind;
 }
 this.update = function (w){
  var w_ind = this.find(w);
  if(w_ind == -1) this.add(w);
  else this.increase(w_ind);
 }  
 this.update_and_sort = function (w){
  this.update(w);
//  this.quick_sort(w);
  this.sort();
 }  
 
 this.merge = function (Words){
  for(var i = 0; i < Words.length; i++){
   this.update(Words[i].word);
  } 
 }
// list
 this.list = [];

 this.append = function (item){
  var l = this.list.length;
  this.list[l] = {w:item.w,c:item.c};
 }
 this.position = function (item){
  var l = this.list.length;
  var pos = l;
  for(var i = 0; i < l; i++){
   if(this.compare(item,this.list[i])){
    pos = i; break;
   }
  }
  return pos;
 }

 this.compare = function (item1, item2){
  return (this.words[item1].c > this.words[item2].c);
 }

 this.shove = function (item, pos){
  var l = this.list.length;
  if(l > 0){
   this.list[l] = this.list[l-1];
   for( var i = l - 1; i > pos; i--){
    this.list[i] = this.list[i-1];
   }
   this.list[pos] = item;
  }else{
   this.list[0] = item;
  }
 }
 this.sort = function (){
  for(var j = 0; j < this.words.length; j++){
   var t = this.words[j];
   this.shove(j, this.position(j));  
  }
 }
 this.quick_sort = function(w_ind){
  
 }

 this.show = function (){
  var sorted =[];
  for(var i = 0; i < this.words.length; i++){
   sorted[i] = this.words[this.list[i]];
  }
  return sorted;
 }
}

var A = [];
var V = [];
for(var i = 0; i < 4; i++){
 A[i] = new Text('text' + i)
 A[i].gather();
 V[i] = new Vocabulary();
 V[i].merge(A[i].words)
 V[i].sort();
 if(i) A[i].show('out' + i);
 else{
  var P = new Program(V[0]);
  A[0].set_scheme({'-1':'green', '0': 'black', '1': 'blue'});
  A[0].set_program("P");
  A[0].set_out('out' + i);
  A[0].show(); 
 }
 console.log(V[i].show());
 console.log(A[i].alphabet());
}


/// 7:33 06.04.2020
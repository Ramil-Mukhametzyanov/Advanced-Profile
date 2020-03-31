// 8:10 31.03.2020
/*
 tasks:
: call insrease word level program by clicking on a word
: SQL
: drag&drop text to text (apply vocabulary to text)
:  fix - words are duplicated in Vocabulary
: coloring words and symbols by frequency and mastering
: quick sort
: add mastering level
: add alphabet
: make vocabulary as class
: hightlight unknown word in the text  
: find a word in the text
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
 this.words = [];
 this.cur = 0; 
 this.ref = ref;
 this.skips = [" ", "\n"];
 this.scheme = {'-1':'red'};
 this.set_scheme = function(scheme){
  this.scheme = scheme;
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
 },
 this.show = function (ref, scheme=this.scheme){
  var t = "";
  for(var i=0; i < this.words.length; i++){
   if(i != 0) t += " ";
   var word = this.words[i].word;
   var m = this.words[i].es;
   if(m == -1){
    t += "<span style='color: " + scheme[m] + ";'>"; 
    t += word;
    t += "</span>"
   }else t += word;
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
 }
 this.find = function (w){
  var w_ind = -1; 
  for(var i = 0; i < this.words.length; i++){
   if(this.words[i].w == w){
    w_ind = i; break;
   }
  }
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
 if(i) A[i].set_scheme({'-1':'green'});
 A[i].show('out' + i);
 V[i] = new Vocabulary();
 V[i].merge(A[i].words)
 V[i].sort();
 console.log(V[i].show());
 console.log(A[i].alphabet());
}



// 8:10 31.03.2020
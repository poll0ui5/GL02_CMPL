var Question = function(num, inti, cat, cho, ans){
    this.number = num;
    this.text = inti || "";
    this.tail = "";         
    this.category = cat;
    this.choices = cho || [];
    this.answer = ans;
    

    this.numericType = null;
    this.value = null;
    this.tolerance = null;
    this.min = null;
    this.max = null;
    

    this.pairs = [];
}; 

module.exports = Question;

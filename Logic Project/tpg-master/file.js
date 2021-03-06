
Array.prototype.isArray = true;
Array.prototype.toString = function() {
return "["+this.join(",")+"]";
}
Array.prototype.extend = function(otherArray) {
this.push.apply(this, otherArray);
}
Array.prototype.remove = function(element) {
var index = this.indexOf(element);
if (index > -1) this.splice(index, 1);
}
Array.prototype.intersect = function(elements) {
for (var i=0; i<this.length; i++) {
if (elements.indexOf(this[i]) == -1) {
this.splice(i--, 1);
}
}
}
Array.prototype.insert = function(element, index) {
return this.splice(index, 0, element);
}
Array.prototype.concatNoDuplicates = function(array2) {
var hash = {};
var res = [];
for (var i=0; i<this.length; i++){
hash[this[i].toString()] = true;
res.push(this[i]);
}
for(var i=0; i<array2.length; i++){
var s = array2[i].toString();
if (!hash[s]){
hash[s] = true;
res.push(array2[i]);
}
}
return res;
}
Array.prototype.extendNoDuplicates = function(array2) {
var hash = {};
for (var i=0; i<this.length; i++){
hash[this[i].toString()] = true;
}
for(var i=0; i<array2.length; i++){
var s = array2[i].toString();
if (!hash[s]){
hash[s] = true;
this.push(array2[i]);
}
}
}
Array.prototype.removeDuplicates = function() {
var hash = {};
var res = [];
for (var i=0; i<this.length; i++){
var s = this[i].toString();
if (!hash[s]) {
hash[s] = true;
res.push(this[i]);
}
}
return res;
}
Array.getArrayOfZeroes = function(length) {
for (var i = 0, a = new Array(length); i < length;) a[i++] = 0;
return a;
}
Array.getArrayOfNumbers = function(length) {
for (var i = 0, a = new Array(length); i < length; i++) a[i] = i;
return a;
}
Array.prototype.copy = function() {
var result = [];
for (var i=0; i<this.length; i++) result[i] = this[i];
return result;
}
Array.prototype.copyDeep = function() {
var result = [];
for (var i=0; i<this.length; i++) {
if (this[i].isArray) result[i] = this[i].copyDeep();
else result[i] = this[i];
}
return result;
}
Array.prototype.equals = function(arr2) {
if (this.length != arr2.length) return false;
for (var i=0; i<this.length; i++) {
if (this[i].isArray) {
if (!arr2[i].isArray) return false;
if (!this[i].equals(arr2[i])) return false;
}
else if (this[i] != arr2[i]) return false;
}
return true;
}
if (!Array.prototype.includes) {
Array.prototype.includes = function(element) {
for (var i=0; i<this.length; i++) {
if (this[i] == element) return true;
}
return false;
};
}
Object.values = Object.values || function(o) {
return Object.keys(o).map(function(k){return o[k]})
};
Object.entries = Object.entries || function(obj) {
var ownProps = Object.keys(obj);
var i = ownProps.length;
var res = new Array(i);
while (i--) res[i] = [ownProps[i], obj[ownProps[i]]];
return res;
};
if (!String.prototype.startsWith) {
String.prototype.startsWith = function(search) {
return this.substring(0, search.length) === search;
}
}
if (!String.prototype.includes) {
String.prototype.includes = function(sub) {
return this.indexOf(sub) > -1;
}
}
function Formula() {
}
Formula.prototype.toString = function() {
if (this.operator && this.operator.match(/[????????????]/)) {
return this.string.slice(1,-1);
}
return this.string;
}
Formula.prototype.equals = function(fla) {
return this.string == fla.string;
}
Formula.prototype.negate = function() {
return new NegatedFormula(this);
}
Formula.unifyTerms = function(terms1, terms2) {
var unifier = [];
var terms1 = terms1.copyDeep();
var terms2 = terms2.copyDeep();
var t1, t2;
while (t1 = terms1.shift(), t2 = terms2.shift()) {
if (t1 == t2) {
continue;
}
if (t1.isArray && t2.isArray) {
if (t1[0] != t2[0]) return false;
for (var i=1; i<t1.length; i++) {
terms1.push(t1[i]);
terms2.push(t2[i]);
}
continue;
}
var t1Var = (t1[0] == '??' || t1[0] == '??');
var t2Var = (t2[0] == '??' || t2[0] == '??');
if (!t1Var && !t2Var) {
return false;
}
if (!t1Var) {
var temp = t1; t1 = t2; t2 = temp;
}
if (t2.isArray) {
var terms, termss = [t2];
while (terms = termss.shift()) {
for (var i=0; i<terms.length; i++) {
if (terms[i].isArray) termss.push(terms[i]);
else if (terms[i] == t1) {
return false;
}
}
}
}
var terms, termss = [unifier, terms1, terms2];
while (terms = termss.shift()) {
for (var i=0; i<terms.length; i++) {
if (terms[i].isArray) termss.push(terms[i]);
else if (terms[i] == t1) terms[i] = t2;
}
}
unifier.push(t1);
unifier.push(t2);
}
return unifier;
}
Formula.prototype.normalize = function() {
var op = this.operator || this.quantifier;
if (!op) return this;
switch (op) {
case '???' : case '???' : {
var sub1 = this.sub1.normalize();
var sub2 = this.sub2.normalize();
return new BinaryFormula(op, sub1, sub2);
}
case '???' : {
var sub1 = this.sub1.negate().normalize();
var sub2 = this.sub2.normalize();
return new BinaryFormula('???', sub1, sub2);
}
case '???' : {
var sub1 = new BinaryFormula('???', this.sub1, this.sub2).normalize();
var sub2 = new BinaryFormula('???', this.sub1.negate(), this.sub2.negate()).normalize();
return new BinaryFormula('???', sub1, sub2);
}
case '???' : case '???' : {
return new QuantifiedFormula(op, this.variable, this.matrix.normalize(),
this.overWorlds);
}
case '???' : case '???' : {
return new ModalFormula(op, this.sub.normalize());
}
case '??' : {
var op2 = this.sub.operator || this.sub.quantifier;
if (!op2) return this;
switch (op2) {
case '???' : case '???' : {
var sub1 = this.sub.sub1.negate().normalize();
var sub2 = this.sub.sub2.negate().normalize();
var newOp = op2 == '???' ? '???' : '???';
return new BinaryFormula(newOp, sub1, sub2);
}
case '???' : {
var sub1 = this.sub.sub1.normalize();
var sub2 = this.sub.sub2.negate().normalize();
return new BinaryFormula('???', sub1, sub2);
}
case '???' : {
var sub1 = new BinaryFormula('???', this.sub.sub1, this.sub.sub2.negate()).normalize();
var sub2 = new BinaryFormula('???', this.sub.sub1.negate(), this.sub.sub2).normalize();
return new BinaryFormula('???', sub1, sub2);
}
case '???' : case '???' : {
var sub = this.sub.matrix.negate().normalize();
return new QuantifiedFormula(op2=='???' ? '???' : '???', this.sub.variable, sub,
this.sub.overWorlds);
}
case '???' : case '???' : {
var sub = this.sub.sub.negate().normalize();
return new ModalFormula(op2=='???' ? '???' : '???', sub);
}
case '??' : {
return this.sub.sub.normalize();
}
}
}
}
}
Formula.prototype.removeQuantifiers = function() {
if (this.matrix) return this.matrix.removeQuantifiers();
if (this.sub1) {
var nsub1 = this.sub1.quantifier ?
this.sub1.matrix.removeQuantifiers() : this.sub1.removeQuantifiers();
var nsub2 = this.sub2.quantifier ?
this.sub2.matrix.removeQuantifiers() : this.sub2.removeQuantifiers();
if (this.sub1 == nsub1 && this.sub2 == nsub2) return this;
var res = new BinaryFormula(this.operator, nsub1, nsub2);
return res;
}
return this;
}
Formula.prototype.alpha = function(n) {
var f = this;
if (f.operator == '???') {
return n == 1 ? f.sub1 : f.sub2;
}
if (f.sub.operator == '???') {
return n == 1 ? f.sub.sub1.negate() : f.sub.sub2.negate();
}
if (f.sub.operator == '???') {
return n == 1 ? f.sub.sub1 : f.sub.sub2.negate();
}
}
Formula.prototype.beta = function(n) {
var f = this;
if (f.operator == '???') {
return n == 1 ? f.sub1 : f.sub2;
}
if (f.operator == '???') {
return n == 1 ? f.sub1.negate() : f.sub2;
}
if (f.operator == '???') {
return n == 1 ? new BinaryFormula('???', f.sub1, f.sub2) :
new BinaryFormula('???', f.sub1.negate(), f.sub2.negate())
}
if (f.sub.operator == '???') {
return n == 1 ? f.sub.sub1.negate() : f.sub.sub2.negate();
}
if (f.sub.operator == '???') {
return n == 1 ? new BinaryFormula('???', f.sub.sub1, f.sub.sub2.negate()) :
new BinaryFormula('???', f.sub.sub1.negate(), f.sub.sub2)
}
}
function AtomicFormula(predicate, terms) {
this.type = 'literal';
this.predicate = predicate;
this.terms = terms;
if (this.predicate == '=') {
this.string = AtomicFormula.terms2string([this.terms[0]])+'='+
AtomicFormula.terms2string([this.terms[1]]);
}
else {
this.string = predicate + AtomicFormula.terms2string(terms);
}
}
AtomicFormula.terms2string = function(list, separator) {
return list.map(function(term) {
if (term.isArray) {
var sublist = term.copy();
var funcsym = sublist.shift();
return funcsym+'('+AtomicFormula.terms2string(sublist,',')+')';
}
else return term;
}).join(separator || '');
}
AtomicFormula.prototype = Object.create(Formula.prototype);
AtomicFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
if (typeof(origTerm) == 'string' && this.string.indexOf(origTerm) == -1) {
return this;
}
var newTerms = Formula.substituteInTerms(this.terms, origTerm, newTerm, shallow);
if (!this.terms.equals(newTerms)) {
return new AtomicFormula(this.predicate, newTerms);
}
else return this;
}
Formula.substituteInTerm = function(term, origTerm, newTerm) {
if (term == origTerm) return newTerm;
if (term.isArray) return Formula.substituteInTerms(term, origTerm, newTerm);
return term;
}
Formula.substituteInTerms = function(terms, origTerm, newTerm, shallow) {
var newTerms = [];
for (var i=0; i<terms.length; i++) {
var term = terms[i];
if (term.toString() == origTerm.toString()) newTerms.push(newTerm);
else if (term.isArray && !shallow) {
newTerms.push(Formula.substituteInTerms(term, origTerm, newTerm));
}
else newTerms.push(term);
}
return newTerms;
}
function QuantifiedFormula(quantifier, variable, matrix, overWorlds) {
this.quantifier = quantifier;
this.variable = variable;
this.matrix = matrix;
this.overWorlds = overWorlds;
if (overWorlds) {
this.type = quantifier == '???' ? 'modalGamma' : 'modalDelta';
}
else {
this.type = quantifier == '???' ? 'gamma' : 'delta';
}
this.string = quantifier + variable + matrix.string;
}
QuantifiedFormula.prototype = Object.create(Formula.prototype);
QuantifiedFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
if (this.variable == origTerm) return this;
var nmatrix = this.matrix.substitute(origTerm, newTerm, shallow);
if (nmatrix == this.matrix) return this;
return new QuantifiedFormula(this.quantifier, this.variable, nmatrix, this.overWorlds);
}
function BinaryFormula(operator, sub1, sub2) {
this.operator = operator;
this.sub1 = sub1;
this.sub2 = sub2;
this.type = operator == '???' ? 'alpha' : 'beta';
var space = sub1.string.length+sub2.string.length > 3 ? ' ' : '';
this.string = '(' + sub1.string + space + operator + space + sub2.string + ')';
}
BinaryFormula.prototype = Object.create(Formula.prototype);
BinaryFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
var nsub1 = this.sub1.substitute(origTerm, newTerm, shallow);
var nsub2 = this.sub2.substitute(origTerm, newTerm, shallow);
if (this.sub1 == nsub1 && this.sub2 == nsub2) return this;
return new BinaryFormula(this.operator, nsub1, nsub2);
}
function ModalFormula(operator, sub) {
this.operator = operator;
this.sub = sub;
this.type = operator == '???' ? 'modalGamma' : 'modalDelta';
this.string = operator + sub.string;
}
ModalFormula.prototype = Object.create(Formula.prototype);
ModalFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
var nsub = this.sub.substitute(origTerm, newTerm, shallow);
if (this.sub == nsub) return this;
return new ModalFormula(this.operator, nsub);
}
function NegatedFormula(sub) {
this.operator = '??';
this.sub = sub;
this.type = NegatedFormula.computeType(sub);
this.string = '??' + sub.string;
}
NegatedFormula.computeType = function(sub) {
if (sub.operator == '??') return 'doublenegation';
switch (sub.type) {
case 'literal': { return 'literal'; }
case 'alpha': { return 'beta'; }
case 'beta': { return sub.operator == '???' ? 'beta' : 'alpha'; }
case 'gamma': { return 'delta'; }
case 'delta': { return 'gamma'; }
case 'modalGamma': { return 'modalBeta'; }
case 'modalDelta': { return 'modalGamma'; }
}
}
NegatedFormula.prototype = Object.create(Formula.prototype);
NegatedFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
var nsub = this.sub.substitute(origTerm, newTerm, shallow);
if (this.sub == nsub) return this;
return new NegatedFormula(nsub);
}
function Parser() {
this.symbols = [];
this.expressionType = {};
this.arities = {};
this.isModal = false;
this.isPropositional = true;
this.hasEquality = false;
}
Parser.prototype.copy = function() {
var nparser = new Parser(true);
nparser.symbols = this.symbols.copy();
for (var i=0; i<this.symbols.length; i++) {
var sym = this.symbols[i];
nparser.expressionType[sym] = this.expressionType[sym];
nparser.arities[sym] = this.arities[sym];
}
nparser.isModal = this.isModal;
nparser.isPropositional = this.isPropositional;
nparser.hasEquality = this.hasEquality;
nparser.R = this.R;
nparser.w = this.w;
return nparser;
}
Parser.prototype.registerExpression = function(ex, exType, arity) {
if (!this.expressionType[ex]) this.symbols.push(ex);
else if (this.expressionType[ex] != exType) {
throw "Don't use '"+ex+"' as both "+this.expressionType[ex]+" and "+exType+".";
}
this.expressionType[ex] = exType;
this.arities[ex] = arity;
}
Parser.prototype.getSymbols = function(expressionType) {
var res = [];
for (var i=0; i<this.symbols.length; i++) {
var s = this.symbols[i];
if (this.expressionType[s].indexOf(expressionType) > -1) res.push(s);
}
return res;
}
Parser.prototype.getNewSymbol = function(candidates, expressionType, arity) {
var candidates = candidates.split('');
for (var i=0; i<candidates.length; i++) {
var sym = candidates[i];
if (!this.expressionType[sym]) {
this.registerExpression(sym, expressionType, arity);
return sym;
}
candidates.push(candidates[0]+(i+2));
}
}
Parser.prototype.getNewConstant = function() {
return this.getNewSymbol('abcdefghijklmno', 'individual constant', 0);
}
Parser.prototype.getNewVariable = function() {
return this.getNewSymbol('xyzwvutsr', 'variable', 0);
}
Parser.prototype.getNewFunctionSymbol = function(arity, isWorldFunction) {
var stype = arity+"-ary function symbol"+(isWorldFunction ? " for worlds" : "");
return this.getNewSymbol('fghijklmn', stype, arity);
}
Parser.prototype.getNewWorldVariable = function() {
return this.getNewSymbol('wvutsr', 'world variable', 0);
}
Parser.prototype.getNewWorldName = function() {
return this.getNewSymbol('vutsr', 'world constant', 0);
}
Parser.prototype.getVariables = function(formula) {
if (formula.sub) {
return this.getVariables(formula.sub);
}
if (formula.sub1) {
return this.getVariables(formula.sub1).concatNoDuplicates(
this.getVariables(formula.sub2));
}
var res = [];
var dupe = {};
var terms = formula.isArray ? formula : formula.terms;
for (var i=0; i<terms.length; i++) {
if (terms[i].isArray) {
res.extendNoDuplicates(this.getVariables(terms[i]));
}
else if (this.expressionType[terms[i]].indexOf('variable') > -1
&& !dupe[terms[i]]) {
dupe[terms[i]] = true;
res.push(terms[i]);
}
}
return res;
}
Parser.prototype.isTseitinLiteral = function(formula) {
return this.expressionType[formula.predicate || formula.sub.predicate] == 'tseitin predicate';
}
Parser.prototype.initModality = function() {
for (var i=0; i<this.symbols.length; i++) {
var sym = this.symbols[i];
if (this.expressionType[sym].indexOf('predicate') > -1) {
this.arities[sym] += 1;
}
}
this.R = this.getNewSymbol('Rr???', '2-ary predicate', 2);
this.w = this.getNewSymbol('wvur', 'world constant', 0);
}
Parser.prototype.translateFromModal = function(formula, worldVariable) {
if (!worldVariable) {
if (!this.w) this.initModality();
worldVariable = this.w;
}
if (formula.terms) {
var nterms = formula.terms.copyDeep();
nterms.push(worldVariable);
return new AtomicFormula(formula.predicate, nterms);
}
if (formula.quantifier) {
var nmatrix = this.translateFromModal(formula.matrix, worldVariable);
return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
}
if (formula.sub1) {
var nsub1 = this.translateFromModal(formula.sub1, worldVariable);
var nsub2 = this.translateFromModal(formula.sub2, worldVariable);
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
if (formula.operator == '??') {
var nsub = this.translateFromModal(formula.sub, worldVariable);
return new NegatedFormula(nsub);
}
if (formula.operator == '???') {
var newWorldVariable = this.getNewWorldVariable();
var wRv = new AtomicFormula(this.R, [worldVariable, newWorldVariable])
var nsub = this.translateFromModal(formula.sub, newWorldVariable);
var nmatrix = new BinaryFormula('???', wRv, nsub);
return new QuantifiedFormula('???', newWorldVariable, nmatrix, true);
}
if (formula.operator == '???') {
var newWorldVariable = this.getNewWorldVariable();
var wRv = new AtomicFormula(this.R, [worldVariable, newWorldVariable])
var nsub = this.translateFromModal(formula.sub, newWorldVariable);
var nmatrix = new BinaryFormula('???', wRv, nsub);
return new QuantifiedFormula('???', newWorldVariable, nmatrix, true)
}
}
Parser.prototype.stripAccessibilityClauses = function(formula) {
if (formula.quantifier) {
var nmatrix = this.stripAccessibilityClauses(formula.matrix);
if (nmatrix == formula.matrix) return formula;
return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
}
if (formula.sub1) {
if ((formula.sub1.sub && formula.sub1.sub.predicate == this.R) ||
(formula.sub1.predicate == this.R)) {
return this.stripAccessibilityClauses(formula.sub2);
}
var nsub1 = this.stripAccessibilityClauses(formula.sub1);
var nsub2 = this.stripAccessibilityClauses(formula.sub2);
if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
if (formula.operator == '??') {
return formula;
}
else {
return formula;
}
}
Parser.prototype.translateToModal = function(formula) {
if (formula.terms && formula.predicate == this.R) {
return formula;
}
if (formula.terms) {
var nterms = formula.terms.copyDeep();
var worldlabel = nterms.pop();
var res = new AtomicFormula(formula.predicate, nterms);
res.world = worldlabel;
}
else if (formula.quantifier && this.expressionType[formula.variable] == 'world variable') {
var prejacent = formula.matrix.sub2;
var op = formula.quantifier == '???' ? '???' : '???';
var res = new ModalFormula(op, this.translateToModal(prejacent));
res.world = formula.matrix.sub1.terms[0];
}
else if (formula.quantifier) {
var nmatrix = this.translateToModal(formula.matrix);
var res = new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
res.world = nmatrix.world;
}
else if (formula.sub1) {
var nsub1 = this.translateToModal(formula.sub1);
var nsub2 = this.translateToModal(formula.sub2);
var res = new BinaryFormula(formula.operator, nsub1, nsub2);
res.world = nsub2.world;
}
else if (formula.operator == '??') {
var nsub = this.translateToModal(formula.sub);
var res = new NegatedFormula(nsub);
res.world = nsub.world;
}
return res;
}
Parser.prototype.parseInput = function(str) {
var parts = str.split('|=');
if (parts.length > 2) {
throw "You can't use more than one turnstile.";
}
var premises = [];
var conclusion = this.parseFormula(parts[parts.length-1]);
if (conclusion.isArray)
throw parts[parts.length-1]+" looks like a list; use either conjunction or disjunction instead of the comma.";
if (parts.length == 2 && parts[0] != '') {
premises = this.parseFormula(parts[0]);
if (!premises.isArray) premises = [premises];
}
if (this.isModal) this.initModality();
return [premises, conclusion];
}
Parser.prototype.parseFormula = function(str) {
var boundVars = arguments[1] ? arguments[1].slice() : [];
if (!arguments[1]) str = this.tidyFormula(str);
var temp = this.hideSubStringsInParens(str);
var nstr = temp[0];
var subStringsInParens = temp[1];
if (nstr == '%0') {
return this.parseFormula(str.replace(/^\((.*)\)$/, "$1"), arguments[1]);
}
var reTest = nstr.match(/,/) || nstr.match(/???/) || nstr.match(/???/)  || nstr.match(/???/) || nstr.match(/???/);
if (reTest) {
var op = reTest[0];
if (op == ',') nstr = nstr.replace(/,/g, '%split');
else nstr = nstr.replace(op, "%split");
for (var i=0; i<subStringsInParens.length; i++) {
nstr = nstr.replace("%"+i, subStringsInParens[i]);
}
var substrings = nstr.split("%split");
if (!substrings[1]) {
throw "argument missing for operator "+op+" in "+str+".";
}
var subFormulas = [];
for (var i=0; i<substrings.length; i++) {
subFormulas.push(this.parseFormula(substrings[i], boundVars));
}
if (op == ',') {
if (arguments[1]) {
throw "I don't understand '"+str+"' (looks like a list of formulas).";
}
return subFormulas;
}
return new BinaryFormula(op, subFormulas[0], subFormulas[1]);
}
var reTest = nstr.match(/^(??|???|???)/);
if (reTest) {
var op = reTest[1];
var sub = this.parseFormula(str.substr(1), boundVars);
if (op == '??') return new NegatedFormula(sub);
this.isModal = true;
return new ModalFormula(op, sub);
}
reTest = /^(???|???)([^\d\(\),%]\d*)/.exec(str);
if (reTest && reTest.index == 0) {
var quantifier = reTest[1];
var variable = reTest[2];
if (!str.substr(reTest[0].length)) {
throw "There is nothing in the scope of "+str+".";
}
if (this.expressionType[variable] != 'world variable') {
this.registerExpression(variable, 'variable', 0);
}
boundVars.push(variable);
this.isPropositional = false;
var sub = this.parseFormula(str.substr(reTest[0].length), boundVars);
return new QuantifiedFormula(quantifier, variable, sub);
}
m = str.match(/[??????????????]/);
if (m) {
throw "I don't understand '"+m[0]+"' in '"+str+"'. Missing operator?";
}
str = str.replace(/^(.+)=(.+)$/, '=$1$2');
reTest = /^[^\d\(\),%]\d*/.exec(str);
if (reTest && reTest.index == 0) {
try {
var predicate = reTest[0];
var termstr = str.substr(predicate.length);
var terms = this.parseTerms(termstr, boundVars) || [];
if (termstr) {
var predicateType = terms.length+"-ary predicate";
if (predicate != this.R) this.isPropositional = false;
}
else {
var predicateType = "proposition letter (0-ary predicate)";
}
if (predicate == '=') this.hasEquality = true;
this.registerExpression(predicate, predicateType, terms.length);
return new AtomicFormula(predicate, terms);
}
catch (e) {
throw e+"\n(I'm assuming '"+str+"' is meant to be an atomic formula with predicate '"+predicate+"'.)";
}
}
throw "Parse Error.\n'" + str + "' is not a well-formed formula.";
}
Parser.prototype.hideSubStringsInParens = function(str) {
var subStringsInParens = [];
var parenDepth = 0;
var storingAtIndex = -1;
var nstr = "";
for (var i=0; i<str.length; i++) {
if (str.charAt(i) == "(") {
parenDepth++;
if (parenDepth == 1) {
storingAtIndex = subStringsInParens.length;
subStringsInParens[storingAtIndex] = "";
nstr += "%" + storingAtIndex;
}
}
if (storingAtIndex == -1) nstr += str.charAt(i);
else subStringsInParens[storingAtIndex] += str.charAt(i);
if (str.charAt(i) == ")") {
parenDepth--;
if (parenDepth == 0) storingAtIndex = -1;
}
}
return [nstr, subStringsInParens];
}
Parser.prototype.tidyFormula = function(str) {
str = str.replace(/\s/g, '');
str = str.replace('[', '(').replace(']', ')');
this.checkBalancedParentheses(str);
str = str.replace(/\(([??????]\w\d*)\)/g, '$1');
var m =str.match(/[^\w\d\(\)??????????????????????????,=????$]/);
if (m) throw("I don't understand the symbol '"+m[0]+"'.");
return str;
}
Parser.prototype.checkBalancedParentheses = function(str) {
var openings = str.split('(').length - 1;
var closings = str.split(')').length - 1;
if (openings != closings) {
throw "unbalanced parentheses: "+openings+" opening parentheses, "+closings+" closing.";
}
}
Parser.prototype.parseAccessibilityFormula = function(str) {
str = str.replace(/R/g, this.R);
var matches = str.match(/[??????]./g);
for (var i=0; i<matches.length; i++) {
var v = matches[i][1];
if (this.expressionType[v] && this.expressionType[v] != 'world variable') {
var re = new RegExp(v, 'g');
str = str.replace(re, this.getNewWorldVariable());
}
else {
this.registerExpression(v, 'world variable', 0);
}
}
var isPropositional = this.isPropositional;
var formula = this.parseFormula(str);
this.isPropositional = isPropositional;
return formula;
}
Parser.prototype.parseTerms = function(str, boundVars) {
if (!str) return [];
var result = [];
str = str.replace(/^\((.+)\)$/, "$1");
do {
var reTest = /[^\(\),%??????????????????????????]\d*/.exec(str);
if (!reTest || reTest.index != 0) {
throw "I expected a (sequence of) term(s) instead of '" + str + "'.";
}
var nextTerm = reTest[0];
str = str.substr(reTest[0].length);
if (str.indexOf("(") == 0) {
var args = "", openParens = 0, spos = 0;
do {
args += str.charAt(spos);
if (str.charAt(spos) == "(") openParens++;
else if (str.charAt(spos) == ")") openParens--;
spos++;
} while (openParens && spos < str.length);
nextTerm = [nextTerm].concat(this.parseTerms(args, boundVars));
var arity = (nextTerm.length - 1);
this.registerExpression(reTest[0], arity+"-ary function symbol", arity);
str = str.substr(args.length);
}
else if (!boundVars.includes(nextTerm)) {
this.registerExpression(nextTerm, 'individual constant', 0);
}
result.push(nextTerm);
if (str.indexOf(",") == 0) str = str.substr(1);
} while (str.length > 0);
return result;
}
function Prover(initFormulas, parser, accessibilityConstraints) {
parser = parser.copy();
this.parser = parser;
this.initFormulas = initFormulas;
this.initFormulasNonModal = initFormulas;
this.accessibilityRules = [];
if (parser.isModal) {
this.initFormulasNonModal = initFormulas.map(function(f) {
return parser.translateFromModal(f);
});
if (accessibilityConstraints) {
this.s5 = accessibilityConstraints.includes('universality');
if (!this.s5) {
this.accessibilityRules = accessibilityConstraints.map(function(s) {
return Prover[s];
});
}
}
}
this.initFormulasNormalized = this.initFormulasNonModal.map(function(f){
return f.normalize();
});
this.pauseLength = 5;
this.computationLength = 20;
this.step = 0;
this.tree = new Tree(this);
this.depthLimit = 2;
this.alternatives = [this.tree];
this.curAlternativeIndex = 0;
this.tree.addInitNodes(this.initFormulasNormalized)
var mfParser = parser.copy();
if (accessibilityConstraints) {
var name2fla = {
"universality": "???v???uRvu",
"reflexivity": "???vRvv",
"symmetry": "???v???u(Rvu???Ruv)",
"transitivity": "???v???u???t(Rvu???(Rut???Rvt))",
"euclidity": "???v???u???t(Rvu???(Rvt???Rut))",
"seriality": "???v???uRvu"
};
var accessibilityFormluas = accessibilityConstraints.map(function(s) {
return mfParser.parseAccessibilityFormula(name2fla[s]).normalize();
});
this.modelfinder = new ModelFinder(
this.initFormulasNormalized,
mfParser,
accessibilityFormluas,
this.s5
);
}
else {
this.modelfinder = new ModelFinder(this.initFormulasNormalized, mfParser);
}
this.counterModel = null;
this.start = function() {
this.lastBreakTime = performance.now();
this.nextStep();
};
this.stop = function() {
this.stopTimeout = true;
};
this.onfinished = function(treeClosed) {};
this.status = function(str) {};
}
Prover.prototype.nextStep = function() {
this.step++;
if (this.tree.openBranches.length == 0) {
return this.onfinished(1);
}
this.status('step '+this.step+' alternative '+this.curAlternativeIndex+', '
+this.tree.numNodes+' nodes, model size '
+this.modelfinder.model.domain.length
+(this.tree.parser.isModal ? '/'+this.modelfinder.model.worlds.length : ''));
if (this.limitReached()) {
if (this.curAlternativeIndex < this.alternatives.length-1) {
this.curAlternativeIndex++;
}
else {
this.depthLimit += 2 + Math.floor(this.step/500);
this.curAlternativeIndex = 0;
}
this.tree = this.alternatives[this.curAlternativeIndex];
return this.nextStep();
}
var todo = this.tree.openBranches[0].todoList.shift();
if (todo) {
todo.nextRule(this.tree.openBranches[0], todo.args);
}
else if (this.alternatives.length) {
this.discardCurrentAlternative();
}
if (this.modelfinder.nextStep()) {
this.counterModel = this.modelfinder.model;
return this.onfinished(0);
}
var timeSinceBreak = performance.now() - this.lastBreakTime;
if (this.stopTimeout) {
this.stopTimeout = false;
}
else if (this.pauseLength && timeSinceBreak > this.computationLength) {
setTimeout(function(){
this.lastBreakTime = performance.now();
this.nextStep();
}.bind(this), this.pauseLength+this.tree.numNodes/1000);
}
else {
this.nextStep();
}
}
Prover.prototype.limitReached = function() {
var complexity = this.tree.getNumNodes() - this.tree.priority;
if (this.tree.openBranches[0].todoList[0] &&
this.tree.openBranches[0].todoList[0].nextRule == Prover.equalityReasoner) {
if (!this.equalityComputationStep) this.equalityComputationStep = 1;
else if (++this.equalityComputationStep == 100) {
this.equalityComputationStep = 0;
return true;
}
}
return complexity >= this.depthLimit;
}
Prover.prototype.useTree = function(tree, index) {
if (index !== undefined) {
this.alternatives.splice(index, 0, tree);
this.curAlternativeIndex = index;
}
else {
this.alternatives[this.curAlternativeIndex] = tree;
}
this.tree = tree
}
Prover.prototype.switchToAlternative = function(altTree) {
this.curAlternativeIndex = this.alternatives.indexOf(altTree);
this.tree = this.alternatives[this.curAlternativeIndex];
}
Prover.prototype.storeAlternatives = function(altTrees) {
var insertPosition = this.curAlternativeIndex+1;
for (var i=0; i<altTrees.length; i++) {
this.alternatives.splice(insertPosition, 0, altTrees[i]);
this.pruneAlternatives(altTrees[i]);
if (!altTrees[i].removed) {
insertPosition++;
}
}
}
Prover.prototype.pruneAlternatives = function(tree) {
for (var i=0; i<this.alternatives.length; i++) {
if (this.alternatives[i] == tree) continue;
var keepWhich = this.keepWhichTree(tree, this.alternatives[i]);
var keepTree = keepWhich[0];
var keepAlt = keepWhich[1];
if (!keepTree) {
this.removeAlternative(this.alternatives.indexOf(tree));
return;
}
else if (!keepAlt) {
this.removeAlternative(i);
i--;
}
}
}
Prover.prototype.keepWhichTree = function(tree, altTree) {
if (altTree.string == tree.string) {
if (tree.openBranches[0].todoList[0].nextRule != altTree.openBranches[0].todoList[0].nextRule ||
tree.openBranches[0].todoList[0].args != altTree.openBranches[0].todoList[0].args) {
return [true, true];
}
else if (tree.numNodes < altTree.numNodes) {
return [true, false];
}
else {
return [false, true];
}
}
var treeDiff = this.treeDiff(tree, altTree);
var treeHasUnmatchedBranches = treeDiff[0];
var altTreeHasUnmatchedBranches = treeDiff[1];
if (treeHasUnmatchedBranches && altTreeHasUnmatchedBranches) {
return [true, true];
}
if (treeHasUnmatchedBranches) {
return [false, true];
}
if (altTreeHasUnmatchedBranches) {
return [true, false];
}
var treeNodes = tree.openBranches[0].nodes;
var altTreeNodes = altTree.openBranches[0].nodes;
if (altTreeNodes.length > treeNodes.length &&
tree.openBranches[0].todoList[0].nextRule != Prover.equalityReasoner) {
return [false, true];
}
else if (treeNodes.length > altTreeNodes.length &&
altTree.openBranches[0].todoList[0].nextRule != Prover.equalityReasoner) {
return [true, false];
}
else return [true, true];
}
Prover.prototype.treeDiff = function(tree1, tree2) {
var tree1hasUnmatchedBranches = false;
var tree2hasUnmatchedBranches = false;
var tree2matchedBranchIds = [];
TREE1BRANCHLOOP:
for (var i=0; i<tree1.openBranches.length; i++) {
var string1 = tree1.openBranches[i].string;
for (var j=0; j<tree2.openBranches.length; j++) {
var string2 = tree2.openBranches[j].string;
if (string1.startsWith(string2) || string2.startsWith(string1)) {
tree2matchedBranchIds.push(j);
continue TREE1BRANCHLOOP;
}
}
tree1hasUnmatchedBranches = true;
break;
}
TREE2BRANCHLOOP:
for (var j=0; j<tree2.openBranches.length; j++) {
if (tree2matchedBranchIds.includes(j)) continue;
var string2 = tree2.openBranches[j].string;
for (var i=0; i<tree1.openBranches.length; i++) {
var string1 = tree1.openBranches[i].string;
if (string1.startsWith(string2) || string2.startsWith(string1)) {
continue TREE2BRANCHLOOP;
}
}
tree2hasUnmatchedBranches = true;
break;
}
return [tree1hasUnmatchedBranches, tree2hasUnmatchedBranches];
}
Prover.prototype.removeAlternative = function(index) {
this.alternatives[index].removed = true;
if (index == this.curAlternativeIndex) {
this.discardCurrentAlternative();
}
else {
this.alternatives.splice(index, 1);
if (index < this.curAlternativeIndex) {
this.curAlternativeIndex--;
}
}
}
Prover.prototype.discardCurrentAlternative = function() {
this.alternatives.splice(this.curAlternativeIndex, 1);
if (this.curAlternativeIndex == this.alternatives.length) {
this.curAlternativeIndex = 0;
}
if (this.alternatives.length) {
this.tree = this.alternatives[this.curAlternativeIndex];
}
}
Prover.alpha = function(branch, nodeList) {
var node = nodeList[0];
var subnode1 = new Node(node.formula.sub1, Prover.alpha, nodeList);
var subnode2 = new Node(node.formula.sub2, Prover.alpha, nodeList);
branch.addNode(subnode1, 'addEvenIfDuplicate');
branch.addNode(subnode2, 'addEvenIfDuplicate');
branch.tryClose(subnode1);
if (!branch.closed) branch.tryClose(subnode2);
}
Prover.alpha.priority = 1;
Prover.alpha.toString = function() { return 'alpha' }
Prover.beta = function(branch, nodeList) {
var node = nodeList[0];
var newbranch = branch.copy();
branch.tree.openBranches.unshift(newbranch);
var re = /[????????????????????????]/g;
var complexity1 = (node.formula.sub1.string.match(re) || []).length;
var complexity2 = (node.formula.sub2.string.match(re) || []).length;
if (complexity2 < complexity1) {
var subnode1 = new Node(node.formula.sub1, Prover.beta, nodeList);
var subnode2 = new Node(node.formula.sub2, Prover.beta, nodeList);
}
else {
var subnode2 = new Node(node.formula.sub1, Prover.beta, nodeList);
var subnode1 = new Node(node.formula.sub2, Prover.beta, nodeList);
}
branch.addNode(subnode1, 'addEvenIfDuplicate');
newbranch.addNode(subnode2, 'addEvenIfDuplicate');
branch.tryClose(subnode1, 'dontPruneAlternatives');
newbranch.tryClose(subnode2);
}
Prover.beta.priority = 9;
Prover.beta.toString = function() { return 'beta' }
Prover.gamma = function(branch, nodeList, matrix) {
var fromModalGamma = (matrix != undefined);
var node = nodeList[0];
var newVariable = branch.newVariable(matrix);
var matrix = matrix || node.formula.matrix;
var newFormula = matrix.substitute(node.formula.variable, newVariable);
var newNode = new Node(newFormula, Prover.gamma, nodeList);
newNode.instanceTerm = newVariable;
branch.addNode(newNode);
branch.tryClose(newNode);
if (!fromModalGamma && newNode.type != 'gamma') {
var outer = node;
while (outer.fromRule == Prover.gamma) outer = outer.fromNodes[0];
var priority = 9;
branch.todoList.push(Prover.makeTodoItem(Prover.gamma, [outer], priority));
}
}
Prover.gamma.priority = 7;
Prover.gamma.toString = function() { return 'gamma' }
Prover.modalGamma = function(branch, nodeList) {
var node = nodeList[0];
branch.todoList.push(Prover.makeTodoItem(Prover.modalGamma, nodeList));
if (branch.tree.prover.s5) {
return Prover.gamma(branch, nodeList, node.formula.matrix.sub2);
}
var wRx = node.formula.matrix.sub1.sub;
OUTERLOOP:
for (var i=0; i<branch.literals.length; i++) {
var wRy = branch.literals[i].formula;
if (wRy.predicate == wRx.predicate && wRy.terms[0] == wRx.terms[0]) {
for (var j=0; j<branch.nodes.length; j++) {
if (branch.nodes[j].fromRule == Prover.modalGamma &&
branch.nodes[j].fromNodes[0] == node &&
branch.nodes[j].fromNodes[1] == branch.literals[i]) {
continue OUTERLOOP;
}
}
var modalMatrix = node.formula.matrix.sub2;
var v = wRy.terms[1];
var newFormula = modalMatrix.substitute(node.formula.variable, v);
var newNode = new Node(newFormula, Prover.modalGamma, [node, branch.literals[i]]);
newNode.instanceTerm = v;
if (branch.addNode(newNode)) {
branch.tryClose(newNode);
break;
}
}
}
}
Prover.modalGamma.priority = 8;
Prover.modalGamma.toString = function() { return 'modalGamma' }
Prover.delta = function(branch, nodeList, matrix) {
var node = nodeList[0];
var fla = node.formula;
var funcSymbol = branch.tree.newFunctionSymbol(matrix);
if (branch.freeVariables.length > 0) {
if (branch.tree.prover.s5) {
var skolemTerm = branch.freeVariables.filter(function(v) {
return v[0] == (matrix ? '??' : '??');
});
}
else {
var skolemTerm = branch.freeVariables.copy();
}
skolemTerm.unshift(funcSymbol);
}
else {
var skolemTerm = funcSymbol;
}
var matrix = matrix || node.formula.matrix;
var newFormula = matrix.substitute(node.formula.variable, skolemTerm);
var newNode = new Node(newFormula, Prover.delta, nodeList);
newNode.instanceTerm = skolemTerm;
branch.addNode(newNode);
branch.tryClose(newNode);
}
Prover.delta.priority = 2;
Prover.delta.toString = function() { return 'delta' }
Prover.modalDelta = function(branch, nodeList) {
var node = nodeList[0];
if (branch.tree.prover.s5) {
return Prover.delta(branch, nodeList, node.formula.matrix.sub2);
}
var fla = node.formula;
var newWorldName = branch.tree.newWorldName();
var fla1 = node.formula.matrix.sub1.substitute(node.formula.variable, newWorldName);
var fla2 = node.formula.matrix.sub2.substitute(node.formula.variable, newWorldName);
var newNode1 = new Node(fla1, Prover.modalDelta, nodeList);
var newNode2 = new Node(fla2, Prover.modalDelta, nodeList);
newNode2.instanceTerm = newWorldName;
branch.addNode(newNode1);
branch.addNode(newNode2);
branch.tryClose(newNode2);
}
Prover.modalDelta.priority = 2;
Prover.modalDelta.toString = function() { return 'modalDelta' }
Prover.literal = function(branch, nodeList) {
var tree = branch.tree;
var prover = tree.prover;
var unifiers = [];
for (var i=0; i<nodeList.length; i++) {
unifiers.extendNoDuplicates(branch.getClosingUnifiers(nodeList[i]));
}
var altTrees = [];
var localTree = null;
for (var i=0; i<unifiers.length; i++) {
var altTree = tree.copy();
altTree.applySubstitution(unifiers[i]);
altTree.closeCloseableBranches();
if (altTree.openBranches.length == 0) {
prover.useTree(altTree);
return;
}
if (!localTree) {
if (!branch.unifierAffectsOtherBranches(unifiers[i])) {
localTree = altTree;
}
else {
altTrees.push(altTree);
}
}
}
if (localTree) {
prover.useTree(localTree);
prover.pruneAlternatives(localTree);
return;
}
if (tree.parser.hasEquality) {
var eqProbs = branch.createEqualityProblems(nodeList);
if (eqProbs.length) {
var altTree = tree.copy();
altTree.openBranches[0].todoList = eqProbs.map(function(p) {
return Prover.makeTodoItem(Prover.equalityReasoner, p);
});
altTrees.push(altTree);
}
}
if (!altTrees.length) {
return;
}
else if (branch.todoList.length) {
altTrees.push(tree);
}
var curTreeIndex = prover.curAlternativeIndex;
prover.alternatives.splice(curTreeIndex, 1);
if (altTrees.length) {
do {
var newTree = altTrees.shift();
prover.useTree(newTree, curTreeIndex);
prover.pruneAlternatives(newTree);
} while (newTree.removed && altTrees.length);
if (altTrees.length) {
prover.storeAlternatives(altTrees);
}
}
}
Prover.literal.priority = 0;
Prover.literal.toString = function() { return 'literal' };
Prover.equalityReasoner = function(branch, equalityProblem) {
var newProblems = equalityProblem.nextStep();
if (newProblems.length == 0) {
if (!branch.todoList[0]) {
branch.tree.prover.discardCurrentAlternative();
}
return;
}
var tree = branch.tree;
var prover = tree.prover;
var altTrees = [];
var localTree = null;
while (newProblems.length && !newProblems[0].nextStep) {
var solution = newProblems.shift();
var substitution = solution.getSubstitution();
var altTree = tree.copy();
altTree.openBranches[0].closeWithEquality(solution);
altTree.closeCloseableBranches();
if (altTree.openBranches.length == 0) {
prover.useTree(altTree);
return;
}
if (!localTree) {
if (!branch.unifierAffectsOtherBranches(substitution)) {
localTree = altTree;
}
else {
altTrees.push(altTree);
}
}
}
if (localTree) {
prover.useTree(localTree);
prover.pruneAlternatives(localTree);
return;
}
if (newProblems.length) {
var newTasks = newProblems.map(function(p) {
return Prover.makeTodoItem(Prover.equalityReasoner, p);
});
branch.todoList.extend(newTasks);
}
if (!altTrees.length) {
return;
}
else if (branch.todoList.length) {
altTrees.push(tree);
}
var curTreeIndex = prover.curAlternativeIndex;
prover.alternatives.splice(curTreeIndex, 1);
if (altTrees.length) {
do {
var newTree = altTrees.shift();
prover.useTree(newTree, curTreeIndex);
prover.pruneAlternatives(newTree);
} while (newTree.removed && altTrees.length);
if (altTrees.length) {
prover.storeAlternatives(altTrees);
}
}
}
Prover.equalityReasoner.priority = 0;
Prover.equalityReasoner.toString = function() { return 'equality' }
Prover.reflexivity = function(branch, nodeList) {
if (nodeList.length == 0) {
var worldName = branch.tree.parser.w;
}
else {
var worldName = nodeList[0].formula.terms[1];
}
var R = branch.tree.parser.R;
var formula = new AtomicFormula(R, [worldName, worldName]);
var newNode = new Node(formula, Prover.reflexivity, nodeList || []);
branch.addNode(newNode);
}
Prover.reflexivity.priority = 3;
Prover.reflexivity.needsPremise = false;
Prover.reflexivity.premiseCanBeReflexive = false;
Prover.reflexivity.toString = function() { return 'reflexivity' }
Prover.symmetry = function(branch, nodeList) {
var nodeFormula = nodeList[0].formula;
var R = branch.tree.parser.R;
var formula = new AtomicFormula(R, [nodeFormula.terms[1], nodeFormula.terms[0]]);
var newNode = new Node(formula, Prover.symmetry, nodeList);
branch.addNode(newNode);
}
Prover.symmetry.priority = 3;
Prover.symmetry.needsPremise = true;
Prover.symmetry.premiseCanBeReflexive = false;
Prover.symmetry.toString = function() { return 'symmetry' }
Prover.euclidity = function(branch, nodeList) {
var node = nodeList[0];
var nodeFla = node.formula;
var flaStrings = branch.nodes.map(function(n) {
return n.formula.string;
});
var R = branch.tree.parser.R;
for (var i=0; i<branch.nodes.length; i++) {
var earlierFla = branch.nodes[i].formula;
if (earlierFla.predicate != R) continue;
if (earlierFla.terms[0] == nodeFla.terms[0]) {
var newFla;
if (!flaStrings.includes(R + earlierFla.terms[1] + nodeFla.terms[1])) {
newFla = new AtomicFormula(R, [earlierFla.terms[1], nodeFla.terms[1]]);
}
else if (!flaStrings.includes(R + nodeFla.terms[1] + earlierFla.terms[1])) {
newFla = new AtomicFormula(R, [nodeFla.terms[1], earlierFla.terms[1]]);
}
if (newFla) {
var newNode = new Node(newFla, Prover.euclidity, [branch.nodes[i], node]);
if (branch.addNode(newNode)) {
branch.todoList.unshift(Prover.makeTodoItem(Prover.euclidity, nodeList, 0));
return;
}
}
}
if (branch.nodes[i] == node) break;
}
}
Prover.euclidity.priority = 3;
Prover.euclidity.needsPremise = true;
Prover.euclidity.premiseCanBeReflexive = false;
Prover.euclidity.toString = function() { return 'euclidity' }
Prover.transitivity = function(branch, nodeList) {
var R = branch.tree.parser.R;
var node = nodeList[0];
var nodeFla = node.formula;
for (var i=0; i<branch.nodes.length; i++) {
var earlierFla = branch.nodes[i].formula;
if (earlierFla.predicate != R) continue;
var newFla = null;
if (earlierFla.terms[1] == nodeFla.terms[0]) {
newFla = new AtomicFormula(R, [earlierFla.terms[0], nodeFla.terms[1]]);
}
else if (earlierFla.terms[0] == nodeFla.terms[1]) {
newFla = new AtomicFormula(R, [nodeFla.terms[0], earlierFla.terms[1]]);
}
if (newFla) {
var newNode = new Node(newFla, Prover.transitivity, [branch.nodes[i], node]);
if (branch.addNode(newNode)) {
branch.todoList.unshift(Prover.makeTodoItem(Prover.transitivity, nodeList, 0));
return;
}
}
if (branch.nodes[i] == node) break;
}
}
Prover.transitivity.priority = 3;
Prover.transitivity.needsPremise = true;
Prover.transitivity.premiseCanBeReflexive = false;
Prover.transitivity.toString = function() { return 'transitivity' }
Prover.seriality = function(branch, nodeList) {
var R = branch.tree.parser.R;
if (nodeList.length == 0) {
var oldWorld = branch.tree.parser.w;
}
else {
var oldWorld = nodeList[0].formula.terms[1];
}
for (var i=0; i<branch.nodes.length-1; i++) {
var earlierFla = branch.nodes[i].formula;
if (earlierFla.predicate == R && earlierFla.terms[0] == oldWorld) {
return;
}
}
var newWorld = branch.tree.newWorldName();
var newFla = new AtomicFormula(R, [oldWorld, newWorld]);
var newNode = new Node(newFla, Prover.seriality, []);
branch.addNode(newNode);
}
Prover.seriality.priority = 10;
Prover.seriality.needsPremise = false;
Prover.seriality.premiseCanBeReflexive = false;
Prover.seriality.toString = function() { return 'seriality' }
Prover.makeTodoItem = function(nextRule, args, priority) {
return {
nextRule: nextRule,
priority: priority || nextRule.priority,
args: args
}
}
function Tree(prover) {
if (!prover) return;
this.prover = prover;
this.parser = prover.parser;
this.openBranches = [new Branch(this)];
this.closedBranches = [];
this.numNodes = 0;
this.skolemSymbols = [];
this.string = "";
this.priority = 0;
}
Tree.prototype.addInitNodes = function(initFormulasNormalized) {
var initBranch = this.openBranches[0];
for (var i=0; i<initFormulasNormalized.length; i++) {
var node = new Node(initFormulasNormalized[i]);
initBranch.addNode(node);
initBranch.tryClose(node);
}
}
Tree.prototype.closeBranch = function(branch, complementary1, complementary2) {
branch.closed = true;
branch.todoList = [];
this.markUsedNodes(branch, complementary1, complementary2);
this.openBranches.remove(branch);
this.closedBranches.push(branch);
this.pruneBranch(branch, complementary1, complementary2);
this.string = this.openBranches.map(function(b) { return b.string }).join('|');
var priorityBoost = Math.min(1, (this.numNodes-this.priority)/40);
this.priority += priorityBoost*Math.max(1, 4-this.openBranches.length);
}
Tree.prototype.markUsedNodes = function(branch, complementary1, complementary2) {
var ancestors = [complementary1, complementary2];
var n;
while ((n = ancestors.shift())) {
if (n.used.indexOf(branch.id) == -1) {
n.used += branch.id;
for (var i=0; i<n.fromNodes.length; i++) {
ancestors.push(n.fromNodes[i]);
}
}
}
}
Tree.prototype.pruneBranch = function(branch, complementary1, complementary2) {
var obranches = this.openBranches.concat(this.closedBranches);
obranches.remove(branch);
for (var i=branch.nodes.length-1; i>0; i--) {
for (var j=0; j<obranches.length; j++) {
if (obranches[j].nodes[i] &&
obranches[j].nodes[i] != branch.nodes[i] &&
obranches[j].nodes[i].expansionStep == branch.nodes[i].expansionStep) {
if (branch.nodes[i].used) {
if (!obranches[j].closed) return;
}
else {
if (obranches[j].closed) {
this.closedBranches.remove(obranches[j]);
for (var k=0; k<i; k++) {
branch.nodes[k].used = branch.nodes[k].used.replace(obranches[j].id, '');
}
}
else {
this.openBranches.remove(obranches[j]);
obranches[j].removed = true;
}
this.numNodes -= (obranches[j].nodes.length - i);
}
}
}
if (!this.nodeIsUsed(branch.nodes[i])) {
this.removeNode(branch, i);
}
}
}
Tree.prototype.nodeIsUsed = function(node) {
if (node.used) return true;
var branches = this.openBranches.concat(this.closedBranches);
for (var i=0; i<branches.length; i++) {
for (var j=0; j<branches[i].nodes.length; j++) {
if (branches[i].nodes[j].expansionStep == node.expansionStep
&& branches[i].nodes[j].used) {
return true;
}
}
}
return false;
}
Tree.prototype.removeNode = function(branch, index) {
var node = branch.nodes[index];
var branches = this.openBranches.concat(this.closedBranches);
for (var i=0; i<branches.length; i++) {
if (branches[i].nodes[index] == node) {
branches[i].nodes.splice(index,1);
}
if (node.type == 'literal') {
branches[i].literals.remove(node);
}
}
this.numNodes--;
}
Tree.prototype.closeCloseableBranches = function() {
var openBranches = this.openBranches.copy();
var numOpenBranches = openBranches.length;
for (var k=0; k<openBranches.length; k++) {
var branch = openBranches[k];
if (branch.removed) continue;
N1LOOP:
for (var i=branch.nodes.length-1; i>=0; i--) {
var n1 = branch.nodes[i];
if (n1.formula.sub && n1.formula.sub.predicate == '='
&& [n1.formula.sub.terms[0]].equals([n1.formula.sub.terms[1]])) {
this.closeBranch(branch, n1, n1);
break N1LOOP;
}
var n1negated = (n1.formula.operator == '??');
for (var j=i-1; j>=0; j--) {
var n2 = branch.nodes[j];
if (n2.formula.operator == '??') {
if (n2.formula.sub.equals(n1.formula)) {
this.closeBranch(branch, n1, n2);
break N1LOOP;
}
}
else if (n1negated && n1.formula.sub.equals(n2.formula)) {
this.closeBranch(branch, n1, n2);
break N1LOOP;
}
}
}
}
}
Tree.prototype.getNumNodes = function() {
try {
return this.openBranches[0].todoList[0].args.newNodes.length +
this.numNodes;
}
catch {
return this.numNodes;
}
}
Tree.prototype.copy = function() {
var ntree = new Tree();
var nodemap = {}
ntree.prover = this.prover;
ntree.parser = this.parser;
ntree.numNodes = this.numNodes;
ntree.skolemSymbols = this.skolemSymbols.copy();
ntree.openBranches = [];
for (var i=0; i<this.openBranches.length; i++) {
ntree.openBranches.push(copyBranch(this.openBranches[i]));
}
ntree.closedBranches = [];
for (var i=0; i<this.closedBranches.length; i++) {
ntree.closedBranches.push(copyBranch(this.closedBranches[i]));
}
ntree.string = this.string;
ntree.priority = this.priority;
return ntree;
function copyBranch(orig) {
var nodes = [];
var literals = [];
var todoList = [];
for (var i=0; i<orig.nodes.length; i++) {
nodes.push(copyNode(orig.nodes[i]));
}
for (var i=0; i<orig.literals.length; i++) {
literals.push(nodemap[orig.literals[i].id]);
}
for (var i=0; i<orig.todoList.length; i++) {
var todo = {
nextRule: orig.todoList[i].nextRule,
priority: orig.todoList[i].priority
};
if (orig.todoList[i].args.equations) {
var eqProb = orig.todoList[i].args.copy();
eqProb.terms1Node = nodemap[eqProb.terms1Node.id];
eqProb.terms2Node = nodemap[eqProb.terms2Node.id];
eqProb.equations = eqProb.equations.map(function(n){ return nodemap[n.id] });
todo.args = eqProb;
}
else {
todo.args = orig.todoList[i].args.map(function(n) { return nodemap[n.id] });
}
todoList.push(todo);
}
var b = new Branch(ntree, nodes, literals,
orig.freeVariables.copy(),
todoList, orig.closed);
b.id = orig.id;
b.string = orig.string;
return b;
}
function copyNode(orig) {
if (nodemap[orig.id]) return nodemap[orig.id];
var n = new Node();
n.formula = orig.formula;
n.fromRule = orig.fromRule;
n.fromNodes = [];
for (var i=0; i<orig.fromNodes.length; i++) {
n.fromNodes.push(nodemap[orig.fromNodes[i].id]);
}
n.type = orig.type;
n.expansionStep = orig.expansionStep;
n.used = orig.used;
n.id = orig.id;
n.instanceTerm = orig.instanceTerm;
nodemap[orig.id] = n;
return n;
}
}
Tree.prototype.applySubstitution = function(sub) {
var branches = this.openBranches.concat(this.closedBranches);
for (var i=0; i<sub.length; i+=2) {
var nodeProcessed = {};
for (var b=0; b<branches.length; b++) {
for (var n=branches[b].nodes.length-1; n>=0; n--) {
var node = branches[b].nodes[n];
if (nodeProcessed[node.id]) break;
node.formula = node.formula.substitute(sub[i], sub[i+1]);
if (node.instanceTerm) {
node.instanceTerm = Formula.substituteInTerm(node.instanceTerm, sub[i], sub[i+1]);
}
nodeProcessed[node.id] = true;
}
branches[b].freeVariables.remove(sub[i]);
}
}
for (var b=0; b<this.openBranches.length; b++) {
this.openBranches[b].string = this.openBranches[b].nodes.map(function(n){
return n.formula.string
}).join(',');
}
this.string = this.openBranches.map(function(b) { return b.string }).join('|');
}
Tree.prototype.newFunctionSymbol = function(isWorldTerm) {
var sym = isWorldTerm ? '??' : '??';
var res = sym+'1';
for (var i=this.skolemSymbols.length-1; i>=0; i--) {
if (this.skolemSymbols[i][0] == sym) {
res = sym+(this.skolemSymbols[i].substr(1)*1+1);
break;
}
}
this.skolemSymbols.push(res);
return res;
}
Tree.prototype.newWorldName = function() {
return this.newFunctionSymbol(true);
}
Tree.prototype.toString = function() {
for (var i=0; i<this.closedBranches.length; i++) {
this.closedBranches[i].nodes[this.closedBranches[i].nodes.length-1].__markClosed = true;
}
var branches = this.closedBranches.concat(this.openBranches);
var res = "<table><tr><td align='center' style='font-family:monospace'>" +
getTree(branches[0].nodes[0])+"</td</tr></table>";
for (var i=0; i<this.closedBranches.length; i++) {
delete this.closedBranches[i].nodes[this.closedBranches[i].nodes.length-1].__markClosed;
}
res += "  todo: "+(this.openBranches[0] && this.openBranches[0].todoList.map(function(t) {
return Object.values(t); }).join(', '))+"<br>";
res += "  search depth: "+this.getNumNodes()+"-"+this.priority+"<br>";
return res;
function getTree(node) {
var recursionDepth = arguments[1] || 0;
if (++recursionDepth > 100) return "<b>...<br>[max recursion]</b>";
var children = [];
for (var i=0; i<branches.length; i++) {
for (var j=0; j<branches[i].nodes.length; j++) {
if (branches[i].nodes[j-1] != node) continue;
if (!children.includes(branches[i].nodes[j])) {
children.push(branches[i].nodes[j]);
}
}
}
var nodestr = node.toString().replace(/(??\d+)(\(.+?\))(?!\)|,)/g, function(m,p1,p2) {
var res = p1;
var extraClosed = (m.match(/\)/g) || []).length - (m.match(/\(/g) || []).length;
for (var i=0; i<extraClosed; i++) res += ')';
return res;
});
var res = node.used + ' ' + nodestr + (node.__markClosed ? "<br>x<br>" : "<br>");
if (children[1]) {
var tdStyle = "font-family:monospace; border-top:1px solid #999; padding:3px; border-right:1px solid #999";
var td = "<td align='center' valign='top' style='" + tdStyle + "'>";
res += "<table><tr>"+ td + getTree(children[0], recursionDepth) +"</td>\n"
+ td + getTree(children[1], recursionDepth) + "</td>\n</tr></table>";
}
else if (children[0]) res += getTree(children[0], recursionDepth);
return res;
}
}
function Branch(tree, nodes, literals, freeVariables, todoList, closed) {
this.tree = tree;
this.nodes = nodes || [];
this.literals = literals || [];
this.freeVariables = freeVariables || [];
this.todoList = todoList || [];
this.closed = closed || false;
this.id = 'b'+(Branch.counter++)+'.';
this.string = '';
}
Branch.counter = 0;
Branch.prototype.newVariable = function(isWorldTerm) {
var sym = isWorldTerm ? '??' : '??';
var res = sym+'1';
for (var i=this.freeVariables.length-1; i>=0; i--) {
if (this.freeVariables[i][0] == sym) {
res = sym+(this.freeVariables[i].substr(1)*1+1);
break;
}
}
this.freeVariables.push(res);
return res;
}
Branch.prototype.tryClose = function(node, dontPrune) {
var complFormula = (node.formula.operator == '??') ? node.formula.sub : node.formula.negate();
var complNode;
for (var i=0; i<this.nodes.length; i++) {
if (this.nodes[i].formula.equals(complFormula)) {
if (this.nodes[i].used || !complNode) {
complNode = this.nodes[i];
if (complNode.used) break;
}
}
}
if (complNode) {
this.tree.closeBranch(this, node, complNode);
if (!dontPrune) {
this.tree.prover.pruneAlternatives(this.tree);
}
return true;
}
return false;
}
Branch.prototype.unifierAffectsOtherBranches = function(unifier) {
for (var j=0; j<this.tree.openBranches.length; j++) {
var branch = this.tree.openBranches[j];
if (branch == this) continue;
for (var i=0; i<unifier.length; i+=2) {
if (branch.freeVariables.includes(unifier[i])) return true;
}
}
return false;
}
Branch.prototype.closeWithEquality = function(solution) {
for (var i=0; i<solution.newNodes.length; i++) {
var node = solution.newNodes[i].copy();
var nf0 = node.fromNodes[0];
var nf1 = node.fromNodes[1];
node.fromNodes[0] = this.getNodeById(node.fromNodes[0].id);
node.fromNodes[1] = this.getNodeById(node.fromNodes[1].id);
this.addNode(node, true);
node.expansionStep = this.tree.prover.step - solution.newNodes.length + i + 1;
}
var subs = solution.getSubstitution();
this.tree.applySubstitution(subs);
var closingNode1 = this.getNodeById(solution.terms1Node.id);
var closingNode2 = this.getNodeById(solution.terms2Node.id);
this.tree.closeBranch(this, closingNode1, closingNode2);
return;
}
Branch.prototype.getNodeById = function(id) {
for (var i=this.literals.length-1; i>=0; i--) {
if (this.literals[i].id == id) return this.literals[i];
}
}
Branch.prototype.copy = function() {
var res = new Branch(this.tree,
this.nodes.copy(),
this.literals.copy(),
this.freeVariables.copy(),
this.todoList.copy(),
this.closed);
res.string = this.string;
return res;
}
Branch.prototype.addNode = function(node, dontSkip) {
var addToTodo = true;
if (this.containsFormula(node.formula)) {
if (dontSkip) addToTodo = false;
else return null;
}
this.nodes.push(node);
this.string += (this.string ? ',' : '')+node.formula.string;
this.tree.string = this.tree.openBranches.map(function(b) { return b.string }).join('|');
this.tree.numNodes++;
if (node.type == 'literal') {
this.literals.push(node);
}
if (!this.closed && addToTodo) {
this.expandTodoList(node);
}
node.expansionStep = this.tree.prover.step;
return node;
}
Branch.prototype.containsFormula = function(formula) {
for (var i=0; i<this.nodes.length; i++) {
if (this.nodes[i].formula.string == formula.string) return true;
}
return false;
}
Branch.prototype.expandTodoList = function(node) {
var todo = node.getExpansionTask();
if (todo.nextRule == Prover.literal &&
this.todoList[0] && this.todoList[0].nextRule == Prover.literal) {
this.todoList[0].args.push(node);
}
else {
for (var i=0; i<this.todoList.length; i++) {
if (todo.priority <= this.todoList[i].priority) break;
}
this.todoList.insert(todo, i);
}
if (this.tree.parser.isModal) {
if (this.nodes.length == 1) {
this.addAccessibilityRuleApplications();
}
else if (node.formula.predicate == this.tree.parser.R) {
this.addAccessibilityRuleApplications(node);
}
}
}
Branch.prototype.addAccessibilityRuleApplications = function(node) {
for (var i=0; i<this.tree.prover.accessibilityRules.length; i++) {
var rule = this.tree.prover.accessibilityRules[i];
var pos = this.todoList.length;
while (pos > 0 && this.todoList[pos-1].priority >= rule.priority) pos--;
if (node) {
if (node.formula.terms[0] != node.formula.terms[1]
|| rule.premiseCanBeReflexive) {
this.todoList.insert(Prover.makeTodoItem(rule, [node]), pos);
}
}
else {
if (!rule.needsPremise) {
this.todoList.insert(Prover.makeTodoItem(rule, []), pos);
}
}
}
}
Branch.prototype.getClosingUnifiers = function(node) {
var nodeAtom = node.formula.sub || node.formula;
var unifiersHash = {};
for (var i=this.literals.length-1; i>=0; i--) {
var otherNode = this.literals[i];
if (otherNode == node) continue;
if (!otherNode.formula.sub == !node.formula.sub) continue;
var otherAtom = otherNode.formula.sub || otherNode.formula;
if (otherAtom.predicate != nodeAtom.predicate) continue;
var u = Formula.unifyTerms(nodeAtom.terms, otherAtom.terms);
if (u.isArray) {
unifiersHash[u.toString()] = u;
}
}
if (nodeAtom.predicate == '=' && node.formula.sub) {
var u = Formula.unifyTerms([nodeAtom.terms[0]], [nodeAtom.terms[1]]);
if (u.isArray) {
unifiersHash[u.toString()] = u;
}
}
return Object.values(unifiersHash);
}
Branch.prototype.createEqualityProblems = function(nodes) {
nodes = nodes.filter(function(n) {
return !(n.formula.predicate == '='
&& n.formula.terms[0].toString() == n.formula.terms[1].toString());
});
for (var i=0; i<nodes.length; i++) {
if (nodes[i].formula.predicate == '=') {
var recNodes = this.literals.filter(function(lit) {
return lit.formula.sub;
});
return this.createEqualityProblems(recNodes);
}
}
var res = [];
for (var i=0; i<nodes.length; i++) {
var node = nodes[i];
if (node.formula.sub && node.formula.sub.predicate == '=') {
var prob = this.createEqualityProblem(node, node)
if (prob) res.push(prob);
}
else {
for (var j=0; j<this.literals.length; j++) {
var lit = this.literals[j];
if ((node.formula.sub && lit.formula.predicate == node.formula.sub.predicate) ||
(lit.formula.sub && node.formula.predicate == lit.formula.sub.predicate)) {
var prob = this.createEqualityProblem(node, lit);
if (prob) res.push(prob);
}
}
}
}
return res;
}
Branch.prototype.createEqualityProblem = function(node1, node2) {
var equations = this.literals.filter(function(n) {
return n.formula.predicate == '='
&& ![n.formula.terms[0]].equals([n.formula.terms[1]]);
});
if (!equations.length) return null;
equations.reverse();
var prob = new EqualityProblem();
prob.init(equations, node1, node2);
return prob;
}
Branch.prototype.toString = function() {
return this.string;
}
function Node(formula, fromRule, fromNodes) {
if (!formula) return;
this.formula = formula;
this.type = formula.type;
this.id = Node.counter++;
this.fromRule = fromRule || null;
this.fromNodes = fromNodes || [];
this.used = '';
}
Node.counter = 0;
Node.prototype.getExpansionTask = function() {
var todo = {
nextRule: Prover[this.type],
priority: Prover[this.type].priority,
args: [this]
}
if (this.type == 'gamma' && this.formula.string.includes('???')) {
todo.priority -= 0.5;
}
else if (this.type == 'modalGamma' && this.formula.string.includes('???')) {
todo.priority -= 0.5;
}
return todo;
}
Node.prototype.copy = function() {
var res = new Node();
res.formula = this.formula;
res.fromRule = this.fromRule;
res.fromNodes = this.fromNodes.copy();
res.type = this.type;
res.id = this.id;
res.used = this.used;
return res;
}
Node.prototype.toString = function() {
return this.formula.toString();
}

function EqualityProblem(equationNodes) {
this.terms1 = null;
this.terms2 = null;
this.terms1Node = null;
this.terms2Node = null;
this.equations = [];
this.constraint = arguments[0] || new SubstitutionConstraint();
this.newNodes = [];
this.nextStep = this.start;
this.lastStep = null;
this.lrbsIndex = -1;
}
EqualityProblem.prototype.init = function(equationNodes, goalNode1, goalNode2) {
this.equations = equationNodes;
this.terms1Node = goalNode1;
this.terms2Node = goalNode2;
if (goalNode1 == goalNode2) {
this.terms1 = [goalNode1.formula.sub.terms[0]];
this.terms2 = [goalNode1.formula.sub.terms[1]];
}
else if (goalNode1.formula.sub) {
this.terms1 = goalNode1.formula.sub.terms;
this.terms2 = goalNode2.formula.terms;
}
else {
this.terms1 = goalNode1.formula.terms;
this.terms2 = goalNode2.formula.sub.terms;
}
}
EqualityProblem.prototype.addSkolemConstraints = function(terms) {
for (var i=0; i<terms.length; i++) {
if (!terms[i].isArray) continue;
if (terms[i][0][0] == '??' || terms[i][0][0] == '??') {
terms[i][0][0].isSkolemTerm = true;
var fvs = getVariablesInTermList(terms[i]);
for (var j=0; j<fvs.length; j++) {
this.constraint.addGreater(terms[i], fvs[j]);
}
}
}
}
function getVariablesInTermList(terms) {
var res = [];
var dupe = {};
for (var i=0; i<terms.length; i++) {
if (terms[i].isArray) {
res.extendNoDuplicates(getVariablesInTermList(terms[i]));
}
else if ((terms[i][0] == '??' || terms[i][0] == '??') && !dupe[terms[i]]) {
dupe[terms[i]] = true;
res.push(terms[i]);
}
}
return res;
}
EqualityProblem.prototype.start = function() {
return this.tryRrbs();
}
EqualityProblem.prototype.tryRrbs = function() {
var equations = this.lastStep == this.tryLrbs ?
[this.equations[this.lrbsIndex]] : this.equations;
var schedule = [];
for (var i=0; i<this.terms1.length; i++) {
var nc = this.constraint.tryAddEqual(this.terms1[i], this.terms2[i]);
if (nc && nc == this.constraint) {
continue;
}
for (var sIsTerms1=1; sIsTerms1>=0; sIsTerms1--) {
var s = sIsTerms1 ? this.terms1 : this.terms2;
var t = sIsTerms1 ? this.terms2 : this.terms1;
var fconstraint = this.constraint.tryAddGreater(s[i],t[i]);
if (!fconstraint) continue;
var siSubterms = subterms(s[i]);
for (var ei=0; ei<equations.length; ei++) {
for (var lIsLHS=1; lIsLHS>=0; lIsLHS--) {
var l = equations[ei].formula.terms[lIsLHS ? 0 : 1];
var r = equations[ei].formula.terms[lIsLHS];
var sconstraint = fconstraint.tryAddGreater(l,r);
if (!sconstraint) continue;
for (var j=0; j<siSubterms.length; j++) {
var p = siSubterms[j];
var tconstraint = sconstraint.tryAddEqual(l,p)
if (!tconstraint) continue;
var new_sis = replaceSubterm(s[i], p, r);
for (var g=0; g<new_sis.length; g++) {
var newProblem = this.copy(tconstraint);
newProblem.applyLLtoGoal(i, sIsTerms1, new_sis[g], equations[ei]);
newProblem.lastStep = this.tryRrbs;
if (newProblem.tryEr()) {
newProblem.nextStep = null;
schedule.unshift(newProblem);
}
else {
newProblem.nextStep = this.tryRrbs;
schedule.push(newProblem);
}
}
}
}
}
}
}
this.nextStep = this.tryLrbs;
schedule.push(this);
return schedule.removeDuplicates();
}
EqualityProblem.prototype.tryLrbs = function() {
var schedule = [];
for (var j=0; j<this.equations.length; j++) {
for (var sIsLHS=1; sIsLHS>=0; sIsLHS--) {
var s = this.equations[j].formula.terms[sIsLHS ? 0 : 1];
var t = this.equations[j].formula.terms[sIsLHS];
var fconstraint = this.constraint.tryAddGreater(s,t);
if (!fconstraint) continue;
var sourceEquations = (j <= this.lrbsIndex) ?
[this.equations[this.lrbsIndex]] : this.equations;
for (var i=0; i<sourceEquations.length; i++) {
for (var lIsLHS=1; lIsLHS>=0; lIsLHS--) {
var l = sourceEquations[i].formula.terms[lIsLHS ? 0 : 1];
var r = sourceEquations[i].formula.terms[lIsLHS];
var sconstraint = fconstraint.tryAddGreater(l,r);
if (!sconstraint) continue;
var sSubterms = subterms(s);
for (var k=0; k<sSubterms.length; k++) {
var p = sSubterms[k];
var tconstraint = sconstraint.tryAddEqual(l,p);
if (!tconstraint) continue;
var new_ss = replaceSubterm(s, p, r);
for (var g=0; g<new_ss.length; g++) {
var new_s = new_ss[g];
if (new_s.toString() == t.toString()) continue;
var newProblem = this.copy(tconstraint);
newProblem.applyLLtoEquation(j, sIsLHS, new_ss[g], sourceEquations[i]);
newProblem.lrbsIndex = j;
newProblem.lastStep = newProblem.tryLrbs;
newProblem.nextStep = newProblem.tryRrbs;
schedule.push(newProblem);
}
}
}
}
}
}
return schedule.removeDuplicates();
}
EqualityProblem.prototype.tryEr = function() {
var con = this.constraint;
for (var i=0; i<this.terms1.length; i++) {
con = con.tryAddEqual(this.terms1[i], this.terms2[i]);
if (!con) return false;
}
this.constraint = con;
return true;
}
EqualityProblem.prototype.applyLLtoGoal = function(i, sIsTerms1, new_si, equation) {
if (sIsTerms1) {
this.terms1 = this.terms1.copy();
this.terms1.splice(i, 1, new_si);
}
else {
this.terms2 = this.terms2.copy();
this.terms2.splice(i, 1, new_si);
}
if (this.terms1Node == this.terms2Node) {
var newFormula = new AtomicFormula('=', [this.terms1[0], this.terms2[0]]).negate();
var newNode = new Node(newFormula,
Prover.equalityReasoner,
[equation, this.terms1Node]
);
this.newNodes.push(newNode);
this.terms1Node = newNode;
this.terms2Node = newNode;
}
else {
var targetNode = sIsTerms1 ? this.terms1Node : this.terms2Node;
var targetAtom = targetNode.formula.sub || targetNode.formula;
var newFormula = new AtomicFormula(targetAtom.predicate,
sIsTerms1 ? this.terms1 : this.terms2);
if (targetNode.formula.sub) newFormula = newFormula.negate();
var newNode = new Node(newFormula,
Prover.equalityReasoner,
[equation, targetNode]
);
this.newNodes.push(newNode);
if (sIsTerms1) this.terms1Node = newNode;
else this.terms2Node = newNode;
}
}
EqualityProblem.prototype.applyLLtoEquation = function(j, sIsLHS, new_s, sourceEq) {
var targetEq = this.equations[j];
var newFormula = new AtomicFormula('=', [
sIsLHS ? new_s : targetEq.formula.terms[0],
sIsLHS ? targetEq.formula.terms[1] : new_s
]);
var newNode = new Node(newFormula,
Prover.equalityReasoner,
[sourceEq, targetEq]
);
this.newNodes.push(newNode);
this.equations = this.equations.copy();
this.equations.splice(j, 1, newNode);
}
EqualityProblem.prototype.getSubstitution = function() {
var sdict = this.constraint.solvedForms[0].solvedDict;
var res = [];
for (var v1 in sdict) {
res.push(v1, sdict[v1]);
}
return res;
}
EqualityProblem.prototype.deskolemize = function(node) {
var res = new Node();
res.id = node.id;
var atom = node.formula.sub || node.formula;
var newTerms = [];
for (var i=0; i<atom.terms.length; i++) {
if (atom.terms[i].isArray &&
(atom.terms[i][0][0] == '??' || atom.terms[i][0][0] == '??')
){}
}
var fvs = node.formula.getFreeVariables();
var newFormula = new AtomicFormula
}
EqualityProblem.prototype.copy = function(constraint) {
var res = new EqualityProblem(constraint || this.constraint);
res.terms1 = this.terms1;
res.terms2 = this.terms2;
res.equations = this.equations;
res.terms1Node = this.terms1Node;
res.terms2Node = this.terms2Node;
res.newNodes = this.newNodes.copy();
res.lastStep = this.lastStep;
res.nextStep = this.nextStep;
res.lrbsIndex = this.lrbsIndex;
return res;
}
EqualityProblem.prototype.toString = function() {
var nextStepStr = this.nextStep==this.tryRrbs ? 'rrbs' :
this.nextStep==this.tryLrbs ? 'lrbs' :
this.nextStep==this.tryEr ? 'er' :
this.nextStep==this.start ? 'start' :
this.nextStep==null ? '' : '???';
return '&lt;' + this.equations + ' ??? ' + this.terms1 + '=' + this.terms2
+ ' (' + this.constraint + ') *' + nextStepStr + '&gt;';
}
function subterms(term) {
if (term.isArray) {
if (term[0][0] == '??' || term[0][0] == '??') {
return [term];
}
var res = [term];
for (var i=1; i<term.length; i++) {
res.extendNoDuplicates(subterms(term[i]));
}
return res;
}
if (term[0] == '??' || term[0] == '??') return [];
return [term];
}
function replaceSubterm(term, sub, repl) {
var subStr = sub.toString();
if (term.toString() == subStr) return [repl];
if (!term.isArray || term[0][0] == '??' || term[0][0] == '??') return [];
var res = [];
for (var i=1; i<term.length; i++) {
var newSubterms = replaceSubterm(term[i], sub, repl);
for (var j=0; j<newSubterms.length; j++) {
var newTerm = term.copy()
newTerm.splice(i, 1, newSubterms[j]);
res.push(newTerm);
}
}
return res;
}
function SubstitutionConstraint(equalities, inequalities, solvedForms) {
this.equalities = equalities || [];
this.inequalities = inequalities || [];
this.solvedForms = solvedForms || [new SolvedForm()];
}
SubstitutionConstraint.prototype.tryAddEqual = function(s, t) {
var sfChanged = false;
var sfs = [];
for (var i=0; i<this.solvedForms.length; i++) {
var sf = this.solvedForms[i].addEqual(s,t);
if (sf.length != 1 || !sf[0].equals(this.solvedForms[i])) sfChanged = true;
sfs.extendNoDuplicates(sf);
}
if (sfs.length == 0) {
return null;
}
if (sfChanged) {
var newEqualities = this.equalities.copy();
newEqualities.push(s+'='+t);
return new SubstitutionConstraint(newEqualities, this.inequalities, sfs);
}
else {
return this;
}
}
SubstitutionConstraint.prototype.tryAddGreater = function(s, t) {
var sfChanged = false;
var sfs = [];
for (var i=0; i<this.solvedForms.length; i++) {
var sfa = this.solvedForms[i].addGreater(s,t);
if (sfa.length != 1 || !sfa[0].equals(this.solvedForms[i])) sfChanged = true;
sfs.extendNoDuplicates(sfa);
}
if (sfs.length == 0) {
return null;
}
if (sfChanged) {
var newInequalities = this.inequalities.copy();
newInequalities.push(s+'>'+t);
return new SubstitutionConstraint(this.equalities, newInequalities, sfs);
}
else {
return this;
}
}
SubstitutionConstraint.prototype.toString = function() {
return this.equalities.join(' ')+' '+this.inequalities.join(' ');
}
function SolvedForm() {
this.solvedDict = {};
this.solvedDictStr = [];
this.inequalities = [];
this.inequalitiesStr = [];
}
SolvedForm.prototype.addEqual = function(s, t) {
var sStr = s.toString();
var tStr = t.toString();
for (var v in this.solvedDict) {
if (sStr.includes(v)) {
s = Formula.substituteInTerm(s, v, this.solvedDict[v]);
sStr = s.toString();
}
if (tStr.includes(v)) {
t = Formula.substituteInTerm(t, v, this.solvedDict[v]);
tStr = t.toString();
}
}
if (sStr == tStr) {
return [this];
}
if (sStr[0] == '??' || sStr[0] == '??') {
if (this.occursCheckStr(sStr,tStr)) {
return [];
}
else {
return this.addSubs(s,t);
}
}
else if (tStr[0] == '??' || tStr[0] == '??') {
return this.addEqual(t,s);
}
else if (s.isArray && t.isArray) {
if (s[0] != t[0]) {
return [];
}
var res = [this];
for (var i=1; i<s.length; i++) {
var newRes = [];
for (var j=0; j<res.length; j++) {
newRes.extendNoDuplicates(res[j].addEqual(s[i],t[i]));
}
res = newRes;
}
return res;
}
else return [];
}
SolvedForm.prototype.addSubs = function(v, t) {
var sf = new SolvedForm();
for (v2 in this.solvedDict) {
sf.solvedDict[v2] = Formula.substituteInTerm(this.solvedDict[v2], v, t);
sf.solvedDictStr.push(v2+'='+sf.solvedDict[v2]);
}
sf.solvedDict[v] = t;
sf.solvedDictStr.push(v+'='+t);
sf.solvedDictStr.sort();
var res = [sf];
for (var i=0; i<this.inequalities.length; i++) {
var ineq = this.inequalities[i];
var newRes = [];
for (var j=0; j<res.length; j++) {
newRes.extendNoDuplicates(res[j].addGreater(ineq[0],ineq[1]));
}
res = newRes;
}
return res;
}
SolvedForm.prototype.addGreater = function(s, t) {
var sStr = s.toString();
var tStr = t.toString();
for (var v in this.solvedDict) {
if (sStr.includes(v)) {
s = Formula.substituteInTerm(s, v, this.solvedDict[v]);
sStr = s.toString();
}
if (tStr.includes(v)) {
t = Formula.substituteInTerm(t, v, this.solvedDict[v]);
tStr = t.toString();
}
}
var sIsVar = sStr[0] == '??' || sStr[0] == '??';
var tIsVar = tStr[0] == '??' || tStr[0] == '??';
if (sIsVar || tIsVar) {
if (this.inequalitiesStr.includes(sStr+'>'+tStr)) {
return [this];
}
if (sIsVar && this.occursCheckStr(sStr,tStr)) {
return [];
}
else if (tIsVar && this.occursCheckStr(tStr,sStr)) {
return [this];
}
else {
if (this.inequalitiesStr.includes(tStr+'>'+sStr)) {
return [];
}
var sf = this.copy();
sf.inequalities.push([s,t]);
sf.inequalitiesStr.push(sStr+'>'+tStr);
sf.inequalities.sort();
return [sf];
}
}
var sRoot = s.isArray ? s[0] : s;
var tRoot = t.isArray ? t[0] : t;
if (sRoot > tRoot) {
var res = [this];
if (t.isArray) {
for (var i=1; i<t.length; i++) {
var newRes = [];
for (var j=0; j<res.length; j++) {
newRes.extendNoDuplicates(res[j].addGreater(s,t[i]));
}
res = newRes;
}
}
return res;
}
else if (tRoot > sRoot) {
var res = [];
if (s.isArray) {
for (var i=1; i<s.length; i++) {
res.extendNoDuplicates(this.addEqual(s[i],t));
res.extendNoDuplicates(this.addGreater(s[i],t));
}
}
return res;
}
else {
if (!s.isArray) {
return [];
}
var res = [];
for (var i=1; i<s.length; i++) {
res.extendNoDuplicates(this.addEqual(s[i],t));
res.extendNoDuplicates(this.addGreater(s[i],t));
}
var eq = [this];
for (var i=1; i<s.length; i++) {
var h = [];
for (var j=0; j<eq.length; j++) {
h.extendNoDuplicates(eq[j].addGreater(s[i], t[i], 1));
}
for (var j=i+1; j<s.length; j++) {
var newH = [];
for (var k=0; k<h.length; k++) {
newH.extendNoDuplicates(h[k].addGreater(s[i], t[i], 1));
}
h = newH;
}
res.extendNoDuplicates(h);
var newEq = [];
for (var j=0; j<eq.length; j++) {
newEq.extendNoDuplicates(eq[j].addEqual(s[i], t[i], 1));
}
eq = newEq;
}
return res;
}
}
SolvedForm.prototype.occursCheck = function(v, t) {
if (t[0] == '??' || t[0] == '??') {
return t == v;
}
else if (t.isArray) {
for (var i=1; i<t.length; i++) {
if (this.occursCheck(v, t[i])) return true;
}
}
return false;
}
SolvedForm.prototype.occursCheckStr = function(v, t) {
var ts = t.split(v, 2);
if (ts.length == 2) {
return isNaN(ts[1][0]);
}
return false;
}
SolvedForm.prototype.checkSatisfiable = function() {
return true;
}
SolvedForm.prototype.copy = function() {
var res = new SolvedForm();
for (key in this.solvedDict) {
res.solvedDict[key] = this.solvedDict[key];
}
res.solvedDictStr = this.solvedDictStr.copy();
res.inequalities = this.inequalities.copy();
res.inequalitiesStr = this.inequalitiesStr.copy();
return res;
}
SolvedForm.prototype.equals = function(sf) {
if (this.solvedDictStr.join() != sf.solvedDictStr.join()) return false;
return (this.inequalitiesStr.join() == sf.inequalitiesStr.join());
}
SolvedForm.prototype.toString = function() {
return '{'+this.solvedDictStr.join(' ')+' '+this.inequalitiesStr.join(' ')+'}';
}

function ModelFinder(initFormulas, parser, accessibilityConstraints, s5) {
this.parser = parser;
this.s5 = s5;
if (s5) {
accessibilityConstraints = [];
initFormulas = initFormulas.map(function(f) {
return parser.stripAccessibilityClauses(f);
});
}
this.predicates = parser.getSymbols('predicate');
if (s5) this.predicates.remove(parser.R);
this.constants = parser.getSymbols('individual constant');
this.funcSymbols = parser.getSymbols('function symbol');
if (parser.isModal) {
this.constants.unshift(parser.w);
}
initFormulas = initFormulas.concat(accessibilityConstraints || []);
this.clauses = this.getClauses(initFormulas);
var numIndividuals = 1;
var numWorlds = this.parser.isModal ? 1 : 0;
this.model = new Model(this, numIndividuals, numWorlds);
this.alternativeModels = [];
}
ModelFinder.prototype.getClauses = function(formulas) {
var res = [];
for (var i=0; i<formulas.length; i++) {
var formula = formulas[i];
var distinctVars = this.makeVariablesDistinct(formula);
var skolemized = this.skolemize(distinctVars);
var quantifiersRemoved = skolemized.removeQuantifiers();
var clauses = this.tseitinCNF(quantifiersRemoved);
res.extendNoDuplicates(clauses);
}
res.sort(function(a,b){ return a.length - b.length; });
res = this.simplifyClauses(res);
return res;
}
ModelFinder.prototype.makeVariablesDistinct = function(formula) {
var usedVariables = arguments[1] || [];
var parser = this.parser;
if (formula.matrix) {
var nmatrix = formula.matrix;
var nvar = formula.variable;
if (usedVariables.includes(formula.variable)) {
nvar = parser.expressionType[nvar] == 'world variable' ?
parser.getNewWorldVariable() : parser.getNewVariable();
nmatrix = nmatrix.substitute(formula.variable, nvar);
}
usedVariables.push(nvar);
nmatrix = this.makeVariablesDistinct(nmatrix, usedVariables);
if (nmatrix == formula.matrix) return formula;
return new QuantifiedFormula(formula.quantifier, nvar, nmatrix, formula.overWorlds);
}
if (formula.sub1) {
var nsub1 = this.makeVariablesDistinct(formula.sub1, usedVariables);
var nsub2 = this.makeVariablesDistinct(formula.sub2, usedVariables);
if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
return formula;
}
ModelFinder.prototype.skolemize = function(formula) {
var boundVars = arguments[1] ? arguments[1].copy() : [];
var parser = this.parser;
if (formula.quantifier == '???') {
var skolemVars = [];
boundVars.forEach(function(v) {
if (formula.matrix.string.indexOf(v) > -1) skolemVars.push(v);
});
var isWorldType = parser.expressionType[formula.variable] == 'world variable';
var skolemTerm;
if (skolemVars.length > 0) {
var funcSymbol = parser.getNewFunctionSymbol(skolemVars.length, isWorldType);
var skolemTerm = skolemVars;
skolemTerm.unshift(funcSymbol);
}
else skolemTerm = isWorldType ? parser.getNewWorldName() : parser.getNewConstant();
var nmatrix = formula.matrix.substitute(formula.variable, skolemTerm);
nmatrix = this.skolemize(nmatrix, boundVars);
return nmatrix;
}
if (formula.quantifier) {
boundVars.push(formula.variable);
var nmatrix = this.skolemize(formula.matrix, boundVars);
if (nmatrix == formula.matrix) return formula;
return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix,
formula.overWorlds);
}
if (formula.sub1) {
var nsub1 = this.skolemize(formula.sub1, boundVars);
var nsub2 = this.skolemize(formula.sub2, boundVars);
if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
return formula;
}
ModelFinder.prototype.tseitinCNF = function(formula) {
if (formula.type == 'literal') {
return [[formula]];
}
if (formula.operator == '???') {
var res = this.tseitinCNF(formula.sub1).concatNoDuplicates(
this.tseitinCNF(formula.sub2))
res.sort(function(a,b){ return a.length - b.length; });
return res;
}
var subformulas = this.tseitinSubFormulas([formula]).removeDuplicates();
subformulas.sort(function(a,b) {
return tseitinComplexity(a) - tseitinComplexity(b);
});
if (!this.tseitsinFormulas) {
this.tseitsinFormulas = {};
}
var clauses = [];
while (subformulas.length) {
var subf = subformulas.shift();
var p = this.tseitsinFormulas[subf.string];
if (!p) {
var vars = this.parser.getVariables(subf);
var pSym = this.parser.getNewSymbol('$', 'tseitin predicate', vars.length);
p = new AtomicFormula(pSym, vars);
this.tseitsinFormulas[subf.string] = p;
var bicond = new BinaryFormula('???', p, subf);
clauses.extendNoDuplicates(this.cnf(bicond));
}
if (subformulas.length == 0) {
clauses.extendNoDuplicates([[p]]);
}
for (var i=0; i<subformulas.length; i++) {
subformulas[i] = this.tseitinReplace(subformulas[i], subf, p);
}
}
clauses.sort(function(a,b){ return a.length - b.length; });
return clauses;
function tseitinComplexity(formula) {
if (formula.sub) {
return 1 + tseitinComplexity(formula.sub);
}
if (formula.sub1) {
return 1 + Math.max(tseitinComplexity(formula.sub1),
tseitinComplexity(formula.sub2));
}
return 0;
}
}
ModelFinder.prototype.tseitinSubFormulas = function(formulas) {
var res = []
for (var i=0; i<formulas.length; i++) {
if (formulas[i].type != 'literal') {
var subformulas = formulas[i].sub ? [formulas[i].sub] :
formulas[i].sub1 ? [formulas[i].sub1, formulas[i].sub2] : null;
res.extend(this.tseitinSubFormulas(subformulas));
res.unshift(formulas[i]);
}
}
return res;
}
ModelFinder.prototype.tseitinReplace = function(formula, f1, f2) {
if (formula.equals(f1)) return f2;
if (formula.sub) {
var nsub = this.tseitinReplace(formula.sub, f1, f2);
if (nsub == formula.sub) return formula;
return new NegatedFormula(nsub);
}
if (formula.sub1) {
var nsub1 = this.tseitinReplace(formula.sub1, f1, f2);
var nsub2 = this.tseitinReplace(formula.sub2, f1, f2);
if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
return formula;
}
ModelFinder.prototype.cnf = function(formula) {
if (formula.type == 'literal') {
return [[formula]];
}
var con, dis;
switch (formula.operator) {
case '???': {
con = [this.cnf(formula.sub1), this.cnf(formula.sub2)];
break;
}
case '???': {
dis = [this.cnf(formula.sub1), this.cnf(formula.sub2)];
break;
}
case '???': {
dis = [this.cnf(formula.sub1.negate()), this.cnf(formula.sub2)];
break;
}
case '???' : {
var con1 = this.cnf(new BinaryFormula('???', formula.sub1, formula.sub2));
var con2 = this.cnf(new BinaryFormula('???', formula.sub2, formula.sub1));
con = [con1, con2];
break;
}
case '??' : {
var sub = formula.sub;
switch (sub.operator) {
case '???': {
dis = [this.cnf(sub.sub1.negate()), this.cnf(sub.sub2.negate())];
break;
}
case '???': {
con = [this.cnf(sub.sub1.negate()), this.cnf(sub.sub2.negate())];
break;
}
case '???': {
con = [this.cnf(sub.sub1), this.cnf(sub.sub2.negate())];
break;
}
case '???' : {
var con1 = this.cnf(new BinaryFormula('???', sub.sub1, sub.sub2));
var con2 = this.cnf(new BinaryFormula('???', sub.sub1.negate(), sub.sub2.negate()));
con = [con1, con2];
break;
}
case '??' : {
return this.cnf(sub.sub);
}
}
}
}
var res = [];
if (con) {
res = con[0].concatNoDuplicates(con[1]);
}
else if (dis) {
for (var i=0; i<dis[0].length; i++) {
for (var j=0; j<dis[1].length; j++) {
res.push(dis[0][i].concatNoDuplicates(dis[1][j]).sort());
}
}
}
res.sort(function(a,b){ return a.length - b.length });
return res;
}
ModelFinder.prototype.simplifyClauses = function(clauseList) {
var nl = clauseList.filter(function(clause) {
for (var i=0; i<clause.length; i++) {
for (var j=i+1; j<clause.length; j++) {
if (clause[i].sub && clause[i].sub.string == clause[j].string ||
clause[j].sub && clause[j].sub.string == clause[i].string) {
return false;
}
}
}
return true;
});
nl2 = nl.copy();
var literals2clauses = {};
for (var i=0; i<nl.length; i++) {
for (var k=0; k<nl[i].length; k++) {
var lit = nl[i][k].string;
if (!literals2clauses[lit]) literals2clauses[lit] = [nl[i]];
else literals2clauses[lit].push(nl[i]);
}
}
for (var i=0; i<nl.length; i++) {
var clause = nl[i];
var lit = clause[0].string;
var supersets = literals2clauses[lit];
for (var k=1; k<clause.length && supersets.length; k++) {
lit = clause[k].string;
supersets.intersect(literals2clauses[lit]);
}
for (var k=0; k<supersets.length; k++) {
if (nl.indexOf(supersets[k]) > nl.indexOf(clause)) {
nl2.remove(supersets[k]);
}
}
}
return nl2;
}
ModelFinder.prototype.nextStep = function() {
if (this.model.clauses.length == 0) {
return true;
}
var literal = this.model.clauses[0][0];
if (!literal) {
this.backtrack();
return false;
}
while (this.model.clauses[0].length == 1 && literal.string.indexOf('$') > -1) {
this.model.unitResolve(literal);
return false;
}
if (!this.model.termValues) {
this.model.initTermValues(literal);
}
else {
if (!this.model.iterateTermValues()) {
this.model.clauses[0].shift();
this.model.termValues = null;
return false;
}
}
while (true) {
var atom = literal.sub || literal;
var nterms = this.model.reduceTerms(atom.terms);
var redAtom = atom.predicate+nterms.toString();
if (this.model.getCurInt(redAtom) === (atom != literal)) {
if (!this.model.iterateTermValues()) {
this.model.clauses[0].shift();
this.model.termValues = null;
return false;
}
}
else {
this.alternativeModels.push(this.model.copy());
if (this.model.getCurInt(redAtom) === undefined) {
this.model.curInt[redAtom] = (atom==literal);
}
this.model.interpretation = this.model.curInt;
this.model.termValues = null;
this.model.clauses.shift();
this.model.simplifyRemainingClauses();
return false;
}
}
}
ModelFinder.prototype.backtrack = function() {
if (this.alternativeModels.length == 0) {
var numWorlds = this.model.worlds.length;
var numIndividuals = this.model.domain.length;
if (numWorlds && this.parser.isPropositional) {
numWorlds++;
}
else {
if (numWorlds && numWorlds < this.model.domain.length) {
numWorlds++;
}
else numIndividuals++;
}
this.model = new Model(this, numIndividuals, numWorlds);
}
else {
this.model = this.alternativeModels.pop();
this.model.curInt = {};
for (var p in this.model.interpretation) {
this.model.curInt[p] = this.model.interpretation[p];
}
var tvs = this.model.termValues;
for (var i=0; i<tvs.length; i++) {
var redTerm = this.model.reduceArguments(tvs[i][0]).toString();
if (tvs[i][2] !== null) {
this.model.curInt[redTerm] = tvs[i][2];
}
}
}
}
function Model(modelfinder, numIndividuals, numWorlds) {
if (!modelfinder) {
return;
}
this.modelfinder = modelfinder;
this.parser = modelfinder.parser;
this.domain = Array.getArrayOfNumbers(numIndividuals);
this.worlds = Array.getArrayOfNumbers(numWorlds);
this.isModal = numWorlds > 0;
this.interpretation = {};
this.clauses = this.getDomainClauses();
var terms = this.getTerms();
this.indivTerms = terms[0];
this.worldTerms = terms[1];
this.termValues = null;
this.curInt = {};
}
Model.prototype.getTerms = function() {
var indivTerms = [];
var worldTerms = this.parser.isModal ? [this.parser.w] : [];
for (var i=0; i<this.parser.symbols.length; i++) {
var s = this.parser.symbols[i];
var stype = this.parser.expressionType[s];
if (stype == 'individual constant') {
indivTerms.push(s);
}
else if (stype.indexOf('function symbol for world') > -1) {
var arity = this.parser.arities[s];
Model.getNTuples(arity, this.worlds.length-1).forEach(function(li) {
li.unshift(s);
worldTerms.push(li.toString());
});
}
else if (stype.indexOf('function symbol') > -1) {
var arity = this.parser.arities[s];
Model.getNTuples(arity, this.domain.length-1).forEach(function(li) {
li.unshift(s);
indivTerms.push(li.toString());
});
}
}
indivTerms.sort(function(a,b){ return a.length - b.length; });
worldTerms.sort(function(a,b){ return a.length - b.length; });
return [indivTerms, worldTerms];
}
Model.prototype.getDomainClauses = function() {
res = [];
for (var c=0; c<this.modelfinder.clauses.length; c++) {
var clause = this.modelfinder.clauses[c];
var variables = [];
for (var i=0; i<clause.length; i++) {
variables.extendNoDuplicates(this.parser.getVariables(clause[i]));
}
if (variables.length == 0) {
res.push(clause.copy());
continue;
}
var interpretations = this.getVariableAssignments(variables);
for (var i=0; i<interpretations.length; i++) {
var interpretation = interpretations[i];
var nclause = clause.map(function(formula) {
var nformula = formula;
for (var i=0; i<variables.length; i++) {
nformula = nformula.substitute(variables[i], interpretation[i]);
}
return nformula;
});
res.push(nclause);
}
}
res = this.modelfinder.simplifyClauses(res);
return res;
}
Model.prototype.getVariableAssignments = function(variables) {
var res = [];
var tuple = Array.getArrayOfZeroes(variables.length);
res.push(tuple.copy());
var maxValues = [];
for (var i=0; i<variables.length; i++) {
maxValues.push(this.parser.expressionType[variables[i]] == 'variable' ?
this.domain.length-1 : this.worlds.length-1);
}
while (Model.iterateTuple(tuple, maxValues)) {
res.push(tuple.copy());
}
return res;
}
Model.iterateTuple = function(tuple, maxValues) {
for (var i=tuple.length-1; i>=0; i--) {
if (tuple[i] < maxValues[i]) {
tuple[i]++;
return true;
}
tuple[i] = 0;
}
return false;
}
Model.getNTuples = function(n, maxval) {
if (n == 0) {
return [[]];
}
var res = [];
for (var i=0; i<maxval; i++) {
Model.getNTuples(n-1, maxval).forEach(function(li) {
li.unshift(i);
res.push(li);
});
}
return res;
}
Model.prototype.initTermValues = function(literal) {
var atom = literal.sub || literal;
var termIsOld = {};
var terms = [];
for (var i=0; i<atom.terms.length; i++) {
if (typeof atom.terms[i] == 'number') continue;
var termStr = atom.terms[i].toString();
if (termIsOld[termStr]) continue;
termIsOld[termStr] = true;
terms.push([atom.terms[i], termStr, null]);
}
for (var i=0; i<terms.length; i++) {
if (terms[i][0].isArray) {
for (var j=1; j<terms[i][0].length; j++) {
var subTerm = terms[i][0][j];
if (typeof subTerm == 'number') continue;
var termStr = subTerm.toString();
if (termIsOld[termStr]) continue;
termIsOld[termStr] = true;
terms.push([subTerm, termStr, null]);
}
}
}
terms.sort(function(a,b){
return a[1].length - b[1].length;
});
this.curInt = {};
for (var p in this.interpretation) {
this.curInt[p] = this.interpretation[p];
}
for (var i=0; i<terms.length; i++) {
var redTerm = this.reduceArguments(terms[i][0]).toString();
if (!(redTerm in this.curInt)) {
terms[i][2] = 0;
this.curInt[redTerm] = 0;
}
}
this.termValues = terms;
}
Model.prototype.isWorldTerm = function(term) {
if (!this.parser.isModal) {
return false;
}
if (term.isArray) {
return this.isWorldTerm(term[0]);
}
return (this.parser.expressionType[term].indexOf("world") > -1);
}
Model.prototype.getMaxValue = function(term, termStr) {
var isWorldTerm = this.isWorldTerm(term);
var domain = isWorldTerm ? this.worlds : this.domain;
var termList = isWorldTerm ? this.worldTerms : this.indivTerms;
var maxValue = domain.length - 1;
var index = termList.indexOf(termStr);
if (index > -1 && index < maxValue) {
maxValue = index;
if (term.isArray) {
for (var i=1; i<term.length; i++) {
if (term[i] >= maxValue) {
maxValue = term[i] + 1;
}
}
}
}
return maxValue;
}
Model.prototype.reduceArguments = function(term) {
if (term.isArray) {
var nterm = this.reduceTerms(term, 1);
nterm.unshift(term[0]);
return nterm;
}
return term;
}
Model.prototype.reduceTerms = function(terms, startIndex) {
var res = [];
for (var i=(startIndex || 0); i<terms.length; i++) {
if (typeof terms[i] == 'number') {
res.push(terms[i]);
}
else if (terms[i].isArray) {
var nterm = this.reduceTerms(terms[i], 1);
nterm.unshift(terms[i][0]);
var ntermStr = nterm.toString();
if (ntermStr in this.curInt) {
res.push(this.curInt[ntermStr]);
}
else {
res.push(nterm);
}
}
else {
if (terms[i] in this.curInt) {
res.push(this.curInt[terms[i]]);
}
else {
res.push(terms[i]);
}
}
}
return res;
}
Model.prototype.iterateTermValues = function() {
for (var i=this.termValues.length-1; i>=0; i--) {
var tv = this.termValues[i];
if (tv[2] === null) {
continue;
}
var redTerm = this.reduceArguments(tv[0]);
var redTermStr = redTerm.toString();
var maxValue = this.getMaxValue(redTerm, redTermStr);
if (tv[2] == maxValue) {
tv[2] = null;
if (!this.interpretation[redTermStr]) {
delete this.curInt[redTermStr];
}
continue;
}
tv[2]++;
this.curInt[redTermStr] = tv[2];
for (var j=0; j<i; j++) {
if (this.termValues[j][2] !== null) {
var rt = this.reduceArguments(this.termValues[j][0]).toString();
this.curInt[rt] = this.termValues[j][2];
}
}
for (var j=i+1; j<this.termValues.length; j++) {
var rt = this.reduceArguments(this.termValues[j][0]).toString();
if (this.curInt[rt] === undefined) {
this.termValues[j][2] = 0;
this.curInt[rt] = 0;
}
else {
this.termValues[j][2] = null;
}
}
if (this.isRedundant()) {
return this.iterateTermValues();
}
return true;
}
return false;
}
Model.prototype.isRedundant = function(checkWorldTerms) {
var terms = checkWorldTerms ? this.worldTerms : this.indivTerms;
var domain = checkWorldTerms ? this.worlds : this.domain;
var unusedEls = domain.copy();
for (var i=0; i<terms.length; i++) {
var term = terms[i];
if (term.indexOf('[') == 0) {
var args = term.slice(1,-1).split(',');
for (var j=1; j<args.length; j++) {
unusedEls.remove(args[j]**1);
}
if (unusedEls.length == 0) break;
}
var val = this.curInt[term];
if (!val || val == unusedEls[0]) {
unusedEls.shift();
if (unusedEls.length == 0) break;
}
if (val > unusedEls[0]) {
return true;
}
}
if (this.isModal && !checkWorldTerms) {
return this.isRedundant(true);
}
return false;
}
Model.prototype.satisfy = function(literal) {
var atom = literal.sub || literal;
this.curInt = this.interpretation;
var nterms = this.reduceTerms(atom.terms);
var redAtom = atom.predicate+nterms.toString();
if (redAtom in this.curInt && thic.curInt[redAtom] != (atom==literal)) {
return false;
}
this.interpretation[redAtom] = (atom==literal);
return true;
}
Model.prototype.simplifyRemainingClauses = function() {
var nclauses = [];
CLAUSELOOP:
for (var i=0; i<this.clauses.length; i++) {
var nclause = [];
for (var j=0; j<this.clauses[i].length; j++) {
var literal = this.clauses[i][j];
var atom = literal.sub || literal;
var nterms = this.reduceTerms(atom.terms);
var redAtomStr = atom.predicate+nterms.toString();
if (redAtomStr in this.curInt) {
if (this.curInt[redAtomStr] == (atom==literal)) {
continue CLAUSELOOP;
}
else {
continue;
}
}
if (atom.terms.toString() != nterms.toString()) {
var redAtom = new AtomicFormula(atom.predicate, nterms);
var nlit = atom == literal ? redAtom : new NegatedFormula(redAtom);
nclause.push(nlit);
}
else nclause.push(literal);
}
nclauses.push(nclause);
}
nclauses.sort(function(a,b) {
if (a.length == 1 && b.length == 1) {
return b[0].string.indexOf('$') - a[0].string.indexOf('$');
}
return a.length - b.length;
});
this.clauses = nclauses;
}
Model.prototype.unitResolve = function(literal) {
var negLiteralString = (literal.sub && literal.sub.string) || '??'+literal.string;
var nclauses = [];
CLAUSELOOP:
for (var i=1; i<this.clauses.length; i++) {
var nclause = [];
for (var j=0; j<this.clauses[i].length; j++) {
if (this.clauses[i][j].string == literal.string) {
continue CLAUSELOOP;
}
if (this.clauses[i][j].string != negLiteralString) {
nclause.push(this.clauses[i][j]);
}
}
nclauses.push(nclause);
}
nclauses.sort(function(a,b) {
if (a.length == 1 && b.length == 1) {
return b[0].string.indexOf('$') - a[0].string.indexOf('$');
}
return a.length - b.length;
});
this.clauses = nclauses;
}
Model.prototype.getCurInt = function(redAtom) {
if (redAtom[0] == '=') {
var terms = redAtom.slice(2,-1).split(',');
if (!isNaN(terms[0]) && !isNaN(terms[1])) {
return terms[0] == terms[1];
}
}
return this.curInt[redAtom];
}
Model.prototype.copy = function() {
var nmodel = new Model();
nmodel.modelfinder = this.modelfinder;
nmodel.parser = this.parser;
nmodel.domain = this.domain;
nmodel.worlds = this.worlds;
nmodel.isModal = this.isModal;
nmodel.interpretation = this.interpretation;
nmodel.termValues = this.termValues;
nmodel.clauses = this.clauses.copyDeep();
nmodel.indivTerms = this.indivTerms;
nmodel.worldTerms = this.worldTerms;
return nmodel;
}
Model.prototype.toHTML = function() {
var str = "<table>";
if (this.parser.isModal) {
function w(num) {
return 'w<sub>'+num+'</sub>';
}
str += "<tr><td align='right'>Worlds: </td><td align='left'>{ ";
str += this.worlds.map(function(n){return w(n)}).join(", ");
str += " }</td></tr>\n";
if (!this.parser.isPropositional) {
str += "<tr><td align='right'>Individuals: </td><td align='left'>{ ";
str += this.domain.join(", ");
str += " }</td></tr>\n";
}
}
else if (!this.parser.isPropositional) {
str += "<tr><td align='right'>Domain: </td><td align='left'>{ ";
str += this.domain.join(", ");
str += " }</td></tr>\n";
}
var extensions = this.getExtensions();
for (var i=0; i<this.modelfinder.constants.length; i++) {
var sym = this.modelfinder.constants[i];
var ext = extensions[sym];
var val = sym == this.parser.w ? w(ext) : ext;
if (sym == this.parser.w) sym = '@';
str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
}
for (var i=0; i<this.modelfinder.funcSymbols.length; i++) {
var sym = this.modelfinder.funcSymbols[i];
var ext = extensions[sym];
if (ext.length > 0 && !ext[0].isArray) {
var val = '{ '+ext.join(',')+' }';
}
else {
var val = '{ '+ext.map(function(tuple) {
return '('+tuple.join(',')+')';
}).join(', ')+' }';
}
str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
}
var isModal = this.parser.isModal;
var R = this.parser.R;
for (var i=0; i<this.modelfinder.predicates.length; i++) {
var sym = this.modelfinder.predicates[i];
if (sym == '=') continue;
var ext = extensions[sym];
var val;
if (!ext.isArray) {
val = ext;
}
else if (ext.length > 0 && !ext[0].isArray) {
if (isModal) ext = ext.map(function(n){return w(n)});
val = '{ '+ext.join(',')+' }';
}
else {
val = '{ '+ext.map(function(tuple) {
if (isModal) {
tuple[tuple.length-1] = w(tuple[tuple.length-1]);
if (sym == R) tuple[0] = w(tuple[0]);
}
return '('+tuple.join(',')+')';
}).join(', ')+' }';
}
if (sym == R && sym != 'R') {
sym = 'Accessibility'
}
str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
}
str += "</table>";
return str;
}
Model.prototype.getExtensions = function() {
var result = {};
for (var i=0; i<this.modelfinder.constants.length; i++) {
var cons = this.modelfinder.constants[i];
result[cons] = this.interpretation[cons] || 0;
}
var interpretedStrings = Object.keys(this.interpretation);
for (var i=0; i<this.modelfinder.funcSymbols.length; i++) {
var f = this.modelfinder.funcSymbols[i];
result[f] = [];
for (var j=0; j<interpretedStrings.length; j++) {
var expr = interpretedStrings[j];
if (expr.indexOf('['+f+',') == 0) {
var args = expr.slice(1,-1).split(',');
args.shift();
var val = this.interpretation[expr];
result[f].push(args.concat([val]));
}
}
result[f] = this.makeFunctionExtensionTotal(f, result[f]);
}
for (var i=0; i<this.modelfinder.predicates.length; i++) {
var p = this.modelfinder.predicates[i];
result[p] = (this.parser.arities[p] == 0) ? false : [];
for (var j=0; j<interpretedStrings.length; j++) {
var expr = interpretedStrings[j];
if (expr.indexOf(p+'[') == 0) {
var val = this.interpretation[expr];
var args = expr.substr(p.length).slice(1,-1).split(',');
if (args[0] == '') {
result[p] = val;
}
else {
if (!val) continue;
if (args.length == 1) {
result[p].push(args[0]);
}
else {
result[p].push(args);
}
}
}
}
}
return result;
}
Model.prototype.makeFunctionExtensionTotal = function(f, extension) {
var arity = this.parser.arities[f];
var args = Array.getArrayOfZeroes(arity);
var maxValue = this.domain.length - 1;
var maxValues = args.map(function(x){ return maxValue; });
var res = [];
ARGLOOP:
do {
for (var i=0; i<extension.length; i++) {
if (extension[i].slice(0,-1).equals(args)) {
res.push(extension[i]);
continue ARGLOOP;
}
}
res.push(args.concat([0]));
} while (Model.iterateTuple(args, maxValues));
return res;
}
Model.prototype.toString = function() {
return this.toHTML().replace(/<.+?>/g, '');
}
function dictToString(dict) {
var res = '';
var keys = Object.keys(dict);
for (var i=0; i<keys.length; i++) {
res += keys[i]+': '+dict[keys[i]]+'\n';
}
return res;
}
function SenTree(fvTree, parser) {
this.nodes = [];
this.isClosed = (fvTree.openBranches.length == 0);
this.initFormulas = fvTree.prover.initFormulas;
this.initFormulasNonModal = fvTree.prover.initFormulasNonModal;
this.initFormulasNormalized = fvTree.prover.initFormulasNormalized;
this.fvTree = fvTree;
this.parser = parser;
this.fvParser = fvTree.parser;
this.markEndNodesClosed();
this.transferNodes();
this.removeUnusedNodes();
this.replaceFreeVariablesAndSkolemTerms();
if (parser.isModal) this.modalize();
this.findComplementaryNodes();
}
SenTree.prototype.markEndNodesClosed = function() {
for (var i=0; i<this.fvTree.closedBranches.length; i++) {
var branch = this.fvTree.closedBranches[i];
branch.nodes[branch.nodes.length-1].closedEnd = true;
}
}
SenTree.prototype.findComplementaryNodes = function() {
for (var i=0; i<this.fvTree.closedBranches.length; i++) {
var branch = this.fvTree.closedBranches[i];
var lastNode = branch.nodes[branch.nodes.length-1];
while (lastNode.children[0]) lastNode = lastNode.children[0];
var n1 = lastNode;
var n2 = lastNode;
N1LOOP:
while (n1) {
while ((n2 = n2.parent)) {
if (!n2) throw 'wtf'
if ((n1.formula.operator == '??' && n1.formula.sub.string == n2.formula.string)
|| (n2.formula.operator == '??' && n2.formula.sub.string == n1.formula.string)) {
lastNode.closedBy = [n1, n2];
break N1LOOP;
}
};
if (n1.formula.operator == '??' && n1.formula.sub.predicate == '='
&& n1.formula.sub.terms[0].toString() == n1.formula.sub.terms[1].toString()) {
lastNode.closedBy = [n1];
break;
}
n1 = n1.parent;
n2 = lastNode;
}
if (lastNode.closedBy.length == 2 && n1.formula.world != n2.formula.world) {
lastNode.closedBy = null;
var addedNode = this.insertRigidIdentity(n1, n2);
}
}
}
SenTree.prototype.insertRigidIdentity = function(n1, n2) {
var identityNode = n1.formula.operator == '??' ? n2 : n1;
var negIdentityNode = n1.formula.operator == '??' ? n1 : n2;
var targetWorld = negIdentityNode.formula.world;
var newFormula = new AtomicFormula('=', identityNode.formula.terms);
newFormula.world = targetWorld;
var newNode = new Node(newFormula, null, [identityNode]);
this.makeNode(newNode);
newNode.parent = n1;
newNode.children = [];
n1.closedEnd = false;
n1.children = [newNode];
newNode.closedEnd = true;
newNode.closedBy = [newNode, negIdentityNode];
newNode.used = true;
this.nodes.push(newNode);
return newNode;
}
SenTree.prototype.transferNodes = function() {
//
//
this.addInitNodes();
var branches = this.fvTree.closedBranches.concat(this.fvTree.openBranches);
for (var b=0; b<branches.length; b++) {
var par;
for (var n=0; n<branches[b].nodes.length; n++) {
var node = branches[b].nodes[n];
if (node.isSenNode) {
par = node.swappedWith || node;
continue;
}
par = this.transferNode(node, par);
}
}
for (var i=0; i<this.nodes.length; i++) {
var node = this.nodes[i];
if (node.used && node.formula.type == 'doublenegation') {
var par = node;
while (par.children[0] && par.children[0].expansionStep == par.expansionStep) {
par = par.children[0];
}
this.expandDoubleNegation(node, par);
}
if (!node.dneNode) {
for (var j=0; j<node.fromNodes.length; j++) {
var from = node.fromNodes[j];
while (from.dneTo) from = from.dneTo;
node.fromNodes[j] = from;
}
}
}
}
SenTree.prototype.transferNode = function(node, par) {
//
//
var nodeFormula = node.formula;
for (var i=0; i<node.fromNodes.length; i++) {
if (node.fromNodes[i].dneTo) {
node.fromNodes[i] = node.fromNodes[i].dneTo;
}
}
switch (node.fromRule) {
case Prover.alpha : {
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
var f1 = fromFormula.alpha(1);
var f2 = fromFormula.alpha(2);
if (from.biconditionalExpansion) {
node.fromNodes = from.fromNodes;
node.expansionStep = from.expansionStep;
}
if (!nodeFormula.equals(f1.normalize())) node.formula = f2;
else if (!nodeFormula.equals(f2.normalize())) node.formula = f1;
else {
node.formula = (par.expansionStep == node.expansionStep && !par.biconditionalExpansion) ? f2 : f1;
}
this.appendChild(par, node);
var lastNode = node;
if (par.fromNodes[0] && par.fromNodes[0] == from && node.formula == f1) {
this.reverse(par, node);
lastNode = par;
}
return lastNode;
}
case Prover.beta: {
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
var f1 = fromFormula.beta(1);
var f2 = fromFormula.beta(2);
if (!nodeFormula.equals(f1.normalize())) node.formula = f2;
else if (!nodeFormula.equals(f2.normalize())) node.formula = f1;
else {
node.formula = (par.children && par.children.length) ? f2 : f1;
}
if (fromFormula.operator == '???' ||
(fromFormula.operator == '??' && fromFormula.sub.operator == '???')) {
node.biconditionalExpansion = true;
node.used = false;
}
this.appendChild(par, node);
if (par.children.length == 2 && node.formula == f1) {
par.children.reverse();
}
return node;
}
case Prover.gamma: case Prover.delta: {
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
var matrix = fromFormula.matrix || fromFormula.sub.matrix;
if (this.fvTree.prover.s5 && matrix.sub1 &&
matrix.sub1.predicate == this.fvParser.R) {
var newFla = fromFormula.sub ? matrix.sub2.negate() : matrix.sub2;
}
else {
var newFla = fromFormula.sub ? matrix.negate() : matrix;
}
var boundVar = fromFormula.sub ? fromFormula.sub.variable : fromFormula.variable;
if (node.instanceTerm) {
node.formula = newFla.substitute(boundVar, node.instanceTerm);
}
else {
node.formula = newFla;
}
this.appendChild(par, node);
return node;
}
case Prover.modalGamma: {
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
if (fromFormula.sub) {
var newFla = fromFormula.sub.matrix.sub2.negate();
var boundVar = fromFormula.sub.variable;
}
else {
var newFla = fromFormula.matrix.sub2;
var boundVar = fromFormula.variable;
}
node.formula = newFla.substitute(boundVar, node.instanceTerm);
this.appendChild(par, node);
return node;
}
case Prover.modalDelta:
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
if (node.formula.predicate == this.fvParser.R) {
this.appendChild(par, node);
}
else {
if (fromFormula.sub) {
var newFla = fromFormula.sub.matrix.sub2.negate();
var boundVar = fromFormula.sub.variable;
}
else {
var newFla = fromFormula.matrix.sub2;
var boundVar = fromFormula.variable;
}
node.formula = newFla.substitute(boundVar, node.instanceTerm);
this.appendChild(par, node);
}
return node;
default: {
this.appendChild(par, node);
return node;
}
}
}
SenTree.prototype.addInitNodes = function() {
var branch = this.fvTree.closedBranches.length > 0 ?
this.fvTree.closedBranches[0] : this.fvTree.openBranches[0];
for (var i=0; i<this.initFormulasNonModal.length; i++) {
var node = this.makeNode(branch.nodes[i]);
node.formula = this.initFormulasNonModal[i];
node.used = true;
if (i==0) this.nodes.push(node);
else this.appendChild(this.nodes[i-1], node);
}
}
SenTree.prototype.expandDoubleNegation = function(node, parent) {
var newNode = new Node(node.formula.sub.sub, null, [node]);
this.makeNode(newNode);
newNode.parent = parent;
newNode.children = parent.children;
parent.children = [newNode];
for (var i=0; i<newNode.children.length; i++) {
newNode.children[i].parent = newNode;
}
if (parent.closedEnd) {
parent.closedEnd = false;
newNode.closedEnd = true;
}
newNode.used = node.used;
newNode.dneNode = true;
node.dneTo = newNode;
this.nodes.push(newNode);
}
SenTree.prototype.replaceFreeVariablesAndSkolemTerms = function() {
var substitutions = [];
for (var n=0; n<this.nodes.length; n++) {
var node = this.nodes[n];
for (var i=0; i<substitutions.length; i++) {
var term = substitutions[i][0], repl = substitutions[i][1];
node.formula = node.formula.substitute(term, repl);
}
var skterms = getSkolemTerms(node.formula);
var term;
while ((term = skterms.shift())) {
var isWorldTerm = (term.toString()[0] == '??');
var repl = isWorldTerm ?
this.parser.getNewWorldName(true) : this.parser.getNewConstant();
substitutions.push([term, repl]);
node.formula = node.formula.substitute(term, repl);
skterms = Formula.substituteInTerms(skterms, term, repl);
}
var varMatches = node.formula.string.match(/[????]\d+/g);
if (varMatches) {
for (var j=0; j<varMatches.length; j++) {
var fv = varMatches[j];
if (fv[0] == '??') {
var repl = this.parser.w;
}
else {
var repl = this.parser.getSymbols('individual constant')[0] ||
this.parser.getNewConstant();
}
substitutions.push([fv, repl]);
node.formula = node.formula.substitute(fv, repl);
}
}
}
function getSkolemTerms(formula) {
var skterms = {};
var flas = [formula];
var fla;
while ((fla = flas.shift())) {
if (fla.isArray) {
for (var i=0; i<fla.length; i++) {
if (fla[i].isArray) {
if (fla[i][0][0].match(/[????]/)) {
skterms[fla[i].toString()] = fla[i];
}
else {
flas.unshift(fla[i]);
}
}
else if (fla[i][0].match(/[????]/)) {
skterms[fla[i].toString()] = fla[i];
}
}
}
else if (fla.sub) {
flas.unshift(fla.sub);
}
else if (fla.sub1) {
flas.unshift(fla.sub1);
flas.unshift(fla.sub2);
}
else if (fla.matrix) {
flas.unshift(fla.matrix);
}
else {
flas.unshift(fla.terms);
}
}
return Object.values(skterms);
}
}
SenTree.prototype.removeUnusedNodes = function() {
if (!this.isClosed) return;
for (var i=0; i<this.nodes.length; i++) {
var node = this.nodes[i];
if (node.used) {
var expansion = this.getExpansion(node);
for (var j=0; j<expansion.length; j++) {
if (!expansion[j].biconditionalExpansion) {
expansion[j].used = true;
}
}
}
}
for (var i=0; i<this.nodes.length; i++) {
if (!this.nodes[i].used) {
var ok = this.remove(this.nodes[i]);
if (ok) i--;
}
}
}
SenTree.prototype.modalize = function() {
for (var i=0; i<this.nodes.length; i++) {
var node = this.nodes[i];
node.formula = this.fvParser.translateToModal(node.formula);
if (node.formula.predicate == this.fvParser.R) {
node.formula.string = node.formula.terms[0] + this.fvParser.R
+ node.formula.terms[1];
}
}
}
SenTree.prototype.makeNode = function(node) {
node.parent = null;
node.children = [];
node.isSenNode = true;
return node;
}
SenTree.prototype.appendChild = function(oldNode, newNode) {
if (!newNode.isSenNode) {
newNode = this.makeNode(newNode);
}
newNode.parent = oldNode;
oldNode.children.push(newNode);
if (oldNode.closedEnd) {
oldNode.closedEnd = false;
newNode.closedEnd = true;
}
this.nodes.push(newNode);
return newNode;
}
SenTree.prototype.remove = function(node) {
if (node.isRemoved) return;
if (node.parent.children.length == 1) {
node.parent.children = node.children;
if (node.children[0]) {
node.children[0].parent = node.parent;
node.children[0].instanceTerm = node.instanceTerm;
}
if (node.children[1]) {
node.children[1].parent = node.parent;
node.children[1].instanceTerm = node.instanceTerm;
}
}
else {
if (node.children.length > 1) {
return false;
}
var i = (node == node.parent.children[0]) ? 0 : 1;
if (node.children[0]) {
node.parent.children[i] = node.children[0];
node.children[0].parent = node.parent;
node.children[0].instanceTerm = node.instanceTerm;
}
else node.parent.children.remove(node);
}
this.nodes.remove(node);
node.isRemoved = true;
return true;
}
SenTree.prototype.toString = function() {
return "<table><tr><td align='center' style='font-family:monospace'>"+getTree(this.nodes[0])+"</td</tr></table>";
function getTree(node) {
var recursionDepth = arguments[1] || 0;
if (++recursionDepth > 40) return "<b>...<br>[max recursion]</b>";
var res = (node.used ? '.' : '') + node
+ (node.formula.world ? ' ('+node.formula.world+')' : '')
+ (node.closedEnd ? "<br>x<br>" : "<br>");
if (node.children[1]) {
var tdStyle = "font-family:monospace; border-top:1px solid #999; padding:3px; border-right:1px solid #999";
var td = "<td align='center' valign='top' style='" + tdStyle + "'>";
res += "<table><tr>"+ td + getTree(node.children[0], recursionDepth) +"</td>\n"
+ td + getTree(node.children[1], recursionDepth) + "</td>\n"
+ "</tr></table>";
}
else if (node.children[0]) {
res += getTree(node.children[0], recursionDepth);
}
return res;
}
}
SenTree.prototype.substitute = function(oldTerm, newTerm) {
for (var i=0; i<this.nodes.length; i++) {
this.nodes[i].formula = this.nodes[i].formula.substitute(oldTerm, newTerm);
}
}
SenTree.prototype.reverse = function(node1, node2) {
node2.parent = node1.parent;
node1.parent = node2;
if (node2.parent.children[0] == node1) node2.parent.children[0] = node2;
else node2.parent.children[1] = node2;
node1.children = node2.children;
node2.children = [node1];
if (node1.children[0]) node1.children[0].parent = node1;
if (node1.children[1]) node1.children[1].parent = node1;
if (node2.closedEnd) {
node2.closedEnd = false;
node1.closedEnd = true;
}
node2.swappedWith = node1;
node1.swappedWith = node2;
}
SenTree.prototype.getExpansion = function(node) {
var res = [node];
if (!node.expansionStep) return res;
var par = node.parent;
while (par && par.expansionStep == node.expansionStep) {
res.unshift(par);
par = par.parent;
}
var ch = node.children[0];
while (ch && ch.expansionStep == node.expansionStep) {
res.push(ch);
ch = ch.children[0];
}
if (par) {
for (var i=0; i<par.children.length; i++) {
var sib = par.children[i];
while (sib && sib.expansionStep == node.expansionStep) {
if (!res.includes(sib)) res.push(sib);
sib = sib.children[0];
}
}
}
return res;
}
SenTree.prototype.getCounterModel = function() {
var endNode = null;
for (var i=0; i<this.nodes.length; i++) {
if (this.nodes[i].children.length || this.nodes[i].closedEnd) continue;
endNode = this.nodes[i];
break;
}
if (!endNode) return null;
var model = new Model(this.fvTree.prover.modelfinder, 0, 0);
var node = endNode;
if (this.parser.isModal) {
model.worlds = [0];
model.interpretation['w'] = 0;
}
do {
var fla = node.formula;
while (fla.operator == '??' && fla.sub.operator == '??') {
fla = fla.sub.sub;
}
var atom = (fla.operator == '??') ? fla.sub : fla;
if (!atom.predicate) continue;
var terms = atom.terms.copy();
for (var t=0; t<terms.length; t++) {
if (terms[t].isArray) {
for (var i=1; i<terms[t].length; i++) {
terms.push(terms[t][i]);
}
}
}
terms.sort(function(a,b) {
return a.toString().length - b.toString().length;
});
for (var t=0; t<terms.length; t++) {
var term = terms[t];
var rterm = model.reduceArguments(terms[t]).toString();
if (rterm in model.interpretation) continue;
var domain = this.fvParser.expressionType[term] &&
this.fvParser.expressionType[term].indexOf('world') > -1 ?
model.worlds : model.domain;
domain.push(domain.length);
model.interpretation[rterm] = domain.length-1;
}
if (!model.satisfy(fla)) {
return null;
}
} while ((node = node.parent));
if (model.domain.length == 0) {
model.domain = [0];
}
return model;
}
function TreePainter(senTree, rootAnchor) {
this.paintInterval = 200;
this.branchPadding = window.innerWidth < 500 ? 0 :
window.innerWidth < 800 ? 20 : 30;
this.branchingHeight = 40;
this.tree = senTree;
this.isModal = senTree.parser.isModal;
this.rootAnchor = rootAnchor;
this.rootAnchor.innerHTML = "";
rootAnchor.style.transform = "scale(1)";
this.minX = this.branchPadding/2 - rootAnchor.offsetLeft;
this.scale = 1;
this.curNodeNumber = 0;
this.highlighted = [];
}
TreePainter.prototype.paintTree = function() {
var node = this.getNextUnpaintedNode();
if (!node) {
this.highlightNothing();
return this.finished();
}
var paintNodes = this.tree.getExpansion(node);
for (var i=0; i<paintNodes.length; i++) {
this.paint(paintNodes[i]);
if (paintNodes[i].closedEnd) {
this.paint(this.makeCloseMarkerNode(paintNodes[i]));
}
}
this.highlight(paintNodes, node.fromNodes);
this.paintTimer = setTimeout(function(){
this.paintTree();
}.bind(this), this.paintInterval);
}
TreePainter.prototype.stop = function() {
clearTimeout(this.paintTimer);
}
TreePainter.prototype.finished = function() {
}
TreePainter.prototype.paint = function(node) {
if (!node.parent || node.parent.children.length == 2) {
node.container = this.makeContainer(node);
}
else {
node.container = node.parent.container;
}
node.div = this.makeNodeDiv(node);
node.container.appendChild(node.div);
node.div.style.top = node.container.h + "px";
node.container.h += node.div.offsetHeight + 3;
if (node.isCloseMarkerNode) {
node.container.h += this.branchPadding;
}
if (node.formulaSpan.offsetWidth > node.container.formulaWidth) {
node.container.formulaWidth = node.formulaSpan.offsetWidth + 10;
var n = node;
do {
n.formulaSpan.style.width = node.container.formulaWidth + "px";
n.div.style.left = -node.div.offsetWidth/2 + "px";
n = n.parent;
} while (n && n.container == node.container);
}
else {
node.formulaSpan.style.width = node.container.formulaWidth + "px";
node.div.style.left = -node.container.w/2 + "px";
}
node.container.w = Math.max(node.container.w, node.div.offsetWidth);
var fromSpan = node.div.childNodes[2];
var wOversize = fromSpan.scrollWidth - fromSpan.offsetWidth;
node.container.wOversize = Math.max(node.container.wOversize, wOversize);
this.repositionBranches(node);
this.keepTreeInView();
}
TreePainter.prototype.makeContainer = function(node, nodeId) {
var parContainer = node.parent ? node.parent.container : this.rootAnchor;
var container = document.createElement('div');
parContainer.appendChild(container);
if (node.parent) parContainer.subContainers.push(container);
container.subContainers = [];
container.style.width = "100%";
container.style.position = "absolute";
container.style.left = "0px";
container.style.top = node.parent ? parContainer.h + this.branchingHeight + "px" : "0px";
container.w = container.h = 0;
container.wOversize = 0;
container.str = "{ " + (this.curNodeNumber+1) + " "+node+ " }";
container.formulaClass = 'fla'+this.curNodeNumber;
container.formulaWidth = 0;
return container;
}
TreePainter.prototype.makeNodeDiv = function(node) {
var div = document.createElement('div');
div.className = 'treeNode';
var nodeNumberSpan = document.createElement('span');
nodeNumberSpan.className = 'nodenumber';
if (!node.isCloseMarkerNode) {
node.nodeNumber = ++this.curNodeNumber;
nodeNumberSpan.innerHTML = node.nodeNumber+'.';
}
div.appendChild(nodeNumberSpan);
div.id = 'n'+this.curNodeNumber;
node.formulaSpan = document.createElement('span');
node.formulaSpan.className = 'formula '+node.container.formulaClass;
node.formulaSpan.innerHTML = node.formula.toString();
div.appendChild(node.formulaSpan);
if (this.isModal) {
var worldSpan = document.createElement('span');
worldSpan.className = 'worldlabel';
worldSpan.innerHTML = node.formula.world ? '('+node.formula.world+')' : '';
div.appendChild(worldSpan);
}
var fromSpan = document.createElement('span');
fromSpan.className = 'fromnumbers';
var annot = node.fromNodes.map(function(n) { return n.nodeNumber; });
if (node.fromRule) {
var fromRule = node.fromRule.toString().substr(0,3);
if (!['alp', 'bet', 'gam', 'del', 'mod'].includes(fromRule)) {
fromRule += '.';
if (fromRule == 'equ.') fromRule = 'LL';
annot.push(fromRule);
}
}
fromSpan.innerHTML = annot.length>0 ? "("+annot.join(',')+")" : " ";
div.appendChild(fromSpan);
var painter = this;
if (node.isCloseMarkerNode) {
div.addEventListener("mouseenter", function(e) {
painter.highlight([], node.closedBy);
});
}
else {
div.addEventListener("mouseenter", function(e) {
painter.highlight(painter.tree.getExpansion(node), node.fromNodes);
});
}
div.addEventListener("mouseleave", function(e) {
painter.highlightNothing();
});
return div;
}
TreePainter.prototype.makeCloseMarkerNode = function(closingNode) {
var node = new Node();
node.formula = "<b>x</b>";
node.parent = closingNode;
node.fromNodes = [];
node.children = [];
node.isCloseMarkerNode = true;
node.closedBy = closingNode.closedBy;
return node;
}
TreePainter.prototype.repositionBranches = function(node) {
var par = node.container;
while ((par = par.parentNode).subContainers) {
if (!par.subContainers[1]) continue;
var overlap = this.getOverlap(par);
//log("comparing subcontainers for overlap: " + par.str);
if (overlap) {
var x1 = parseInt(par.subContainers[0].style.left) - Math.ceil(overlap/2);
var x2 = parseInt(par.subContainers[1].style.left) + Math.ceil(overlap/2);
par.subContainers[0].style.left = x1 + "px";
par.subContainers[1].style.left = x2 + "px";
if (par.branchLines) {
for (var i=0; i<par.branchLines.length; i++) {
par.removeChild(par.branchLines[i]);
}
}
var centre = this.isModal ? -8 : 0;
var line1 = this.drawLine(par, centre, par.h, x1+centre, par.h + this.branchingHeight-2);
var line2 = this.drawLine(par, centre, par.h, x2+centre, par.h + this.branchingHeight-2);
par.branchLines = [line1, line2];
}
}
}
TreePainter.prototype.getOverlap = function(par) {
var overlap = 0;
var co1, co2, co1s = [par.subContainers[0]], co2s;
par.__x = 0; par.__y = 0;
while ((co1 = co1s.shift())) {
co2s = [par.subContainers[1]];
while ((co2 = co2s.shift())) {
co1.__x = co1.parentNode.__x + parseInt(co1.style.left);
co1.__y = co1.parentNode.__y + parseInt(co1.style.top);
co2.__x = co2.parentNode.__x + parseInt(co2.style.left);
co2.__y = co2.parentNode.__y + parseInt(co2.style.top);
if ((co1.__y >= co2.__y) && (co1.__y < co2.__y + co2.h) ||
(co2.__y >= co1.__y) && (co2.__y < co1.__y + co1.h)) {
var co1w = co1.w + co1.wOversize;
var co2w = co2.w + co2.wOversize;
var overlap12 = (co1.__x + co1w/2 + painter.branchPadding) - (co2.__x - co2w/2);
overlap = Math.max(overlap, overlap12);
}
co2s = co2s.concat(co2.subContainers);
}
co1s = co1s.concat(co1.subContainers);
}
return Math.floor(overlap);
}
TreePainter.prototype.keepTreeInView = function() {
var mainContainer = this.rootAnchor.firstChild;
if (mainContainer.getBoundingClientRect) {
var midPoint = Math.round(mainContainer.getBoundingClientRect()['left']);
var winTreeRatio = window.innerWidth*1.0/(midPoint*2);
if (winTreeRatio < 1) {
this.scale = Math.max(winTreeRatio, 0.8);
rootAnchor.style.transform="scale("+this.scale+")";
}
}
var minX = this.getMinX();
if (minX < this.minX/this.scale) {
var invisibleWidth = (this.minX/this.scale - minX);
mainContainer.style.left = mainContainer.__x + invisibleWidth + "px";
}
}
TreePainter.prototype.getMinX = function() {
var minX = 0;
var con, cons = [this.rootAnchor.firstChild];
while ((con = cons.shift())) {
con.__x = (con.parentNode.__x || 0) + parseInt(con.style.left);
if (con.__x - con.w/2 < minX) {
minX = con.__x - con.w/2;
}
cons = cons.concat(con.subContainers);
}
return minX;
}
TreePainter.prototype.highlight = function(children, fromNodes) {
while (this.highlighted.length) {
this.highlighted.shift().div.childNodes[1].style.backgroundColor = 'unset';
}
for (var i=0; i<children.length; i++) {
children[i].div.childNodes[1].style.backgroundColor = '#00708333';
}
for (var i=0; i<fromNodes.length; i++) {
fromNodes[i].div.childNodes[1].style.backgroundColor = '#00708366';
}
this.highlighted = children.concat(fromNodes);
}
TreePainter.prototype.highlightNothing = function() {
this.highlight([], []);
}
TreePainter.prototype.drawLine = function(el, x1, y1, x2, y2) {
var a = x1 - x2;
var b = y1 - y2;
var length = Math.sqrt(a*a + b*b);
var sx = (x1 + x2) / 2
var x = sx - length / 2;
var y = (y1 + y2) / 2;
var angle = Math.PI - Math.atan2(-b, a);
var line = document.createElement("div");
var styles = 'border: 1px solid #678; '
+ 'width: ' + length + 'px; '
+ 'height: 0px; '
+ '-moz-transform: rotate(' + angle + 'rad); '
+ '-webkit-transform: rotate(' + angle + 'rad); '
+ '-o-transform: rotate(' + angle + 'rad); '
+ '-ms-transform: rotate(' + angle + 'rad); '
+ 'position: absolute; '
+ 'top: ' + y + 'px; '
+ 'left: ' + x + 'px; ';
line.setAttribute('style', styles);
el.appendChild(line);
return line;
}
TreePainter.prototype.getNextUnpaintedNode = function() {
var nodes = [this.tree.nodes[0]];
var node;
while ((node = nodes.shift())) {
do {
if (!node.div) return node;
if (node.children.length == 2) nodes.unshift(node.children[1]);
} while ((node = node.children[0]));
}
return null;
}
var flaFieldValue = '';
function updateInput() {
var ostr = document.forms[0].flaField.value;
if (ostr == flaFieldValue) {
return true;
}
cposition = this.selectionStart;
flaFieldValue = renderSymbols(ostr);
var diff = ostr.length - flaFieldValue.length
document.forms[0].flaField.value = flaFieldValue;
this.selectionEnd = cposition - diff;
toggleAccessibilityRow();
}
function renderSymbols(str) {
str = str.replace(/&|\^| and/ig, '???');
str = str.replace(/ v | or/ig, ' ??? ');
str = str.replace(/~| not/ig, '??');
str = str.replace(/<->|<=>| iff/ig, '???');
str = str.replace(/->|=>| then/g, '???');
str = str.replace(/\[\]/g, '???');
str = str.replace(/<>|???/g, '???');
str = str.replace(/!|???/g, '???');
str = str.replace(/\?/g, '???');
str = str.replace(/\(A([s-z])\)/g, '???$1');
str = str.replace(/\(E([s-z])\)/g, '???$1');
str = str.replace(/(?:^|\W)\(([s-z])\)/g, '???$1');
str = str.replace(/\\?forall[\{ ]?\}?/g, '???');
str = str.replace(/\\?exists[\{ ]?\}?/g, '???');
str = str.replace(/(\\neg|\\lnot)[\{ ]?\}?/g, '??');
str = str.replace(/(\\vee|\\lor)[\{ ]?\}?/g, '???');
str = str.replace(/(\\wedge|\\land)[\{ ]?\}?/g, '???');
str = str.replace(/(\\to|\\rightarrow)[\{ ]?\}?/g, '???');
str = str.replace(/\\leftrightarrow[\{ ]?\}?/g, '???');
str = str.replace(/\\[Bb]ox[\{ ]?\}?/g, '???');
str = str.replace(/\\[Dd]iamond[\{ ]?\}?/g, '???');
return str;
}
function toggleAccessibilityRow() {
if (/[??????]/.test(document.forms[0].flaField.value)) {
document.getElementById('accessibilitySpan').style.display = 'inline-block';
}
else {
document.getElementById('accessibilitySpan').style.display = 'none';
}


document.forms[0].flaField.insertAtCaret = function(str) {
if (document.selection) {
this.focus();
sel = document.selection.createRange();
sel.text = str;
this.focus();
}
else if (this.selectionStart || this.selectionStart === 0) {
var startPos = this.selectionStart;
var endPos = this.selectionEnd;
var scrollTop = this.scrollTop;
var val = this.value;
this.value = val.substring(0, startPos)+str+val.substring(endPos,val.length);
this.focus();
this.selectionStart = startPos + str.length;
this.selectionEnd = startPos + str.length;
this.scrollTop = scrollTop;
}
else {
this.value += str;
this.focus();
}
}
document.querySelectorAll('.symbutton').forEach(function(el) {
el.onclick = function(e) {
var field = document.forms[0].flaField;
var command = this.innerHTML;
field.insertAtCaret(command);
toggleAccessibilityRow();
}
});
var prover = null;
function startProof() {
var input = document.forms[0].flaField.value;
var parser = new Parser();
try {
var parsedInput = parser.parseInput(input);
}
catch (e) {
if (input.indexOf('v') > -1) {
e += "\nIf you mean disjunction by the letter 'v', put a space on either side.";
}
alert(e);
return false;
}
var premises = parsedInput[0];
var conclusion = parsedInput[1];
var initFormulas = premises.concat([conclusion.negate()]);
document.getElementById("intro").style.display = "none";
document.getElementById("model").style.display = "none";
document.getElementById("rootAnchor").style.display = "none";
document.getElementById("backtostartpage").style.display = "block";
document.getElementById("status").style.display = "block";
document.getElementById("statusmsg").innerHTML = "something went wrong: please email wo@umsu.de and tell me what you did";
document.getElementById("statusbtn").style.display = "block";
document.getElementById("statusbtn").innerHTML = "stop";
var accessibilityConstraints = [];
if (parser.isModal) {
document.querySelectorAll('.accCheckbox').forEach(function(el) {
if (el.checked) {
accessibilityConstraints.push(el.id);
}
});
}
prover = new Prover(initFormulas, parser, accessibilityConstraints);
prover.onfinished = function(treeClosed) {
var conclusionSpan = "<span class='formula'>"+conclusion+"</span>";
if (initFormulas.length == 1) {
var summary = conclusionSpan + " is " + (treeClosed ? "valid." : "invalid.");
}
else {
var summary = premises.map(function(f){
return "<span class='formula'>"+f+"</span>";
}).join(', ') + (treeClosed ? " entails " : " does not entail ") + conclusionSpan + ".";
}
document.getElementById("statusmsg").innerHTML = summary;
document.getElementById("statusbtn").style.display = "none";
var sentree = new SenTree(this.tree, parser);
if (!treeClosed) {
if (this.counterModel) {
document.getElementById("model").style.display = "block";
document.getElementById("model").innerHTML = "<b>Countermodel:</b><br>" +
this.counterModel.toHTML();
}
return;
}
document.getElementById("rootAnchor").style.display = "block";
self.painter = new TreePainter(sentree, document.getElementById("rootAnchor"));
self.painter.finished = function() { addExportButtons(); }
self.painter.paintTree();
}
prover.status = function(txt) {
document.getElementById("statusmsg").innerHTML = txt;
}
setTimeout(function(){
prover.start();
}, 1);
return false;
}
document.getElementById("statusbtn").onclick = function(e) {
var btn = document.getElementById("statusbtn");
if (btn.innerText == 'stop') {
btn.innerText = 'continue';
prover.stop();
}
else {
btn.innerText = 'stop';
prover.start();
}
}
onload = function(e) {
updateInput();
document.forms[0].flaField.onkeyup = updateInput;
document.forms[0].onsubmit = function(e) {
setTimeout(function() {
setHash();
startProof();
}, 1);
return false;
}
if (location.search.startsWith('?f=')) {
location.hash = location.search.substring(3);
hashChange();
}
else if (location.hash.length > 0) {
hashChange();
}
document.forms[0].flaField.focus();
}
var hashSetByScript = false;
function setHash() {
hashSetByScript = true;
var hash = encodeInputToHash(document.forms[0].flaField.value);
if (document.getElementById('accessibilitySpan').style.display != 'none') {
var accessibilityConstraints = [];
document.querySelectorAll('.accCheckbox').forEach(function(el) {
if (el.checked) {
accessibilityConstraints.push(el.id);
}
});
if (accessibilityConstraints.length > 0) {
hash += '||'+accessibilityConstraints.join('|');
}
}
location.hash = hash;
}
window.onhashchange = hashChange;
function hashChange() {
if (hashSetByScript) {
hashSetByScript = false;
return;
}
if (prover) prover.stop();
if (location.hash.length == 0) {
document.getElementById("intro").style.display = "block";
document.getElementById("model").style.display = "none";
document.getElementById("rootAnchor").style.display = "none";
document.getElementById("backtostartpage").style.display = "none";
document.getElementById("status").style.display = "none";
}
else {
var hashparts = location.hash.split('||');
document.forms[0].flaField.value = decodeHashToInput(hashparts[0].substring(1));
var accessibilityConstraints = hashparts[1] ? hashparts[1].split('|') : [];
document.querySelectorAll('.accCheckbox').forEach(function(el) {
el.checked = accessibilityConstraints.includes(el.id);
});
toggleAccessibilityRow();
startProof();
}
}
function encodeInputToHash(input) {
'???';
inputNoSpaces = input.replace(/\s/g, '');
var hash = inputNoSpaces.replace(new RegExp('['+symbols+']', 'g'), function(match) {
return '~'+symbols.indexOf(match);
});
return hash;
}
function decodeHashToInput(hash) {
if (hash.indexOf('%') > -1) {
hash = decodeURIComponent(hash.replace(/\+/g, '%20'));
}
var symbols = ' ??????????????????????????';
return hash.replace(/~./g, function(match) {
return symbols[parseInt(match[1])];
});
}
function addExportButtons() {
var el = document.createElement('div');
el.id = 'exportDiv';
el.style.position = 'absolute';
var treeCoords = getTreeCoords();
el.style.top = (treeCoords.bottom-treeCoords.top)/painter.scale + 'px';
var width = (treeCoords.right-treeCoords.left)/painter.scale;
el.style.width = width+'px';
el.style.left = Math.round(width/-2) +'px'
el.innerHTML = '<button onclick="exportImage()">save as png</button>';
painter.rootAnchor.firstChild.appendChild(el);
}
function getTreeCoords() {
rootCoords = document.getElementById('rootAnchor').getBoundingClientRect();
var treeCoords = {
left: rootCoords.left,
right: rootCoords.right,
top: rootCoords.top,
bottom: rootCoords.bottom
};
document.querySelectorAll('.treeNode').forEach(function(el) {
var coords = el.getBoundingClientRect();
if (coords.left < treeCoords.left) treeCoords.left = Math.round(coords.left);
if (coords.right > treeCoords.right) treeCoords.right = Math.round(coords.right);
if (coords.bottom > treeCoords.bottom) treeCoords.bottom = Math.round(coords.bottom);
});
return treeCoords;
}
function getTreeHTML() {
var root = document.getElementById('rootAnchor');
defaultStyles = {
'DIV' : getDefaultStyle('div'),
'SPAN' : getDefaultStyle('span')
}
document.querySelectorAll('#rootAnchor *').forEach(function(el) {
var computedStyle = window.getComputedStyle(el);
var defaultStyle = defaultStyles[el.tagName];
if (!defaultStyle) return;
for (var i=0; i<computedStyle.length; i++) {
var cssProperty = computedStyle[i];
var cssValue = computedStyle.getPropertyValue(cssProperty);
if (defaultStyle[cssProperty] != computedStyle[cssProperty]) {
el.style[cssProperty] = cssValue;
}
}
});
document.getElementById('exportDiv').style.display = 'none';
var html = root.outerHTML;
document.getElementById('exportDiv').style.display = 'block';
var treeCoords = getTreeCoords();
var width = treeCoords.right - treeCoords.left;
html = html.replace(/id="rootAnchor".+?>/, 'id="rootAnchor" style="position:relative; left:'+(width/2)+'px;">');
return html;
}
function getDefaultStyle(tagName) {
var defaultStyle = {};
var element = document.body.appendChild(document.createElement(tagName));
var computedStyle = window.getComputedStyle(element);
for (var i=0; i < computedStyle.length; i++) {
defaultStyle[computedStyle[i]] = computedStyle[computedStyle[i]];
}
document.body.removeChild(element);
return defaultStyle;
}
function exportImage() {
if (!document.getElementById('localfontstyle')) {
document.getElementsByTagName("head")[0].insertAdjacentHTML(
"beforeend",
'<link rel="stylesheet" id="localfontstyle" href="font.css" onload="exportImage()" type="text/css" />');
return;
}
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var treeCoords = getTreeCoords();
width = treeCoords.right - treeCoords.left;
height = treeCoords.bottom - treeCoords.top;
canvas.width = width;
canvas.height = height;
var tempImg = document.createElement('img');
tempImg.addEventListener('load', function(el) {
ctx.drawImage(el.target, 0, 0);
var dataURL = canvas.toDataURL('image/png');
var downloadLink = document.createElement('a');
downloadLink.setAttribute('download', 'proof.png');
var url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
downloadLink.setAttribute('href', url);
downloadLink.click();
document.body.removeChild(downloadLink);
});
tempImg.addEventListener('error', function(el) {
alert("sorry, this doesn't seem to work in your browser");
});
var html = getTreeHTML();
html = html.replace(/<br>/g, '<br/>');
var style = '';
var cssRules = document.styleSheets[2].cssRules;
for (var i=0; i<cssRules.length; i++) {
style += cssRules[i].cssText;
}
xml = '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">'
xml += '<defs><style>' + style + '</style></defs>';
xml += '<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">'+html+'</div></foreignObject>';
xml += '</svg>'
tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(xml);
}
}Array.prototype.isArray = true;

Array.prototype.toString = function() {
    return "["+this.join(",")+"]";
}

Array.prototype.extend = function(otherArray) {
    // extend this array by the elements of <otherArray>:
    this.push.apply(this, otherArray);
}

Array.prototype.remove = function(element) {
    // remove the first element that strictly equals <element>
    var index = this.indexOf(element);
    if (index > -1) this.splice(index, 1);
}

Array.prototype.intersect = function(elements) {
    // remove each item not in <elements>: 
    for (var i=0; i<this.length; i++) {
        if (elements.indexOf(this[i]) == -1) {
            this.splice(i--, 1);
        }
    }
}

Array.prototype.insert = function(element, index) {
    // insert <element> at the given position, shifting the existing
    // ones further back
    return this.splice(index, 0, element);
}

Array.prototype.concatNoDuplicates = function(array2) {
    // return new array with all elements of <array2> added, but without adding
    // any duplicates. x and y count as duplicates if x.toString() ==
    // y.toString(), which is useful for arrays of (arrays of) formulas.
    var hash = {};
    var res = [];
    for (var i=0; i<this.length; i++){
        hash[this[i].toString()] = true;
        res.push(this[i]);
    }
    for(var i=0; i<array2.length; i++){
        var s = array2[i].toString();
        if (!hash[s]){
            hash[s] = true;
            res.push(array2[i]);
        }
    }
    return res;
}

Array.prototype.extendNoDuplicates = function(array2) {
    // extend this array by all elements of <array2> added, but without adding
    // any duplicates. x and y count as duplicates if x.toString() ==
    // y.toString(), which is usefor for arrays of (arrays of) formulas.
    var hash = {};
    for (var i=0; i<this.length; i++){
        hash[this[i].toString()] = true;
    }
    for(var i=0; i<array2.length; i++){
        var s = array2[i].toString();
        if (!hash[s]){
            hash[s] = true;
            this.push(array2[i]);
        }
    }
}

Array.prototype.removeDuplicates = function() {
    // return new array with no duplicate elements.
    var hash = {};
    var res = [];
    for (var i=0; i<this.length; i++){
        var s = this[i].toString();
        if (!hash[s]) {
            hash[s] = true;
            res.push(this[i]);
        }
    }
    return res;
}

Array.getArrayOfZeroes = function(length) {
    // https://jsperf.com/zero-filled-array-creation/17
    for (var i = 0, a = new Array(length); i < length;) a[i++] = 0;
    return a;
}

Array.getArrayOfNumbers = function(length) {
    for (var i = 0, a = new Array(length); i < length; i++) a[i] = i;
    return a;
}

Array.prototype.copy = function() {
    // returns a shallow copy of this array.
    var result = [];
    for (var i=0; i<this.length; i++) result[i] = this[i];
    return result;
}

Array.prototype.copyDeep = function() {
    // returns a deep copy of this array (deep only with respect to arrays,
    // not objects, so objects will be copied by reference).
    var result = [];
    for (var i=0; i<this.length; i++) {
        if (this[i].isArray) result[i] = this[i].copyDeep();
        else result[i] = this[i];
    }
    return result;
}

Array.prototype.equals = function(arr2) {
    // return true iff two (possibly nested) arrays are equal (==) at all
    // positions
    if (this.length != arr2.length) return false;
    for (var i=0; i<this.length; i++) {
        if (this[i].isArray) {
            if (!arr2[i].isArray) return false;
            if (!this[i].equals(arr2[i])) return false;
        }
        else if (this[i] != arr2[i]) return false;
    }
    return true;
}

// Polyfill:

if (!Array.prototype.includes) { 
    Array.prototype.includes = function(element) {
        for (var i=0; i<this.length; i++) {
            if (this[i] == element) return true;
        }
        return false;
    };
}

Object.values = Object.values || function(o) {
    return Object.keys(o).map(function(k){return o[k]})
};

Object.entries = Object.entries || function(obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var res = new Array(i); 
    while (i--) res[i] = [ownProps[i], obj[ownProps[i]]];
    return res;
};

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search) {
        return this.substring(0, search.length) === search;
    }
}

if (!String.prototype.includes) {
    String.prototype.includes = function(sub) {
        return this.indexOf(sub) > -1;
    }
}
/**
 * Here we define some methods for handling equality (identity).
 *
 * Most textbooks use two special rules, going back to Jeffrey: "Leibniz' Law"
 * (LL) and a closure rule (Ref) that allows closing any branch that contains
 * ??(t=t).
 *
 * Unrestricted, (LL) opens up a huge search space. One can restrict the rule to
 * literals and constrain it so that it (1) only replaces "larger" terms by
 * "smaller" terms, relative to some ordering, and also (2) only replaces the
 * "larger" side of an equation. One can also delay application until some
 * sequence of applications allows closing a branch.
 *
 * In free-variable tableaux, Jeffrey's rules are incomplete: sometimes (LL)
 * must be applied simultaneously with a substitution of free variables. That
 * is, we need to check if there is some substitution under which some
 * applications of (LL) and (Ref) allow closing the current branch.
 *
 * For example, if the branch contains the equation E = { f(a)=b } as well as
 * the literals Pf(a)y and ??Pxg(b), then we are looking for a substitution ??
 * under which E entails (f(a)=x)?? and (y=g(b))?? by LL. Finding such a
 * substitution is known as a rigid E-unification problem.
 * 
 * We use a simplified form of the E-unification calculus "BSE" suggested by
 * Degtyarev and Voronkov 1998 ("What you always wanted to know about rigid
 * E-unification"), partly following Franssen 2008 ("Implementing rigid
 * E-unification") for implementation details.
 *
 * The BSE calculus respects the idea that applications of (LL) should replace
 * larger terms by smaller terms. Unfortunately, we sometimes don't know at the
 * time when we want to apply (LL) -- say, replacing f(a) by x -- whether the
 * application meets the complexity-reducing condition, since the variable x
 * might only be instantiated later in the computation (or indeed only when
 * dealing with another branch). The BSE calculus therefore operates with
 * /constraints/ on possible substitutions.
 *
 * Constraints involve two kinds of conditions: equality conditions saying that
 * a substitution ?? must render two terms s and t identical, and inequality
 * conditions saying that ?? must render one term s "smaller" than another term
 * t. We interpret the smaller relation in terms of Lexicographic Path Ordering.
 * 
 * D&V describe a sound and complete tableau algorithm in which no substitution
 * is ever applied; instead, a tableaux is closed if the union of the
 * constraints that would allow closing each individual branch is non-empty. We
 * use a different approach. When working on a branch, we regularly check if one
 * of its E-unification problems can be solved. We collect all these solutions,
 * apply the substitution determined by the equality conditions of the first and
 * store the others for backtracking. (We forget the ordering constraint.)
 *
 */

function EqualityProblem(equationNodes) {
    /**
     * An EqualityProblem represents a rigid E-unification problem with a
     * constraint on substitutions. The goal of a rigid E-unification problem is
     * to find a substitution (variables -> terms) under which the target
     * equalities terms1[i]=terms2[i] can be derived from the supplied equations
     * by LL.
     *
     * Calling this.nextStep() will call one of the RBS rules (basically, one
     * application of LL) in all possible ways and return a list of resulting
     * EqualityProblems. If some of these are solved, they will come first in the
     * list and have this.nextStep == null.
     *
     * In comments below, I'll sometimes represent a unification problem like
     * this:
     * 
     *    <equations> ??? <goal>, [<constraint>]
     *
     * I here use the tilde for equality and '=' for syntactic identity.
     * 
     */
    // the (goal) term lists we want to unify:
    this.terms1 = null;
    this.terms2 = null;
    // the nodes from which these terms come (to annotate LL applications):
    this.terms1Node = null;
    this.terms2Node = null;
    // the equations on the branch that we can use to apply LL (pairs of terms):
    this.equations = [];
    // the constraint on substitutions that we will construct:
    this.constraint = arguments[0] || new SubstitutionConstraint();
    // new Nodes that were added by applications of LL:
    this.newNodes = [];
    // the scheduled next rrbs rule:
    this.nextStep = this.start;
    // bookkepping for recursion:
    this.lastStep = null;
    this.lrbsIndex = -1;
}

EqualityProblem.prototype.init = function(equationNodes, goalNode1, goalNode2) {
    /**
     * initialise the problem based on the supplied nodes
     */
    this.equations = equationNodes;
    this.terms1Node = goalNode1;
    this.terms2Node = goalNode2;
    if (goalNode1 == goalNode2) { // target is an inequality
        this.terms1 = [goalNode1.formula.sub.terms[0]];
        this.terms2 = [goalNode1.formula.sub.terms[1]];
    }
    else if (goalNode1.formula.sub) {
        this.terms1 = goalNode1.formula.sub.terms;
        this.terms2 = goalNode2.formula.terms;
    }
    else {
        this.terms1 = goalNode1.formula.terms;
        this.terms2 = goalNode2.formula.sub.terms;
    }
}

EqualityProblem.prototype.addSkolemConstraints = function(terms) {
    for (var i=0; i<terms.length; i++) {
        if (!terms[i].isArray) continue;
        if (terms[i][0][0] == '??' || terms[i][0][0] == '??') {
            terms[i][0][0].isSkolemTerm = true;
            var fvs = getVariablesInTermList(terms[i]);
            for (var j=0; j<fvs.length; j++) {
                this.constraint.addGreater(terms[i], fvs[j]);
            }
        }
    }
}

function getVariablesInTermList(terms) {
    var res = [];
    var dupe = {};
    for (var i=0; i<terms.length; i++) {
        if (terms[i].isArray) {
            res.extendNoDuplicates(getVariablesInTermList(terms[i]));
        }
        else if ((terms[i][0] == '??' || terms[i][0] == '??') && !dupe[terms[i]]) {
            dupe[terms[i]] = true;
            res.push(terms[i]);
        }
    }
    return res;
}

EqualityProblem.prototype.start = function() {
    /**
     * try the first application of LL to the goal terms in all possible
     * ways; return a list of resulting problems, with any solved ones
     * coming first.
     */
    log("starting; trying rrbs");
    return this.tryRrbs();
}

EqualityProblem.prototype.tryRrbs = function() {
    /**
     * Go through all possible (single) applications of the rrbs rule; create a
     * new EqualityProblem for each result; return a list of these new problems,
     * with any solved ones coming first.
     *
     * 
     * The rrbs rule allows using one of the equations in the problem to modify
     * the goal:
     *
     *         [E, l~r ??? s1..si[p]..sn~t1..tn], [C]
     * (rrbs)  -------------------------------------------
     *         [E, l~r ??? s1..si[r]..sn~t1..tn], [C, l>r, si[p]>ti, l=p]
     * 
     * (This rule is adapted from D&V to handle term lists as s and t.)
     * 
     * We look for candidate equations l~r and subterms p for which the new
     * constraint is satisfiable. For each candidate, we create a copy of the
     * problem in which we apply the (rrbs) rule, thereby changing the goal
     * terms and the constraint and adding the relevant (LL) application to
     * newNodes. Then we call tryEr() to see if the new goal terms can be
     * unified. If yes, we add the solved problem to the start of the returned
     * array. If no, we schedule another call of tryRrbs() for the newly created
     * problem in order to change another subterm of the (altered) goal terms,
     * etc. To the end of the schedule, we append a call of tryLrbs() on the
     * original problem, in order to change the equations.
     */

    // This function can be scheduled from itself or from tryLrbs(). If it is
    // scheduled from tryLrbs(), we have already tried all equations except
    // for the one that was altered by tryLrbs():
    var equations = this.lastStep == this.tryLrbs ?
        [this.equations[this.lrbsIndex]] : this.equations;

    log('# trying rrbs');
    
    // Instead of recursively calling other applications of rrbs or lrbs, we
    // collect these recursive calls in a list, which we return (so that the
    // browser can take a break in between calls):
    var schedule = []; 

    // We have a choice of which equation in which direction to use as l=r,
    // which goal term list (terms1 or terms2) to use as s or t, which
    // position to use as i, and which subterm p to replace in si. We
    // begin by looping over the goal term position i:
    for (var i=0; i<this.terms1.length; i++) {
        
        // don't need to do anything if s[i] is already identical to t[i]:
        log("checking if candidate terms "+this.terms1[i]+" and "+this.terms2[i]+" can be unified");
        var nc = this.constraint.tryAddEqual(this.terms1[i], this.terms2[i]);
        if (nc && nc == this.constraint) {
            // don't continue merely because nc exists; see commit from 15/07/21
            log("terms are already equal");
            continue;
        }

        // loop over both directions of the selected goal terms:
        for (var sIsTerms1=1; sIsTerms1>=0; sIsTerms1--) {
            var s = sIsTerms1 ? this.terms1 : this.terms2;
            var t = sIsTerms1 ? this.terms2 : this.terms1;
            
            log('trying rrbs with '+s[i]+' as si and '+t[i]+' as ti');
        
            // rrbs can only be applied if the constraint is compatible with si>ti:
            var fconstraint = this.constraint.tryAddGreater(s[i],t[i]);
            if (!fconstraint) continue;
            // NB: fconstraint is now an extended copy of this.constraint

            // collect all non-variable subterms of si as candidates for p
            // (variables are excluded by condition (3) on p.53 of D&V):
            var siSubterms = subterms(s[i]);

            // try each eligible equation, in both directions:
            for (var ei=0; ei<equations.length; ei++) {
                for (var lIsLHS=1; lIsLHS>=0; lIsLHS--) {
                    var l = equations[ei].formula.terms[lIsLHS ? 0 : 1];
                    var r = equations[ei].formula.terms[lIsLHS];
                    log('  trying '+l+' as l and '+r+' as r');

                    // rrbs can only be applied if constraint is compatible with l>r:
                    var sconstraint = fconstraint.tryAddGreater(l,r);
                    if (!sconstraint) continue;

                    // try all subterms of si as candidates for p:
                    for (var j=0; j<siSubterms.length; j++) {
                        var p = siSubterms[j];
                        log('  trying '+p+' as p');

                        // rrbs can only be applied if constraint is compatible with l=p:
                        var tconstraint = sconstraint.tryAddEqual(l,p)
                        if (!tconstraint) continue;
                        
                        // All requirements are met: we can apply the rule. I.e., we
                        // can replace one occurrence of p in si by r, using (LL). We
                        // go through all occurrences.
                        var new_sis = replaceSubterm(s[i], p, r);
                        for (var g=0; g<new_sis.length; g++) {
                            log('rrbs constraints satisfied: replacing '+s[i]+' by '+new_sis[g]);
                            var newProblem = this.copy(tconstraint);
                            newProblem.applyLLtoGoal(i, sIsTerms1, new_sis[g], equations[ei]);
                            newProblem.lastStep = this.tryRrbs;
                            log('scheduling new problem '+newProblem+'; checking if solved by er');
                            // check if resulting problem can be solved directly: 
                            if (newProblem.tryEr()) {
                                log("yes, add to start of schedule");
                                newProblem.nextStep = null;
                                schedule.unshift(newProblem);
                            }
                            // schedule unsolved problem for further processing:
                            else {
                                log("no, add to end of schedule");
                                newProblem.nextStep = this.tryRrbs;
                                schedule.push(newProblem);
                            }
                            log('continuing with rrbs application to '+this);
                        }
                    }
                }
            }
        }
    }
    log("scheduling same problem with lrbs");
    this.nextStep = this.tryLrbs;
    schedule.push(this);
    return schedule.removeDuplicates();
}
 
EqualityProblem.prototype.tryLrbs = function() {
    /**
     * Go through all possible (single) applications of the lrbs rule; create a
     * new EqualityProblem for each result; return a list of these new problems.
     * 
     * The lrbs rule allows using one of the equations to modify another equation:
     *
     *         [E, l~r, s[p]~t ??? e], [C]
     * (lbrs)  -------------------------------------------
     *         [E, l~r, s[r]~t ??? e], [C, l>r, s[p]>t, l=p]
     *
     * We look for candidate equations l~r and subterms p for which the new
     * constraint is satisfiable. (If there is none, this path of the search is
     * a dead end, and we return an empty list.)
     *
     * For each candidate, we create a copy of the problem in which we apply the
     * (lrbs) rule, changing an equation and the constraint and adding the
     * relevant (LL) application to newNodes. Then we schedule a call to tryRrbs
     * to check if the new equation allows unifying the goal terms. (tryRrbs()
     * will schedule another call of this function to modify another equation,
     * etc.)
     */
    
    log('# trying lrbs');

    var schedule = [];
    
    // We need to choose two equations: l~r and s~t. So we loop twice over the
    // equations. Each equation has to be considered in both directions. (The
    // counters 'j' and 'i' are used like in Franssen 2008.
    for (var j=0; j<this.equations.length; j++) {
        for (var sIsLHS=1; sIsLHS>=0; sIsLHS--) {
            var s = this.equations[j].formula.terms[sIsLHS ? 0 : 1];
            var t = this.equations[j].formula.terms[sIsLHS];
            log('trying lrbs with '+s+' as s and '+t+' as t');
            
            // lrbs can only be applied if constraint is compatible with s>t:
            var fconstraint = this.constraint.tryAddGreater(s,t);
            if (!fconstraint) continue;

            // After finding a candidate for applying lrbs, we call tryRrbs(),
            // which will probably change the goal terms and then call this
            // function again, to make further changes to the equations. In that
            // case, we don't want to loop over all the equations again.
            // Instead, if the previous candidate had equation j as the target
            // s~t, we only need to re-try equations before j as targets for
            // the source equation l~r that was changed in the last call, i.e.
            // that was the target of the previous equation. We store this index
            // j in this.lrbsIndex.
            var sourceEquations = (j <= this.lrbsIndex) ?
                [this.equations[this.lrbsIndex]] : this.equations;
            for (var i=0; i<sourceEquations.length; i++) {
                for (var lIsLHS=1; lIsLHS>=0; lIsLHS--) {
                    var l = sourceEquations[i].formula.terms[lIsLHS ? 0 : 1];
                    var r = sourceEquations[i].formula.terms[lIsLHS];
                    log('   trying '+l+' as l and '+r+' as r');

                    // also need l>r:
                    var sconstraint = fconstraint.tryAddGreater(l,r);
                    if (!sconstraint) continue;

                    // try all subterms of s as candidates for p:
                    var sSubterms = subterms(s);
                    for (var k=0; k<sSubterms.length; k++) {
                        var p = sSubterms[k];
                        log('  trying '+p+' as p');

                        // lrbs can only be applied if constraint is compatible with l=p:
                        var tconstraint = sconstraint.tryAddEqual(l,p);
                        if (!tconstraint) continue;

                        // All requirements are met: we can apply the rule. I.e., we
                        // can replace one occurrence of p in s by r, using (LL). We
                        // try all occurrences.
                        var new_ss = replaceSubterm(s, p, r); 
                        for (var g=0; g<new_ss.length; g++) {
                            var new_s = new_ss[g];
                            // don't apply rule if new_s = t (D&V, condition (4), p.53):
                            if (new_s.toString() == t.toString()) continue;
                            log('lrbs constraints satisfied: replacing s[p]='+s+' by s[r]='+new_ss[g]);
                            var newProblem = this.copy(tconstraint);
                            newProblem.applyLLtoEquation(j, sIsLHS, new_ss[g], sourceEquations[i]);
                            newProblem.lrbsIndex = j;
                            newProblem.lastStep = newProblem.tryLrbs;
                            newProblem.nextStep = newProblem.tryRrbs;
                            log('scheduling new problem '+newProblem);
                            schedule.push(newProblem);
                        }
                    }
                }
            }
        }
    }
    return schedule.removeDuplicates(); 
}

EqualityProblem.prototype.tryEr = function() {
    /**
     * try unification of goal terms
     */
    log("# trying er()");
    var con = this.constraint;
    for (var i=0; i<this.terms1.length; i++) {
        con = con.tryAddEqual(this.terms1[i], this.terms2[i]);
        if (!con) return false;
    }
    // We're done. Any substitution that meets con renders terms1 and terms2
    // identical, which allows closing the branch.
    this.constraint = con;
    log("solved: "+this);
    return true;
}

EqualityProblem.prototype.applyLLtoGoal = function(i, sIsTerms1, new_si, equation) {
    /**
     * Apply a hypothetical (post-substitution) instance of LL to current
     * problem in which one term si (at index <i>) of the goal term list s is
     * replaced by <new_si>, based on <equation>. If <sIsTerms1> is 1, the goal
     * term list s is this.terms1, otherwise it is this.terms2.
     */
    if (sIsTerms1) {
        log("LL: replacing "+this.terms1[i]+" in "+this.terms1Node+" by "+new_si); 
        this.terms1 = this.terms1.copy();
        this.terms1.splice(i, 1, new_si);
    }
    else {
        log("LL: replacing "+this.terms2[i]+" in "+this.terms2Node+" by "+new_si); 
        this.terms2 = this.terms2.copy();
        this.terms2.splice(i, 1, new_si);
    }
    if (this.terms1Node == this.terms2Node) {
        // LL applied to one side of the inequality terms1Node (= terms2Node)
        var newFormula = new AtomicFormula('=', [this.terms1[0], this.terms2[0]]).negate();
        var newNode = new Node(newFormula,
                               Prover.equalityReasoner, // fromRule
                               [equation, this.terms1Node] // fromNodes
                              );
        this.newNodes.push(newNode);
        this.terms1Node = newNode;
        this.terms2Node = newNode;
    }
    else {
        // LL applied to terms1Node if sIsTerms1 else to terms2Node
        var targetNode = sIsTerms1 ? this.terms1Node : this.terms2Node;
        var targetAtom = targetNode.formula.sub || targetNode.formula;
        var newFormula = new AtomicFormula(targetAtom.predicate,
                                           sIsTerms1 ? this.terms1 : this.terms2);
        if (targetNode.formula.sub) newFormula = newFormula.negate();
        var newNode = new Node(newFormula,
                               Prover.equalityReasoner,
                               [equation, targetNode]
                              );
        this.newNodes.push(newNode);
        if (sIsTerms1) this.terms1Node = newNode;
        else this.terms2Node = newNode;
    }
}

EqualityProblem.prototype.applyLLtoEquation = function(j, sIsLHS, new_s, sourceEq) {
    /**
     * Apply a hypothetical (post-substitution) instance of LL to current
     * problem in which a term s in this.equations[j] is replaced by <new_s>,
     * based on <equation>. If <sIsLHS> is 1, the term s is the LHS of the
     * target equation, otherwise it is the RHS.
     */
    var targetEq = this.equations[j];
    var newFormula = new AtomicFormula('=', [
        sIsLHS ? new_s : targetEq.formula.terms[0],
        sIsLHS ? targetEq.formula.terms[1] : new_s
    ]);
    var newNode = new Node(newFormula,
                           Prover.equalityReasoner, // fromRule
                           [sourceEq, targetEq] // fromNodes
                          );
    this.newNodes.push(newNode);
    this.equations = this.equations.copy();
    this.equations.splice(j, 1, newNode);
}

EqualityProblem.prototype.getSubstitution = function() {
    /**
     * return a substition compatible with this.constraint, for applying to the
     * tree once a solution is found
     */
    var sdict = this.constraint.solvedForms[0].solvedDict;
    var res = [];
    for (var v1 in sdict) {
        res.push(v1, sdict[v1]);
    }
    return res;
}

EqualityProblem.prototype.deskolemize = function(node) {
    /**
     * return a new Node in which each skolem terms \phi(x,y..) in
     * <node>.formula is replaced by a new constant c; add a constraint to the
     * problem that c > x, c > y, ..; store the mapping from new constants to
     * original skolem terms in this.
     */
    var res = new Node();
    res.id = node.id;
    var atom = node.formula.sub || node.formula;
    var newTerms = [];
    for (var i=0; i<atom.terms.length; i++) {
        // Skolem terms all look like '??1', '??1(??1,??2..)' (for individuals) or
        // '??1' etc. (for worlds); after unification they can also be nested.
        if (atom.terms[i].isArray &&
            (atom.terms[i][0][0] == '??' || atom.terms[i][0][0] == '??') 
           ){}
    }
    var fvs = node.formula.getFreeVariables();
    var newFormula = new AtomicFormula
}

EqualityProblem.prototype.copy = function(constraint) {
    var res = new EqualityProblem(constraint || this.constraint);
    res.terms1 = this.terms1; // don't need to copy because the array is never changed, only replaced (see applyLL functions)
    res.terms2 = this.terms2; // same
    res.equations = this.equations; // same
    res.terms1Node = this.terms1Node;
    res.terms2Node = this.terms2Node;
    res.newNodes = this.newNodes.copy();
    res.lastStep = this.lastStep;
    res.nextStep = this.nextStep;
    res.lrbsIndex = this.lrbsIndex;
    return res;
}

EqualityProblem.prototype.toString = function() {
    var nextStepStr = this.nextStep==this.tryRrbs ? 'rrbs' :
        this.nextStep==this.tryLrbs ? 'lrbs' :
        this.nextStep==this.tryEr ? 'er' :
        this.nextStep==this.start ? 'start' :
        this.nextStep==null ? '' : '???';
    return '&lt;' + this.equations + ' ??? ' + this.terms1 + '=' + this.terms2
        + ' (' + this.constraint + ') *' + nextStepStr + '&gt;';
}

function subterms(term) {
    /**
     * return all (distinct) subterms of <term>, except for variables and subterms
     * within skolem terms
     *
     * We don't need to replace terms within skolem terms. However, we can't treat
     * skolem terms as completely atomic: if a skolem term contains variable x, we
     * can't susbstitute x for that term. This is automatically ensured by returning
     * the skolem term as a proper function term.
     */
    if (term.isArray) {
        if (term[0][0] == '??' || term[0][0] == '??') { // skolem term
            return [term];
        }
        var res = [term];
        for (var i=1; i<term.length; i++) { // skip function symbol
            res.extendNoDuplicates(subterms(term[i]));
        }
        return res;
    }
    if (term[0] == '??' || term[0] == '??') return [];
    return [term];
}

function replaceSubterm(term, sub, repl) {
    /**
     * return list of all terms that result from <term> by replacing one occurrence
     * of <sub> with <repl>; ignore occurrences within skolem terms
     */
    var subStr = sub.toString();
    if (term.toString() == subStr) return [repl];
    if (!term.isArray || term[0][0] == '??' || term[0][0] == '??') return [];
    var res = [];
    for (var i=1; i<term.length; i++) {
        var newSubterms = replaceSubterm(term[i], sub, repl);
        for (var j=0; j<newSubterms.length; j++) {
            var newTerm = term.copy()
            newTerm.splice(i, 1, newSubterms[j]);
            res.push(newTerm);
        }
    }
    return res;
}


/**
 *
 * In order to check satisfiability of a constraint, we rewrite the constraint
 * into a disjunction of "solved forms". A solved form makes explicit all ordering
 * and equality conditions that are implied by a constraint.
 * 
 */

function SubstitutionConstraint(equalities, inequalities, solvedForms) {
    this.equalities = equalities || [];
    this.inequalities = inequalities || [];
    // The above two properties are only used for debugging/bookkeeping,
    // what matters is the next one.
    this.solvedForms = solvedForms || [new SolvedForm()];
}

SubstitutionConstraint.prototype.tryAddEqual = function(s, t) {
    /**
     * check if the syntactic identity s=t is compatible with the present
     * constraint; if yes, return a new constraint with the added condition (or
     * the same constraint if the condition is already entailed); if no, return
     * null.
     */
    var sfChanged = false;
    var sfs = [];
    for (var i=0; i<this.solvedForms.length; i++) {
        var sf = this.solvedForms[i].addEqual(s,t);
        if (sf.length != 1 || !sf[0].equals(this.solvedForms[i])) sfChanged = true;
        sfs.extendNoDuplicates(sf);
    }
    if (sfs.length == 0) {
        log("   can't add "+s+"="+t+" to constraint "+this.solvedForms);
        return null;
    }
    if (sfChanged) {
        log("   OK, can add "+s+"="+t+" to constraint "+this.solvedForms+" => "+sfs);
        var newEqualities = this.equalities.copy();
        newEqualities.push(s+'='+t);
        // newEqualities.push([s,t]);
        return new SubstitutionConstraint(newEqualities, this.inequalities, sfs);
    }
    else {
        log("   "+s+"="+t+" is already entailed by "+this.solvedForms);
        return this;
    }
}

SubstitutionConstraint.prototype.tryAddGreater = function(s, t) {
    /**
     * check if s>t is compatible with the present constraint; if yes, return a
     * new constraint with the added condition (or the same constraint if the
     * condition is already entailed); if no, return null. 
     */
    var sfChanged = false;
    var sfs = [];
    for (var i=0; i<this.solvedForms.length; i++) {
        var sfa = this.solvedForms[i].addGreater(s,t);
        if (sfa.length != 1 || !sfa[0].equals(this.solvedForms[i])) sfChanged = true;
        sfs.extendNoDuplicates(sfa);
    }
    if (sfs.length == 0) {
        log("   can't add "+s+">"+t+" to constraint "+this.solvedForms);
        return null;
    }
    if (sfChanged) {
        log("   OK, can add "+s+">"+t+" to constraint "+this.solvedForms+" => "+sfs);
        var newInequalities = this.inequalities.copy();
        // newInequalities.push([s,t]);
        newInequalities.push(s+'>'+t);
        return new SubstitutionConstraint(this.equalities, newInequalities, sfs);
    }
    else {
        log("   "+s+">"+t+" is already entailed by "+this.solvedForms);
        return this;
    }
}

SubstitutionConstraint.prototype.toString = function() {
    // var res = [];
    // for (var i=0; i<this.equalities.length; i++) {
    //     res.push(this.equalities[i][0]+'='+this.equalities[i][1]);
    // }
    // for (var i=0; i<this.inequalities.length; i++) {
    //     res.push(this.inequalities[i][0]+'>'+this.inequalities[i][1]);
    // }
    // return res.join(' ');
    return this.equalities.join(' ')+' '+this.inequalities.join(' ');
}


function SolvedForm() {
    this.solvedDict = {}; // mapping v->t, represents that any solution must make
                          // variable v identical to t
    this.solvedDictStr = []; // the same mapping as list of strings 'v=t', in
                             // alphabetic order
    this.inequalities = []; // list of (s>t) term pairs, one side of which is a
                            // variable not in this.solvedDict
    this.inequalitiesStr = []; // the same list as strings 's>t', in alphabetic order
}

SolvedForm.prototype.addEqual = function(s, t) {
    /**
     * check if this SolvedForm can be extended by condition s=t; return
     * list of extended SolvedForms (might be empty list)
     */
    // apply known substitution to s and t:
    var sStr = s.toString();
    var tStr = t.toString();
    for (var v in this.solvedDict) {
        if (sStr.includes(v)) {
            s = Formula.substituteInTerm(s, v, this.solvedDict[v]);
            sStr = s.toString();
        }
        if (tStr.includes(v)) {
            t = Formula.substituteInTerm(t, v, this.solvedDict[v]);
            tStr = t.toString();
        }
    }
    if (sStr == tStr) {
        // constraint is trivial; nothing to add
        log("   [add "+s+"="+t+" to "+this+"?] trivial");
        return [this];
    }
    if (sStr[0] == '??' || sStr[0] == '??') { // s is variable
        // if (this.occursCheck(s,t)) {
        if (this.occursCheckStr(sStr,tStr)) {
            // s occurs in t; unification impossible
            log("   [add "+s+"="+t+" to "+this+"?] no, s occurs in t");
            return [];
        }
        else {
            // add equality between variable s and term t:
            return this.addSubs(s,t);
        }
    }
    else if (tStr[0] == '??' || tStr[0] == '??') { // t is variable
        return this.addEqual(t,s);
    }
    else if (s.isArray && t.isArray) { // both terms functional
        if (s[0] != t[0]) {
            // a substitution can't make g(...) identical to f(....)
            log("   [add "+s+"="+t+" to "+this+"?] no, different function terms");
            return [];
        }
        // add equality condition for all subterms:
        log("   [add "+s+"="+t+" to "+this+"?] checking identity for subterms");
        var res = [this];
        for (var i=1; i<s.length; i++) {
            // add s[i]=t[i] equality to all members of res:
            var newRes = [];
            for (var j=0; j<res.length; j++) {
                newRes.extendNoDuplicates(res[j].addEqual(s[i],t[i]));
            }
            res = newRes;
        }
        return res;
    }
    else return [];
}

SolvedForm.prototype.addSubs = function(v, t) {
    /**
     * return list of new SolvedForms with added substitution <v>-><t>;
     * apply substitution to equalities and inequalities
     */
    var sf = new SolvedForm();
    // first create new solvedDict;
    for (v2 in this.solvedDict) {
        sf.solvedDict[v2] = Formula.substituteInTerm(this.solvedDict[v2], v, t);
        sf.solvedDictStr.push(v2+'='+sf.solvedDict[v2]);
    }
    sf.solvedDict[v] = t;
    sf.solvedDictStr.push(v+'='+t);
    sf.solvedDictStr.sort();
    log("   [add "+v+"="+t+" to "+this+"?] substituting "+v+" by "+t+" in inequalities");
    var res = [sf];
    for (var i=0; i<this.inequalities.length; i++) {
        var ineq = this.inequalities[i];
        // add ineq[0]>ineq[1] to all members of res and set res to the union of
        // the results:
        var newRes = [];
        for (var j=0; j<res.length; j++) {
            newRes.extendNoDuplicates(res[j].addGreater(ineq[0],ineq[1]));
        }
        res = newRes;
    }
    log("   [add "+v+"="+t+" to "+this+"?] result: "+res);
    return res;
}

SolvedForm.prototype.addGreater = function(s, t) {
    /**
     * check if this SolvedForm can be extended by condition s>t; return
     * list of extended SolvedForms (might be empty list)
     */
    var sStr = s.toString();
    var tStr = t.toString();
    // apply known substitution to s and t:
    for (var v in this.solvedDict) {
        if (sStr.includes(v)) {
            s = Formula.substituteInTerm(s, v, this.solvedDict[v]);
            sStr = s.toString();
        }
        if (tStr.includes(v)) {
            t = Formula.substituteInTerm(t, v, this.solvedDict[v]);
            tStr = t.toString();
        }
    }
    var sIsVar = sStr[0] == '??' || sStr[0] == '??';
    var tIsVar = tStr[0] == '??' || tStr[0] == '??';
    if (sIsVar || tIsVar) {
        if (this.inequalitiesStr.includes(sStr+'>'+tStr)) {
            log("   [add "+s+">"+t+" to "+this+"?] yes, already part of constraint");
            return [this];
        }
        if (sIsVar && this.occursCheckStr(sStr,tStr)) {
            // if variable s occurs in t, we can't have s>t:
            log("   [add "+s+">"+t+" to "+this+"?] no, s occurs in t");
            return [];
        }
        else if (tIsVar && this.occursCheckStr(tStr,sStr)) {
            // if variable t occurs in s, we automatically have s>t:
            log("   [add "+s+">"+t+" to "+this+"?] yes, trivially: t occurs in s");
            return [this];
        }
        else {
            // we can't have s>t and also t>s:
            if (this.inequalitiesStr.includes(tStr+'>'+sStr)) {
                log("   [add "+s+">"+t+" to "+this+"?] no, clash with "+this.inequalities[i]);
                return [];
            }
            // create extended sf:
            var sf = this.copy();
            sf.inequalities.push([s,t]);
            sf.inequalitiesStr.push(sStr+'>'+tStr);
            sf.inequalities.sort(); // for comparing sfs
            // here we should ideally check sf.checkSatisfiable()
            log("   [add "+s+">"+t+" to "+this+"?] yes. extended sf is "+sf);
            return [sf];
        }
    }
    var sRoot = s.isArray ? s[0] : s;
    var tRoot = t.isArray ? t[0] : t;
    if (sRoot > tRoot) { // function symbol of s is "greater"
        // f(v1..vn) > g(u1..um); we add f(v1..vn) > u1, ..., f(v1...vn) > um;
        // each of these additions may return a set of SolvedForms.
        log("   [add "+s+">"+t+" to "+this+"?] function symbol of "+s+" is greater");
        var res = [this];
        if (t.isArray) {
            for (var i=1; i<t.length; i++) {
                // try to extend all members of res by s>t[i]; return union of the
                // results:
                var newRes = [];
                for (var j=0; j<res.length; j++) {
                    newRes.extendNoDuplicates(res[j].addGreater(s,t[i]));
                }
                res = newRes;
            }
            log("   [add "+s+">"+t+" to "+this+"?] result: "+res);
        }
        // here we should ideally filter by sf.checkSatisfiable()
        return res;
    }
    else if (tRoot > sRoot) { // function symbol of t is "greater"
        // f(v1..vn) > g(u1..um); we add v1 >= g(u1..um) OR .. OR vn >= g(u1..um)
        log("   [add "+s+">"+t+" to "+this+"?] function symbol in 2nd term is greater; one arg in 1st must be >= 1st term");
        var res = [];
        if (s.isArray) {
            for (var i=1; i<s.length; i++) {
                res.extendNoDuplicates(this.addEqual(s[i],t));
                res.extendNoDuplicates(this.addGreater(s[i],t));
            }
            log("   [add "+s+">"+t+" to "+this+"?] result: "+res);
        }
        // here we should ideally filter by sf.checkSatisfiable()
        return res;
    }
    else { // s and t have same function symbol
        // f(v1..vn) > f(u1..un); we add the following:
        // v1 >= f(u1..un) OR .. OR vn >= f(u1..un)
        // OR (v1 > u1, f(v1..vn) > u2, .., f(v1..vn) > un)
        // OR (v1 = u1, v2 > u2, f(v1..vn) > u3, .., f(v1..vn) > un)
        // ...
        // OR (v1 = u1, v2 = u2, .., vn > un)
        if (!s.isArray) {
            log("   [add "+s+">"+t+" to "+this+"?] no: same constant");
            return [];
        }
        var res = [];
        log("   [add "+s+">"+t+" to "+this+"?] same function symbol; f(..ti..)>f(..si..) if ti>=f(..si..)");
        for (var i=1; i<s.length; i++) { 
            res.extendNoDuplicates(this.addEqual(s[i],t));
            res.extendNoDuplicates(this.addGreater(s[i],t));
        }
        log("   ["+s+">"+t+"?] alternatively, f(..ti..)>f(..si..) if t1=s1,..,ti>si,f(..ti+j..)>si+j");
        var eq = [this];
        for (var i=1; i<s.length; i++) {
            // add s[i]>t[i] to all members of eq:
            var h = [];
            for (var j=0; j<eq.length; j++) {
                h.extendNoDuplicates(eq[j].addGreater(s[i], t[i], 1));
            }
            for (var j=i+1; j<s.length; j++) {
                // add s>t[j] to all members of h:
                var newH = [];
                for (var k=0; k<h.length; k++) {
                    newH.extendNoDuplicates(h[k].addGreater(s[i], t[i], 1));
                }
                h = newH;
            }
            res.extendNoDuplicates(h);
            // add s[i]=t[i] to all members of eq:
            var newEq = [];
            for (var j=0; j<eq.length; j++) {
                newEq.extendNoDuplicates(eq[j].addEqual(s[i], t[i], 1));
            }
            eq = newEq;
        }
        log("   ["+s+">"+t+"?] new sfs: "+res);
        // here we should ideally filter by sf.checkSatisfiable()
        return res;
    }
}

SolvedForm.prototype.occursCheck = function(v, t) {
    /**
     * check if variable v occurs in term t
     */
    if (t[0] == '??' || t[0] == '??') {
        // while (t in this.solvedDict) t = this.solvedDict[t];
        return t == v;
    }
    else if (t.isArray) {
        for (var i=1; i<t.length; i++) {
            if (this.occursCheck(v, t[i])) return true;
        }
    }
    return false;
}

SolvedForm.prototype.occursCheckStr = function(v, t) {
    /**
     * check if variable v occurs in term t
     */
    var ts = t.split(v, 2);
    if (ts.length == 2) {
        return isNaN(ts[1][0]);
    }
    return false;
}

SolvedForm.prototype.checkSatisfiable = function() {
    /**
     * Ideally, we should check if the ordering constraints in a solved form are
     * satisfiable. Franssen 2008 discusses some implementation ideas. In practice,
     * it hurts little to leave out this check: worst case we'll end up sometimes
     * substituting smaller terms by larger terms; this doesn't affect soundness
     * and shouldn't affect completeness given our breadth-first search.
     */
    return true;
}

SolvedForm.prototype.copy = function() {
    var res = new SolvedForm();
    for (key in this.solvedDict) {
        res.solvedDict[key] = this.solvedDict[key];
    }
    res.solvedDictStr = this.solvedDictStr.copy();
    res.inequalities = this.inequalities.copy();
    res.inequalitiesStr = this.inequalitiesStr.copy();
    return res;
}

SolvedForm.prototype.equals = function(sf) {
    if (this.solvedDictStr.join() != sf.solvedDictStr.join()) return false;
    return (this.inequalitiesStr.join() == sf.inequalitiesStr.join());
}

SolvedForm.prototype.toString = function() {
    return '{'+this.solvedDictStr.join(' ')+' '+this.inequalitiesStr.join(' ')+'}';
}
// Formula objects should be treated as immutable.

function Formula() {
    // not actually called, but you may pretend that NegatedFormula etc. are all
    // subclasses of Formula insofar as they inherit Formula.prototype.
}

Formula.prototype.toString = function() {
    // return this.string, but slighly nicer
    if (this.operator && this.operator.match(/[????????????]/)) {
        // remove redundant outer parens
        return this.string.slice(1,-1);
    }
    return this.string;
}

Formula.prototype.equals = function(fla) {
    return this.string == fla.string;
}

Formula.prototype.negate = function() {
    return new NegatedFormula(this);
}

Formula.unifyTerms = function(terms1, terms2) {
    /**
     * check whether list of terms <terms1> can be unified with <terms2>;
     * returns a (most general) unifying substitution (that yields the same term
     * list if applied to <terms1> and <terms2>) if one exists, otherwise false
     *
     * A substitution is an array of terms, which is interpreted as
     * arr[1] -> arr[2], arr[3] -> arr[4], ... (arr[1], arr[3], etc. are variables).
     * 
     * Warning: Don't confuse an empty unifier [] with false!
     */
    var unifier = [];
    var terms1 = terms1.copyDeep(); // copy() doesn't suffice: see pel38 
    var terms2 = terms2.copyDeep();
    var t1, t2;
    while (t1 = terms1.shift(), t2 = terms2.shift()) {
        // log('unify terms? '+t1+' <=> '+t2);
        if (t1 == t2) {
            // terms are equal: nothing to do.
            continue;
        }
        if (t1.isArray && t2.isArray) {
            // both terms are functional: unification fails if function symbols
            // differ (arities can't differ if the function symbol is the same);
            // otherwise add all the argument pairs to the terms that must be
            // unified.
            if (t1[0] != t2[0]) return false;
            for (var i=1; i<t1.length; i++) {
                terms1.push(t1[i]);
                terms2.push(t2[i]);
            }
            continue;
        }
        var t1Var = (t1[0] == '??' || t1[0] == '??');
        var t2Var = (t2[0] == '??' || t2[0] == '??');
        if (!t1Var && !t2Var) {
            // neither term is variable: unification failed
            // log('no, neither term variable');
            return false;
        }
        if (!t1Var) {
            // only second term is a variable: exchange it with first term, so
            // that in what follows the first term is always a variable.
            var temp = t1; t1 = t2; t2 = temp; 
        }
        if (t2.isArray) {
            // t2 is a function term: unification fails if it contains t1 among
            // its arguments (or arguments of its ... arguments).
            var terms, termss = [t2];
            while (terms = termss.shift()) {
                // log(terms);
                for (var i=0; i<terms.length; i++) {
                    if (terms[i].isArray) termss.push(terms[i]);
                    else if (terms[i] == t1) {
                        // log("no, term can't be nested in itself");
                        return false;
                    }
                }
            }
        }
        // now we unify the variable t1 with the term t2: substitute t2 for t1
        // everywhere in the unifier array and in the remaining terms1 and
        // terms2, and add t1/t2 to the unifier array.
        // log('yes');
        var terms, termss = [unifier, terms1, terms2];
        while (terms = termss.shift()) {
            for (var i=0; i<terms.length; i++) {
                if (terms[i].isArray) termss.push(terms[i]);
                else if (terms[i] == t1) terms[i] = t2;
            }
        }
        unifier.push(t1);
        unifier.push(t2);
    }
    return unifier;
}

Formula.prototype.normalize = function() {
    // returns an equivalent formula in negation normal form
    var op = this.operator || this.quantifier;
    if (!op) return this;
    switch (op) {
    case '???' : case '???' : {
        // |A&B| = |A|&|B|
        // |AvB| = |A|v|B|
        var sub1 = this.sub1.normalize();
        var sub2 = this.sub2.normalize();
        return new BinaryFormula(op, sub1, sub2);
    }
    case '???' : {
        // |A->B| = |~A|v|B|
        var sub1 = this.sub1.negate().normalize();
        var sub2 = this.sub2.normalize();
        return new BinaryFormula('???', sub1, sub2);
    }
    case '???' : {
        // |A<->B| = |A&B|v|~A&~B|
        var sub1 = new BinaryFormula('???', this.sub1, this.sub2).normalize();
        var sub2 = new BinaryFormula('???', this.sub1.negate(), this.sub2.negate()).normalize();
        return new BinaryFormula('???', sub1, sub2);
    }
    case '???' : case '???' : {
        // |(Ax)A| = Ax|A|
        return new QuantifiedFormula(op, this.variable, this.matrix.normalize(),
                                     this.overWorlds);
    }
    case '???' : case '???' : {
        // |[]A| = []|A|
        return new ModalFormula(op, this.sub.normalize());
    }
    case '??' : {
        var op2 = this.sub.operator || this.sub.quantifier;
        if (!op2) return this;
        switch (op2) {
        case '???' : case '???' : {
            // |~(A&B)| = |~A|v|~B|
            // |~(AvB)| = |~A|&|~B|
            var sub1 = this.sub.sub1.negate().normalize();
            var sub2 = this.sub.sub2.negate().normalize();
            var newOp = op2 == '???' ? '???' : '???';
            return new BinaryFormula(newOp, sub1, sub2);
        }
        case '???' : {
            // |~(A->B)| = |A|&|~B|
            var sub1 = this.sub.sub1.normalize();
            var sub2 = this.sub.sub2.negate().normalize();
            return new BinaryFormula('???', sub1, sub2);
        }
        case '???' : {
            // |~(A<->B)| = |A&~B|v|~A&B|
            var sub1 = new BinaryFormula('???', this.sub.sub1, this.sub.sub2.negate()).normalize();
            var sub2 = new BinaryFormula('???', this.sub.sub1.negate(), this.sub.sub2).normalize();
            return new BinaryFormula('???', sub1, sub2);
        }
        case '???' : case '???' : {
            // |~(Ax)A| = Ex|~A|
            var sub = this.sub.matrix.negate().normalize();
            return new QuantifiedFormula(op2=='???' ? '???' : '???', this.sub.variable, sub,
                                         this.sub.overWorlds);
        }
        case '???' : case '???' : {
            // |~[]A| = []|~A|
            var sub = this.sub.sub.negate().normalize();
            return new ModalFormula(op2=='???' ? '???' : '???', sub);
        }
        case '??' : {
            // |~~A| = |A|
            return this.sub.sub.normalize();
        }
        }
    }
    }
}

Formula.prototype.removeQuantifiers = function() {
    // return formula with all quantifiers removed; formula must be skolemized
    // and in NNF.
    if (this.matrix) return this.matrix.removeQuantifiers();
    if (this.sub1) {
        var nsub1 = this.sub1.quantifier ?
            this.sub1.matrix.removeQuantifiers() : this.sub1.removeQuantifiers();
        var nsub2 = this.sub2.quantifier ?
            this.sub2.matrix.removeQuantifiers() : this.sub2.removeQuantifiers();
        if (this.sub1 == nsub1 && this.sub2 == nsub2) return this;
        var res = new BinaryFormula(this.operator, nsub1, nsub2);
        return res;
    }
    return this;
}

Formula.prototype.alpha = function(n) {
    // return first/second subformula for sentree alpha expansion
    var f = this;
    if (f.operator == '???') {
        return n == 1 ? f.sub1 : f.sub2;
    }
    // formula is negated
    if (f.sub.operator == '???') {
        return n == 1 ? f.sub.sub1.negate() : f.sub.sub2.negate();
    }
    if (f.sub.operator == '???') {
        return n == 1 ? f.sub.sub1 : f.sub.sub2.negate();
    }
}

Formula.prototype.beta = function(n) {
    // return first/second subformula for sentree beta expansion
    var f = this;
    if (f.operator == '???') {
        return n == 1 ? f.sub1 : f.sub2;
    }
    if (f.operator == '???') {
        return n == 1 ? f.sub1.negate() : f.sub2;
    }
    // We treat A <-> B as expanding to (A&B) | (~A&~B), and ~(A<->B) to
    // (A&~B) | (~A&B); these intermediate notes will be removed before
    // displaying trees.
    if (f.operator == '???') {
        return n == 1 ? new BinaryFormula('???', f.sub1, f.sub2) :
            new BinaryFormula('???', f.sub1.negate(), f.sub2.negate())
    }
    // formula is negated
    if (f.sub.operator == '???') {
        return n == 1 ? f.sub.sub1.negate() : f.sub.sub2.negate();
    }
    if (f.sub.operator == '???') {
        return n == 1 ? new BinaryFormula('???', f.sub.sub1, f.sub.sub2.negate()) :
            new BinaryFormula('???', f.sub.sub1.negate(), f.sub.sub2)
    }
}

function AtomicFormula(predicate, terms) {
    this.type = 'literal';
    this.predicate = predicate;
    this.terms = terms; // a,b,f(a,g(c),d) => a,b,[f,a,[g,c],d]
    if (this.predicate == '=') {
        this.string = AtomicFormula.terms2string([this.terms[0]])+'='+
            AtomicFormula.terms2string([this.terms[1]]);
        // In modal trees, even identity formulas have an extra world argument.
        // However, we don't reflect it in this.string. As a consequence, identity
        // formulas are treated as if they held at all worlds. For example, two
        // nodes =(a,b,w) and ??=(a,b,v) are treated as complementary, because
        // we search for complementary nodes by looking at formula.string
    }
    else {
        this.string = predicate + AtomicFormula.terms2string(terms);
    }
}

AtomicFormula.terms2string = function(list, separator) {
    return list.map(function(term) {
        if (term.isArray) {
            var sublist = term.copy();
            var funcsym = sublist.shift();
            return funcsym+'('+AtomicFormula.terms2string(sublist,',')+')';
        }
        else return term;
    }).join(separator || '');
}

AtomicFormula.prototype = Object.create(Formula.prototype);

AtomicFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
    // return new formula with all occurrences of <origTerm> replaced by
    // <newTerm>. If <shallow>, don't replace terms in function arguments
    if (typeof(origTerm) == 'string' && this.string.indexOf(origTerm) == -1) {
        return this;
    }
    var newTerms = Formula.substituteInTerms(this.terms, origTerm, newTerm, shallow);
    if (!this.terms.equals(newTerms)) {
        return new AtomicFormula(this.predicate, newTerms);
    }
    else return this;
}

Formula.substituteInTerm = function(term, origTerm, newTerm) {
    // return a copy of <term> with all occurrences of <origTerm> replaced
    // by <newTerm>
    if (term == origTerm) return newTerm;
    if (term.isArray) return Formula.substituteInTerms(term, origTerm, newTerm);
    return term;
}

Formula.substituteInTerms = function(terms, origTerm, newTerm, shallow) {
    // return a copy of <terms> with all occurrences of <origTerm> replaced
    // by <newTerm>. If <shallow>, don't replace terms in function arguments
    var newTerms = [];
    for (var i=0; i<terms.length; i++) {
        var term = terms[i];
        if (term.toString() == origTerm.toString()) newTerms.push(newTerm);
        else if (term.isArray && !shallow) {
            newTerms.push(Formula.substituteInTerms(term, origTerm, newTerm));
        }
        else newTerms.push(term);
    }
    return newTerms;
}


function QuantifiedFormula(quantifier, variable, matrix, overWorlds) {
    this.quantifier = quantifier;
    this.variable = variable;
    this.matrix = matrix;
    this.overWorlds = overWorlds;
    if (overWorlds) {
        this.type = quantifier == '???' ? 'modalGamma' : 'modalDelta';
    }
    else {
        this.type = quantifier == '???' ? 'gamma' : 'delta';
    }
    this.string = quantifier + variable + matrix.string;
    // We could now set this.parser.isPropositional = false, so that ???xP counts
    // as a non-propositional formula; OTOH, it's useful to have
    // parser.isPropositional true for modal formulas. So we only set
    // parser.isPropositional in AtomicFormula and treat ???xP as propositional.
}

QuantifiedFormula.prototype = Object.create(Formula.prototype);

QuantifiedFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
    // return new formula with all free occurrences of <origTerm> replaced
    // by <newTerm>. If <shallow>, don't replace terms in function arguments
    if (this.variable == origTerm) return this;
    var nmatrix = this.matrix.substitute(origTerm, newTerm, shallow);
    if (nmatrix == this.matrix) return this;
    return new QuantifiedFormula(this.quantifier, this.variable, nmatrix, this.overWorlds);
}

function BinaryFormula(operator, sub1, sub2) {
    this.operator = operator;
    this.sub1 = sub1;
    this.sub2 = sub2;
    this.type = operator == '???' ? 'alpha' : 'beta';
    var space = sub1.string.length+sub2.string.length > 3 ? ' ' : '';
    this.string = '(' + sub1.string + space + operator + space + sub2.string + ')';
}

BinaryFormula.prototype = Object.create(Formula.prototype);

BinaryFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
    // return new formula with all free occurrences of <origTerm> replaced
    // by <newTerm>. If <shallow>, don't replace terms in function arguments
    var nsub1 = this.sub1.substitute(origTerm, newTerm, shallow);
    var nsub2 = this.sub2.substitute(origTerm, newTerm, shallow);
    if (this.sub1 == nsub1 && this.sub2 == nsub2) return this;
    return new BinaryFormula(this.operator, nsub1, nsub2);
}

function ModalFormula(operator, sub) {
    this.operator = operator;
    this.sub = sub;
    this.type = operator == '???' ? 'modalGamma' : 'modalDelta';
    this.string = operator + sub.string;
}

ModalFormula.prototype = Object.create(Formula.prototype);

ModalFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
    // return new formula with all free occurrences of <origTerm> replaced
    // by <newTerm>. If <shallow>, don't replace terms in function arguments
    var nsub = this.sub.substitute(origTerm, newTerm, shallow);
    if (this.sub == nsub) return this;
    return new ModalFormula(this.operator, nsub);
}

function NegatedFormula(sub) {
    this.operator = '??';
    this.sub = sub;
    this.type = NegatedFormula.computeType(sub);
    this.string = '??' + sub.string;
}

NegatedFormula.computeType = function(sub) {
    if (sub.operator == '??') return 'doublenegation';
    switch (sub.type) {
    case 'literal': { return 'literal'; }
    case 'alpha': { return 'beta'; }
    case 'beta': { return sub.operator == '???' ? 'beta' : 'alpha'; }
    case 'gamma': { return 'delta'; }
    case 'delta': { return 'gamma'; }
    case 'modalGamma': { return 'modalBeta'; }
    case 'modalDelta': { return 'modalGamma'; }
    }
}

NegatedFormula.prototype = Object.create(Formula.prototype);

NegatedFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
    // return new formula with all free occurrences of <origTerm> replaced
    // by <newTerm>. If <shallow>, don't replace terms in function arguments
    var nsub = this.sub.substitute(origTerm, newTerm, shallow);
    if (this.sub == nsub) return this;
    return new NegatedFormula(nsub);
}

// This file deals with the user interface.

var flaFieldValue = '';
function updateInput() {
    // called on page load and keyup events to render symbols and toggle the
    // accessibility row
    var ostr = document.forms[0].flaField.value;
    if (ostr == flaFieldValue) {
        // no change; e.g. curser moved to highlight part of formula
        return true;
    }
    cposition = this.selectionStart;
    flaFieldValue = renderSymbols(ostr);
    var diff = ostr.length - flaFieldValue.length
    document.forms[0].flaField.value = flaFieldValue;
    this.selectionEnd = cposition - diff;
    toggleAccessibilityRow();
}

function renderSymbols(str) {
    str = str.replace(/&|\^| and/ig, '???');
    str = str.replace(/ v | or/ig, ' ??? '); // 'v' letter => or symbol
    str = str.replace(/~| not/ig, '??');
    str = str.replace(/<->|<=>| iff/ig, '???');
    str = str.replace(/->|=>| then/g, '???');
    str = str.replace(/\[\]/g, '???');
    str = str.replace(/<>|???/g, '???');
    str = str.replace(/!|???/g, '???');
    str = str.replace(/\?/g, '???');
    str = str.replace(/\(A([s-z])\)/g, '???$1'); // (Ax) => ???x
    str = str.replace(/\(E([s-z])\)/g, '???$1'); // (Ex) => ???x
    str = str.replace(/(?:^|\W)\(([s-z])\)/g, '???$1'); // (x) => ???x, but not f(x) => f???x
    str = str.replace(/\\?forall[\{ ]?\}?/g, '???');
    str = str.replace(/\\?exists[\{ ]?\}?/g, '???');
    str = str.replace(/(\\neg|\\lnot)[\{ ]?\}?/g, '??');
    str = str.replace(/(\\vee|\\lor)[\{ ]?\}?/g, '???');
    str = str.replace(/(\\wedge|\\land)[\{ ]?\}?/g, '???');
    str = str.replace(/(\\to|\\rightarrow)[\{ ]?\}?/g, '???');
    str = str.replace(/\\leftrightarrow[\{ ]?\}?/g, '???');
    str = str.replace(/\\[Bb]ox[\{ ]?\}?/g, '???');
    str = str.replace(/\\[Dd]iamond[\{ ]?\}?/g, '???');
    return str;
}

function toggleAccessibilityRow() {
    if (/[??????]/.test(document.forms[0].flaField.value)) {
        document.getElementById('accessibilitySpan').style.display = 'inline-block';
    }
    else {
        document.getElementById('accessibilitySpan').style.display = 'none';
    }
}

// define method to insert character at caret position upon button click: 
document.forms[0].flaField.insertAtCaret = function(str) {
   if (document.selection) {
      // Internet Explorer
      this.focus();
      sel = document.selection.createRange();
      sel.text = str;
      this.focus();
   }
   else if (this.selectionStart || this.selectionStart === 0) {
      // Firefox and Webkit
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      var val = this.value; 
      this.value = val.substring(0, startPos)+str+val.substring(endPos,val.length);
      this.focus();
      this.selectionStart = startPos + str.length;
      this.selectionEnd = startPos + str.length;
      this.scrollTop = scrollTop;
   } 
   else {
      this.value += str;
      this.focus();
   }
}

document.querySelectorAll('.symbutton').forEach(function(el) {
    el.onclick = function(e) {
        var field = document.forms[0].flaField;
        var command = this.innerHTML;
        field.insertAtCaret(command);
        toggleAccessibilityRow();
    }
});

var prover = null;
function startProof() {
    var input = document.forms[0].flaField.value;
    var parser = new Parser();
    try {
        var parsedInput = parser.parseInput(input);
    }
    catch (e) {
        if (input.indexOf('v') > -1) {
            e += "\nIf you mean disjunction by the letter 'v', put a space on either side.";
        }
        alert(e);
        return false;
    }
    var premises = parsedInput[0];
    var conclusion = parsedInput[1];
    var initFormulas = premises.concat([conclusion.negate()]);
    document.getElementById("intro").style.display = "none";
    document.getElementById("model").style.display = "none";
    document.getElementById("rootAnchor").style.display = "none";
    document.getElementById("backtostartpage").style.display = "block";
    document.getElementById("status").style.display = "block";
    document.getElementById("statusmsg").innerHTML = "something went wrong: please email wo@umsu.de and tell me what you did";
    document.getElementById("statusbtn").style.display = "block";
    document.getElementById("statusbtn").innerHTML = "stop";
    
    // Now a free-variable tableau is created. When the proof is finished,
    // prover.finished() is called.
    var accessibilityConstraints = [];
    if (parser.isModal) {
        document.querySelectorAll('.accCheckbox').forEach(function(el) {
            if (el.checked) {
                // accFla = parser.parseAccessibilityFormula(el.value);
                accessibilityConstraints.push(el.id);
            }
        });
    }
    prover = new Prover(initFormulas, parser, accessibilityConstraints);
    prover.onfinished = function(treeClosed) {
        // The prover has finished. Show result:
        var conclusionSpan = "<span class='formula'>"+conclusion+"</span>";
        if (initFormulas.length == 1) {
            var summary = conclusionSpan + " is " + (treeClosed ? "valid." : "invalid.");
        }
        else {
            var summary = premises.map(function(f){
                return "<span class='formula'>"+f+"</span>";
            }).join(', ') + (treeClosed ? " entails " : " does not entail ") + conclusionSpan + ".";
        }
        document.getElementById("statusmsg").innerHTML = summary;
        document.getElementById("statusbtn").style.display = "none";
        // Translate the free-variable tableau into a sentence tableau:
        var sentree = new SenTree(this.tree, parser); 
        if (!treeClosed) {
            // Tree is open. Display a countermodel if one is known:
            // if (!this.counterModel) this.counterModel = sentree.getCounterModel();
            if (this.counterModel) {
                document.getElementById("model").style.display = "block";
                document.getElementById("model").innerHTML = "<b>Countermodel:</b><br>" +
                    this.counterModel.toHTML();
            }
            return; 
        }
        // Start painting the tree:
        document.getElementById("rootAnchor").style.display = "block";
        self.painter = new TreePainter(sentree, document.getElementById("rootAnchor"));
        self.painter.finished = function() { addExportButtons(); }
        self.painter.paintTree();
    }
    prover.status = function(txt) {
        document.getElementById("statusmsg").innerHTML = txt;
    }
    setTimeout(function(){
        prover.start();
    }, 1);
    return false;
}

document.getElementById("statusbtn").onclick = function(e) {
    // handle clicks on 'stop'/'continue' button
    var btn = document.getElementById("statusbtn");
    if (btn.innerText == 'stop') {
        btn.innerText = 'continue';
        prover.stop();
    }
    else {
        btn.innerText = 'stop';
        prover.start();
    }
}
   
onload = function(e) {
    // in case the browser has automatically filled in some value into the
    // field (e.g. on reload):
    updateInput();
    // register event handlers:
    document.forms[0].flaField.onkeyup = updateInput;
    document.forms[0].onsubmit = function(e) {
        setTimeout(function() {
            setHash();
            startProof();
        }, 1);
        return false;
    }
    // start proof submitted via URL (e.g. from back button):
    if (location.search.startsWith('?f=')) {
        location.hash = location.search.substring(3);
        hashChange();
    }
    else if (location.hash.length > 0) {
        hashChange();
    }
    document.forms[0].flaField.focus();
}

var hashSetByScript = false;
function setHash() {
    // store input in URL when submitting the form:
    hashSetByScript = true; // prevent hashChange()
    var hash = encodeInputToHash(document.forms[0].flaField.value);
    if (document.getElementById('accessibilitySpan').style.display != 'none') {
        var accessibilityConstraints = [];
        document.querySelectorAll('.accCheckbox').forEach(function(el) {
            if (el.checked) {
                accessibilityConstraints.push(el.id);
            }
        });
        if (accessibilityConstraints.length > 0) {
            hash += '||'+accessibilityConstraints.join('|');
        }
    }
    location.hash = hash;
}

window.onhashchange = hashChange;

function hashChange() {
    if (hashSetByScript) {
        hashSetByScript = false;
        return;
    }
    // input submitted via URL or through back button; in the second case there
    // might be a prover running.
    if (prover) prover.stop();
    if (location.hash.length == 0) {
        document.getElementById("intro").style.display = "block";
        document.getElementById("model").style.display = "none";
        document.getElementById("rootAnchor").style.display = "none";
        document.getElementById("backtostartpage").style.display = "none";
        document.getElementById("status").style.display = "none";
    }
    else {
        var hashparts = location.hash.split('||');
        document.forms[0].flaField.value = decodeHashToInput(hashparts[0].substring(1));
        var accessibilityConstraints = hashparts[1] ? hashparts[1].split('|') : [];
        document.querySelectorAll('.accCheckbox').forEach(function(el) {
            el.checked = accessibilityConstraints.includes(el.id); 
        });
        toggleAccessibilityRow();
        startProof();
    }
}

function encodeInputToHash(input) {
    /**
     * convert the string in the input field into something that can safely be
     * put in the URL
     */
    var symbols = ' ??????????????????????????';
    inputNoSpaces = input.replace(/\s/g, '');
    var hash = inputNoSpaces.replace(new RegExp('['+symbols+']', 'g'), function(match) {
        return '~'+symbols.indexOf(match);
    });
    return hash;
}

function decodeHashToInput(hash) {
    /**
     * invert encodeInputToHash
     */
    if (hash.indexOf('%') > -1) {
        // old way of specifing input in URL hash, and use of unusual symbols
        hash = decodeURIComponent(hash.replace(/\+/g, '%20'));
    }
    var symbols = ' ??????????????????????????';
    return hash.replace(/~./g, function(match) {
        return symbols[parseInt(match[1])];
    });
}

// functions to export tree as png:

function addExportButtons() {
    var el = document.createElement('div');
    el.id = 'exportDiv';
    el.style.position = 'absolute';
    var treeCoords = getTreeCoords();
    el.style.top = (treeCoords.bottom-treeCoords.top)/painter.scale + 'px';
    var width = (treeCoords.right-treeCoords.left)/painter.scale;
    el.style.width = width+'px';
    el.style.left = Math.round(width/-2) +'px'
    el.innerHTML = '<button onclick="exportImage()">save as png</button>';
    painter.rootAnchor.firstChild.appendChild(el);
}

function getTreeCoords() {
    // dict 'left', 'right', 'top', 'bottom'
    rootCoords = document.getElementById('rootAnchor').getBoundingClientRect();
    var treeCoords = {
        left: rootCoords.left,
        right: rootCoords.right,
        top: rootCoords.top,
        bottom: rootCoords.bottom
    };
    document.querySelectorAll('.treeNode').forEach(function(el) {
        var coords = el.getBoundingClientRect();
        if (coords.left < treeCoords.left) treeCoords.left = Math.round(coords.left);
        if (coords.right > treeCoords.right) treeCoords.right = Math.round(coords.right);
        if (coords.bottom > treeCoords.bottom) treeCoords.bottom = Math.round(coords.bottom);
    });
    log('tree coords: '+treeCoords.top+','+treeCoords.right+','+treeCoords.bottom+','+treeCoords.left);
    return treeCoords;
}

function getTreeHTML() {
    // returns HTML of tree, in idiosyncratic browser format. E.g., in Firefox
    // outerHTML does not include the dynamically set style properties for
    // position of subelements, instead it includes non-standard 'inset'
    // properties. To export cross-browser suitable HTML, we could add a
    // 'data-style' attribute to all elements whose value we set to the computed
    // style; after collecting rootAnchor.outerHTML, we could then rename that
    // attribute to 'style'. But the present code is sufficient for generating
    // an image.
    var root = document.getElementById('rootAnchor');
    // Note: inner/outerHTML does not include default styles from style.css; so
    // we have to add these; window.getComputedStyle() returns all style
    // properties, we only want the non-default ones.
    defaultStyles = {
        'DIV' : getDefaultStyle('div'),
        'SPAN' : getDefaultStyle('span')
    }
    document.querySelectorAll('#rootAnchor *').forEach(function(el) {
        var computedStyle = window.getComputedStyle(el);
        var defaultStyle = defaultStyles[el.tagName];
        if (!defaultStyle) return;
        for (var i=0; i<computedStyle.length; i++) {
            var cssProperty = computedStyle[i];
            var cssValue = computedStyle.getPropertyValue(cssProperty);
            if (defaultStyle[cssProperty] != computedStyle[cssProperty]) {
                el.style[cssProperty] = cssValue;
            }
        }
    });
    document.getElementById('exportDiv').style.display = 'none';
    var html = root.outerHTML;
    document.getElementById('exportDiv').style.display = 'block';
    // adjust location of root element:
    var treeCoords = getTreeCoords();
    var width = treeCoords.right - treeCoords.left;
    html = html.replace(/id="rootAnchor".+?>/, 'id="rootAnchor" style="position:relative; left:'+(width/2)+'px;">');
    return html;
}

function getDefaultStyle(tagName) {
    var defaultStyle = {};
    var element = document.body.appendChild(document.createElement(tagName));
    var computedStyle = window.getComputedStyle(element);
    for (var i=0; i < computedStyle.length; i++) {
        defaultStyle[computedStyle[i]] = computedStyle[computedStyle[i]];
    }
    document.body.removeChild(element);
    return defaultStyle;
}

function exportImage() {
    log('converting tree to image')
    // To create the image, we first need to move the external google fonts inline:
    if (!document.getElementById('localfontstyle')) {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            '<link rel="stylesheet" id="localfontstyle" href="font.css" onload="exportImage()" type="text/css" />');
        return;
    }
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var treeCoords = getTreeCoords();
    width = treeCoords.right - treeCoords.left;
    height = treeCoords.bottom - treeCoords.top;
    canvas.width = width;
    canvas.height = height;
    var tempImg = document.createElement('img');
    tempImg.addEventListener('load', function(el) {
        ctx.drawImage(el.target, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        var downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', 'proof.png');
        var url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
        downloadLink.setAttribute('href', url);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
    tempImg.addEventListener('error', function(el) {
        alert("sorry, this doesn't seem to work in your browser");
    });
    var html = getTreeHTML();
    html = html.replace(/<br>/g, '<br/>');
    var style = '';
    var cssRules = document.styleSheets[2].cssRules;
    for (var i=0; i<cssRules.length; i++) {
        style += cssRules[i].cssText;
    }
    xml = '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">'
    xml += '<defs><style>' + style + '</style></defs>';
    xml += '<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">'+html+'</div></foreignObject>';
    xml += '</svg>'
    log('<xmp>'+xml+'</xmp>');
    tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(xml);
}

/**
 * Often there are simple countermodels that are hard to find through the tree
 * method; so we run a separate algorithm to find countermodels.
 * 
 * In outline, this works as follows.
 * 
 * 1. We transform the (demodalized) formulas for which we want to find a model
 *    into clausal normal form, using prenexing and skolemization to remove
 *    quantifiers. A CNF is a conjunction (represented as a list) of
 *    disjunctions ("clauses", also lists). Free variables are read as
 *    universal.
 * 
 * 2. We now start with a domain of size 1, namely { 0 }. We add further
 *    elements until a model is found. For each domain, we do the following:
 * 
 * 3. We replace free (i.e. universal) variables in the list of clauses by
 *    numbers. So for domain { 0,1 }, [Fx] would be replaced by two clauses,
 *    [F0] and [F1].
 * 
 * 4. We process the list of clauses from left to right, starting with an empty
 *    interpretation relative to which all literals are neither true nor false.
 *    At each step, we look at one literal in one clause, with the aim of making
 *    it true. If it can't be made true, we remove it from the clause list. If
 *    it can be made true, we simplify the remaining clauses by substituting all
 *    occurrences of newly interpreted terms by their values (e.g. turning Ac
 *    into A0), removing clauses for which any literal is settled true, and
 *    removing literals that are settled false.
 * 
 * Models for originally modal formulas (which we recognize from parser.isModal
 * == true) have two domains, W and D. The elements of W are also natural
 * numbers starting with 0. Accessibility conditions like reflexivity are added
 * to the formulas for which we want to find a model. In modal models, all
 * predicates take a world as their last argument; 'R' takes two worlds,
 * function terms only take individuals.
 */

function ModelFinder(initFormulas, parser, accessibilityConstraints, s5) {
    /**
     * Prototype for a modelfinder
     * 
     * <initFormulas> is a list of demodalized formulas in NNF for which we try
     * to find a model; <accessibilityConstraints> is another such list, for
     * modal models; <s5> is boolean.
     */
    log("*** creating ModelFinder");
    
    this.parser = parser;
    this.s5 = s5;
    
    if (s5) {
        accessibilityConstraints = [];
        initFormulas = initFormulas.map(function(f) {
            return parser.stripAccessibilityClauses(f);
        });
    }
    
    // collect expressions whose interpretation should be displayed in the
    // model (before adding skolem terms):
    this.predicates = parser.getSymbols('predicate');
    if (s5) this.predicates.remove(parser.R);
    this.constants = parser.getSymbols('individual constant');
    this.funcSymbols = parser.getSymbols('function symbol');
    if (parser.isModal) {
        this.constants.unshift(parser.w);
    }
    
    // break down initFormulas and accessibilityConstraints into clauses:
    initFormulas = initFormulas.concat(accessibilityConstraints || []);
    this.clauses = this.getClauses(initFormulas);
    
    // initialize model:
    var numIndividuals = 1;
    var numWorlds = this.parser.isModal ? 1 : 0;
    this.model = new Model(this, numIndividuals, numWorlds);
    
    // set up list of alternative models for backtracking
    this.alternativeModels = [];
}

ModelFinder.prototype.getClauses = function(formulas) {
    /**
     * convert <formulas> into clausal normal form and return combined list of
     * clauses.
     *
     * A clausal normal form is a list (interpreted as conjunction) of
     * "clauses", each of which is a list (interpreted as disjunction) of
     * literals. Variables are understood as universal; existential quantifiers
     * are skolemized away.
     */
    var res = [];
    for (var i=0; i<formulas.length; i++) {
        var formula = formulas[i]; 
        log('getting clauses from '+formula);
        var distinctVars = this.makeVariablesDistinct(formula);
        log('distinctVars: '+distinctVars);
        var skolemized = this.skolemize(distinctVars);
        log('skolemized: '+skolemized);
        var quantifiersRemoved = skolemized.removeQuantifiers();
        log('qantifiers removed: '+quantifiersRemoved);
        var clauses = this.tseitinCNF(quantifiersRemoved);
        // var clauses = this.cnf(quantifiersRemoved);
        log('cnf: '+clauses);
        res.extendNoDuplicates(clauses);
    }
    // order clauses by length (number of disjuncts):
    res.sort(function(a,b){ return a.length - b.length; });
    log('all clauses: '+res);
    res = this.simplifyClauses(res);
    log('simplified clauses: '+res);
    return res;
}

ModelFinder.prototype.makeVariablesDistinct = function(formula) {
    /**
     * return an equivalent variant of <formula> that doesn't reuse the same
     * variable (for conversion to prenex normal form); <formula> must be in
     * NNF.
     */
    var usedVariables = arguments[1] || [];
    var parser = this.parser;
    // log('making variables distinct in '+formula+' (used '+usedVariables+')');
    if (formula.matrix) {
        var nmatrix = formula.matrix;
        var nvar = formula.variable;
        if (usedVariables.includes(formula.variable)) {
            // log('need new variable instead of '+formula.variable);
            nvar = parser.expressionType[nvar] == 'world variable' ?
                parser.getNewWorldVariable() : parser.getNewVariable();
            nmatrix = nmatrix.substitute(formula.variable, nvar);
        }
        usedVariables.push(nvar);
        nmatrix = this.makeVariablesDistinct(nmatrix, usedVariables);
        // log('back at '+formula+': new matrix is '+nmatrix);
        if (nmatrix == formula.matrix) return formula;
        return new QuantifiedFormula(formula.quantifier, nvar, nmatrix, formula.overWorlds);
    }
    if (formula.sub1) {
        var nsub1 = this.makeVariablesDistinct(formula.sub1, usedVariables);
        var nsub2 = this.makeVariablesDistinct(formula.sub2, usedVariables);
        if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
        return new BinaryFormula(formula.operator, nsub1, nsub2);
    }
    // literal:
    return formula;
}

ModelFinder.prototype.skolemize = function(formula) {
    /**
     * return <formula> with existential quantifiers skolemized away
     */
    log('skolemizing '+formula);
    var boundVars = arguments[1] ? arguments[1].copy() : [];
    // log(formula.string+' bv: '+boundVars);
    var parser = this.parser;
    if (formula.quantifier == '???') {
        // skolemize on variables that are bound at this point and that occur in
        // the matrix (ignoring formula.variable)
        var skolemVars = [];
        boundVars.forEach(function(v) {
            if (formula.matrix.string.indexOf(v) > -1) skolemVars.push(v);
        });
        var isWorldType = parser.expressionType[formula.variable] == 'world variable';
        var skolemTerm;
        if (skolemVars.length > 0) {
            var funcSymbol = parser.getNewFunctionSymbol(skolemVars.length, isWorldType);
            var skolemTerm = skolemVars;
            skolemTerm.unshift(funcSymbol);
        }
        else skolemTerm = isWorldType ? parser.getNewWorldName() : parser.getNewConstant();
        var nmatrix = formula.matrix.substitute(formula.variable, skolemTerm); 
        // nmatrix.constants.push(skolemVars.length > 0 ? funcSymbol : skolemTerm);
        nmatrix = this.skolemize(nmatrix, boundVars);
        return nmatrix;
    }
    if (formula.quantifier) { // ???
        boundVars.push(formula.variable);
        var nmatrix = this.skolemize(formula.matrix, boundVars);
        if (nmatrix == formula.matrix) return formula;
        return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix,
                                     formula.overWorlds);
    }
    if (formula.sub1) {
        var nsub1 = this.skolemize(formula.sub1, boundVars);
        var nsub2 = this.skolemize(formula.sub2, boundVars);
        if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
        return new BinaryFormula(formula.operator, nsub1, nsub2);
    }
    // literal:
    return formula;
}

ModelFinder.prototype.tseitinCNF = function(formula) {
    /**
     * convert <formula> into CNF.
     *
     * We use a kind of tseitin transform to keep the number of clauses under
     * control. The tseitin transform of a propositional formula F is created by
     * introducing a new sentence letter $ for each non-atomic subformula of F
     * and listing the equivalences between $ and the relevant subformula, with
     * non-trivial subsubformulas replaced by their tseitin letters. E.g., for F
     * = p -> ~q, we would list
     * 
     *    $ <-> ~q
     *    $' <-> (p -> $1).
     * 
     * The tseitin transform of F is the tseitin letter for the whole formula
     * conjoined with the equivalences:
     * 
     *    $' & ($ <-> ~q) & ($' <-> (p -> $)).
     *
     * The tseitin CNF converts this into a conjunction of disjunctions.
     *
     * We have to be careful with free variables. Consider ???xFx ??? ???xGx.
     * Skolemized, this becomes ??Fx ??? Ga. The tseitin CNF of that is
     *
     * ($ ??? ??Fx) ??? ($ ??? Ga).
     *
     * If we create the instantiances of this universal requirement for all
     * members of domain { 0,1 }, we get
     *
     * ($ ??? ??F0) ??? ($ ??? Ga) and
     * ($ ??? ??F1) ??? ($ ??? Ga),
     *
     * which wrongly requires F0 ??? F1. So we don't use new proposition letters
     * $, but first-order formulas: with $x instead of $, the transform is
     * 
     * ($x ??? ??Fx) ??? ($x ??? Ga).
     *
     * The instances are
     *
     * ($0 ??? ??F0) ??? ($0 ??? Ga) and
     * ($1 ??? ??F1) ??? ($1 ??? Ga).
     * 
     */
    if (formula.type == 'literal') {
        return [[formula]];
    }

    log('creating tseitin transform of '+formula);
    if (formula.operator == '???') {
        // TCNF(A & B) = [TCNF(A), TCNF(B)]:
        var res = this.tseitinCNF(formula.sub1).concatNoDuplicates(
            this.tseitinCNF(formula.sub2))
        res.sort(function(a,b){ return a.length - b.length; });
        return res;
    }
    
    // collect all non-atomic subformulas:
    var subformulas = this.tseitinSubFormulas([formula]).removeDuplicates();
    // sort by increasing complexity:
    subformulas.sort(function(a,b) {
        return tseitinComplexity(a) - tseitinComplexity(b);
    });
    // Now introduce a new atomic formula for each non-literal subformula.
    if (!this.tseitsinFormulas) {
        this.tseitsinFormulas = {}; // subformula => formula, so that we use the
                                    // same tseitsin formula for the same
                                    // subformula in different <formula>s
    }
    var clauses = [];
    while (subformulas.length) {
        var subf = subformulas.shift();
        log('  subformula '+subf)
        var p = this.tseitsinFormulas[subf.string];
        if (!p) {
            var vars = this.parser.getVariables(subf); // optimise!
            var pSym = this.parser.getNewSymbol('$', 'tseitin predicate', vars.length);
            p = new AtomicFormula(pSym, vars);
            this.tseitsinFormulas[subf.string] = p;
            // add 'p <-> S':
            var bicond = new BinaryFormula('???', p, subf);
            clauses.extendNoDuplicates(this.cnf(bicond));
            log('  adding clause for '+bicond+': '+clauses);
        }
        // else log('subformula already known');
        if (subformulas.length == 0) {
            // add p itself:
            clauses.extendNoDuplicates([[p]]);
            log('  adding tseitin formula '+p);
        }
        // replace all occurrences of sentence in the list by p:
        for (var i=0; i<subformulas.length; i++) {
            subformulas[i] = this.tseitinReplace(subformulas[i], subf, p);
        }
    }
    clauses.sort(function(a,b){ return a.length - b.length; });
    return clauses;

    function tseitinComplexity(formula) {
        // return degree of complexity of <formula>, for sorting
        if (formula.sub) {
            return 1 + tseitinComplexity(formula.sub);
        }
        if (formula.sub1) {
            return 1 + Math.max(tseitinComplexity(formula.sub1),
                                tseitinComplexity(formula.sub2));
        }
        return 0;
    }

}

ModelFinder.prototype.tseitinSubFormulas = function(formulas) {
    /**
     * return non-literal subformulas of <formulas>
     */
    var res = []
    for (var i=0; i<formulas.length; i++) {
        if (formulas[i].type != 'literal') {
            var subformulas = formulas[i].sub ? [formulas[i].sub] :
                formulas[i].sub1 ? [formulas[i].sub1, formulas[i].sub2] : null;
            res.extend(this.tseitinSubFormulas(subformulas));
            res.unshift(formulas[i]);
        }
    }
    return res;
}

ModelFinder.prototype.tseitinReplace = function(formula, f1, f2) {
    /**
     * replace all occurrences of <f1> in <formula> by <f2>:
     */
    if (formula.equals(f1)) return f2;
    if (formula.sub) {
        var nsub = this.tseitinReplace(formula.sub, f1, f2);
        if (nsub == formula.sub) return formula;
        return new NegatedFormula(nsub);
    }
    if (formula.sub1) {
        var nsub1 = this.tseitinReplace(formula.sub1, f1, f2);
        var nsub2 = this.tseitinReplace(formula.sub2, f1, f2);
        if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
        return new BinaryFormula(formula.operator, nsub1, nsub2);
    }
    return formula;
}

ModelFinder.prototype.cnf = function(formula) {
    /**
     * convert <formula> to CNF; formula need not be in NNF (because of tseitin
     * transformations)
     */
    if (formula.type == 'literal') {
        // return CNF with 1 clause containing 1 literal:
        return [[formula]];
    }
    // optimize: remove creation of negated formulas through negate() etc.?
    var con, dis;
    switch (formula.operator) {
    case '???': {
        con = [this.cnf(formula.sub1), this.cnf(formula.sub2)];
        break;
    }
    case '???': {
        dis = [this.cnf(formula.sub1), this.cnf(formula.sub2)];
        break;
    }
    case '???': {
        dis = [this.cnf(formula.sub1.negate()), this.cnf(formula.sub2)];
        break;
    }
    case '???' : {
        con1 = this.cnf(new BinaryFormula('???', formula.sub1, formula.sub2));
        con2 = this.cnf(new BinaryFormula('???', formula.sub2, formula.sub1));
        con = [con1, con2];
        break;
    }
    case '??' : {
        var sub = formula.sub;
        switch (sub.operator) {
        case '???': {
            dis = [this.cnf(sub.sub1.negate()), this.cnf(sub.sub2.negate())];
            break;
        }
        case '???': {
            con = [this.cnf(sub.sub1.negate()), this.cnf(sub.sub2.negate())];
            break;
        }
        case '???': {
            con = [this.cnf(sub.sub1), this.cnf(sub.sub2.negate())];
            break;
        }
        case '???' : {
            // dis1 = this.cnf(new BinaryFormula('???', sub.sub1, sub.sub2.negate()));
            // dis2 = this.cnf(new BinaryFormula('???', sub.sub1.negate(), sub.sub2));
            // dis = [dis1, dis2];
            con1 = this.cnf(new BinaryFormula('???', sub.sub1, sub.sub2));
            con2 = this.cnf(new BinaryFormula('???', sub.sub1.negate(), sub.sub2.negate()));
            con = [con1, con2];
            break;
        }
        case '??' : {
            return this.cnf(sub.sub);
        }
        }
    }
    }
    var res = [];
    if (con) {
        // con1 is [C1, C2 ...], con2 is [D1, D2, ...], where the elements are
        // clauses; return [C1, C2, ..., D1, D2, ...]:
        res = con[0].concatNoDuplicates(con[1]);
    }
    else if (dis) {
        // dis1 is [C1, C2 ...], dis2 is [D1, D2, ...], where the elements are
        // disjunctions of literals; (C1 & C2 & ...) v (D1 & D2 & ..) is
        // equivalent to (C1 v D1) & (C1 v D2) & ... (C2 v D1) & (C2 V D2) &
        // ...; so return [C1+D1, C1+D2, ..., C2+D1, C2+D2, ...]:
        for (var i=0; i<dis[0].length; i++) {
            for (var j=0; j<dis[1].length; j++) {
                // dis[0][i] and dis[1][j] are clauses, we want to combine them
                // log('adding '+dis[0][i].concat(dis[1][j]));
                res.push(dis[0][i].concatNoDuplicates(dis[1][j]).sort());
                // (sort each clause so that we can remove duplicate clauses)
            }
        }
    }
    res.sort(function(a,b){ return a.length - b.length });
    return res;
}

ModelFinder.prototype.simplifyClauses = function(clauseList) {
    /**
     * simplify <clauseList>
     */

    // remove clauses that contain contradictory formulas, e.g. [p,q,??p]:
    var nl = clauseList.filter(function(clause) {
        for (var i=0; i<clause.length; i++) {
            for (var j=i+1; j<clause.length; j++) {
                if (clause[i].sub && clause[i].sub.string == clause[j].string ||
                    clause[j].sub && clause[j].sub.string == clause[i].string) {
                    return false;
                }
            }
        }
        return true;
    });

    // TODO: if an atom occurs only positively/negatively in the list of
    // clauses, it can be set as true/false;

    // // remove repetitions in clauses, as in [p,p,q]:
    // var nl = nl.map(function(clause) {
    //     return clause.removeDuplicates();
    // });

    // If clause A is a subset of (or equal to) clause B, clause B can be
    // removed (e.g. [[p],[p,q]] => [[p]] or [[q,s],[p,q,r,s]] => [[q,s]]. The
    // naive way to test this is O(n!). The following still takes too long if we
    // have a lot of clauses.
    nl2 = nl.copy();
    // We store which clauses contain which literals: q => [c1,c2],...
    var literals2clauses = {};
    for (var i=0; i<nl.length; i++) {
        for (var k=0; k<nl[i].length; k++) {
            var lit = nl[i][k].string;
            if (!literals2clauses[lit]) literals2clauses[lit] = [nl[i]];
            else literals2clauses[lit].push(nl[i]);
        }
    }
    // We look for supersets of each clause:
    for (var i=0; i<nl.length; i++) {
        var clause = nl[i];
        var lit = clause[0].string;
        var supersets = literals2clauses[lit];
        // log(clause+': supsersets from first literal: '+supersets);
        for (var k=1; k<clause.length && supersets.length; k++) {
            lit = clause[k].string;
            supersets.intersect(literals2clauses[lit]);
            // log(clause+': supsersets from next literal: '+supersets);
        }
        // log(clause+' is contained in '+supersets);
        for (var k=0; k<supersets.length; k++) {
            if (nl.indexOf(supersets[k]) > nl.indexOf(clause)) {
                nl2.remove(supersets[k]);
            }
        }
    }
    return nl2;
}

ModelFinder.prototype.nextStep = function() {
    /**
     * Each call of this function tries to extend the interpretation function of
     * this.model so that it satisfies the first literal in the first clause
     * from this.model.clauses. If we fail, we remove the literal from the
     * clause. If we succeed, we remove the entire clause and simplify the
     * remaining clauses.
     */

    log("** modelfinder: "+this.model.clauses);
    log("D: "+this.model.domain+"/"+this.model.worlds);
    log(dictToString(this.model.curInt));
    if (this.model.clauses.length == 0) {
        log('done');
        return true;
    }
    var literal = this.model.clauses[0][0];
    if (!literal) {
        // If the first clause contains no more literals, it can't be satisfied; we
        // need to backtrack:
        this.backtrack();
        return false;
    }
    while (this.model.clauses[0].length == 1 && literal.string.indexOf('$') > -1) {
        // We ultimately don't care about the interpretation of tseitin
        // formulas, and if they occur in a unit clause, we have no choice of
        // how to interpret them.
        log('applying unit resolution to '+literal);
        this.model.unitResolve(literal);
        return false;
    }

    log("trying to satisfy "+literal);

    // If we're processing this literal for the first time, we need to set up a
    // tentative interpretation of its terms and subterms. If we've backtracked
    // to this literal, we instead change its tentative interpretation to the
    // next possible interpretation.
    if (!this.model.termValues) {
        // NB: model.termValues stores only the values for the current literal
        this.model.initTermValues(literal);
    }
    else {
        if (!this.model.iterateTermValues()) {
            log("no more term interpretations to try: giving up");
            // try next disjunct in first clause on next attempt:
            this.model.clauses[0].shift();
            this.model.termValues = null;
            return false;
        }
    }
    
    while (true) {
        // check if the literal is true, or can be made true by extending the
        // predicate interpretation:
        var atom = literal.sub || literal;
        // NB: (atom == literal) is the truth-value we want for atom.

        // look up predicate for interpreted term values in curInt:
        var nterms = this.model.reduceTerms(atom.terms);
        var redAtom = atom.predicate+nterms.toString();
        if (this.model.getCurInt(redAtom) === (atom != literal)) {
            // failure: literal is false; try with a different term
            // interpretation:
            log("literal is false on present term interpretation");
            if (!this.model.iterateTermValues()) {
                log("no more term interpretations to try: giving up");
                this.model.clauses[0].shift();
                this.model.termValues = null;
                return false;
            }
        }
        else {
            // success! store present state for backtracking, then extend
            // model.interpretation by the tentative interpretation:
            this.alternativeModels.push(this.model.copy());
            if (this.model.getCurInt(redAtom) === undefined) {
                // predicate is undefined for terms; extend its interpretation:
                log('setting value for '+redAtom+' to '+(atom==literal));
                this.model.curInt[redAtom] = (atom==literal);
            }
            log("literal is satisfied: "+redAtom+" -> "+this.model.getCurInt(redAtom));
            this.model.interpretation = this.model.curInt;
            this.model.termValues = null;
            this.model.clauses.shift();
            this.model.simplifyRemainingClauses();
            return false;
        }
    }
}

ModelFinder.prototype.backtrack = function() {
    /**
     * try a different interpretation
     */
    log("backtracking");
    if (this.alternativeModels.length == 0) {
        log("no more models to backtrack; initializing larger model");
        var numWorlds = this.model.worlds.length;
        var numIndividuals = this.model.domain.length;
        if (numWorlds && this.parser.isPropositional) {
            numWorlds++;
        }
        else {
            if (numWorlds && numWorlds < this.model.domain.length) {
                numWorlds++;
            }
            else numIndividuals++; 
        }
        this.model = new Model(this, numIndividuals, numWorlds);
    }
    else {
        this.model = this.alternativeModels.pop();
        // recover this.model.curInt:
        this.model.curInt = {};
        for (var p in this.model.interpretation) {
            this.model.curInt[p] = this.model.interpretation[p];
        }
        var tvs = this.model.termValues;
        for (var i=0; i<tvs.length; i++) {
            var redTerm = this.model.reduceArguments(tvs[i][0]).toString();
            if (tvs[i][2] !== null) {
                this.model.curInt[redTerm] = tvs[i][2];
            }
        }
    }
}

function Model(modelfinder, numIndividuals, numWorlds) {
    /**
     * A (partial) model; also serves as a modelfinder state for backtracking
     */

    if (!modelfinder) { // called from copy()
        return;
    }
    
    this.modelfinder = modelfinder;
    this.parser = modelfinder.parser;

    // initialize domains:
    this.domain = Array.getArrayOfNumbers(numIndividuals);
    this.worlds = Array.getArrayOfNumbers(numWorlds);
    this.isModal = numWorlds > 0;
    log('model domain '+this.domain+', worlds '+this.worlds);

    // initialize interpretation function:
    this.interpretation = {}; // e.g. 'a' => 0, '[f,0]' => 2, 'F[0]' => true

    // initialize clauses we need to satisfy:
    this.clauses = this.getDomainClauses();
    log(this.clauses.length+" clauses");

    // list of all terms that we need to interpret; e.g. 'a','f(0)','f(1)':
    var terms = this.getTerms();
    this.indivTerms = terms[0];
    this.worldTerms = terms[1];
    
    // tentative interpretation of terms in current literal:
    this.termValues = null;

    // tentative combined interpretation:
    this.curInt = {};
}

Model.prototype.getTerms = function() {
    /**
     * return all terms that need to be interpreted in the model as strings
     * sorted by length; returns one list for individual terms and one for world
     * terms; includes skolem terms, but with nested terms reduced; i.e. on
     * domain { 0,1 }, term f(f(a)) is represented by terms a, f(0), f(1).
     */
    var indivTerms = [];
    var worldTerms = this.parser.isModal ? [this.parser.w] : [];
    for (var i=0; i<this.parser.symbols.length; i++) {
        var s = this.parser.symbols[i];
        var stype = this.parser.expressionType[s];
        if (stype == 'individual constant') {
            indivTerms.push(s);
        }
        else if (stype.indexOf('function symbol for world') > -1) {
            var arity = this.parser.arities[s];
            Model.getNTuples(arity, this.worlds.length-1).forEach(function(li) {
                li.unshift(s);
                worldTerms.push(li.toString());
            });
        }
        else if (stype.indexOf('function symbol') > -1) {
            var arity = this.parser.arities[s];
            Model.getNTuples(arity, this.domain.length-1).forEach(function(li) {
                li.unshift(s);
                indivTerms.push(li.toString());
            });
        }
    }
    indivTerms.sort(function(a,b){ return a.length - b.length; });
    worldTerms.sort(function(a,b){ return a.length - b.length; });
    return [indivTerms, worldTerms];
}

Model.prototype.getDomainClauses = function() {
    /**
     * turn modelfinder.clauses into a variable-free list of clauses that serves
     * as constraints on interpretations. If the domain is [0,1], then a clause
     * ['Fx','xRy'] is turned into ['F0','0R0'], ['F0','0R1'], ['F1','1R0'],
     * ['F1','1R1'].
     */
    res = [];
    log('creating clauses for current domain(s)');
    for (var c=0; c<this.modelfinder.clauses.length; c++) {
        var clause = this.modelfinder.clauses[c];
        // log('  clause '+clause);
        // collect all variables in the clause:
        var variables = [];
        for (var i=0; i<clause.length; i++) {
            variables.extendNoDuplicates(this.parser.getVariables(clause[i])); // optimise
        }
        if (variables.length == 0) {
            // log('    adding clause to constraint');
            res.push(clause.copy());
            continue;
        }
        // get all possible interpretations of the variables:
        var interpretations = this.getVariableAssignments(variables);
        // log('    variables: '+variables+', interpretations: '+interpretations);
        // e.g. [[0,0],[0,1],[1,0],[1,1]] for two variables and domain [0,1]
        for (var i=0; i<interpretations.length; i++) {
            var interpretation = interpretations[i];
            // log('    adding clause for interpretation '+interpretation);
            var nclause = clause.map(function(formula) {
                var nformula = formula;
                for (var i=0; i<variables.length; i++) {
                    nformula = nformula.substitute(variables[i], interpretation[i]);
                }
                return nformula;
            });
            res.push(nclause);
        }
    }

    log('           clauses: '+res);
    res = this.modelfinder.simplifyClauses(res);
    log('simplified clauses: '+res);
    return res;
}

Model.prototype.getVariableAssignments = function(variables) {
    /**
     * list all interpretations of <variables> on the model's domain(s), as
     * sequences; e.g. [[0,0],[0,1],[1,0],[1,1]] for domain=[0,1] and two
     * individual variables.
     */
    var res = [];
    var tuple = Array.getArrayOfZeroes(variables.length);
    res.push(tuple.copy());
    var maxValues = [];
    for (var i=0; i<variables.length; i++) {
        maxValues.push(this.parser.expressionType[variables[i]] == 'variable' ?
                       this.domain.length-1 : this.worlds.length-1);
    }
    while (Model.iterateTuple(tuple, maxValues)) { // optimise?
        res.push(tuple.copy());
    }
    return res;
}

Model.iterateTuple = function(tuple, maxValues) {
    /**
     * changes tuple to the next tuple in the list of all tuples of the same
     * length whose i-the element is one of {0..maxValues[i]}
     */
    for (var i=tuple.length-1; i>=0; i--) {
        if (tuple[i] < maxValues[i]) {
            tuple[i]++;
            return true;
        }
        tuple[i] = 0;
    }
    return false;
    // Example 1: tuple = 011, all maxValues 2.
    //   at i=2, tuple -> 012, return true
    // Example 2: tuple = 011, maxValues 1.
    //   at i=2, tuple -> 010
    //   at i=1, tuple -> 000
    //   at i=0, tuple -> 100, return true
}

Model.getNTuples = function(n, maxval) {
    /**
     * return all <n>-tuples of numbers up to <maxval>
     *
     * E.g., for n=2 and maxval=1 return [[0,0],[0,1],[1,0],[1,1]].
     */
    if (n == 0) {
        return [[]];
    }
    var res = [];
    for (var i=0; i<maxval; i++) {
        Model.getNTuples(n-1, maxval).forEach(function(li) {
            li.unshift(i);
            res.push(li);
        });
    }
    return res;
}


Model.prototype.initTermValues = function(literal) {
    /**
     * this.termValues is a list of triples, one for each non-numerical term
     * and subterm from <literal>, in order of increasing complexity. The
     * triple elements are:
     *    
     * [0]: the term itself,
     * [1]: the term as string,
     * [2]: the term's current tentative value, or null if the value is
     *      determined by this.interpretation together with items earlier in the
     *      list.
     * 
     * We have to make sure we're interpreting function terms consistently, so
     * that we don't end up with inconsistent interpretations like these:
     *    
     * - |a|=0, |f(0)|=1, |f(a)|=0
     * - |f(a)|=0, |f(0)|=1, |f(f(a))|=0
     * - |a|=0, |f(a)|=0, |f(f(0))|=1.
     * - |f(a)|=0, |f(f(a))|=1, |f(b)|=1, |b|=1, D = {0,1}
     *
     * Whenever we interpret a nested term like f(f(a)), we first interpret its
     * smallest non-numerical subterms. (These subterms will not have an old
     * interpretation, otherwise they would have been replaced by their
     * numerical values.) So when we try to satisfy Af(f(a)), and a doesn't have
     * a current value, we interpret a as 0. The next term to interpret is then
     * f(a), which reduces to f(0). We check if this has an (old or current)
     * interpretation. If not, we interpret it as 0. And so on.
     *    
     * If the initial interpretation didn't work out, we need to try others.
     * (This isn't trivial because we don't have a fixed set of terms to
     * interpret in any given disjunct: if a disjunct contains f(a), and f(0) is
     * previously defined but f(1) is not, then setting |a|=1 requires also
     * setting |f(1)|, but setting |a|=0 does not require setting anything
     * else.)
     *    
     * Here's what we do:
     * 
     * 1. We make a list of all non-numerical subterms in the term list, in
     *    order of complexity. E.g.: [a,b,g(0,0),f(b),g(a,0),f(f(b))]
     *      
     * 2. For each term in the list (LTR), we check if its extension is
     *    determined by the current interpretation. If yes, we pair it with the
     *    value null. If no, we pair it with a new value 0. 
     *        
     *    E.g.: if the old interpretation has f(0)=0, the above ex. turns into 
     *    [(a,0),(b,0),(g(0,0),0),(f(b),null),(g(a,0),null),(f(f(b)),null)]
     *    - f(b) is null because b is 0 and f(0) is fixed
     *    - g(a,0) is null because a is 0 and we've set g(0,0) 
     *    - f(f(b)) is null because f(b)=f(0) is 0 and f(0) is fixed
     *    
     * 3. When iterating, we go through the list of pairs RTL, trying to
     *    increase a value:
     *    - If the term has null value, we skip it.
     *    - If the term has its max value, we reset it to 0.
     *    - If the term has a value less than its max value, we increase it. 
     *      We then recompute the values of the terms to the right of the
     *      present term and exit the loop.
     */
    log("initializing termValues in "+literal);
    
    var atom = literal.sub || literal;
    var termIsOld = {};
    var terms = [];
    
    // We first add each original term with its string value.
    for (var i=0; i<atom.terms.length; i++) {
        if (typeof atom.terms[i] == 'number') continue;
        var termStr = atom.terms[i].toString();
        if (termIsOld[termStr]) continue;
        termIsOld[termStr] = true;
        terms.push([atom.terms[i], termStr, null]);
    }

    // Next we add the subterms:
    for (var i=0; i<terms.length; i++) {
        if (terms[i][0].isArray) {
            for (var j=1; j<terms[i][0].length; j++) {
                var subTerm = terms[i][0][j];
                if (typeof subTerm == 'number') continue;
                var termStr = subTerm.toString();
                if (termIsOld[termStr]) continue;
                termIsOld[termStr] = true;
                terms.push([subTerm, termStr, null]);
            }
        }
    }

    // sort term list by length, to ensure that a term is never a subterm of any
    // term to its left:
    terms.sort(function(a,b){
        return a[1].length - b[1].length;
    });

    // tentatively interpret all terms and subterms:
    this.curInt = {};
    for (var p in this.interpretation) {
        this.curInt[p] = this.interpretation[p];
    }
    for (var i=0; i<terms.length; i++) {
        var redTerm = this.reduceArguments(terms[i][0]).toString();
        if (!(redTerm in this.curInt)) {
            terms[i][2] = 0;
            this.curInt[redTerm] = 0;
        }
    }

    this.termValues = terms;
    log(this.termValues.toString());
}

Model.prototype.isWorldTerm = function(term) {
    /**
     * return true iff <term> is a term that denotes a world
     */
    if (!this.parser.isModal) {
        return false;
    }
    if (term.isArray) {
        return this.isWorldTerm(term[0]);
    }
    return (this.parser.expressionType[term].indexOf("world") > -1);
}

Model.prototype.getMaxValue = function(term, termStr) {
    /**
     * return the maximum value that can be assigned to <term>
     * 
     * We want to avoid redundant permutations. There's no point trying |a|=0,
     * |b|=1 and later |a|=1, |b|=0. So we fix the first constant to always
     * denote 0. The second either denotes 0 or (if available) 1, but never 2.
     * And so on. The function term f(0) is allowed to denote 1, even if no term
     * yet denotes 0.
     */
    var isWorldTerm = this.isWorldTerm(term);
    var domain = isWorldTerm ? this.worlds : this.domain;
    var termList = isWorldTerm ? this.worldTerms : this.indivTerms;
    var maxValue = domain.length - 1; 
    var index = termList.indexOf(termStr);
    if (index > -1 && index < maxValue) {
        // maxValue is index, unless term has larger elements as arguments
        maxValue = index;
        if (term.isArray) {
            // termList only contains fully reduced terms, so we don't need to
            // worry about nested function expressions.
            for (var i=1; i<term.length; i++) {
                if (term[i] >= maxValue) {
                    maxValue = term[i] + 1;
                }
            }
        }
    }
    // log("maxValue "+maxValue);
    return maxValue;
}

Model.prototype.reduceArguments = function(term) {
    /**
     * replace arguments in <term> (or in subterms of <term>) by their numerical
     * values, as per this.curInt.
     */
    if (term.isArray) {
        var nterm = this.reduceTerms(term, 1);
        nterm.unshift(term[0]);
        return nterm;
    }
    return term;
}

Model.prototype.reduceTerms = function(terms, startIndex) {
    /**
     * replace each term and subterm in <terms> by its numerical value, if it has
     * one in this.curInt. E.g., if curInt['a']=0, and '[f,a]' and 'b' are not in
     * curInt, then a => 0, b => b, [f,a] => [f,0].
     */
    var res = [];
    for (var i=(startIndex || 0); i<terms.length; i++) {
        if (typeof terms[i] == 'number') {
            res.push(terms[i]);
        }
        else if (terms[i].isArray) {
            var nterm = this.reduceTerms(terms[i], 1);
            nterm.unshift(terms[i][0]);
            var ntermStr = nterm.toString();
            if (ntermStr in this.curInt) {
                res.push(this.curInt[ntermStr]);
            }
            else {
                res.push(nterm);
            }
        }
        else {
            if (terms[i] in this.curInt) {
                res.push(this.curInt[terms[i]]);
            }
            else {
                res.push(terms[i]);
            }
        }
    }
    return res;
}

Model.prototype.iterateTermValues = function() {
    /**
     * try to minimally change the interpretation of the terms in the currently
     * processed literal (stored in this.termValues)
     *
     * Recall that this.termValues is a list of triples, one for each
     * non-numerical term and subterm in the literal, in order of increasing
     * complexity. The triple elements are:
     *    
     * [0]: the term itself,
     * [1]: the term as string,
     * [2]: the term's current tentative value, or null if the value is
     *      determined by this.interpretation together with items earlier in the
     *      list.
     */

    log("trying to iterate termValues");
    // Go through terms RTL:
    for (var i=this.termValues.length-1; i>=0; i--) {
        var tv = this.termValues[i];
        // skip uninterpreted terms:
        if (tv[2] === null) {
            continue;
        }
        var redTerm = this.reduceArguments(tv[0]);
        var redTermStr = redTerm.toString();
        var maxValue = this.getMaxValue(redTerm, redTermStr);
        if (tv[2] == maxValue) {
            // We can't increase the value of this term. We don't simply set it
            // to 0 because the change we make to an earlier term's
            // interpretation might fix the interpretation of this term. So we
            // set the interpretation to null for now and recompute it below.
            tv[2] = null;
            if (!this.interpretation[redTermStr]) {
                delete this.curInt[redTermStr];
            }
            continue;
        }
        tv[2]++;
        this.curInt[redTermStr] = tv[2];
        log('setting '+tv[1]+' (= '+redTermStr+') to '+tv[2]);
        
        // Now we recompute/reset the values of terms to the right. To this end,
        // we first have to fill back in the interpretation of reduced terms
        // that is implied by terms to the left:
        for (var j=0; j<i; j++) {
            if (this.termValues[j][2] !== null) {
                var rt = this.reduceArguments(this.termValues[j][0]).toString();
                this.curInt[rt] = this.termValues[j][2];
            }
        }
        for (var j=i+1; j<this.termValues.length; j++) {
            var rt = this.reduceArguments(this.termValues[j][0]).toString();
            if (this.curInt[rt] === undefined) {
                // interpretation not yet fixed
                this.termValues[j][2] = 0;
                this.curInt[rt] = 0;
            }
            else {
                this.termValues[j][2] = null;
            }
        }
        log(this.termValues.toString());
        if (this.isRedundant()) {
            // try another iteration; e.g. while a->0, b->0, c->2 is redundant
            // on D = {0,1,2}, the next iteration a->0, b->1, c->0 is not
            // redundant:
            return this.iterateTermValues();
        }
        return true;
    }
    return false;
}

Model.prototype.isRedundant = function(checkWorldTerms) {
    /**
     * check if the present interpretation of term values makes the model
     * isomorphic to a model we've already tried.
     *
     * We mostly avoid redundant models by setting a term's maxValue. But
     * sometimes a value less than maxValue can be skipped. For example, if we
     * have terms a,b,c and a and b both denote 0 then we don't need to try
     * |c|=1 and |c|=2.
     * 
     * The argument <checkWorldTerms> is for recursive calls only, because we
     * need to check world terms and individual terms separately.
     */

    var terms = checkWorldTerms ? this.worldTerms : this.indivTerms;
    var domain = checkWorldTerms ? this.worlds : this.domain;
    var unusedEls = domain.copy();

    for (var i=0; i<terms.length; i++) {
        var term = terms[i];
        // all argument terms count as used:
        if (term.indexOf('[') == 0) {
            var args = term.slice(1,-1).split(',');
            for (var j=1; j<args.length; j++) {
                unusedEls.remove(args[j]**1);
            }
            if (unusedEls.length == 0) break;
        }
        var val = this.curInt[term];
        if (!val || val == unusedEls[0]) {
            // If the term is uninterpreted, the interpretation may be
            // legitimately extended by assigning to the term the first unused
            // element in the domain.
            unusedEls.shift();
            if (unusedEls.length == 0) break;
        }
        if (val > unusedEls[0]) {
            log("interpretation should assign "+unusedEls[0]+" instead of "+val+" to "+term);
            return true;
        }
    }

    if (this.isModal && !checkWorldTerms) {
        return this.isRedundant(true);
    }
    return false;
}

Model.prototype.satisfy = function(literal) {
    /**
     * try to extend this.interpretation to satisfy <literal>; used in
     * sentree.js. (currently unused)
     */
    var atom = literal.sub || literal;
    this.curInt = this.interpretation;
    var nterms = this.reduceTerms(atom.terms);
    var redAtom = atom.predicate+nterms.toString();
    if (redAtom in this.curInt && thic.curInt[redAtom] != (atom==literal)) {
        return false;
    }
    this.interpretation[redAtom] = (atom==literal);
    return true;
}


Model.prototype.simplifyRemainingClauses = function() {
    /**
     * After a clause has been satisfied by extending the interpretion function,
     * we simplify the remaining clauses.
     *
     * (a) If we've assigned a value to new terms, we substitute all occurrences
     *     of these terms in later clauses by that value (e.g., turning Ac into
     *     A0).
     *
     * (b) We then remove any literals that are known to be false. (All these
     *     literals will be simple literals with numeral terms. If a literal
     *     doesn't have only numeral terms, it doesn't as yet have a
     *     truth-value.) We also remove entire clauses for which any literal is
     *     known to be true.
     *
     *     (E.g., if we've extended the predicate interpretation so as to make
     *     ~R00 true, then R00 is removed from any future clauses. Another
     *     example: We may have a past clause [A0], a future clause [~Ac,~Bc],
     *     and newly assign c -> 0. The future clause then turns into
     *     [~A0,~B0]. We simplify this to [~B0].)
     *
     * (c) Finally, we re-order the future clauses by number of literals.
     */

    log("simplifying remaining clauses:");
    log(this.clauses.toString());
    
    var nclauses = [];
    CLAUSELOOP:
    for (var i=0; i<this.clauses.length; i++) {
        var nclause = [];
        for (var j=0; j<this.clauses[i].length; j++) {
            var literal = this.clauses[i][j];
            var atom = literal.sub || literal;
            // look up predicate for interpreted term values in curInt:
            var nterms = this.reduceTerms(atom.terms);
            var redAtomStr = atom.predicate+nterms.toString();
            if (redAtomStr in this.curInt) {
                if (this.curInt[redAtomStr] == (atom==literal)) {
                    // literal is true; skip clause
                    continue CLAUSELOOP;
                }
                else { 
                    // literal is false; skip literal
                    continue;
                }
            }
            if (atom.terms.toString() != nterms.toString()) {
                // replace literal by interpreted literal:
                var redAtom = new AtomicFormula(atom.predicate, nterms);
                var nlit = atom == literal ? redAtom : new NegatedFormula(redAtom);
                nclause.push(nlit);
            }
            else nclause.push(literal);
        }
        nclauses.push(nclause);
    }
    nclauses.sort(function(a,b) {
        // process unit clauses with tseitin formulas first:
        if (a.length == 1 && b.length == 1) {
            return b[0].string.indexOf('$') - a[0].string.indexOf('$');
        }
        return a.length - b.length;
    });
    log(nclauses.toString());
    this.clauses = nclauses;
}

Model.prototype.unitResolve = function(literal) {
    /**
     * <literal> is a tseitin formula in a unit clause; we can interpret it as true
     * and simplify the remaining clauses accordingly.
     */
    var negLiteralString = (literal.sub && literal.sub.string) || '??'+literal.string;
    var nclauses = [];
    CLAUSELOOP:
    for (var i=1; i<this.clauses.length; i++) {
        var nclause = [];
        for (var j=0; j<this.clauses[i].length; j++) {
            if (this.clauses[i][j].string == literal.string) {
                continue CLAUSELOOP;
            }
            if (this.clauses[i][j].string != negLiteralString) {
                nclause.push(this.clauses[i][j]);
            }
        }
        nclauses.push(nclause);
    }
    nclauses.sort(function(a,b) {
        // process unit clauses with tseitin formulas first:
        if (a.length == 1 && b.length == 1) {
            return b[0].string.indexOf('$') - a[0].string.indexOf('$');
        }
        return a.length - b.length;
    });
    this.clauses = nclauses;
}

Model.prototype.getCurInt = function(redAtom) {
    /**
     * return this.curInt[<redAtom>], except if <redAtom> is an identity
     * formula, in which case the interpretation is settled
     */
    if (redAtom[0] == '=') {
        // redAtom is a string like '=[0,1]'
        var terms = redAtom.slice(2,-1).split(',');
        if (!isNaN(terms[0]) && !isNaN(terms[1])) {
            return terms[0] == terms[1];
        }
    }
    return this.curInt[redAtom];
}

Model.prototype.copy = function() {
    /**
     * return a shallow copy of the model, for backtracking.
     */
    var nmodel = new Model();
    nmodel.modelfinder = this.modelfinder;
    nmodel.parser = this.parser;
    nmodel.domain = this.domain;
    nmodel.worlds = this.worlds;
    nmodel.isModal = this.isModal;
    nmodel.interpretation = this.interpretation;
    nmodel.termValues = this.termValues;
    nmodel.clauses = this.clauses.copyDeep();
    nmodel.indivTerms = this.indivTerms;
    nmodel.worldTerms = this.worldTerms;
    // curInt isn't copied (contains later predicate interpretations)
    return nmodel;
}

Model.prototype.toHTML = function() {
    /**
     * return HTML representation of the model to display as countermodel
     */
    var str = "<table>";
    if (this.parser.isModal) {
        // change world names from '0', '1', .. to 'w0', 'w1', ..:
        function w(num) {
            return 'w<sub>'+num+'</sub>';
        }
        str += "<tr><td align='right'>Worlds: </td><td align='left'>{ ";
        str += this.worlds.map(function(n){return w(n)}).join(", ");
        str += " }</td></tr>\n";
        if (!this.parser.isPropositional) {
            str += "<tr><td align='right'>Individuals: </td><td align='left'>{ ";
            str += this.domain.join(", ");
            str += " }</td></tr>\n";
        }
    }
    else if (!this.parser.isPropositional) {
        str += "<tr><td align='right'>Domain: </td><td align='left'>{ ";
        str += this.domain.join(", ");
        str += " }</td></tr>\n";
    }

    // display constants and function symbols:
    // a: 0
    // f: { <0,1>, <1,1> }
    
    var extensions = this.getExtensions();

    for (var i=0; i<this.modelfinder.constants.length; i++) {
        var sym = this.modelfinder.constants[i];
        var ext = extensions[sym];
        var val = sym == this.parser.w ? w(ext) : ext;
        if (sym == this.parser.w) sym = '@';
        str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
    }
    
    for (var i=0; i<this.modelfinder.funcSymbols.length; i++) {
        var sym = this.modelfinder.funcSymbols[i];
        var ext = extensions[sym];
        // ext is something like [1,2] or [[0,1],[1,1]]
        if (ext.length > 0 && !ext[0].isArray) {
            // extensions[sym] is something like [1,2]
            var val = '{ '+ext.join(',')+' }';
        }
        else {
            // extensions[sym] is something like [[0,1],[1,1]]
            var val = '{ '+ext.map(function(tuple) {
                return '('+tuple.join(',')+')';
            }).join(', ')+' }';
        }
        str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
    }
    
    // display predicates and proposition letters:
    // p: true/1
    // F: { 0,1 }
    // G: { <0,0>, <1,1> }

    var isModal = this.parser.isModal;
    var R = this.parser.R;
    for (var i=0; i<this.modelfinder.predicates.length; i++) {
        var sym = this.modelfinder.predicates[i];
        if (sym == '=') continue;
        var ext = extensions[sym];
        var val;
        if (!ext.isArray) { // zero-ary
            val = ext;
        }
        else if (ext.length > 0 && !ext[0].isArray) {
            // ext is something like [1,2]
            if (isModal) ext = ext.map(function(n){return w(n)});
            val = '{ '+ext.join(',')+' }';
        }
        else {
            // ext is something like [[0,1],[1,1]]
            val = '{ '+ext.map(function(tuple) {
                if (isModal) {
                    tuple[tuple.length-1] = w(tuple[tuple.length-1]);
                    if (sym == R) tuple[0] = w(tuple[0]);
                }
                return '('+tuple.join(',')+')';
            }).join(', ')+' }';
        }
        if (sym == R && sym != 'R') {
            // 'R' is used as predicate, our internal accessibility symbol won't mean much to the user
            sym = 'Accessibility'
        }
        str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
    }

    str += "</table>";
    return str;
}

Model.prototype.getExtensions = function() {
    /**
     * this.interpretation is a dict with entries like 'a' => 0, '[f,0]' => 0,
     * '[p]' => true, '[R,0,1]' => false.  We return a new dict that assigns
     * extensions to all non-logical expressions in initFormulas, with records
     * like 'f' => [(0,0),(1,0)], 'R' => [(0,1)].
     */
    var result = {};
    // constants:
    for (var i=0; i<this.modelfinder.constants.length; i++) {
        var cons = this.modelfinder.constants[i];
        result[cons] = this.interpretation[cons] || 0;
    }
    var interpretedStrings = Object.keys(this.interpretation);
    // function symbols:
    for (var i=0; i<this.modelfinder.funcSymbols.length; i++) {
        var f = this.modelfinder.funcSymbols[i];
        result[f] = [];
        for (var j=0; j<interpretedStrings.length; j++) {
            var expr = interpretedStrings[j];
            if (expr.indexOf('['+f+',') == 0) { // e.g. '[f,0]' 
                var args = expr.slice(1,-1).split(',');
                args.shift(); 
                var val = this.interpretation[expr];
                result[f].push(args.concat([val]));
            }
        }
        result[f] = this.makeFunctionExtensionTotal(f, result[f]);
    }
    // predicates:
    for (var i=0; i<this.modelfinder.predicates.length; i++) {
        var p = this.modelfinder.predicates[i];
        // Zero-ary predicates should have truth-values as extensions, one-ary
        // predicates list of individuals, other predicates lists of lists of
        // individuals.
        result[p] = (this.parser.arities[p] == 0) ? false : [];
        // NB: modal proposition letters have arity 1 
        for (var j=0; j<interpretedStrings.length; j++) {
            var expr = interpretedStrings[j];
            if (expr.indexOf(p+'[') == 0) { // e.g. 'F[0]'
                var val = this.interpretation[expr];
                var args = expr.substr(p.length).slice(1,-1).split(',');
                if (args[0] == '') { // sentence letter
                    result[p] = val;
                }
                else {
                    if (!val) continue; // only list positive extension
                    if (args.length == 1) {
                        result[p].push(args[0]);
                    }
                    else {
                        result[p].push(args);
                    }
                }
            }
        }
    }
    return result;
}

Model.prototype.makeFunctionExtensionTotal = function(f, extension) {
    /**
     * map all arguments for <f> that aren't covered in <extension> to 0
     */
    var arity = this.parser.arities[f];
    var args = Array.getArrayOfZeroes(arity);
    var maxValue = this.domain.length - 1;
    var maxValues = args.map(function(x){ return maxValue; });
    var res = [];
    ARGLOOP:
    do {
        for (var i=0; i<extension.length; i++) {
            if (extension[i].slice(0,-1).equals(args)) {
                res.push(extension[i]);
                continue ARGLOOP;
            }
        }
        res.push(args.concat([0]));
    } while (Model.iterateTuple(args, maxValues));
    return res;
}

Model.prototype.toString = function() {
    /**
     * return string representation of model, for debugging
     */
    return this.toHTML().replace(/<.+?>/g, '');
}

function dictToString(dict) {
    /**
     * return string representation of associative array, for debugging
     */
    var res = '';
    var keys = Object.keys(dict);
    for (var i=0; i<keys.length; i++) {
        res += keys[i]+': '+dict[keys[i]]+'\n';
    }
    return res;
}
function TreePainter(senTree, rootAnchor) {
    // Constructor for a tree painter. rootAnchor is the HTML element into which
    // the tree will be written.

    this.paintInterval = 200;      // number of ms between paint steps
    this.branchPadding = window.innerWidth < 500 ? 0 :
        window.innerWidth < 800 ? 20 : 30; // min margin between tree branches
    this.branchingHeight = 40;     // vertical space used by branching lines
    
    this.tree = senTree;
    this.isModal = senTree.parser.isModal;
    this.rootAnchor = rootAnchor;
    this.rootAnchor.innerHTML = "";
    rootAnchor.style.transform = "scale(1)";
    this.minX = this.branchPadding/2 - rootAnchor.offsetLeft;
    this.scale = 1;
    
    this.curNodeNumber = 0;
    this.highlighted = [];

}

TreePainter.prototype.paintTree = function() {
    // start painting
    var node = this.getNextUnpaintedNode();
    if (!node) {
        this.highlightNothing();
        return this.finished();
    }
    var paintNodes = this.tree.getExpansion(node);
    log("expansion: " + paintNodes);
    for (var i=0; i<paintNodes.length; i++) {
        this.paint(paintNodes[i]);
        if (paintNodes[i].closedEnd) {
            log("painting close marker");
            this.paint(this.makeCloseMarkerNode(paintNodes[i]));
        }
    }
    this.highlight(paintNodes, node.fromNodes);

    this.paintTimer = setTimeout(function(){
        this.paintTree();
    }.bind(this), this.paintInterval);
}

TreePainter.prototype.stop = function() {
    clearTimeout(this.paintTimer);
}

TreePainter.prototype.finished = function() {
}

TreePainter.prototype.paint = function(node) {
    // paint single node
    if (!node.parent || node.parent.children.length == 2) {
        node.container = this.makeContainer(node);
    }
    else {
        node.container = node.parent.container;
    }
    log("painting "+node+" in "+node.container.str);
    node.div = this.makeNodeDiv(node);
    node.container.appendChild(node.div);

    // Since all children of the container are absolutely positioned, the
    // container element is actually a horizontal line starting centered at
    // the top of the branch.
    log('formula w '+node.formulaSpan.offsetWidth+' div w '+node.div.offsetWidth);
    node.div.style.top = node.container.h + "px";
    node.container.h += node.div.offsetHeight + 3; // that number is the line-spacing
    if (node.isCloseMarkerNode) {
        // add some spacing below leaf nodes
        node.container.h += this.branchPadding;
    }
    if (node.formulaSpan.offsetWidth > node.container.formulaWidth) {
        node.container.formulaWidth = node.formulaSpan.offsetWidth + 10;
        log('adjusting container formula width '+node.container.formulaWidth);
        var n = node;
        do {
            n.formulaSpan.style.width = node.container.formulaWidth + "px";
            n.div.style.left = -node.div.offsetWidth/2 + "px";
            n = n.parent;
        } while (n && n.container == node.container);
    }
    else {
        log('using old container formula width '+node.container.formulaWidth);
        node.formulaSpan.style.width = node.container.formulaWidth + "px";
        node.div.style.left = -node.container.w/2 + "px";
    }
    // node.div.style.left = -node.div.offsetWidth/2 + "px";
    node.container.w = Math.max(node.container.w, node.div.offsetWidth);
    // account for overlong fromNumber labels (not reflected in offsetWidth):
    var fromSpan = node.div.childNodes[2];
    var wOversize = fromSpan.scrollWidth - fromSpan.offsetWidth;
    node.container.wOversize = Math.max(node.container.wOversize, wOversize);
    this.repositionBranches(node);
    this.keepTreeInView();
}

TreePainter.prototype.makeContainer = function(node, nodeId) {
    // create new container for subbranch
    log('creating new container');
    var parContainer = node.parent ? node.parent.container : this.rootAnchor;
    var container = document.createElement('div');
    parContainer.appendChild(container);
    if (node.parent) parContainer.subContainers.push(container);
    container.subContainers = [];
    container.style.width = "100%";
    container.style.position = "absolute";
    container.style.left = "0px";
    container.style.top = node.parent ? parContainer.h + this.branchingHeight + "px" : "0px";
    container.w = container.h = 0;
    container.wOversize = 0;
    container.str = "{ " + (this.curNodeNumber+1) + " "+node+ " }";
    container.formulaClass = 'fla'+this.curNodeNumber;
    container.formulaWidth = 0;
    return container;
}

TreePainter.prototype.makeNodeDiv = function(node) {
    var div = document.createElement('div');
    div.className = 'treeNode';

    var nodeNumberSpan = document.createElement('span');
    nodeNumberSpan.className = 'nodenumber';
    if (!node.isCloseMarkerNode) {
        node.nodeNumber = ++this.curNodeNumber;
        nodeNumberSpan.innerHTML = node.nodeNumber+'.';
    }
    div.appendChild(nodeNumberSpan);
    div.id = 'n'+this.curNodeNumber;
    
    node.formulaSpan = document.createElement('span');
    node.formulaSpan.className = 'formula '+node.container.formulaClass;
    node.formulaSpan.innerHTML = node.formula.toString();
    div.appendChild(node.formulaSpan);
    
    if (this.isModal) {
        var worldSpan = document.createElement('span');
        worldSpan.className = 'worldlabel';
        worldSpan.innerHTML = node.formula.world ? '('+node.formula.world+')' : '';
        div.appendChild(worldSpan);
    }

    var fromSpan = document.createElement('span');
    fromSpan.className = 'fromnumbers';
    var annot = node.fromNodes.map(function(n) { return n.nodeNumber; });
    if (node.fromRule) {
        var fromRule = node.fromRule.toString().substr(0,3);
        if (!['alp', 'bet', 'gam', 'del', 'mod'].includes(fromRule)) {
            fromRule += '.';
            if (fromRule == 'equ.') fromRule = 'LL';
            annot.push(fromRule);
        }
    }
    fromSpan.innerHTML = annot.length>0 ? "("+annot.join(',')+")" : " ";
    div.appendChild(fromSpan);
    var painter = this;
    if (node.isCloseMarkerNode) {
        div.addEventListener("mouseenter", function(e) {
            painter.highlight([], node.closedBy);
        });
    }
    else {
        div.addEventListener("mouseenter", function(e) {
            painter.highlight(painter.tree.getExpansion(node), node.fromNodes);
        });
    }
    div.addEventListener("mouseleave", function(e) {
        painter.highlightNothing();
    });
    return div;
}

TreePainter.prototype.makeCloseMarkerNode = function(closingNode) {
    var node = new Node();
    node.formula = "<b>x</b>";
    node.parent = closingNode;
    node.fromNodes = [];
    node.children = [];
    node.isCloseMarkerNode = true;
    node.closedBy = closingNode.closedBy;
    return node;
}

TreePainter.prototype.repositionBranches = function(node) {
    var par = node.container;
    while ((par = par.parentNode).subContainers) {
        if (!par.subContainers[1]) continue;
        var overlap = this.getOverlap(par);
        //log("comparing subcontainers for overlap: " + par.str);
        if (overlap) {
            log(overlap+" overlap between "+par.subContainers[0].str+" and "+par.subContainers[1].str);
            var x1 = parseInt(par.subContainers[0].style.left) - Math.ceil(overlap/2);
            var x2 = parseInt(par.subContainers[1].style.left) + Math.ceil(overlap/2);
            par.subContainers[0].style.left = x1 + "px";
            par.subContainers[1].style.left = x2 + "px";
            if (par.branchLines) {
                for (var i=0; i<par.branchLines.length; i++) {
                    par.removeChild(par.branchLines[i]);
                }
            }
            var centre = this.isModal ? -8 : 0; // hack to make branching lines look more centred
            var line1 = this.drawLine(par, centre, par.h, x1+centre, par.h + this.branchingHeight-2);
            var line2 = this.drawLine(par, centre, par.h, x2+centre, par.h + this.branchingHeight-2);
            par.branchLines = [line1, line2];
            // now that sub0 has been moved left, it may itself overlap
            // something, so we continue the loop
        }
    }
}

TreePainter.prototype.getOverlap = function(par) {
    var overlap = 0;
    // compare all pairs of sub(sub...)Containers:
    var co1, co2, co1s = [par.subContainers[0]], co2s;
    par.__x = 0; par.__y = 0;
    while ((co1 = co1s.shift())) {
        co2s = [par.subContainers[1]];
        while ((co2 = co2s.shift())) {
            co1.__x = co1.parentNode.__x + parseInt(co1.style.left); // - co1.w/2;
            co1.__y = co1.parentNode.__y + parseInt(co1.style.top);
            co2.__x = co2.parentNode.__x + parseInt(co2.style.left); // - co2.w/2;
            co2.__y = co2.parentNode.__y + parseInt(co2.style.top);
            if ((co1.__y >= co2.__y) && (co1.__y < co2.__y + co2.h) ||
                (co2.__y >= co1.__y) && (co2.__y < co1.__y + co1.h)) { // y-overlap > 0
                var co1w = co1.w + co1.wOversize;
                var co2w = co2.w + co2.wOversize;
                var overlap12 = (co1.__x + co1w/2 + painter.branchPadding) - (co2.__x - co2w/2);
                overlap = Math.max(overlap, overlap12);
            }
            co2s = co2s.concat(co2.subContainers);
        }
        co1s = co1s.concat(co1.subContainers);
    }
    return Math.floor(overlap);
}

TreePainter.prototype.keepTreeInView = function() {
    var mainContainer = this.rootAnchor.firstChild;
    // check if tree fits horizontal display width:
    if (mainContainer.getBoundingClientRect) {
        var midPoint = Math.round(mainContainer.getBoundingClientRect()['left']);
        var winTreeRatio = window.innerWidth*1.0/(midPoint*2);
        if (winTreeRatio < 1) {
            this.scale = Math.max(winTreeRatio, 0.8);
            rootAnchor.style.transform="scale("+this.scale+")";
            log("tree doesn't fit: ratio window.width/tree.width "+winTreeRatio);
        }
    }
    var minX = this.getMinX();
    if (minX < this.minX/this.scale) {
        var invisibleWidth = (this.minX/this.scale - minX);
        log("minX " + minX + "<" + this.minX+": tree out of left document border by " + invisibleWidth);
        mainContainer.style.left = mainContainer.__x + invisibleWidth + "px";
    }
}

TreePainter.prototype.getMinX = function() {
    // get x-position of leftmost container (relative to rootAnchor)
    var minX = 0;
    var con, cons = [this.rootAnchor.firstChild];
    while ((con = cons.shift())) {
        con.__x = (con.parentNode.__x || 0) + parseInt(con.style.left);
        if (con.__x - con.w/2 < minX) {
            minX = con.__x - con.w/2;
        }
        cons = cons.concat(con.subContainers);
    }
    return minX;
}

TreePainter.prototype.highlight = function(children, fromNodes) {
    while (this.highlighted.length) {
        this.highlighted.shift().div.childNodes[1].style.backgroundColor = 'unset';
    }
    for (var i=0; i<children.length; i++) {
        // children[i].div.className = 'treeNodeHiChild';
        children[i].div.childNodes[1].style.backgroundColor = '#00708333';
    }
    for (var i=0; i<fromNodes.length; i++) {
        // fromNodes[i].div.className = 'treeNodeHiParent';
        fromNodes[i].div.childNodes[1].style.backgroundColor = '#00708366';
    }
    this.highlighted = children.concat(fromNodes);
}

TreePainter.prototype.highlightNothing = function() {
    this.highlight([], []);
}

TreePainter.prototype.drawLine = function(el, x1, y1, x2, y2) {
    // adapted from https://stackoverflow.com/questions/4270485/drawing-lines-on-html-page
    log('line in '+el+' from '+x1+'/'+y1+' to '+x2+'/'+y2);
    var a = x1 - x2;
    var b = y1 - y2;
    var length = Math.sqrt(a*a + b*b);
    var sx = (x1 + x2) / 2
    var x = sx - length / 2;
    var y = (y1 + y2) / 2;
    var angle = Math.PI - Math.atan2(-b, a);
    var line = document.createElement("div");
    var styles = 'border: 1px solid #678; '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';
    line.setAttribute('style', styles);  
    el.appendChild(line);
    return line;
}

TreePainter.prototype.getNextUnpaintedNode = function() {
    var nodes = [this.tree.nodes[0]];
    var node;
    while ((node = nodes.shift())) {
        do {
            if (!node.div) return node;
            if (node.children.length == 2) nodes.unshift(node.children[1]);
        } while ((node = node.children[0]));
    }
    return null;
}


function Parser() {
    // store signature info so that we can parse multiple formulas and check if
    // they make sense together (e.g. matching arities for same predicate)
    this.symbols = [];
    this.expressionType = {}; // symbol => string describing expression type
    this.arities = {}; // symbol => number
    // store whether at least one of the parsed formulas is modal/
    // propositional, so that we can build an appropriate tree/countermodel:
    this.isModal = false;
    this.isPropositional = true;
    // do we need equality reasoning?
    this.hasEquality = false;
}

Parser.prototype.copy = function() {
    // returns a copy of the present parser. This allows e.g. introducing 'a' as
    // a new constant when constructing clausal normal forms, but then
    // introducing 'a' again when constructing the displayed tree: we don't have
    // to manually check where 'a' is already used.
    var nparser = new Parser(true);
    nparser.symbols = this.symbols.copy();
    for (var i=0; i<this.symbols.length; i++) {
        var sym = this.symbols[i];
        nparser.expressionType[sym] = this.expressionType[sym];
        nparser.arities[sym] = this.arities[sym];
    }
    nparser.isModal = this.isModal;
    nparser.isPropositional = this.isPropositional;
    nparser.hasEquality = this.hasEquality;
    nparser.R = this.R;
    nparser.w = this.w;
    return nparser;
}

Parser.prototype.registerExpression = function(ex, exType, arity) {
    log('registering '+exType+' '+ex);
    if (!this.expressionType[ex]) this.symbols.push(ex);
    else if (this.expressionType[ex] != exType) {
        throw "Don't use '"+ex+"' as both "+this.expressionType[ex]+" and "+exType+".";
    }
    this.expressionType[ex] = exType;
    this.arities[ex] = arity;
}

Parser.prototype.getSymbols = function(expressionType) {
    // return all registered symbols whose type contains <expressionType>
    var res = [];
    for (var i=0; i<this.symbols.length; i++) {
        var s = this.symbols[i];
        if (this.expressionType[s].indexOf(expressionType) > -1) res.push(s);
    }
    return res;
}

Parser.prototype.getNewSymbol = function(candidates, expressionType, arity) {
    // returns new symbol of given type and arity from <candidates> (string!)
    var candidates = candidates.split('');
    for (var i=0; i<candidates.length; i++) {
        var sym = candidates[i];
        if (!this.expressionType[sym]) {
            this.registerExpression(sym, expressionType, arity);
            return sym;
        }
        // after we've gone through <candidates>, add indices to first element:
        candidates.push(candidates[0]+(i+2));
    }
}

Parser.prototype.getNewConstant = function() {
    // for gamma/delta instances in sentrees and cnf skolemization
    return this.getNewSymbol('abcdefghijklmno', 'individual constant', 0);
}

Parser.prototype.getNewVariable = function() {
    // for converting to clausal normal form (for modelfinder)
    return this.getNewSymbol('xyzwvutsr', 'variable', 0);
}

Parser.prototype.getNewFunctionSymbol = function(arity, isWorldFunction) {
    // for converting to clausal normal form (for modelfinder)
    var stype = arity+"-ary function symbol"+(isWorldFunction ? " for worlds" : "");
    return this.getNewSymbol('fghijklmn', stype, arity);
}

Parser.prototype.getNewWorldVariable = function() {
    // for standard translations: ???p => ???x(wRx ...)
    return this.getNewSymbol('wvutsr', 'world variable', 0);
}

Parser.prototype.getNewWorldName = function() {
    // for ???/??? instances in sentrees and cnf skolemization 
    return this.getNewSymbol('vutsr', 'world constant', 0);
}

Parser.prototype.getVariables = function(formula) {
    // return all variables in <formula>
    if (formula.sub) {
        return this.getVariables(formula.sub);
    }
    if (formula.sub1) {
        return this.getVariables(formula.sub1).concatNoDuplicates(
            this.getVariables(formula.sub2));
    }
    var res = [];
    var dupe = {};
    var terms = formula.isArray ? formula : formula.terms;
    for (var i=0; i<terms.length; i++) {
        if (terms[i].isArray) {
            res.extendNoDuplicates(this.getVariables(terms[i]));
        }
        else if (this.expressionType[terms[i]].indexOf('variable') > -1
                 && !dupe[terms[i]]) {
            dupe[terms[i]] = true;
            res.push(terms[i]);
        }
    }
    return res;
}

Parser.prototype.isTseitinLiteral = function(formula) {
    return this.expressionType[formula.predicate || formula.sub.predicate] == 'tseitin predicate';
}

Parser.prototype.initModality = function() {
    // convert signature to standard translation and initialize extra modal
    // vocabulary
    for (var i=0; i<this.symbols.length; i++) {
        var sym = this.symbols[i];
        if (this.expressionType[sym].indexOf('predicate') > -1) {
            this.arities[sym] += 1;
        }
    }
    // This assumes initModality() is called /after/ all formulas have been
    // parsed.
    this.R = this.getNewSymbol('Rr???', '2-ary predicate', 2);
    this.w = this.getNewSymbol('wvur', 'world constant', 0);
}

Parser.prototype.translateFromModal = function(formula, worldVariable) {
    // return translation of modal formula into first-order formula with
    // explicit world variables
    log("translating modal formula "+formula);
    if (!worldVariable) {
        if (!this.w) this.initModality();
        worldVariable = this.w;
    }
    if (formula.terms) { // atomic; add world variable to argument list
        var nterms = formula.terms.copyDeep();
        nterms.push(worldVariable); // don't need to add world parameters to function terms; think of 0-ary terms
        return new AtomicFormula(formula.predicate, nterms);
    }
    if (formula.quantifier) {
        var nmatrix = this.translateFromModal(formula.matrix, worldVariable);
        return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
        // assumes constant domains
    }
    if (formula.sub1) {
        var nsub1 = this.translateFromModal(formula.sub1, worldVariable);
        var nsub2 = this.translateFromModal(formula.sub2, worldVariable);
        return new BinaryFormula(formula.operator, nsub1, nsub2);
    }
    if (formula.operator == '??') {
        var nsub = this.translateFromModal(formula.sub, worldVariable);
        return new NegatedFormula(nsub);
    }
    if (formula.operator == '???') {
        var newWorldVariable = this.getNewWorldVariable();
        var wRv = new AtomicFormula(this.R, [worldVariable, newWorldVariable])
        var nsub = this.translateFromModal(formula.sub, newWorldVariable);
        var nmatrix = new BinaryFormula('???', wRv, nsub);
        return new QuantifiedFormula('???', newWorldVariable, nmatrix, true);
    }
    if (formula.operator == '???') {
        var newWorldVariable = this.getNewWorldVariable();
        var wRv = new AtomicFormula(this.R, [worldVariable, newWorldVariable])
        var nsub = this.translateFromModal(formula.sub, newWorldVariable);
        var nmatrix = new BinaryFormula('???', wRv, nsub);
        return new QuantifiedFormula('???', newWorldVariable, nmatrix, true)
    }
}

Parser.prototype.stripAccessibilityClauses = function(formula) {
    // return new non-modal formula with all accessibility conditions stripped;
    // e.g. ???v(wRv???Av) => ???vAv; ???v(??wRv???Av) => ???vAv. <formula> is normalized.
    log(formula);
    if (formula.quantifier) {
        var nmatrix = this.stripAccessibilityClauses(formula.matrix);
        if (nmatrix == formula.matrix) return formula;
        return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
    }
    if (formula.sub1) {
        if ((formula.sub1.sub && formula.sub1.sub.predicate == this.R) ||
            (formula.sub1.predicate == this.R)) {
            return this.stripAccessibilityClauses(formula.sub2);
        }
        var nsub1 = this.stripAccessibilityClauses(formula.sub1);
        var nsub2 = this.stripAccessibilityClauses(formula.sub2);
        if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
        return new BinaryFormula(formula.operator, nsub1, nsub2);
    }
    if (formula.operator == '??') {
        // negation only for literals in NNF
        return formula;
    }
    else { // atomic
        return formula;
    }
}

Parser.prototype.translateToModal = function(formula) {
    // translate back from first-order formula into modal formula, with extra
    // .world label: pv => p (v); ???u(vRu???pu) => ???p (v). Formulas of type 'wRv'
    // remain untranslated.
    log("translating "+formula+" into modal formula");
    if (formula.terms && formula.predicate == this.R) {
        return formula;
    }
    if (formula.terms) {
        // remove world variable from argument list
        var nterms = formula.terms.copyDeep();
        var worldlabel = nterms.pop();
        var res = new AtomicFormula(formula.predicate, nterms);
        res.world = worldlabel;
    }
    else if (formula.quantifier && this.expressionType[formula.variable] == 'world variable') {
        // (Ev)(wRv & Av) => <>A
        var prejacent = formula.matrix.sub2;
        var op = formula.quantifier == '???' ? '???' : '???';
        var res = new ModalFormula(op, this.translateToModal(prejacent));
        res.world = formula.matrix.sub1.terms[0];
    }
    else if (formula.quantifier) {
        var nmatrix = this.translateToModal(formula.matrix);
        var res = new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
        res.world = nmatrix.world;
    }
    else if (formula.sub1) {
        var nsub1 = this.translateToModal(formula.sub1);
        var nsub2 = this.translateToModal(formula.sub2);
        var res = new BinaryFormula(formula.operator, nsub1, nsub2);
        res.world = nsub2.world; // sub1 might be 'wRv' which has no world parameter
    }
    else if (formula.operator == '??') {
        var nsub = this.translateToModal(formula.sub);
        var res = new NegatedFormula(nsub);
        res.world = nsub.world;
    }
    return res;
}


Parser.prototype.parseInput = function(str) {
    // return [premises, conclusion] for entered string, where <premises> is
    // a list of premise Formulas and <conclusion> is a Formula.
    log("*** parsing input");
    var parts = str.split('|=');
    if (parts.length > 2) {
        throw "You can't use more than one turnstile.";
    }
    var premises = [];
    var conclusion = this.parseFormula(parts[parts.length-1]);
    if (conclusion.isArray)
        throw parts[parts.length-1]+" looks like a list; use either conjunction or disjunction instead of the comma.";

    log("=== conclusion "+conclusion);
    if (parts.length == 2 && parts[0] != '') {
        premises = this.parseFormula(parts[0]);
        if (!premises.isArray) premises = [premises];
        log("=== premises: "+premises);
    }
    if (this.isModal) this.initModality();
    return [premises, conclusion];
}

Parser.prototype.parseFormula = function(str) {
    /**
     * convert entered string <str> into Formula, or into a list of Formulas if
     * <str> contains several formulas separated by commas
     */
    var boundVars = arguments[1] ? arguments[1].slice() : [];
    log("parsing '"+str+"' (boundVars "+boundVars+")");

    if (!arguments[1]) str = this.tidyFormula(str);

    // replace every substring in parens by "%0", "%1", etc.:
    var temp = this.hideSubStringsInParens(str);
    var nstr = temp[0];
    var subStringsInParens = temp[1];
    log("   nstr = '"+nstr+"'; ");

    if (nstr == '%0') {
        log("trying again without surrounding parens");
        return this.parseFormula(str.replace(/^\((.*)\)$/, "$1"), arguments[1]);
    }

    // test if string contains a comma or connective that's not inside
    // parentheses (in order of precedence):
    var reTest = nstr.match(/,/) || nstr.match(/???/) || nstr.match(/???/)  || nstr.match(/???/) || nstr.match(/???/);
    if (reTest) {
        var op = reTest[0];
        log("   string is complex (or list); main connective: "+op+"; ");
        if (op == ',') nstr = nstr.replace(/,/g, '%split');
        else nstr = nstr.replace(op, "%split");
        // restore removed substrings:
        for (var i=0; i<subStringsInParens.length; i++) {
            nstr = nstr.replace("%"+i, subStringsInParens[i]);
        }
        var substrings = nstr.split("%split");
        if (!substrings[1]) {
            throw "argument missing for operator "+op+" in "+str+".";
        }
        log("   substrings: "+substrings);
        var subFormulas = [];
        for (var i=0; i<substrings.length; i++) {
            subFormulas.push(this.parseFormula(substrings[i], boundVars));
        }
        if (op == ',') {
            log("string is list of formulas");
            if (arguments[1]) {
                throw "I don't understand '"+str+"' (looks like a list of formulas).";
            }
            return subFormulas;
        }
        return new BinaryFormula(op, subFormulas[0], subFormulas[1]);
    }

    var reTest = nstr.match(/^(??|???|???)/);
    if (reTest) {
        log("   string is negated or modal; ");
        var op = reTest[1];
        var sub = this.parseFormula(str.substr(1), boundVars);
        if (op == '??') return new NegatedFormula(sub);
        this.isModal = true;
        return new ModalFormula(op, sub);
    }

    // If we're here the formula should be quantified or atomic.
    reTest = /^(???|???)([^\d\(\),%]\d*)/.exec(str);
    if (reTest && reTest.index == 0) {
        // quantified formula
        log("   string is quantified (quantifier = '"+reTest[1]+"'); ");
        var quantifier = reTest[1];
        var variable = reTest[2];
        if (!str.substr(reTest[0].length)) {
            throw "There is nothing in the scope of "+str+".";
        }
        if (this.expressionType[variable] != 'world variable') {
            this.registerExpression(variable, 'variable', 0);
        }
        boundVars.push(variable);
        this.isPropositional = false;
        var sub = this.parseFormula(str.substr(reTest[0].length), boundVars);
        return new QuantifiedFormula(quantifier, variable, sub);
    }

    // formula should be atomic
    m = str.match(/[??????????????]/);
    if (m) {
        throw "I don't understand '"+m[0]+"' in '"+str+"'. Missing operator?";
    }
    
    // convert infix '=' to prefix:
    str = str.replace(/^(.+)=(.+)$/, '=$1$2');
    
    reTest = /^[^\d\(\),%]\d*/.exec(str);
    if (reTest && reTest.index == 0) {
        // normal atomic
        log("   string is atomic (predicate = '"+reTest[0]+"'); ");
        try {
            var predicate = reTest[0];
            var termstr = str.substr(predicate.length); // empty for propositional constants
            var terms = this.parseTerms(termstr, boundVars) || [];
            if (termstr) {
                var predicateType = terms.length+"-ary predicate";
                if (predicate != this.R) this.isPropositional = false;
            }
            else {
                var predicateType = "proposition letter (0-ary predicate)";
            }
            if (predicate == '=') this.hasEquality = true;
            this.registerExpression(predicate, predicateType, terms.length);
            return new AtomicFormula(predicate, terms);
        }
        catch (e) {
            throw e+"\n(I'm assuming '"+str+"' is meant to be an atomic formula with predicate '"+predicate+"'.)";
        }
    }

    throw "Parse Error.\n'" + str + "' is not a well-formed formula.";
}        

Parser.prototype.hideSubStringsInParens = function(str) {
    // return [nstr, hiddenSubStrings], where <nstr> is <str> with all
    // substrings in parentheses replaced by %0, %1, etc., and
    // <hiddenSubStrings> is a list of the corresponding substrings.
    var subStringsInParens = []; 
    var parenDepth = 0;
    var storingAtIndex = -1; // index in subStringsInParens
    var nstr = "";
    for (var i=0; i<str.length; i++) {
        if (str.charAt(i) == "(") {
            parenDepth++;
            if (parenDepth == 1) {
                storingAtIndex = subStringsInParens.length;
                subStringsInParens[storingAtIndex] = "";
                nstr += "%" + storingAtIndex;
            }
        }
        if (storingAtIndex == -1) nstr += str.charAt(i);
        else subStringsInParens[storingAtIndex] += str.charAt(i);
        if (str.charAt(i) == ")") {
            parenDepth--;
            if (parenDepth == 0) storingAtIndex = -1;
        }
    }
    return [nstr, subStringsInParens];
}

Parser.prototype.tidyFormula = function(str) {
    // remove whitespace:
    str = str.replace(/\s/g, '');
    // replace brackets by parentheses:
    str = str.replace('[', '(').replace(']', ')');
    // check that parentheses are balanced:
    this.checkBalancedParentheses(str);
    // remove parentheses around quantifiers: (???x)Fx => ???xFx
    str = str.replace(/\(([??????]\w\d*)\)/g, '$1');
    // check for illegal symbols:
    var m =str.match(/[^\w\d\(\)??????????????????????????,=????$]/);
    if (m) throw("I don't understand the symbol '"+m[0]+"'.");
    log(str);
    return str;
}

Parser.prototype.checkBalancedParentheses = function(str) {
    // check if equally many parentheses open and close in <str>
    var openings = str.split('(').length - 1;
    var closings = str.split(')').length - 1;
    if (openings != closings) {
        throw "unbalanced parentheses: "+openings+" opening parentheses, "+closings+" closing.";
    }
}  

Parser.prototype.parseAccessibilityFormula = function(str) {
    // return Formula for accessibility condition like ???w???v(Rwv)

    // We need to work around clashes if e.g. 'v' is already used as proposition
    // letter or 'R' as an ordinary predicate. Also need to make sure the
    // parsing of accessibility formulas doesn't set this.propositional to
    // false.
    str = str.replace(/R/g, this.R);
    var matches = str.match(/[??????]./g);
    for (var i=0; i<matches.length; i++) {
        var v = matches[i][1];
        if (this.expressionType[v] && this.expressionType[v] != 'world variable') {
            var re = new RegExp(v, 'g');
            str = str.replace(re, this.getNewWorldVariable());
        }
        else {
            // also register variables as world variables:
            this.registerExpression(v, 'world variable', 0);
        }
    }
    var isPropositional = this.isPropositional;
    var formula = this.parseFormula(str);
    this.isPropositional = isPropositional;
    return formula;
}

Parser.prototype.parseTerms = function(str, boundVars) {
    // parses a sequence of terms and returns the sequence in internal format,
    // as nested array
    log("parsing terms: "+str+" (boundVars "+boundVars+")");
    if (!str) return [];
    var result = [];
    str = str.replace(/^\((.+)\)$/, "$1"); // remove surrounding parens
    do {
        var reTest = /[^\(\),%??????????????????????????]\d*/.exec(str);
        if (!reTest || reTest.index != 0) {
            throw "I expected a (sequence of) term(s) instead of '" + str + "'.";
        }
        var nextTerm = reTest[0];
        str = str.substr(reTest[0].length);
        if (str.indexOf("(") == 0) {
            // term was a function symbol. Find and parse the arguments:
            // (I can't use a simple RegExp such as /^\(([^\)]+)\)/ here because
            // I have to keep track of *how many* parens open and close,
            // cf. Rf(a)g(b) vs. Rf(a,g(b))
            var args = "", openParens = 0, spos = 0;
            do {
                args += str.charAt(spos);
                if (str.charAt(spos) == "(") openParens++;
                else if (str.charAt(spos) == ")") openParens--;
                spos++;
            } while (openParens && spos < str.length);
            log("Arguments: "+args);
            nextTerm = [nextTerm].concat(this.parseTerms(args, boundVars));
            var arity = (nextTerm.length - 1);
            this.registerExpression(reTest[0], arity+"-ary function symbol", arity);
            str = str.substr(args.length);
        }
        else if (!boundVars.includes(nextTerm)) {
            this.registerExpression(nextTerm, 'individual constant', 0);
        }
        result.push(nextTerm);
        if (str.indexOf(",") == 0) str = str.substr(1);
    } while (str.length > 0);
    return result;
}
function Prover(initFormulas, parser, accessibilityConstraints) {
    /**
     * A Prover object collects functions and properties used to find either a
     * tableau proof or a countermodel. <initFormulas> is the list of formulas
     * with which the tableau begins (all premises, if any, plus the negated
     * conclusion); <parser> is the Parser object used to parse these formulas;
     * <accessibilityConstraints> is a list of words like 'reflexivity'
     * determinining the relevant modal system.
     */

    log("*** initializing prover");

    parser = parser.copy();
    this.parser = parser;
    this.initFormulas = initFormulas; // formulas as entered, with conclusion negated
    this.initFormulasNonModal = initFormulas;
    this.accessibilityRules = [];
    if (parser.isModal) {
        // convert modal formulas into two-sorted first-order formulas:
        this.initFormulasNonModal = initFormulas.map(function(f) {
            return parser.translateFromModal(f);
        });
        if (accessibilityConstraints) {
            this.s5 = accessibilityConstraints.includes('universality');
            if (!this.s5) {
                this.accessibilityRules = accessibilityConstraints.map(function(s) {
                    return Prover[s];
                });
            }
        }
    }
    this.initFormulasNormalized = this.initFormulasNonModal.map(function(f){
        return f.normalize();
    });
    // These are the formulas that we'll use on the internal tableaux.
    log('normalized initFormulas: '+this.initFormulasNormalized);
    
    // init tableau prover:
    this.pauseLength = 5; // ms pause between calculations
    log('increasing pauseLength to '+(this.pauseLength = 10));
    this.computationLength = 20; // ms before setTimeout pause
    this.step = 0; // counter of calculation steps
    this.tree = new Tree(this);
    this.depthLimit = 2; // how far to explore a tree before backtracking
    this.alternatives = [this.tree]; // alternative trees for backtracking
    this.curAlternativeIndex = 0;
    this.tree.addInitNodes(this.initFormulasNormalized)

    // init modelfinder:
    log("initializing modelfinder")
    var mfParser = parser.copy();
    if (accessibilityConstraints) {
        var name2fla = {
            "universality": "???v???uRvu",
            "reflexivity": "???vRvv",
            "symmetry": "???v???u(Rvu???Ruv)",
            "transitivity": "???v???u???t(Rvu???(Rut???Rvt))",
            "euclidity": "???v???u???t(Rvu???(Rvt???Rut))",
            "seriality": "???v???uRvu"
        };
        var accessibilityFormluas = accessibilityConstraints.map(function(s) {
            return mfParser.parseAccessibilityFormula(name2fla[s]).normalize();
        });
        // todo: strip redundant constraints
        this.modelfinder = new ModelFinder(
            this.initFormulasNormalized,
            mfParser,
            accessibilityFormluas,
            this.s5
        );
    }
    else {
        this.modelfinder = new ModelFinder(this.initFormulasNormalized, mfParser);
    }
    this.counterModel = null;

    this.start = function() {
        this.lastBreakTime = performance.now();
        this.nextStep();
    };

    this.stop = function() {
        this.stopTimeout = true;
    };

    this.onfinished = function(treeClosed) {}; // to be overwritten
    this.status = function(str) {}; // to be overwritten

}

Prover.prototype.nextStep = function() {
    /**
     * expand the next node on the left-most open branch; initializes
     * backtracking if limit is reached; also search for a countermodel. This
     * function calls itself again until the proof is complete.
     */
    this.step++;
    log('*** prover step '+this.step+' alternative '+this.curAlternativeIndex+' (max '+(this.alternatives.length-1)+')');
    log(this.tree);

    if (this.tree.openBranches.length == 0) {
        log('tree closed');
        return this.onfinished(1);
    }
    
    this.status('step '+this.step+' alternative '+this.curAlternativeIndex+', '
                +this.tree.numNodes+' nodes, model size '
                +this.modelfinder.model.domain.length
                +(this.tree.parser.isModal ? '/'+this.modelfinder.model.worlds.length : ''));

    if (this.limitReached()) {
        log(" * limit "+this.depthLimit+" reached");
        if (this.curAlternativeIndex < this.alternatives.length-1) {
            this.curAlternativeIndex++;
            log(" * trying stored alternative");
        }
        else {
            // this.depthLimit += Math.ceil(this.alternatives.length/20);
            this.depthLimit += 2 + Math.floor(this.step/500);
            this.curAlternativeIndex = 0;
            log(" * increasing to "+this.depthLimit);
        }
        this.tree = this.alternatives[this.curAlternativeIndex];
        return this.nextStep(); // need to check if alternative is also at limit
    }

    var todo = this.tree.openBranches[0].todoList.shift();
    if (todo) {
        todo.nextRule(this.tree.openBranches[0], todo.args);
    }
    else if (this.alternatives.length) {
        // If we reason with equality, todoList may be empty even though the tree isn't finished
        // because we consider trees without equality reasoning.
        log("nothing left to do");
        this.discardCurrentAlternative();
    }
    
    // search for a countermodel:
    if (this.modelfinder.nextStep()) {
        this.counterModel = this.modelfinder.model;
        return this.onfinished(0);
    }
    
    var timeSinceBreak = performance.now() - this.lastBreakTime;
    if (this.stopTimeout) {
        // proof manually interrupted
        this.stopTimeout = false;
    }
    else if (this.pauseLength && timeSinceBreak > this.computationLength) {
        // continue with next step after short break to display status message
        // and not get killed by browsers
        setTimeout(function(){
            this.lastBreakTime = performance.now();
            this.nextStep();
        }.bind(this), this.pauseLength+this.tree.numNodes/1000);
    }
    else {
        this.nextStep();
    }
}

Prover.prototype.limitReached = function() {
    /**
     * check if the current tree has been explored up to depthLimit
     */
    var complexity = this.tree.getNumNodes() - this.tree.priority;
    if (this.tree.openBranches[0].todoList[0] &&
        this.tree.openBranches[0].todoList[0].nextRule == Prover.equalityReasoner) {
        if (!this.equalityComputationStep) this.equalityComputationStep = 1;
        else if (++this.equalityComputationStep == 100) {
            this.equalityComputationStep = 0;
            return true;
        }
    }
    // complexity += this.curAlternativeIndex/100;
    return complexity >= this.depthLimit; 
}

Prover.prototype.useTree = function(tree, index) {
    /**
     * replace currently active tree alternative by <tree>; if <index> is given,
     * inserts <tree> at <index> in this.alternatives
     */
    if (index !== undefined) {
        this.alternatives.splice(index, 0, tree);
        this.curAlternativeIndex = index;
    }
    else {
        this.alternatives[this.curAlternativeIndex] = tree;
    }
    this.tree = tree
}

Prover.prototype.switchToAlternative = function(altTree) {
    /**
     * continue proof search with <altTree> (member of this.alternatives)
     */
    this.curAlternativeIndex = this.alternatives.indexOf(altTree);
    this.tree = this.alternatives[this.curAlternativeIndex];
}

Prover.prototype.storeAlternatives = function(altTrees) {
    /**
     * add <altTrees> as alternatives to be explored after the current tree;
     * remove redundant alternatives
     */
    log("storing "+altTrees.length+" alternatives");
    var insertPosition = this.curAlternativeIndex+1;
    for (var i=0; i<altTrees.length; i++) {
        this.alternatives.splice(insertPosition, 0, altTrees[i]);
        this.pruneAlternatives(altTrees[i]);
        if (!altTrees[i].removed) {
            insertPosition++;
        }
    }
    log("There are now "+this.alternatives.length+' alternatives');
    log(this.alternatives.map(function(t,i) { return "alternative "+i+":"+t }).join('<br>')); 
}

Prover.prototype.pruneAlternatives = function(tree) {
    /**
     * discard elements in this.alternatives that have become redundant after <tree>
     * has been added or altered; might remove <tree> itself if it is found redundant;
     * removed trees get attribute 'removed'
     */
    log("pruning alternatives");
    for (var i=0; i<this.alternatives.length; i++) {
        if (this.alternatives[i] == tree) continue;
        var keepWhich = this.keepWhichTree(tree, this.alternatives[i]);
        var keepTree = keepWhich[0];
        var keepAlt = keepWhich[1];
        if (!keepTree) {
            log("removing tree<br>"+tree+"<br>in favour of alternative<br>"+this.alternatives[i]);
            this.removeAlternative(this.alternatives.indexOf(tree));
            return;
        }
        else if (!keepAlt) {
            log("removing alternative<br>"+this.alternatives[i]+"<br>in favour of<br>"+tree);
            this.removeAlternative(i);
            i--;
        }
    }
}

Prover.prototype.keepWhichTree = function(tree, altTree) {
    /**
     * compare <tree> and <altTree> from this.alternatives for redundancy; return
     * [Boolean1, Boolean2], where Boolean1 indicates if <tree> should be kept and
     * Boolean2 if <altTree> should be kept
     */
    if (altTree.string == tree.string) {
        if (tree.openBranches[0].todoList[0].nextRule != altTree.openBranches[0].todoList[0].nextRule ||
            tree.openBranches[0].todoList[0].args != altTree.openBranches[0].todoList[0].args) {
            return [true, true];
        }
        else if (tree.numNodes < altTree.numNodes) {
            log('alternative has same open branches and is larger; removing');
            return [true, false];
        }
        else {
            log('tree has same open branches as alternative; removing');
            return [false, true];
        }
    }
    var treeDiff = this.treeDiff(tree, altTree);
    var treeHasUnmatchedBranches = treeDiff[0];
    var altTreeHasUnmatchedBranches = treeDiff[1];
    if (treeHasUnmatchedBranches && altTreeHasUnmatchedBranches) {
        return [true, true];
    }
    if (treeHasUnmatchedBranches) {
        log('tree has extra open branches compared to alternative; removing');
        return [false, true];
    }
    if (altTreeHasUnmatchedBranches) {
        log('alternative has extra open branches; removing');
        return [true, false];
    }
    // The trees have the same open branches. We check if one tree is more
    // developed. Careful: We may want to store alternative ways of expanding an
    // open branch, so the mere fact that a branch is longer on one tree doesn't
    // mean it is a continuation of the other.
    var treeNodes = tree.openBranches[0].nodes;
    var altTreeNodes = altTree.openBranches[0].nodes;
    if (altTreeNodes.length > treeNodes.length &&
        tree.openBranches[0].todoList[0].nextRule != Prover.equalityReasoner) {
        log('tree is less developed than alternative; removing it');
        return [false, true];
    }
    else if (treeNodes.length > altTreeNodes.length &&
             altTree.openBranches[0].todoList[0].nextRule != Prover.equalityReasoner) {
        log('tree is more developed than alternative; removing alternative');
        return [true, false];
    }
    else return [true, true];
}

Prover.prototype.treeDiff = function(tree1, tree2) {
    /**
     * compare open branches of <tree1> and <tree2>; return [Boolean1, Boolean2],
     * where Boolean1 indicates if <tree1> has a branch that doesn't "match" a
     * branch of <tree2> and conversely for Boolean2; two branches "match" if
     * they have the same formulas or one is an initial segment of the other
     */
    var tree1hasUnmatchedBranches = false;
    var tree2hasUnmatchedBranches = false;
    var tree2matchedBranchIds = [];
    TREE1BRANCHLOOP:
    for (var i=0; i<tree1.openBranches.length; i++) {
        var string1 = tree1.openBranches[i].string;
        for (var j=0; j<tree2.openBranches.length; j++) {
            var string2 = tree2.openBranches[j].string;
            if (string1.startsWith(string2) || string2.startsWith(string1)) {
                // branches i and j match
                tree2matchedBranchIds.push(j);
                continue TREE1BRANCHLOOP;
            }
        }
        // branch i doesn't match any branch on tree2
        tree1hasUnmatchedBranches = true;
        break;
    }
    TREE2BRANCHLOOP:
    for (var j=0; j<tree2.openBranches.length; j++) {
        if (tree2matchedBranchIds.includes(j)) continue;
        var string2 = tree2.openBranches[j].string;
        for (var i=0; i<tree1.openBranches.length; i++) {
            var string1 = tree1.openBranches[i].string;
            if (string1.startsWith(string2) || string2.startsWith(string1)) {
                // branches i and j match
                continue TREE2BRANCHLOOP;
            }
        }
        // branch j doesn't match any branch on tree1
        tree2hasUnmatchedBranches = true;
        break;
    }
    return [tree1hasUnmatchedBranches, tree2hasUnmatchedBranches];
}

Prover.prototype.removeAlternative = function(index) {
    /**
     * remove alternative at position <index> from this.alternatives
     */
    log("removing alternative "+index+" of "+this.alternatives.length);
    this.alternatives[index].removed = true;
    if (index == this.curAlternativeIndex) {
        this.discardCurrentAlternative();
    }
    else {
        this.alternatives.splice(index, 1);
        if (index < this.curAlternativeIndex) {
            this.curAlternativeIndex--;
        }
    }
}

Prover.prototype.discardCurrentAlternative = function() {
    /**
     * remove current tree from this.alternatives and move to next one
     */
    this.alternatives.splice(this.curAlternativeIndex, 1);
    if (this.curAlternativeIndex == this.alternatives.length) {
        this.curAlternativeIndex = 0;
    }
    log("discarding current alternative; switching to alternative "+this.curAlternativeIndex);
    if (this.alternatives.length) {
        // don't make this.tree undefined if there are no more alternatives
        this.tree = this.alternatives[this.curAlternativeIndex];
    }
}

/**
 * What follows are functions corresponding to individual tableau expansion steps.
 */

Prover.alpha = function(branch, nodeList) {
    // <nodeList> is a list because some rules apply to more than one node. Not
    // this one, so here <nodeList> has just one member: a conjunction.
    log('alpha '+nodeList[0]);
    var node = nodeList[0];
    var subnode1 = new Node(node.formula.sub1, Prover.alpha, nodeList);
    var subnode2 = new Node(node.formula.sub2, Prover.alpha, nodeList);
    branch.addNode(subnode1, 'addEvenIfDuplicate');
    branch.addNode(subnode2, 'addEvenIfDuplicate');
    branch.tryClose(subnode1);
    if (!branch.closed) branch.tryClose(subnode2);
}
Prover.alpha.priority = 1;
Prover.alpha.toString = function() { return 'alpha' }

Prover.beta = function(branch, nodeList) {
    log('beta '+nodeList[0]);
    var node = nodeList[0];
    var newbranch = branch.copy();
    branch.tree.openBranches.unshift(newbranch);
    // tackle simpler branch first:
    var re = /[????????????????????????]/g;
    var complexity1 = (node.formula.sub1.string.match(re) || []).length;
    var complexity2 = (node.formula.sub2.string.match(re) || []).length;
    if (complexity2 < complexity1) { 
        var subnode1 = new Node(node.formula.sub1, Prover.beta, nodeList);
        var subnode2 = new Node(node.formula.sub2, Prover.beta, nodeList);
    }
    else {
        var subnode2 = new Node(node.formula.sub1, Prover.beta, nodeList);
        var subnode1 = new Node(node.formula.sub2, Prover.beta, nodeList);
    }
    branch.addNode(subnode1, 'addEvenIfDuplicate');
    newbranch.addNode(subnode2, 'addEvenIfDuplicate');
    branch.tryClose(subnode1, 'dontPruneAlternatives');
    newbranch.tryClose(subnode2);
}
Prover.beta.priority = 9;
Prover.beta.toString = function() { return 'beta' }

Prover.gamma = function(branch, nodeList, matrix) {
    // <matrix> is set when this is called from modalGamma for S5 trees, see
    // modalGamma() below.
    log('gamma '+nodeList[0]);
    var fromModalGamma = (matrix != undefined);
    var node = nodeList[0];
    var newVariable = branch.newVariable(matrix);
    var matrix = matrix || node.formula.matrix;
    var newFormula = matrix.substitute(node.formula.variable, newVariable);
    var newNode = new Node(newFormula, Prover.gamma, nodeList);
    // NB: The last line sets fromRule to gamma even for s5 modalGamma nodes
    newNode.instanceTerm = newVariable; // used in sentree
    branch.addNode(newNode);
    branch.tryClose(newNode);
    // add application back onto todoList:
    if (!fromModalGamma && newNode.type != 'gamma') {
        // When expanding ???x???y???z??, we add ???y???z?? and ???z?? to the branch, all of
        // which can be expanded again and again, leading to lots of useless
        // variations of ??. So we only add the outermost sentence back to the
        // list, and only after the innermost was expanded, so that we first
        // expand ?? before expanding ???x???y???z?? again.
        var outer = node;
        while (outer.fromRule == Prover.gamma) outer = outer.fromNodes[0];
        var priority = 9;
        branch.todoList.push(Prover.makeTodoItem(Prover.gamma, [outer], priority));
    }
}
Prover.gamma.priority = 7;
Prover.gamma.toString = function() { return 'gamma' }

Prover.modalGamma = function(branch, nodeList) {
    // ???A and ?????A nodes are translated into ???x(??wRxvAx) and ???x(??wRx?????Ax). By the
    // standard gamma rule, these would be expanded to ??wR??7 ??? A??7 or ??wR??7 ???
    // ??A??7. We don't want the resulting branches on the tree. See readme.org
    log('modalGamma '+nodeList[0]);
    var node = nodeList[0];
    // add application back onto todoList:
    branch.todoList.push(Prover.makeTodoItem(Prover.modalGamma, nodeList));
    
    if (branch.tree.prover.s5) {
        // In S5, we still translate ???A into ???x(??wRxvAx) rather than ???xAx.
        // That's because the latter doesn't tell us at which world the formula
        // is evaluated ('w'), which makes it hard to translate back into
        // textbook tableaux. (Think about the tableau for ??????A??????A.) But when we
        // expand the ???A node, we ignore the accessibility clause. Instead, we
        // expand ???x(??wRx???Ax) to A??1 and use the free-variable machinery.
        return Prover.gamma(branch, nodeList, node.formula.matrix.sub2);
    }

    var wRx = node.formula.matrix.sub1.sub;
    log('looking for '+wRx.predicate+wRx.terms[0]+'* nodes');
    // find wR* node for ???A expansion:
    OUTERLOOP:
    for (var i=0; i<branch.literals.length; i++) {
        var wRy = branch.literals[i].formula;
        if (wRy.predicate == wRx.predicate && wRy.terms[0] == wRx.terms[0]) {
            log('found '+wRy);
            // check if <node> has already been expanded with this wR* node:
            for (var j=0; j<branch.nodes.length; j++) {
                if (branch.nodes[j].fromRule == Prover.modalGamma &&
                    branch.nodes[j].fromNodes[0] == node &&
                    branch.nodes[j].fromNodes[1] == branch.literals[i]) {
                    log('already used');
                    continue OUTERLOOP;
                }
            }
            // expand <node> with found wR*:
            var modalMatrix = node.formula.matrix.sub2;
            var v = wRy.terms[1];
            log('expanding: '+node.formula.variable+' => '+v);
            var newFormula = modalMatrix.substitute(node.formula.variable, v);
            var newNode = new Node(newFormula, Prover.modalGamma, [node, branch.literals[i]]);
            newNode.instanceTerm = v;
            if (branch.addNode(newNode)) {
                branch.tryClose(newNode);
                break;
            }
        }
    }
}
Prover.modalGamma.priority = 8;
Prover.modalGamma.toString = function() { return 'modalGamma' }
    
Prover.delta = function(branch, nodeList, matrix) {
    // <matrix> is set when this is called from modalDelta for S5 trees, see
    // modalDelta() below. 
    log('delta '+nodeList[0]);
    var node = nodeList[0];
    var fla = node.formula;
    // find skolem term:
    var funcSymbol = branch.tree.newFunctionSymbol(matrix);
    // It suffices to skolemize on variables contained in this formula. This
    // makes some proofs much faster by making some gamma applications
    // redundant. However, translation into sentence tableau then becomes almost
    // impossible, because here we need the missing gamma applications. Consider
    // ???x(Fx & ???y??Fy).
    if (branch.freeVariables.length > 0) {
        if (branch.tree.prover.s5) {
            // branch.freeVariables contains world and individual variables
            var skolemTerm = branch.freeVariables.filter(function(v) {
                return v[0] == (matrix ? '??' : '??');
            });
        }
        else {
            var skolemTerm = branch.freeVariables.copy();
        }
        skolemTerm.unshift(funcSymbol);
    }
    else {
        var skolemTerm = funcSymbol;
    }
    var matrix = matrix || node.formula.matrix;
    var newFormula = matrix.substitute(node.formula.variable, skolemTerm);
    var newNode = new Node(newFormula, Prover.delta, nodeList);
    newNode.instanceTerm = skolemTerm;
    branch.addNode(newNode);
    branch.tryClose(newNode);
}
Prover.delta.priority = 2;
Prover.delta.toString = function() { return 'delta' }

Prover.modalDelta = function(branch, nodeList) {
    log('modalDelta '+nodeList[0]);
    var node = nodeList[0]; // a node of type ???x(wRx???Ax)
    if (branch.tree.prover.s5) {
        // In S5, we still translate ???A into ???x(wRx???Ax) rather than ???xAx. That's
        // because the latter doesn't tell us at which world the formula is
        // evaluated ('w'), which makes it hard to translate back into textbook
        // tableaux. (Think about the tableau for ??????A??????A.) But when we expand
        // the ???A node, we ignore the accessibility clause. Instead, we expand
        // ???x(wRx???Ax) to A??, where ?? is a suitable skolem term, just like for
        // ordinary existential formulas.
        return Prover.delta(branch, nodeList, node.formula.matrix.sub2);
    }
    var fla = node.formula;
    // don't need skolem terms (see readme.org):
    var newWorldName = branch.tree.newWorldName();
    // The instance formula would be wRu???Au. We immediately expand the
    // conjunction to conform to textbooks modal rules:
    var fla1 = node.formula.matrix.sub1.substitute(node.formula.variable, newWorldName);
    var fla2 = node.formula.matrix.sub2.substitute(node.formula.variable, newWorldName);
    var newNode1 = new Node(fla1, Prover.modalDelta, nodeList); // wRu
    var newNode2 = new Node(fla2, Prover.modalDelta, nodeList); // Au
    newNode2.instanceTerm = newWorldName;
    branch.addNode(newNode1);
    branch.addNode(newNode2);
    branch.tryClose(newNode2);
}
Prover.modalDelta.priority = 2;
Prover.modalDelta.toString = function() { return 'modalDelta' }

Prover.literal = function(branch, nodeList) {
    /**
     * check if <branch> can be closed by applying a substitution, involving the
     * newly added literal(s) <nodeList> as either the member of a complementary
     * pair or as a self-complementary node ??(??=??); also schedule the equality
     * reasoner that tries to close the branch by calling LL* on any equality
     * problem that newly arises on the branch by the addition of <nodeList>.
     *
     * There may be several options for closing the branch, with different
     * substitutions. We need to try them all. It may also be better to not close
     * the branch at all and instead continue expanding nodes. So we collect all
     * possible unifiers, try the first and store alternative trees for later
     * exploration with backtracking.
     *
     * (Sometimes a branch can be closed both by unifying a complementary pair
     * and by turning a new node into a self-complementary node. For example,
     * if the branch contains g(f(x1)) = x1 and the new node is ??(x2=a), we can
     * unify the two formulas with x1->a, x2->g(f(a)), but we can also close the
     * branch by solving the trivial equality problem [] |- x2=a, whose solution
     * is x2->a.)
     *
     * (Why have a special rule/step for this, rather than calling it from
     * tryClose, in the same step in which the new node is added? Because we
     * would then create the relevant EqualityProblems on non-active branches
     * of a beta expansion. By the time we get to work on them, those
     * branches might have changed by applying a substitution that closed
     * the earlier active branch. As a result the created EqualityProblems
     * could involve equations or terms that are no longer on the branch.)
     */

    var tree = branch.tree;
    var prover = tree.prover;

    // collect unifiers that would allow closing the branch:
    var unifiers = [];
    for (var i=0; i<nodeList.length; i++) {
        unifiers.extendNoDuplicates(branch.getClosingUnifiers(nodeList[i]));
    }
    // We apply each unifier to a different copy of the present tree. If one
    // of them closes the entire tree, we're done. If not, and if there's a
    // unifier that doesn't affect other branches, we use that one and
    // discard the other tree copies. Otherwise we store the other copies
    // for backtracking.
    var altTrees = [];
    var localTree = null;
    for (var i=0; i<unifiers.length; i++) {
        log("processing unifier (on new tree): "+unifiers[i]);
        var altTree = tree.copy();
        altTree.applySubstitution(unifiers[i]);
        altTree.closeCloseableBranches();
        if (altTree.openBranches.length == 0) {
            log('tree closes, stopping proof search');
            prover.useTree(altTree);
            return;
        }
        if (!localTree) {
            if (!branch.unifierAffectsOtherBranches(unifiers[i])) {
                log("That unifier didn't affect other branches.");
                localTree = altTree;
            }
            else {
                altTrees.push(altTree);
            }
        }
    }
    if (localTree) {
        log("continuing with unifier that doesn't affect other branches");
        prover.useTree(localTree);
        prover.pruneAlternatives(localTree);
        return;
    }

    // Instead of unifying (often as the only option), we could apply some other
    // rule. In particular, we could try to close the branch with an equality
    // rule.
    if (tree.parser.hasEquality) {
        log("checking if we could apply equality reasoning (on original tree)");
        var eqProbs = branch.createEqualityProblems(nodeList);
        if (eqProbs.length) {
            log("scheduling equality problem(s) (on a new tree): "+eqProbs);
            var altTree = tree.copy();
            altTree.openBranches[0].todoList = eqProbs.map(function(p) {
                return Prover.makeTodoItem(Prover.equalityReasoner, p);
            });
            // We erase the other todoList items: if the branch can't be closed
            // using equality reasoning, we'll switch to the alternative introduced
            // below
            altTrees.push(altTree);
        }
    }

    // Alternatively, we could apply an ordinary rule. (This is an alternative
    // to trying equality reasoning because the latter may only stop when
    // depthLimit is reached, in which case we want to switch to the alternative
    // of applying ordinary rules.)
    if (!altTrees.length) {
        // no alternatives found; simply continue with present tree
        return;
    }
    else if (branch.todoList.length) {
        log("storing original tree as alternative");
        altTrees.push(tree);
    }
    // We continue with the first altTree and store the others for backtracking.
    var curTreeIndex = prover.curAlternativeIndex;
    prover.alternatives.splice(curTreeIndex, 1);
    if (altTrees.length) {
        do {
            log("switching to first alternative");
            var newTree = altTrees.shift();
            prover.useTree(newTree, curTreeIndex);
            prover.pruneAlternatives(newTree);
        } while (newTree.removed && altTrees.length);
        if (altTrees.length) {
            prover.storeAlternatives(altTrees);
        }
    }
}
Prover.literal.priority = 0;
Prover.literal.toString = function() { return 'literal' };

Prover.equalityReasoner = function(branch, equalityProblem) {
    /**
     * expand the <EqualityProblem> by one RBS rule (roughly, one appliation of LL)
     *
     * This method follows a similar logic to Prover.literal.
     */

    log('tackling equality problem '+equalityProblem);

    // equalityProblem.nextStep returns a list of EqualityProblems beginning
    // with solved problems (if any) and continuing with problems that have
    // extended the original problem by zero or one application of (LL*).
    var newProblems = equalityProblem.nextStep();
    log("equality reasoning returned "+newProblems);

    if (newProblems.length == 0) {
        log("equalityProblem exhausted; no further rules to schedule");
        if (!branch.todoList[0]) {
            // We've already saved an alternative on which we continue with the
            // rest of the todoList (in literal()); so we can discard the
            // present alternative.
            branch.tree.prover.discardCurrentAlternative();
        }
        return;
    }

    // We apply each solution to a copy of the present tree. On all these copies,
    // the current branch gets closed. If one of them closes all branches, we're
    // done. Otherwise we continue with a solution that doesn't affect other
    // branches, if any. If there's none, we add all possibilities as alternatives
    // for backtracking.  (Note that when we copy the tree, we change the
    // identity of its Nodes, so the node references in newProblems break. We
    // fix this in branch.closeWithEquality().)
    var tree = branch.tree;
    var prover = tree.prover;
    var altTrees = [];
    var localTree = null;
    while (newProblems.length && !newProblems[0].nextStep) {
        // newProblems[0] is a solved problem (that closes the current branch)
        var solution = newProblems.shift();
        var substitution = solution.getSubstitution();
        // We could enforce a check that the solution makes use of newly added
        // equalities, but in tests this doesn't speed things up.
        log("applying solution "+solution);
        var altTree = tree.copy();
        altTree.openBranches[0].closeWithEquality(solution);
        altTree.closeCloseableBranches();
        if (altTree.openBranches.length == 0) {
            log('that tree closes, stopping proof search');
            prover.useTree(altTree);
            return;
        }
        if (!localTree) {
            if (!branch.unifierAffectsOtherBranches(substitution)) {
                localTree = altTree;
            }
            else {
                altTrees.push(altTree);
            }
        }
    }
    if (localTree) {
        log("continuing with solution that doesn't affect other branches");
        prover.useTree(localTree);
        prover.pruneAlternatives(localTree);
        return;
    }

    // We also consider the option of continuing with unsolved EqualityProblems
    // in order to find another solution (using the current tree)
    if (newProblems.length) {
        log("scheduling revised non-solution problems");
        var newTasks = newProblems.map(function(p) {
            return Prover.makeTodoItem(Prover.equalityReasoner, p);
        });
        branch.todoList.extend(newTasks);
        // Note that a substitution is only applied to this branch when the
        // branch is closed. So we don't need to worry about the terms and
        // equations of the new problems changing by the time we get to deal
        // with them at the end of the todoList. However, we do need to worry
        // about the fact that in-between rules might copy the present tree and
        // store it as an alternative. A copied tree has new Node objects, and
        // we need to make sure that the EqualityProblems on its todoLists point
        // to these Nodes. We do this in tree.copy().
    }

    if (!altTrees.length) {
        // no alternatives found; simply continue with present tree
        return;
    }
    else if (branch.todoList.length) {
        altTrees.push(tree);
    }
    // We continue with the first altTree and store the others for backtracking.
    var curTreeIndex = prover.curAlternativeIndex;
    prover.alternatives.splice(curTreeIndex, 1);
    if (altTrees.length) {
        do {
            log("switching to first alternative");
            var newTree = altTrees.shift();
            prover.useTree(newTree, curTreeIndex);
            prover.pruneAlternatives(newTree);
        } while (newTree.removed && altTrees.length);
        if (altTrees.length) {
            prover.storeAlternatives(altTrees);
        }
    }
}
Prover.equalityReasoner.priority = 0;
Prover.equalityReasoner.toString = function() { return 'equality' }

Prover.reflexivity = function(branch, nodeList) {
    log('applying reflexivity rule');
    // nodeList is either empty or contains a node of form wRv where v might
    // have been newly introduced
    if (nodeList.length == 0) {
        // applied to initial world w:
        var worldName = branch.tree.parser.w;
    }
    else {
        var worldName = nodeList[0].formula.terms[1];
    }
    var R = branch.tree.parser.R;
    var formula = new AtomicFormula(R, [worldName, worldName]);
    log('adding '+formula);
    var newNode = new Node(formula, Prover.reflexivity, nodeList || []);
    branch.addNode(newNode);
    // No point calling branch.tryClose(newNode): ~Rwv won't be on the branch.
}
Prover.reflexivity.priority = 3;
Prover.reflexivity.needsPremise = false; // can only be applied if wRv is on the branch
Prover.reflexivity.premiseCanBeReflexive = false; // can be applied to wRw
Prover.reflexivity.toString = function() { return 'reflexivity' }
    
Prover.symmetry = function(branch, nodeList) {
    log('applying symmetry rule');
    // nodeList contains a node of form wRv.
    var nodeFormula = nodeList[0].formula;
    var R = branch.tree.parser.R;
    var formula = new AtomicFormula(R, [nodeFormula.terms[1], nodeFormula.terms[0]]);
    log('adding '+formula);
    var newNode = new Node(formula, Prover.symmetry, nodeList);
    branch.addNode(newNode);
}
Prover.symmetry.priority = 3;
Prover.symmetry.needsPremise = true; // can only be applied if wRv is on the branch
Prover.symmetry.premiseCanBeReflexive = false; // can be applied to wRw
Prover.symmetry.toString = function() { return 'symmetry' }

Prover.euclidity = function(branch, nodeList) {
    log('applying euclidity rule');
    // nodeList contains a newly added node of form wRv.
    var node = nodeList[0];
    var nodeFla = node.formula;
    // When a wRv node has been added, euclidity always allows us to add vRv. In
    // addition, for each earlier wRu node, we can add uRv as well as
    // vRu. However, if we add all of these at once, they will be marked as
    // having been added in the same step, so that if some of them are
    // eventually used to derive a contradiction, senTree.removeUnusedNodes will
    // keep them all (ex.: ??????p?????????p). So we have to add them one by one. (And
    // they really are different applications of the euclidity rule.)
    var flaStrings = branch.nodes.map(function(n) {
        return n.formula.string;
    });
    var R = branch.tree.parser.R;
    for (var i=0; i<branch.nodes.length; i++) {
        var earlierFla = branch.nodes[i].formula;
        if (earlierFla.predicate != R) continue;
        if (earlierFla.terms[0] == nodeFla.terms[0]) {
            // earlierFla is wRu, nodeFla wRv (or earlierFla == nodeFla); need
            // to add uRv and vRu if not already there.
            var newFla;
            if (!flaStrings.includes(R + earlierFla.terms[1] + nodeFla.terms[1])) {
                newFla = new AtomicFormula(R, [earlierFla.terms[1], nodeFla.terms[1]]);
            }
            else if (!flaStrings.includes(R + nodeFla.terms[1] + earlierFla.terms[1])) {
                newFla = new AtomicFormula(R, [nodeFla.terms[1], earlierFla.terms[1]]);
            }
            if (newFla) {
                log('adding '+newFla);
                var newNode = new Node(newFla, Prover.euclidity, [branch.nodes[i], node]);
                if (branch.addNode(newNode)) {
                    branch.todoList.unshift(Prover.makeTodoItem(Prover.euclidity, nodeList, 0));
                    return;
                }
            }
        }
        if (branch.nodes[i] == node) break;
    }
}
Prover.euclidity.priority = 3;
Prover.euclidity.needsPremise = true; // can only be applied if wRv is on the branch
Prover.euclidity.premiseCanBeReflexive = false; // can be applied to wRw
Prover.euclidity.toString = function() { return 'euclidity' }

Prover.transitivity = function(branch, nodeList) {
    log('applying transitivity rule');
    // nodeList contains a newly added node of form wRv.
    var R = branch.tree.parser.R;
    var node = nodeList[0];
    var nodeFla = node.formula;
    // see if we can apply transitivity:
    for (var i=0; i<branch.nodes.length; i++) {
        var earlierFla = branch.nodes[i].formula;
        if (earlierFla.predicate != R) continue;
        var newFla = null;
        if (earlierFla.terms[1] == nodeFla.terms[0]) {
            // earlierFla uRw, nodeFla wRv
            newFla = new AtomicFormula(R, [earlierFla.terms[0], nodeFla.terms[1]]);
        }
        else if (earlierFla.terms[0] == nodeFla.terms[1]) {
            // earlierFla vRu, nodeFla wRv
            newFla = new AtomicFormula(R, [nodeFla.terms[0], earlierFla.terms[1]]);
        }
        if (newFla) {
            log('matches '+earlierFla+': adding '+newFla);
            var newNode = new Node(newFla, Prover.transitivity, [branch.nodes[i], node]);
            if (branch.addNode(newNode)) {
                branch.todoList.unshift(Prover.makeTodoItem(Prover.transitivity, nodeList, 0));
                return;
            }
        }
        if (branch.nodes[i] == node) break;
    }
}
Prover.transitivity.priority = 3;
Prover.transitivity.needsPremise = true; // can only be applied if wRv is on the branch
Prover.transitivity.premiseCanBeReflexive = false; // can be applied to wRw
Prover.transitivity.toString = function() { return 'transitivity' }

Prover.seriality = function(branch, nodeList) {
    log('applying seriality rule');
    // nodeList is either empty or contains a newly added node of form wRv.
    var R = branch.tree.parser.R;
    if (nodeList.length == 0) {
        // applied to initial world w.
        var oldWorld = branch.tree.parser.w;
    }
    else {
        var oldWorld = nodeList[0].formula.terms[1];
    } 
    // check if oldWorld can already see a world:
    for (var i=0; i<branch.nodes.length-1; i++) {
        var earlierFla = branch.nodes[i].formula;
        if (earlierFla.predicate == R && earlierFla.terms[0] == oldWorld) {
            log(oldWorld+' can already see a world');
            return;
        }
    }
    var newWorld = branch.tree.newWorldName();
    var newFla = new AtomicFormula(R, [oldWorld, newWorld]);
    log('adding '+newFla);
    var newNode = new Node(newFla, Prover.seriality, []);
    branch.addNode(newNode);
}
Prover.seriality.priority = 10;
Prover.seriality.needsPremise = false; // can only be applied if wRv is on the branch
Prover.seriality.premiseCanBeReflexive = false; // can be applied to wRw
Prover.seriality.toString = function() { return 'seriality' }

Prover.makeTodoItem = function(nextRule, args, priority) {
    return {
        nextRule: nextRule,
        priority: priority || nextRule.priority,
        args: args
    }
}

function Tree(prover) {
    /**
     * a (partial) tableau
     */
    if (!prover) return; // for copy() function
    this.prover = prover;
    this.parser = prover.parser;
    this.openBranches = [new Branch(this)];
    this.closedBranches = [];
    this.numNodes = 0;
    this.skolemSymbols = []; // the function symbols used for skolem terms on the tree
    this.string = ""; // a string representation of the open branches, used in pruneAlternatives
    this.priority = 0;
}

Tree.prototype.addInitNodes = function(initFormulasNormalized) {
    var initBranch = this.openBranches[0];
    for (var i=0; i<initFormulasNormalized.length; i++) {
        var node = new Node(initFormulasNormalized[i]);
        initBranch.addNode(node);
        initBranch.tryClose(node);
    }
}

Tree.prototype.closeBranch = function(branch, complementary1, complementary2) {
    /**
     * close branch <branch>; mark nodes as "used" for deriving the supplied
     * complementary pair
     */
    log('closing branch '+branch)
    branch.closed = true;
    branch.todoList = [];
    this.markUsedNodes(branch, complementary1, complementary2);
    this.openBranches.remove(branch);
    this.closedBranches.push(branch);
    log(this);
    this.pruneBranch(branch, complementary1, complementary2);
    this.string = this.openBranches.map(function(b) { return b.string }).join('|');
    var priorityBoost = Math.min(1, (this.numNodes-this.priority)/40);
    this.priority += priorityBoost*Math.max(1, 4-this.openBranches.length);
    log(this);
}

Tree.prototype.markUsedNodes = function(branch, complementary1, complementary2) {
    /**
     * add <branch>.id to node.used for all nodes that were involved in deriving
     * the supplied complementary pair
     */
    var ancestors = [complementary1, complementary2];
    var n;
    while ((n = ancestors.shift())) {
        // n is in the fromNodes chain of the complementary pair
        if (n.used.indexOf(branch.id) == -1) {
            n.used += branch.id;
            for (var i=0; i<n.fromNodes.length; i++) {
                ancestors.push(n.fromNodes[i]);
            }
        }
    }
}

Tree.prototype.pruneBranch = function(branch, complementary1, complementary2) {
    /**
     * remove redundant branches from current tree after <branch> has been
     * closed with the supplied complementary nodes
     * 
     * When a branch is closed, we look for branching steps that weren't used to
     * derive the complementary pair; we undo these steps and remove the other
     * branches originating from them.
     *
     * Example:
     *
     *           /-B--    can be removed (no matter if it's open or closed)
     * --Z--(AvB)       
     *           \-A-??Z   x (AvB unused)
     *
     * A more tricky case:
     *
     *                        /-D--   
     *           /-B-----(CvD)
     * --Z--(AvB)             \-C-??Z   x (AvB unused, CvD used)
     *           \-A---
     *
     * If the branch with D is closed (without using B), the A branch can be
     * removed (no matter if it's open or closed). But if the D branch is open,
     * the so-far unused node B may be needed to close that branch; so we have
     * to keep the AvB expansion. (It will be removed if the B node is not used
     * when closing the D branch.)
     *
     * Our general strategy is to walk up from the endpoint of the closed branch
     * until we reach a used branching node from which another open branch
     * emerges; any unused branching up to that point is removed.
     */
   
    var obranches = this.openBranches.concat(this.closedBranches);
    obranches.remove(branch);
    for (var i=branch.nodes.length-1; i>0; i--) {
        for (var j=0; j<obranches.length; j++) {
            if (obranches[j].nodes[i] &&
                obranches[j].nodes[i] != branch.nodes[i] &&
                obranches[j].nodes[i].expansionStep == branch.nodes[i].expansionStep) {
                // branch.nodes[i] is the result of a branching step;
                // obranches[j].nodes[i] is one if its siblings.
                if (branch.nodes[i].used) {
                    // quit if sibling branch is open:
                    if (!obranches[j].closed) return;
                }
                else {
                    log("pruning branch "+obranches[j]+": unused expansion of "+branch.nodes[i].fromNodes[0]);
                    if (obranches[j].closed) {
                        this.closedBranches.remove(obranches[j]);
                        // We need to remove 'used' marks from all remaining
                        // nodes that were only used to close the removed branch
                        // (including branch.nodes[i].fromNodes[0], but possibly
                        // other nodes as well, e.g. in the tree for
                        // ??(???x???y???z((Ixy???Iyz)???Ixz)???((IaW(a)???IbW(b))???(???x???y???z(Ixy???(IzW(x)???IzW(y)))?????Iba)));
                        // this is why we keep track of the branches for which a node is used.)
                        for (var k=0; k<i; k++) {
                            branch.nodes[k].used = branch.nodes[k].used.replace(obranches[j].id, '');
                        }
                    }
                    else {
                        this.openBranches.remove(obranches[j]);
                        obranches[j].removed = true; // for loop in closeCloseableBranches
                    }
                    this.numNodes -= (obranches[j].nodes.length - i);
                    log(this);
                    // We don't remove the beta expansion result on this branch;
                    // it'll be removed in the displayed sentence tree because
                    // it has .used == false
                }
            }
        }
        if (!this.nodeIsUsed(branch.nodes[i])) {
            this.removeNode(branch, i);
        }
    }
}

Tree.prototype.nodeIsUsed = function(node) {
    /**
     * check if <node> is used to close a branch on the tree, or is part of an
     * expansion that is used to close a branch
     */
    if (node.used) return true;
    var branches = this.openBranches.concat(this.closedBranches);
    for (var i=0; i<branches.length; i++) {
        for (var j=0; j<branches[i].nodes.length; j++) {
            if (branches[i].nodes[j].expansionStep == node.expansionStep
                && branches[i].nodes[j].used) {
                return true;
            }
        }
    }
    return false;
}

Tree.prototype.removeNode = function(branch, index) {
    /**
     * remove node with index <index> on branch <branch> from this tree
     */
    log("removing node "+branch.nodes[index]);
    var node = branch.nodes[index];
    var branches = this.openBranches.concat(this.closedBranches);
    for (var i=0; i<branches.length; i++) {
        if (branches[i].nodes[index] == node) {
            branches[i].nodes.splice(index,1);
        }
        if (node.type == 'literal') {
            branches[i].literals.remove(node);
        }
    }
    this.numNodes--;
}

Tree.prototype.closeCloseableBranches = function() {
    /**
     * close all branches on <tree> that can be closed without unification
     */
    log('checking for branches that can be closed without unification');
    var openBranches = this.openBranches.copy();
    var numOpenBranches = openBranches.length;
    for (var k=0; k<openBranches.length; k++) {
        var branch = openBranches[k];
        if (branch.removed) continue;
        // log('?b: '+branch);
        N1LOOP:
        for (var i=branch.nodes.length-1; i>=0; i--) {
            var n1 = branch.nodes[i];
            if (n1.formula.sub && n1.formula.sub.predicate == '='
                && [n1.formula.sub.terms[0]].equals([n1.formula.sub.terms[1]])) {
                this.closeBranch(branch, n1, n1);
                break N1LOOP;
            }
            var n1negated = (n1.formula.operator == '??');
            for (var j=i-1; j>=0; j--) {
                var n2 = branch.nodes[j];
                // log('? '+n1+' '+n2);
                if (n2.formula.operator == '??') {
                    if (n2.formula.sub.equals(n1.formula)) {
                        // log("+++ branch closed +++");
                        this.closeBranch(branch, n1, n2);
                        break N1LOOP;
                    }
                }
                else if (n1negated && n1.formula.sub.equals(n2.formula)) {
                    // log("+++ branch closed +++");
                    this.closeBranch(branch, n1, n2);
                    break N1LOOP;
                }
            }
        }
    }
}

Tree.prototype.getNumNodes = function() {
    /**
     * return the number of nodes on the current tree, including LL nodes
     * only registered in an EqualityProblem
     */
    try {
        return this.openBranches[0].todoList[0].args.newNodes.length +
            this.numNodes;
    }
    catch {
        return this.numNodes;
    }
}

Tree.prototype.copy = function() {
    /**
     * return a deep copy of this tree, including copies of the nodes
     * (but not of formulas)
     */
    var ntree = new Tree();
    var nodemap = {} // old node id => copied Node
    ntree.prover = this.prover;
    ntree.parser = this.parser;
    ntree.numNodes = this.numNodes;
    ntree.skolemSymbols = this.skolemSymbols.copy();
    ntree.openBranches = [];
    for (var i=0; i<this.openBranches.length; i++) {
        ntree.openBranches.push(copyBranch(this.openBranches[i]));
    }
    ntree.closedBranches = [];
    for (var i=0; i<this.closedBranches.length; i++) {
        ntree.closedBranches.push(copyBranch(this.closedBranches[i]));
    }
    ntree.string = this.string;
    ntree.priority = this.priority;
    return ntree;
    
    function copyBranch(orig) {
        var nodes = [];
        var literals = [];
        var todoList = [];
        for (var i=0; i<orig.nodes.length; i++) {
            nodes.push(copyNode(orig.nodes[i]));
        } 
        for (var i=0; i<orig.literals.length; i++) {
            literals.push(nodemap[orig.literals[i].id]);
        }
        for (var i=0; i<orig.todoList.length; i++) {
            var todo = {
                nextRule: orig.todoList[i].nextRule,
                priority: orig.todoList[i].priority
            };
            if (orig.todoList[i].args.equations) { // equalityProblem
                var eqProb = orig.todoList[i].args.copy();
                eqProb.terms1Node = nodemap[eqProb.terms1Node.id];
                eqProb.terms2Node = nodemap[eqProb.terms2Node.id];
                eqProb.equations = eqProb.equations.map(function(n){ return nodemap[n.id] });  
                todo.args = eqProb;
            }
            else {
                todo.args = orig.todoList[i].args.map(function(n) { return nodemap[n.id] });
            }
            todoList.push(todo);
        } 
        var b = new Branch(ntree, nodes, literals,
                           orig.freeVariables.copy(),
                           todoList, orig.closed);
        b.id = orig.id;
        b.string = orig.string;
        return b;
    }
    
    function copyNode(orig) { 
        if (nodemap[orig.id]) return nodemap[orig.id];
        var n = new Node();
        n.formula = orig.formula;
        n.fromRule = orig.fromRule;
        n.fromNodes = [];
        for (var i=0; i<orig.fromNodes.length; i++) {
            n.fromNodes.push(nodemap[orig.fromNodes[i].id]);
        }
        n.type = orig.type;
        n.expansionStep = orig.expansionStep;
        n.used = orig.used;
        n.id = orig.id;
        n.instanceTerm = orig.instanceTerm;
        nodemap[orig.id] = n;
        return n;
    }
    
}

Tree.prototype.applySubstitution = function(sub) {
    /**
     * apply substitution <sub> of terms for variables to all nodes on the tree
     */
    var branches = this.openBranches.concat(this.closedBranches);
    // (need to process closed branches so that displayed tree looks right)
    for (var i=0; i<sub.length; i+=2) {
        var nodeProcessed = {};
        for (var b=0; b<branches.length; b++) {
            for (var n=branches[b].nodes.length-1; n>=0; n--) {
                var node = branches[b].nodes[n]; 
                if (nodeProcessed[node.id]) break;
                node.formula = node.formula.substitute(sub[i], sub[i+1]);
                if (node.instanceTerm) {
                    node.instanceTerm = Formula.substituteInTerm(node.instanceTerm, sub[i], sub[i+1]);
                }
                nodeProcessed[node.id] = true;                    
            }
            branches[b].freeVariables.remove(sub[i]);
        }
    }
    for (var b=0; b<this.openBranches.length; b++) {
        this.openBranches[b].string = this.openBranches[b].nodes.map(function(n){
            return n.formula.string
        }).join(',');
    }
    this.string = this.openBranches.map(function(b) { return b.string }).join('|');
    // NB: substitution is also applied to EqualityProblems in branch.todoLists,
    // because these refer to nodes on the tree.
}

Tree.prototype.newFunctionSymbol = function(isWorldTerm) {
    /**
     * return new constant/function symbol for delta expansion
     */
    var sym = isWorldTerm ? '??' : '??';
    var res = sym+'1';
    for (var i=this.skolemSymbols.length-1; i>=0; i--) {
        if (this.skolemSymbols[i][0] == sym) {
            res = sym+(this.skolemSymbols[i].substr(1)*1+1);
            break;
        }
    }
    this.skolemSymbols.push(res);
    return res;
}

Tree.prototype.newWorldName = function() {
    return this.newFunctionSymbol(true);
}

Tree.prototype.toString = function() {
    for (var i=0; i<this.closedBranches.length; i++) {
        this.closedBranches[i].nodes[this.closedBranches[i].nodes.length-1].__markClosed = true;
    }
    var branches = this.closedBranches.concat(this.openBranches);
    var res = "<table><tr><td align='center' style='font-family:monospace'>" +
        getTree(branches[0].nodes[0])+"</td</tr></table>";
    for (var i=0; i<this.closedBranches.length; i++) {
        delete this.closedBranches[i].nodes[this.closedBranches[i].nodes.length-1].__markClosed;
    }
    res += "  todo: "+(this.openBranches[0] && this.openBranches[0].todoList.map(function(t) {
        return Object.values(t); }).join(', '))+"<br>";
    res += "  search depth: "+this.getNumNodes()+"-"+this.priority+"<br>";
    return res;
    
    function getTree(node) { 
        var recursionDepth = arguments[1] || 0;
        if (++recursionDepth > 100) return "<b>...<br>[max recursion]</b>";
        var children = [];
        for (var i=0; i<branches.length; i++) {
            for (var j=0; j<branches[i].nodes.length; j++) {
                if (branches[i].nodes[j-1] != node) continue;
                if (!children.includes(branches[i].nodes[j])) {
                    children.push(branches[i].nodes[j]);
                }
            }
        }
        // remove arguments from skolem terms:
        var nodestr = node.toString().replace(/(??\d+)(\(.+?\))(?!\)|,)/g, function(m,p1,p2) {
            var res = p1;
            var extraClosed = (m.match(/\)/g) || []).length - (m.match(/\(/g) || []).length;
            for (var i=0; i<extraClosed; i++) res += ')';
            return res;
        });
        // nodestr = node.toString();
        var res = node.used + ' ' + nodestr + (node.__markClosed ? "<br>x<br>" : "<br>");
        if (children[1]) {
            var tdStyle = "font-family:monospace; border-top:1px solid #999; padding:3px; border-right:1px solid #999";
            var td = "<td align='center' valign='top' style='" + tdStyle + "'>"; 
            res += "<table><tr>"+ td + getTree(children[0], recursionDepth) +"</td>\n"
                + td + getTree(children[1], recursionDepth) + "</td>\n</tr></table>";
        }
        else if (children[0]) res += getTree(children[0], recursionDepth);
        return res;
    }
}

function Branch(tree, nodes, literals, freeVariables, todoList, closed) {
    this.tree = tree;
    this.nodes = nodes || [];
    this.literals = literals || [];
    this.freeVariables = freeVariables || [];
    this.todoList = todoList || [];
    this.closed = closed || false;
    this.id = 'b'+(Branch.counter++)+'.';
    this.string = ''; // a string representation, used in pruneAlternatives
}
Branch.counter = 0;

Branch.prototype.newVariable = function(isWorldTerm) {
    /**
     * return new variable for gamma expansion
     */
    var sym = isWorldTerm ? '??' : '??';
    var res = sym+'1';
    for (var i=this.freeVariables.length-1; i>=0; i--) {
        if (this.freeVariables[i][0] == sym) {
            res = sym+(this.freeVariables[i].substr(1)*1+1);
            break;
        }
    }
    this.freeVariables.push(res);
    return res;
}

Branch.prototype.tryClose = function(node, dontPrune) {
    /**
     * check if branch can be closed with the help of the newly added node
     * <node>, without applying unification
     */
    log('checking if branch can be closed with '+node);
    var complFormula = (node.formula.operator == '??') ? node.formula.sub : node.formula.negate();
    var complNode;
    for (var i=0; i<this.nodes.length; i++) {
        if (this.nodes[i].formula.equals(complFormula)) {
            // prefer already used nodes as complementary nodes:
            if (this.nodes[i].used || !complNode) {
                complNode = this.nodes[i];
                if (complNode.used) break;
            }
        }
    }
    if (complNode) {
        log("+++ branch closed +++");
        this.tree.closeBranch(this, node, complNode);
        if (!dontPrune) {
            this.tree.prover.pruneAlternatives(this.tree);
        }
        return true;
    }
    return false;
}
    
Branch.prototype.unifierAffectsOtherBranches = function(unifier) {
    /**
     * check if any of the variables in the domain of <unifier> (a substitution)
     * occurs on another branch of the tree
     */
    for (var j=0; j<this.tree.openBranches.length; j++) {
        var branch = this.tree.openBranches[j];
        if (branch == this) continue;
        for (var i=0; i<unifier.length; i+=2) {
            if (branch.freeVariables.includes(unifier[i])) return true;
        }
    }
    return false;
}

Branch.prototype.closeWithEquality = function(solution) {
    /**
     * close branch with solved EqualityProblem <solution>
     */

    // As mentioned in Prover.equalityReasoner(), from where this function is
    // called, the current tree may be a copy of the tree for which <solution>
    // was made. In this case, terms1Node and terms2Node in <solution> point at
    // nodes that aren't on the present tree, and so do newNodes[i].fromNode
    // references to these nodes. We can find the right nodes on the present
    // tree by their node.id.
    
    for (var i=0; i<solution.newNodes.length; i++) {
        // Different solutions may involve overlapping newNodes. We want to
        // apply them to different trees (for backtracking) with non-overlapping
        // nodes (see e.g. pel49). So we copy the node.
        var node = solution.newNodes[i].copy();
        var nf0 = node.fromNodes[0];
        var nf1 = node.fromNodes[1];
        node.fromNodes[0] = this.getNodeById(node.fromNodes[0].id);
        node.fromNodes[1] = this.getNodeById(node.fromNodes[1].id);
        log("adding node " +node);
        this.addNode(node, true);
        node.expansionStep = this.tree.prover.step - solution.newNodes.length + i + 1;
    }
    var subs = solution.getSubstitution();
    log("applying substitution "+subs);
    this.tree.applySubstitution(subs);
    log(this.tree);
    var closingNode1 = this.getNodeById(solution.terms1Node.id);
    var closingNode2 = this.getNodeById(solution.terms2Node.id);
    this.tree.closeBranch(this, closingNode1, closingNode2);
    return;
}

Branch.prototype.getNodeById = function(id) {
    for (var i=this.literals.length-1; i>=0; i--) {
        if (this.literals[i].id == id) return this.literals[i];
    }
}

Branch.prototype.copy = function() {
    /**
     * return a copy of this branch with the same (===) nodes, for beta
     * expansions
     */
    var res = new Branch(this.tree,
                         this.nodes.copy(),
                         this.literals.copy(),
                         this.freeVariables.copy(),
                         this.todoList.copy(),
                         this.closed);
    res.string = this.string;
    return res;
}

Branch.prototype.addNode = function(node, dontSkip) {
    /**
     * add <node> to branch and inserts it expansion into the branch's todo
     * stack; if a node with the same formula is already on the branch, the
     * node is only added if <dontSkip> is true
     */
    var addToTodo = true;
    if (this.containsFormula(node.formula)) {
        if (dontSkip) addToTodo = false;
        else return null;
    }
    this.nodes.push(node);
    this.string += (this.string ? ',' : '')+node.formula.string;
    this.tree.string = this.tree.openBranches.map(function(b) { return b.string }).join('|');
    this.tree.numNodes++;
    if (node.type == 'literal') {
        this.literals.push(node);
    }
    if (!this.closed && addToTodo) {
        this.expandTodoList(node);
    }
    // so that we can later find nodes added in the same step:
    node.expansionStep = this.tree.prover.step;
    log(this.tree);
    return node;
}

Branch.prototype.containsFormula = function(formula) {
    for (var i=0; i<this.nodes.length; i++) {
        if (this.nodes[i].formula.string == formula.string) return true;
    }
    return false;
}

Branch.prototype.expandTodoList = function(node) {
    /**
     * insert node expansion into branch's todoList
     */
    var todo = node.getExpansionTask();
    // process newly added literals in one go:
    if (todo.nextRule == Prover.literal &&
        this.todoList[0] && this.todoList[0].nextRule == Prover.literal) {
        this.todoList[0].args.push(node);
    }
    else {
        for (var i=0; i<this.todoList.length; i++) {
            if (todo.priority <= this.todoList[i].priority) break;
            // '<=' is important so that new gamma nodes are processed before old ones
        }
        this.todoList.insert(todo, i);
    }
    
    if (this.tree.parser.isModal) {
        if (this.nodes.length == 1) {
            // add accessibility rules for initial world:
            this.addAccessibilityRuleApplications();
        }
        else if (node.formula.predicate == this.tree.parser.R) {
            this.addAccessibilityRuleApplications(node);
        }
    }
}

Branch.prototype.addAccessibilityRuleApplications = function(node) {
    /**
     * add special modal rules to todoList based on the added <node> 
     * 
     * Whenever a new world is first mentioned on a branch, rules like
     * seriality, transitivity etc. can potentially be applied with that
     * world. So we add these rules to todoList. Some rules like symmetry can
     * also be applied when wRv is first added for old worlds.
     */
    for (var i=0; i<this.tree.prover.accessibilityRules.length; i++) {
        var rule = this.tree.prover.accessibilityRules[i];
        var pos = this.todoList.length;
        while (pos > 0 && this.todoList[pos-1].priority >= rule.priority) pos--;
        if (node) {
            // Many accessibility rules don't meaningfully extend nodes of type
            // wRw.
            if (node.formula.terms[0] != node.formula.terms[1]
                || rule.premiseCanBeReflexive) {
                this.todoList.insert(Prover.makeTodoItem(rule, [node]), pos);
            }
        }
        else {
            // Many accessibility rules don't meaningfully apply without any
            // premises of form wRv.
            if (!rule.needsPremise) {
                this.todoList.insert(Prover.makeTodoItem(rule, []), pos);
            }
        }
    }
}

Branch.prototype.getClosingUnifiers = function(node) {
    /**
     * check if branch can be closed by applying a substitution, involving the
     * newly added literal <node> as either the member of a complementary pair
     * or as a self-complementary node ??(??=??); return list of substitutions
     * that allow closing the branch 
     */

    log("checking if "+node+" can be made complementary with other node on the branch");
    var nodeAtom = node.formula.sub || node.formula;
    var unifiersHash = {}; // for duplicate detection
    for (var i=this.literals.length-1; i>=0; i--) {
        var otherNode = this.literals[i];
        if (otherNode == node) continue;
        if (!otherNode.formula.sub == !node.formula.sub) continue;
        var otherAtom = otherNode.formula.sub || otherNode.formula;
        if (otherAtom.predicate != nodeAtom.predicate) continue;
        var u = Formula.unifyTerms(nodeAtom.terms, otherAtom.terms);
        log("unification with "+otherNode+" "+(u===false ? "impossible" : "possible: "+u));
        if (u.isArray) {
            unifiersHash[u.toString()] = u;
        }
    }
    
    if (nodeAtom.predicate == '=' && node.formula.sub) {
        log("checking if "+node+" can be turned into ??(??=??)");
        var u = Formula.unifyTerms([nodeAtom.terms[0]], [nodeAtom.terms[1]]);
        if (u.isArray) {
            log("yes: "+u);
            unifiersHash[u.toString()] = u;
        }
    }
    return Object.values(unifiersHash);
}

Branch.prototype.createEqualityProblems = function(nodes) {
    /**
     * create equality problems that arise from <nodes>
     *
     * We test whether each node in <nodes> is a negated equality node ??(s=t) or
     * a node of form +-Ps1..sn that has a potentially complementary node
     * -+Pt1..tn; if yes, we create an EqualityProblem with the target of
     * unifying s and t or s1=t1..sn=tn. If instead a node in <nodes> is an
     * equality node s=t, we need to re-schedule earlier equality problems with
     * the new equation(s).
     */

    nodes = nodes.filter(function(n) {
        // skip t=t nodes
        return !(n.formula.predicate == '='
                 && n.formula.terms[0].toString() == n.formula.terms[1].toString());
    });
    for (var i=0; i<nodes.length; i++) {
        if (nodes[i].formula.predicate == '=') {
            // new equation; call equality reasoner for all problems on branch:
            var recNodes = this.literals.filter(function(lit) {
                // select only negated literals, so that we also re-evaluated
                // potentially self-complentary nodes, but don't re-re-evaluate
                // nodes based on earlier equality nodes
                return lit.formula.sub;
            });
            return this.createEqualityProblems(recNodes);
        }
    }
    var res = [];
    for (var i=0; i<nodes.length; i++) {
        var node = nodes[i];
        if (node.formula.sub && node.formula.sub.predicate == '=') {
            // ??(s=t)
            var prob = this.createEqualityProblem(node, node)
            if (prob) res.push(prob);
        }
        else {
            // Ps=..sn or ??Ps1..sn
            for (var j=0; j<this.literals.length; j++) {
                var lit = this.literals[j];
                if ((node.formula.sub && lit.formula.predicate == node.formula.sub.predicate) ||
                    (lit.formula.sub && node.formula.predicate == lit.formula.sub.predicate)) {
                    var prob = this.createEqualityProblem(node, lit);
                    if (prob) res.push(prob);
                }
            }
        }
    }
    return res;
}

Branch.prototype.createEqualityProblem = function(node1, node2) {
    /**
     * create EqualityProblem whose target is to unify <node1> and <node2>
     * based on the eqations on the current branch
     */
    var equations = this.literals.filter(function(n) {
        return n.formula.predicate == '='
            && ![n.formula.terms[0]].equals([n.formula.terms[1]]);
    });
    if (!equations.length) return null;
    equations.reverse(); // prefer applying LL to late equations
    log('creating equality problem based on '+(node1==node2 ? node1 : node1+' and '+node2));
    var prob = new EqualityProblem();
    prob.init(equations, node1, node2);
    return prob;
}

Branch.prototype.toString = function() {
    return this.string;
}

function Node(formula, fromRule, fromNodes) {
    if (!formula) return;
    this.formula = formula;
    this.type = formula.type;
    this.id = Node.counter++;
    // Each non-initial node on a branch is the result of applying a rule to
    // (zero or more) earlier nodes on the same branch. This information about a
    // node's origin is needed to display the final sentence tableau, and for
    // pruning branches (see pruneBranch).
    this.fromRule = fromRule || null;
    this.fromNodes = fromNodes || [];
    this.used = ''; // (string) list of branch ids for whose closure this node is used
}
Node.counter = 0;

Node.prototype.getExpansionTask = function() {
    /**
     * return todo item for expanding this node
     */
    var todo = {
        nextRule: Prover[this.type],
        priority: Prover[this.type].priority,
        args: [this]
    }
    // heuristic: expand ???..???.. nodes before entirely universal nodes:
    if (this.type == 'gamma' && this.formula.string.includes('???')) {
        todo.priority -= 0.5;
    }
    else if (this.type == 'modalGamma' && this.formula.string.includes('???')) {
        todo.priority -= 0.5;
    }
    return todo;
}

Node.prototype.copy = function() {
    var res = new Node();
    res.formula = this.formula;
    res.fromRule = this.fromRule;
    res.fromNodes = this.fromNodes.copy();
    res.type = this.type;
    res.id = this.id;
    res.used = this.used;
    return res;
}

Node.prototype.toString = function() {
    return this.formula.toString();
}

Array.prototype.isArray = true;
Array.prototype.toString = function() {
return "["+this.join(",")+"]";
}
Array.prototype.extend = function(otherArray) {
this.push.apply(this, otherArray);
}
Array.prototype.remove = function(element) {
var index = this.indexOf(element);
if (index > -1) this.splice(index, 1);
}
Array.prototype.intersect = function(elements) {
for (var i=0; i<this.length; i++) {
if (elements.indexOf(this[i]) == -1) {
this.splice(i--, 1);
}
}
}
Array.prototype.insert = function(element, index) {
return this.splice(index, 0, element);
}
Array.prototype.concatNoDuplicates = function(array2) {
var hash = {};
var res = [];
for (var i=0; i<this.length; i++){
hash[this[i].toString()] = true;
res.push(this[i]);
}
for(var i=0; i<array2.length; i++){
var s = array2[i].toString();
if (!hash[s]){
hash[s] = true;
res.push(array2[i]);
}
}
return res;
}
Array.prototype.extendNoDuplicates = function(array2) {
var hash = {};
for (var i=0; i<this.length; i++){
hash[this[i].toString()] = true;
}
for(var i=0; i<array2.length; i++){
var s = array2[i].toString();
if (!hash[s]){
hash[s] = true;
this.push(array2[i]);
}
}
}
Array.prototype.removeDuplicates = function() {
var hash = {};
var res = [];
for (var i=0; i<this.length; i++){
var s = this[i].toString();
if (!hash[s]) {
hash[s] = true;
res.push(this[i]);
}
}
return res;
}
Array.getArrayOfZeroes = function(length) {
for (var i = 0, a = new Array(length); i < length;) a[i++] = 0;
return a;
}
Array.getArrayOfNumbers = function(length) {
for (var i = 0, a = new Array(length); i < length; i++) a[i] = i;
return a;
}
Array.prototype.copy = function() {
var result = [];
for (var i=0; i<this.length; i++) result[i] = this[i];
return result;
}
Array.prototype.copyDeep = function() {
var result = [];
for (var i=0; i<this.length; i++) {
if (this[i].isArray) result[i] = this[i].copyDeep();
else result[i] = this[i];
}
return result;
}
Array.prototype.equals = function(arr2) {
if (this.length != arr2.length) return false;
for (var i=0; i<this.length; i++) {
if (this[i].isArray) {
if (!arr2[i].isArray) return false;
if (!this[i].equals(arr2[i])) return false;
}
else if (this[i] != arr2[i]) return false;
}
return true;
}
if (!Array.prototype.includes) {
Array.prototype.includes = function(element) {
for (var i=0; i<this.length; i++) {
if (this[i] == element) return true;
}
return false;
};
}
Object.values = Object.values || function(o) {
return Object.keys(o).map(function(k){return o[k]})
};
Object.entries = Object.entries || function(obj) {
var ownProps = Object.keys(obj);
var i = ownProps.length;
var res = new Array(i);
while (i--) res[i] = [ownProps[i], obj[ownProps[i]]];
return res;
};
if (!String.prototype.startsWith) {
String.prototype.startsWith = function(search) {
return this.substring(0, search.length) === search;
}
}
if (!String.prototype.includes) {
String.prototype.includes = function(sub) {
return this.indexOf(sub) > -1;
}
}
function Formula() {
}
Formula.prototype.toString = function() {
if (this.operator && this.operator.match(/[????????????]/)) {
return this.string.slice(1,-1);
}
return this.string;
}
Formula.prototype.equals = function(fla) {
return this.string == fla.string;
}
Formula.prototype.negate = function() {
return new NegatedFormula(this);
}
Formula.unifyTerms = function(terms1, terms2) {
var unifier = [];
var terms1 = terms1.copyDeep();
var terms2 = terms2.copyDeep();
var t1, t2;
while (t1 = terms1.shift(), t2 = terms2.shift()) {
if (t1 == t2) {
continue;
}
if (t1.isArray && t2.isArray) {
if (t1[0] != t2[0]) return false;
for (var i=1; i<t1.length; i++) {
terms1.push(t1[i]);
terms2.push(t2[i]);
}
continue;
}
var t1Var = (t1[0] == '??' || t1[0] == '??');
var t2Var = (t2[0] == '??' || t2[0] == '??');
if (!t1Var && !t2Var) {
return false;
}
if (!t1Var) {
var temp = t1; t1 = t2; t2 = temp;
}
if (t2.isArray) {
var terms, termss = [t2];
while (terms = termss.shift()) {
for (var i=0; i<terms.length; i++) {
if (terms[i].isArray) termss.push(terms[i]);
else if (terms[i] == t1) {
return false;
}
}
}
}
var terms, termss = [unifier, terms1, terms2];
while (terms = termss.shift()) {
for (var i=0; i<terms.length; i++) {
if (terms[i].isArray) termss.push(terms[i]);
else if (terms[i] == t1) terms[i] = t2;
}
}
unifier.push(t1);
unifier.push(t2);
}
return unifier;
}
Formula.prototype.normalize = function() {
var op = this.operator || this.quantifier;
if (!op) return this;
switch (op) {
case '???' : case '???' : {
var sub1 = this.sub1.normalize();
var sub2 = this.sub2.normalize();
return new BinaryFormula(op, sub1, sub2);
}
case '???' : {
var sub1 = this.sub1.negate().normalize();
var sub2 = this.sub2.normalize();
return new BinaryFormula('???', sub1, sub2);
}
case '???' : {
var sub1 = new BinaryFormula('???', this.sub1, this.sub2).normalize();
var sub2 = new BinaryFormula('???', this.sub1.negate(), this.sub2.negate()).normalize();
return new BinaryFormula('???', sub1, sub2);
}
case '???' : case '???' : {
return new QuantifiedFormula(op, this.variable, this.matrix.normalize(),
this.overWorlds);
}
case '???' : case '???' : {
return new ModalFormula(op, this.sub.normalize());
}
case '??' : {
var op2 = this.sub.operator || this.sub.quantifier;
if (!op2) return this;
switch (op2) {
case '???' : case '???' : {
var sub1 = this.sub.sub1.negate().normalize();
var sub2 = this.sub.sub2.negate().normalize();
var newOp = op2 == '???' ? '???' : '???';
return new BinaryFormula(newOp, sub1, sub2);
}
case '???' : {
var sub1 = this.sub.sub1.normalize();
var sub2 = this.sub.sub2.negate().normalize();
return new BinaryFormula('???', sub1, sub2);
}
case '???' : {
var sub1 = new BinaryFormula('???', this.sub.sub1, this.sub.sub2.negate()).normalize();
var sub2 = new BinaryFormula('???', this.sub.sub1.negate(), this.sub.sub2).normalize();
return new BinaryFormula('???', sub1, sub2);
}
case '???' : case '???' : {
var sub = this.sub.matrix.negate().normalize();
return new QuantifiedFormula(op2=='???' ? '???' : '???', this.sub.variable, sub,
this.sub.overWorlds);
}
case '???' : case '???' : {
var sub = this.sub.sub.negate().normalize();
return new ModalFormula(op2=='???' ? '???' : '???', sub);
}
case '??' : {
return this.sub.sub.normalize();
}
}
}
}
}
Formula.prototype.removeQuantifiers = function() {
if (this.matrix) return this.matrix.removeQuantifiers();
if (this.sub1) {
var nsub1 = this.sub1.quantifier ?
this.sub1.matrix.removeQuantifiers() : this.sub1.removeQuantifiers();
var nsub2 = this.sub2.quantifier ?
this.sub2.matrix.removeQuantifiers() : this.sub2.removeQuantifiers();
if (this.sub1 == nsub1 && this.sub2 == nsub2) return this;
var res = new BinaryFormula(this.operator, nsub1, nsub2);
return res;
}
return this;
}
Formula.prototype.alpha = function(n) {
var f = this;
if (f.operator == '???') {
return n == 1 ? f.sub1 : f.sub2;
}
if (f.sub.operator == '???') {
return n == 1 ? f.sub.sub1.negate() : f.sub.sub2.negate();
}
if (f.sub.operator == '???') {
return n == 1 ? f.sub.sub1 : f.sub.sub2.negate();
}
}
Formula.prototype.beta = function(n) {
var f = this;
if (f.operator == '???') {
return n == 1 ? f.sub1 : f.sub2;
}
if (f.operator == '???') {
return n == 1 ? f.sub1.negate() : f.sub2;
}
if (f.operator == '???') {
return n == 1 ? new BinaryFormula('???', f.sub1, f.sub2) :
new BinaryFormula('???', f.sub1.negate(), f.sub2.negate())
}
if (f.sub.operator == '???') {
return n == 1 ? f.sub.sub1.negate() : f.sub.sub2.negate();
}
if (f.sub.operator == '???') {
return n == 1 ? new BinaryFormula('???', f.sub.sub1, f.sub.sub2.negate()) :
new BinaryFormula('???', f.sub.sub1.negate(), f.sub.sub2)
}
}
function AtomicFormula(predicate, terms) {
this.type = 'literal';
this.predicate = predicate;
this.terms = terms;
if (this.predicate == '=') {
this.string = AtomicFormula.terms2string([this.terms[0]])+'='+
AtomicFormula.terms2string([this.terms[1]]);
}
else {
this.string = predicate + AtomicFormula.terms2string(terms);
}
}
AtomicFormula.terms2string = function(list, separator) {
return list.map(function(term) {
if (term.isArray) {
var sublist = term.copy();
var funcsym = sublist.shift();
return funcsym+'('+AtomicFormula.terms2string(sublist,',')+')';
}
else return term;
}).join(separator || '');
}
AtomicFormula.prototype = Object.create(Formula.prototype);
AtomicFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
if (typeof(origTerm) == 'string' && this.string.indexOf(origTerm) == -1) {
return this;
}
var newTerms = Formula.substituteInTerms(this.terms, origTerm, newTerm, shallow);
if (!this.terms.equals(newTerms)) {
return new AtomicFormula(this.predicate, newTerms);
}
else return this;
}
Formula.substituteInTerm = function(term, origTerm, newTerm) {
if (term == origTerm) return newTerm;
if (term.isArray) return Formula.substituteInTerms(term, origTerm, newTerm);
return term;
}
Formula.substituteInTerms = function(terms, origTerm, newTerm, shallow) {
var newTerms = [];
for (var i=0; i<terms.length; i++) {
var term = terms[i];
if (term.toString() == origTerm.toString()) newTerms.push(newTerm);
else if (term.isArray && !shallow) {
newTerms.push(Formula.substituteInTerms(term, origTerm, newTerm));
}
else newTerms.push(term);
}
return newTerms;
}
function QuantifiedFormula(quantifier, variable, matrix, overWorlds) {
this.quantifier = quantifier;
this.variable = variable;
this.matrix = matrix;
this.overWorlds = overWorlds;
if (overWorlds) {
this.type = quantifier == '???' ? 'modalGamma' : 'modalDelta';
}
else {
this.type = quantifier == '???' ? 'gamma' : 'delta';
}
this.string = quantifier + variable + matrix.string;
}
QuantifiedFormula.prototype = Object.create(Formula.prototype);
QuantifiedFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
if (this.variable == origTerm) return this;
var nmatrix = this.matrix.substitute(origTerm, newTerm, shallow);
if (nmatrix == this.matrix) return this;
return new QuantifiedFormula(this.quantifier, this.variable, nmatrix, this.overWorlds);
}
function BinaryFormula(operator, sub1, sub2) {
this.operator = operator;
this.sub1 = sub1;
this.sub2 = sub2;
this.type = operator == '???' ? 'alpha' : 'beta';
var space = sub1.string.length+sub2.string.length > 3 ? ' ' : '';
this.string = '(' + sub1.string + space + operator + space + sub2.string + ')';
}
BinaryFormula.prototype = Object.create(Formula.prototype);
BinaryFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
var nsub1 = this.sub1.substitute(origTerm, newTerm, shallow);
var nsub2 = this.sub2.substitute(origTerm, newTerm, shallow);
if (this.sub1 == nsub1 && this.sub2 == nsub2) return this;
return new BinaryFormula(this.operator, nsub1, nsub2);
}
function ModalFormula(operator, sub) {
this.operator = operator;
this.sub = sub;
this.type = operator == '???' ? 'modalGamma' : 'modalDelta';
this.string = operator + sub.string;
}
ModalFormula.prototype = Object.create(Formula.prototype);
ModalFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
var nsub = this.sub.substitute(origTerm, newTerm, shallow);
if (this.sub == nsub) return this;
return new ModalFormula(this.operator, nsub);
}
function NegatedFormula(sub) {
this.operator = '??';
this.sub = sub;
this.type = NegatedFormula.computeType(sub);
this.string = '??' + sub.string;
}
NegatedFormula.computeType = function(sub) {
if (sub.operator == '??') return 'doublenegation';
switch (sub.type) {
case 'literal': { return 'literal'; }
case 'alpha': { return 'beta'; }
case 'beta': { return sub.operator == '???' ? 'beta' : 'alpha'; }
case 'gamma': { return 'delta'; }
case 'delta': { return 'gamma'; }
case 'modalGamma': { return 'modalBeta'; }
case 'modalDelta': { return 'modalGamma'; }
}
}
NegatedFormula.prototype = Object.create(Formula.prototype);
NegatedFormula.prototype.substitute = function(origTerm, newTerm, shallow) {
var nsub = this.sub.substitute(origTerm, newTerm, shallow);
if (this.sub == nsub) return this;
return new NegatedFormula(nsub);
}
function Parser() {
this.symbols = [];
this.expressionType = {};
this.arities = {};
this.isModal = false;
this.isPropositional = true;
this.hasEquality = false;
}
Parser.prototype.copy = function() {
var nparser = new Parser(true);
nparser.symbols = this.symbols.copy();
for (var i=0; i<this.symbols.length; i++) {
var sym = this.symbols[i];
nparser.expressionType[sym] = this.expressionType[sym];
nparser.arities[sym] = this.arities[sym];
}
nparser.isModal = this.isModal;
nparser.isPropositional = this.isPropositional;
nparser.hasEquality = this.hasEquality;
nparser.R = this.R;
nparser.w = this.w;
return nparser;
}
Parser.prototype.registerExpression = function(ex, exType, arity) {
if (!this.expressionType[ex]) this.symbols.push(ex);
else if (this.expressionType[ex] != exType) {
throw "Don't use '"+ex+"' as both "+this.expressionType[ex]+" and "+exType+".";
}
this.expressionType[ex] = exType;
this.arities[ex] = arity;
}
Parser.prototype.getSymbols = function(expressionType) {
var res = [];
for (var i=0; i<this.symbols.length; i++) {
var s = this.symbols[i];
if (this.expressionType[s].indexOf(expressionType) > -1) res.push(s);
}
return res;
}
Parser.prototype.getNewSymbol = function(candidates, expressionType, arity) {
var candidates = candidates.split('');
for (var i=0; i<candidates.length; i++) {
var sym = candidates[i];
if (!this.expressionType[sym]) {
this.registerExpression(sym, expressionType, arity);
return sym;
}
candidates.push(candidates[0]+(i+2));
}
}
Parser.prototype.getNewConstant = function() {
return this.getNewSymbol('abcdefghijklmno', 'individual constant', 0);
}
Parser.prototype.getNewVariable = function() {
return this.getNewSymbol('xyzwvutsr', 'variable', 0);
}
Parser.prototype.getNewFunctionSymbol = function(arity, isWorldFunction) {
var stype = arity+"-ary function symbol"+(isWorldFunction ? " for worlds" : "");
return this.getNewSymbol('fghijklmn', stype, arity);
}
Parser.prototype.getNewWorldVariable = function() {
return this.getNewSymbol('wvutsr', 'world variable', 0);
}
Parser.prototype.getNewWorldName = function() {
return this.getNewSymbol('vutsr', 'world constant', 0);
}
Parser.prototype.getVariables = function(formula) {
if (formula.sub) {
return this.getVariables(formula.sub);
}
if (formula.sub1) {
return this.getVariables(formula.sub1).concatNoDuplicates(
this.getVariables(formula.sub2));
}
var res = [];
var dupe = {};
var terms = formula.isArray ? formula : formula.terms;
for (var i=0; i<terms.length; i++) {
if (terms[i].isArray) {
res.extendNoDuplicates(this.getVariables(terms[i]));
}
else if (this.expressionType[terms[i]].indexOf('variable') > -1
&& !dupe[terms[i]]) {
dupe[terms[i]] = true;
res.push(terms[i]);
}
}
return res;
}
Parser.prototype.isTseitinLiteral = function(formula) {
return this.expressionType[formula.predicate || formula.sub.predicate] == 'tseitin predicate';
}
Parser.prototype.initModality = function() {
for (var i=0; i<this.symbols.length; i++) {
var sym = this.symbols[i];
if (this.expressionType[sym].indexOf('predicate') > -1) {
this.arities[sym] += 1;
}
}
this.R = this.getNewSymbol('Rr???', '2-ary predicate', 2);
this.w = this.getNewSymbol('wvur', 'world constant', 0);
}
Parser.prototype.translateFromModal = function(formula, worldVariable) {
if (!worldVariable) {
if (!this.w) this.initModality();
worldVariable = this.w;
}
if (formula.terms) {
var nterms = formula.terms.copyDeep();
nterms.push(worldVariable);
return new AtomicFormula(formula.predicate, nterms);
}
if (formula.quantifier) {
var nmatrix = this.translateFromModal(formula.matrix, worldVariable);
return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
}
if (formula.sub1) {
var nsub1 = this.translateFromModal(formula.sub1, worldVariable);
var nsub2 = this.translateFromModal(formula.sub2, worldVariable);
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
if (formula.operator == '??') {
var nsub = this.translateFromModal(formula.sub, worldVariable);
return new NegatedFormula(nsub);
}
if (formula.operator == '???') {
var newWorldVariable = this.getNewWorldVariable();
var wRv = new AtomicFormula(this.R, [worldVariable, newWorldVariable])
var nsub = this.translateFromModal(formula.sub, newWorldVariable);
var nmatrix = new BinaryFormula('???', wRv, nsub);
return new QuantifiedFormula('???', newWorldVariable, nmatrix, true);
}
if (formula.operator == '???') {
var newWorldVariable = this.getNewWorldVariable();
var wRv = new AtomicFormula(this.R, [worldVariable, newWorldVariable])
var nsub = this.translateFromModal(formula.sub, newWorldVariable);
var nmatrix = new BinaryFormula('???', wRv, nsub);
return new QuantifiedFormula('???', newWorldVariable, nmatrix, true)
}
}
Parser.prototype.stripAccessibilityClauses = function(formula) {
if (formula.quantifier) {
var nmatrix = this.stripAccessibilityClauses(formula.matrix);
if (nmatrix == formula.matrix) return formula;
return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
}
if (formula.sub1) {
if ((formula.sub1.sub && formula.sub1.sub.predicate == this.R) ||
(formula.sub1.predicate == this.R)) {
return this.stripAccessibilityClauses(formula.sub2);
}
var nsub1 = this.stripAccessibilityClauses(formula.sub1);
var nsub2 = this.stripAccessibilityClauses(formula.sub2);
if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
if (formula.operator == '??') {
return formula;
}
else {
return formula;
}
}
Parser.prototype.translateToModal = function(formula) {
if (formula.terms && formula.predicate == this.R) {
return formula;
}
if (formula.terms) {
var nterms = formula.terms.copyDeep();
var worldlabel = nterms.pop();
var res = new AtomicFormula(formula.predicate, nterms);
res.world = worldlabel;
}
else if (formula.quantifier && this.expressionType[formula.variable] == 'world variable') {
var prejacent = formula.matrix.sub2;
var op = formula.quantifier == '???' ? '???' : '???';
var res = new ModalFormula(op, this.translateToModal(prejacent));
res.world = formula.matrix.sub1.terms[0];
}
else if (formula.quantifier) {
var nmatrix = this.translateToModal(formula.matrix);
var res = new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix);
res.world = nmatrix.world;
}
else if (formula.sub1) {
var nsub1 = this.translateToModal(formula.sub1);
var nsub2 = this.translateToModal(formula.sub2);
var res = new BinaryFormula(formula.operator, nsub1, nsub2);
res.world = nsub2.world;
}
else if (formula.operator == '??') {
var nsub = this.translateToModal(formula.sub);
var res = new NegatedFormula(nsub);
res.world = nsub.world;
}
return res;
}
Parser.prototype.parseInput = function(str) {
var parts = str.split('|=');
if (parts.length > 2) {
throw "You can't use more than one turnstile.";
}
var premises = [];
var conclusion = this.parseFormula(parts[parts.length-1]);
if (conclusion.isArray)
throw parts[parts.length-1]+" looks like a list; use either conjunction or disjunction instead of the comma.";
if (parts.length == 2 && parts[0] != '') {
premises = this.parseFormula(parts[0]);
if (!premises.isArray) premises = [premises];
}
if (this.isModal) this.initModality();
return [premises, conclusion];
}
Parser.prototype.parseFormula = function(str) {
var boundVars = arguments[1] ? arguments[1].slice() : [];
if (!arguments[1]) str = this.tidyFormula(str);
var temp = this.hideSubStringsInParens(str);
var nstr = temp[0];
var subStringsInParens = temp[1];
if (nstr == '%0') {
return this.parseFormula(str.replace(/^\((.*)\)$/, "$1"), arguments[1]);
}
var reTest = nstr.match(/,/) || nstr.match(/???/) || nstr.match(/???/)  || nstr.match(/???/) || nstr.match(/???/);
if (reTest) {
var op = reTest[0];
if (op == ',') nstr = nstr.replace(/,/g, '%split');
else nstr = nstr.replace(op, "%split");
for (var i=0; i<subStringsInParens.length; i++) {
nstr = nstr.replace("%"+i, subStringsInParens[i]);
}
var substrings = nstr.split("%split");
if (!substrings[1]) {
throw "argument missing for operator "+op+" in "+str+".";
}
var subFormulas = [];
for (var i=0; i<substrings.length; i++) {
subFormulas.push(this.parseFormula(substrings[i], boundVars));
}
if (op == ',') {
if (arguments[1]) {
throw "I don't understand '"+str+"' (looks like a list of formulas).";
}
return subFormulas;
}
return new BinaryFormula(op, subFormulas[0], subFormulas[1]);
}
var reTest = nstr.match(/^(??|???|???)/);
if (reTest) {
var op = reTest[1];
var sub = this.parseFormula(str.substr(1), boundVars);
if (op == '??') return new NegatedFormula(sub);
this.isModal = true;
return new ModalFormula(op, sub);
}
reTest = /^(???|???)([^\d\(\),%]\d*)/.exec(str);
if (reTest && reTest.index == 0) {
var quantifier = reTest[1];
var variable = reTest[2];
if (!str.substr(reTest[0].length)) {
throw "There is nothing in the scope of "+str+".";
}
if (this.expressionType[variable] != 'world variable') {
this.registerExpression(variable, 'variable', 0);
}
boundVars.push(variable);
this.isPropositional = false;
var sub = this.parseFormula(str.substr(reTest[0].length), boundVars);
return new QuantifiedFormula(quantifier, variable, sub);
}
m = str.match(/[??????????????]/);
if (m) {
throw "I don't understand '"+m[0]+"' in '"+str+"'. Missing operator?";
}
str = str.replace(/^(.+)=(.+)$/, '=$1$2');
reTest = /^[^\d\(\),%]\d*/.exec(str);
if (reTest && reTest.index == 0) {
try {
var predicate = reTest[0];
var termstr = str.substr(predicate.length);
var terms = this.parseTerms(termstr, boundVars) || [];
if (termstr) {
var predicateType = terms.length+"-ary predicate";
if (predicate != this.R) this.isPropositional = false;
}
else {
var predicateType = "proposition letter (0-ary predicate)";
}
if (predicate == '=') this.hasEquality = true;
this.registerExpression(predicate, predicateType, terms.length);
return new AtomicFormula(predicate, terms);
}
catch (e) {
throw e+"\n(I'm assuming '"+str+"' is meant to be an atomic formula with predicate '"+predicate+"'.)";
}
}
throw "Parse Error.\n'" + str + "' is not a well-formed formula.";
}
Parser.prototype.hideSubStringsInParens = function(str) {
var subStringsInParens = [];
var parenDepth = 0;
var storingAtIndex = -1;
var nstr = "";
for (var i=0; i<str.length; i++) {
if (str.charAt(i) == "(") {
parenDepth++;
if (parenDepth == 1) {
storingAtIndex = subStringsInParens.length;
subStringsInParens[storingAtIndex] = "";
nstr += "%" + storingAtIndex;
}
}
if (storingAtIndex == -1) nstr += str.charAt(i);
else subStringsInParens[storingAtIndex] += str.charAt(i);
if (str.charAt(i) == ")") {
parenDepth--;
if (parenDepth == 0) storingAtIndex = -1;
}
}
return [nstr, subStringsInParens];
}
Parser.prototype.tidyFormula = function(str) {
str = str.replace(/\s/g, '');
str = str.replace('[', '(').replace(']', ')');
this.checkBalancedParentheses(str);
str = str.replace(/\(([??????]\w\d*)\)/g, '$1');
var m =str.match(/[^\w\d\(\)??????????????????????????,=????$]/);
if (m) throw("I don't understand the symbol '"+m[0]+"'.");
return str;
}
Parser.prototype.checkBalancedParentheses = function(str) {
var openings = str.split('(').length - 1;
var closings = str.split(')').length - 1;
if (openings != closings) {
throw "unbalanced parentheses: "+openings+" opening parentheses, "+closings+" closing.";
}
}
Parser.prototype.parseAccessibilityFormula = function(str) {
str = str.replace(/R/g, this.R);
var matches = str.match(/[??????]./g);
for (var i=0; i<matches.length; i++) {
var v = matches[i][1];
if (this.expressionType[v] && this.expressionType[v] != 'world variable') {
var re = new RegExp(v, 'g');
str = str.replace(re, this.getNewWorldVariable());
}
else {
this.registerExpression(v, 'world variable', 0);
}
}
var isPropositional = this.isPropositional;
var formula = this.parseFormula(str);
this.isPropositional = isPropositional;
return formula;
}
Parser.prototype.parseTerms = function(str, boundVars) {
if (!str) return [];
var result = [];
str = str.replace(/^\((.+)\)$/, "$1");
do {
var reTest = /[^\(\),%??????????????????????????]\d*/.exec(str);
if (!reTest || reTest.index != 0) {
throw "I expected a (sequence of) term(s) instead of '" + str + "'.";
}
var nextTerm = reTest[0];
str = str.substr(reTest[0].length);
if (str.indexOf("(") == 0) {
var args = "", openParens = 0, spos = 0;
do {
args += str.charAt(spos);
if (str.charAt(spos) == "(") openParens++;
else if (str.charAt(spos) == ")") openParens--;
spos++;
} while (openParens && spos < str.length);
nextTerm = [nextTerm].concat(this.parseTerms(args, boundVars));
var arity = (nextTerm.length - 1);
this.registerExpression(reTest[0], arity+"-ary function symbol", arity);
str = str.substr(args.length);
}
else if (!boundVars.includes(nextTerm)) {
this.registerExpression(nextTerm, 'individual constant', 0);
}
result.push(nextTerm);
if (str.indexOf(",") == 0) str = str.substr(1);
} while (str.length > 0);
return result;
}
function Prover(initFormulas, parser, accessibilityConstraints) {
parser = parser.copy();
this.parser = parser;
this.initFormulas = initFormulas;
this.initFormulasNonModal = initFormulas;
this.accessibilityRules = [];
if (parser.isModal) {
this.initFormulasNonModal = initFormulas.map(function(f) {
return parser.translateFromModal(f);
});
if (accessibilityConstraints) {
this.s5 = accessibilityConstraints.includes('universality');
if (!this.s5) {
this.accessibilityRules = accessibilityConstraints.map(function(s) {
return Prover[s];
});
}
}
}
this.initFormulasNormalized = this.initFormulasNonModal.map(function(f){
return f.normalize();
});
this.pauseLength = 5;
this.computationLength = 20;
this.step = 0;
this.tree = new Tree(this);
this.depthLimit = 2;
this.alternatives = [this.tree];
this.curAlternativeIndex = 0;
this.tree.addInitNodes(this.initFormulasNormalized)
var mfParser = parser.copy();
if (accessibilityConstraints) {
var name2fla = {
"universality": "???v???uRvu",
"reflexivity": "???vRvv",
"symmetry": "???v???u(Rvu???Ruv)",
"transitivity": "???v???u???t(Rvu???(Rut???Rvt))",
"euclidity": "???v???u???t(Rvu???(Rvt???Rut))",
"seriality": "???v???uRvu"
};
var accessibilityFormluas = accessibilityConstraints.map(function(s) {
return mfParser.parseAccessibilityFormula(name2fla[s]).normalize();
});
this.modelfinder = new ModelFinder(
this.initFormulasNormalized,
mfParser,
accessibilityFormluas,
this.s5
);
}
else {
this.modelfinder = new ModelFinder(this.initFormulasNormalized, mfParser);
}
this.counterModel = null;
this.start = function() {
this.lastBreakTime = performance.now();
this.nextStep();
};
this.stop = function() {
this.stopTimeout = true;
};
this.onfinished = function(treeClosed) {};
this.status = function(str) {};
}
Prover.prototype.nextStep = function() {
this.step++;
if (this.tree.openBranches.length == 0) {
return this.onfinished(1);
}
this.status('step '+this.step+' alternative '+this.curAlternativeIndex+', '
+this.tree.numNodes+' nodes, model size '
+this.modelfinder.model.domain.length
+(this.tree.parser.isModal ? '/'+this.modelfinder.model.worlds.length : ''));
if (this.limitReached()) {
if (this.curAlternativeIndex < this.alternatives.length-1) {
this.curAlternativeIndex++;
}
else {
this.depthLimit += 2 + Math.floor(this.step/500);
this.curAlternativeIndex = 0;
}
this.tree = this.alternatives[this.curAlternativeIndex];
return this.nextStep();
}
var todo = this.tree.openBranches[0].todoList.shift();
if (todo) {
todo.nextRule(this.tree.openBranches[0], todo.args);
}
else if (this.alternatives.length) {
this.discardCurrentAlternative();
}
if (this.modelfinder.nextStep()) {
this.counterModel = this.modelfinder.model;
return this.onfinished(0);
}
var timeSinceBreak = performance.now() - this.lastBreakTime;
if (this.stopTimeout) {
this.stopTimeout = false;
}
else if (this.pauseLength && timeSinceBreak > this.computationLength) {
setTimeout(function(){
this.lastBreakTime = performance.now();
this.nextStep();
}.bind(this), this.pauseLength+this.tree.numNodes/1000);
}
else {
this.nextStep();
}
}
Prover.prototype.limitReached = function() {
var complexity = this.tree.getNumNodes() - this.tree.priority;
if (this.tree.openBranches[0].todoList[0] &&
this.tree.openBranches[0].todoList[0].nextRule == Prover.equalityReasoner) {
if (!this.equalityComputationStep) this.equalityComputationStep = 1;
else if (++this.equalityComputationStep == 100) {
this.equalityComputationStep = 0;
return true;
}
}
return complexity >= this.depthLimit;
}
Prover.prototype.useTree = function(tree, index) {
if (index !== undefined) {
this.alternatives.splice(index, 0, tree);
this.curAlternativeIndex = index;
}
else {
this.alternatives[this.curAlternativeIndex] = tree;
}
this.tree = tree
}
Prover.prototype.switchToAlternative = function(altTree) {
this.curAlternativeIndex = this.alternatives.indexOf(altTree);
this.tree = this.alternatives[this.curAlternativeIndex];
}
Prover.prototype.storeAlternatives = function(altTrees) {
var insertPosition = this.curAlternativeIndex+1;
for (var i=0; i<altTrees.length; i++) {
this.alternatives.splice(insertPosition, 0, altTrees[i]);
this.pruneAlternatives(altTrees[i]);
if (!altTrees[i].removed) {
insertPosition++;
}
}
}
Prover.prototype.pruneAlternatives = function(tree) {
for (var i=0; i<this.alternatives.length; i++) {
if (this.alternatives[i] == tree) continue;
var keepWhich = this.keepWhichTree(tree, this.alternatives[i]);
var keepTree = keepWhich[0];
var keepAlt = keepWhich[1];
if (!keepTree) {
this.removeAlternative(this.alternatives.indexOf(tree));
return;
}
else if (!keepAlt) {
this.removeAlternative(i);
i--;
}
}
}
Prover.prototype.keepWhichTree = function(tree, altTree) {
if (altTree.string == tree.string) {
if (tree.openBranches[0].todoList[0].nextRule != altTree.openBranches[0].todoList[0].nextRule ||
tree.openBranches[0].todoList[0].args != altTree.openBranches[0].todoList[0].args) {
return [true, true];
}
else if (tree.numNodes < altTree.numNodes) {
return [true, false];
}
else {
return [false, true];
}
}
var treeDiff = this.treeDiff(tree, altTree);
var treeHasUnmatchedBranches = treeDiff[0];
var altTreeHasUnmatchedBranches = treeDiff[1];
if (treeHasUnmatchedBranches && altTreeHasUnmatchedBranches) {
return [true, true];
}
if (treeHasUnmatchedBranches) {
return [false, true];
}
if (altTreeHasUnmatchedBranches) {
return [true, false];
}
var treeNodes = tree.openBranches[0].nodes;
var altTreeNodes = altTree.openBranches[0].nodes;
if (altTreeNodes.length > treeNodes.length &&
tree.openBranches[0].todoList[0].nextRule != Prover.equalityReasoner) {
return [false, true];
}
else if (treeNodes.length > altTreeNodes.length &&
altTree.openBranches[0].todoList[0].nextRule != Prover.equalityReasoner) {
return [true, false];
}
else return [true, true];
}
Prover.prototype.treeDiff = function(tree1, tree2) {
var tree1hasUnmatchedBranches = false;
var tree2hasUnmatchedBranches = false;
var tree2matchedBranchIds = [];
TREE1BRANCHLOOP:
for (var i=0; i<tree1.openBranches.length; i++) {
var string1 = tree1.openBranches[i].string;
for (var j=0; j<tree2.openBranches.length; j++) {
var string2 = tree2.openBranches[j].string;
if (string1.startsWith(string2) || string2.startsWith(string1)) {
tree2matchedBranchIds.push(j);
continue TREE1BRANCHLOOP;
}
}
tree1hasUnmatchedBranches = true;
break;
}
TREE2BRANCHLOOP:
for (var j=0; j<tree2.openBranches.length; j++) {
if (tree2matchedBranchIds.includes(j)) continue;
var string2 = tree2.openBranches[j].string;
for (var i=0; i<tree1.openBranches.length; i++) {
var string1 = tree1.openBranches[i].string;
if (string1.startsWith(string2) || string2.startsWith(string1)) {
continue TREE2BRANCHLOOP;
}
}
tree2hasUnmatchedBranches = true;
break;
}
return [tree1hasUnmatchedBranches, tree2hasUnmatchedBranches];
}
Prover.prototype.removeAlternative = function(index) {
this.alternatives[index].removed = true;
if (index == this.curAlternativeIndex) {
this.discardCurrentAlternative();
}
else {
this.alternatives.splice(index, 1);
if (index < this.curAlternativeIndex) {
this.curAlternativeIndex--;
}
}
}
Prover.prototype.discardCurrentAlternative = function() {
this.alternatives.splice(this.curAlternativeIndex, 1);
if (this.curAlternativeIndex == this.alternatives.length) {
this.curAlternativeIndex = 0;
}
if (this.alternatives.length) {
this.tree = this.alternatives[this.curAlternativeIndex];
}
}
Prover.alpha = function(branch, nodeList) {
var node = nodeList[0];
var subnode1 = new Node(node.formula.sub1, Prover.alpha, nodeList);
var subnode2 = new Node(node.formula.sub2, Prover.alpha, nodeList);
branch.addNode(subnode1, 'addEvenIfDuplicate');
branch.addNode(subnode2, 'addEvenIfDuplicate');
branch.tryClose(subnode1);
if (!branch.closed) branch.tryClose(subnode2);
}
Prover.alpha.priority = 1;
Prover.alpha.toString = function() { return 'alpha' }
Prover.beta = function(branch, nodeList) {
var node = nodeList[0];
var newbranch = branch.copy();
branch.tree.openBranches.unshift(newbranch);
var re = /[????????????????????????]/g;
var complexity1 = (node.formula.sub1.string.match(re) || []).length;
var complexity2 = (node.formula.sub2.string.match(re) || []).length;
if (complexity2 < complexity1) {
var subnode1 = new Node(node.formula.sub1, Prover.beta, nodeList);
var subnode2 = new Node(node.formula.sub2, Prover.beta, nodeList);
}
else {
var subnode2 = new Node(node.formula.sub1, Prover.beta, nodeList);
var subnode1 = new Node(node.formula.sub2, Prover.beta, nodeList);
}
branch.addNode(subnode1, 'addEvenIfDuplicate');
newbranch.addNode(subnode2, 'addEvenIfDuplicate');
branch.tryClose(subnode1, 'dontPruneAlternatives');
newbranch.tryClose(subnode2);
}
Prover.beta.priority = 9;
Prover.beta.toString = function() { return 'beta' }
Prover.gamma = function(branch, nodeList, matrix) {
var fromModalGamma = (matrix != undefined);
var node = nodeList[0];
var newVariable = branch.newVariable(matrix);
var matrix = matrix || node.formula.matrix;
var newFormula = matrix.substitute(node.formula.variable, newVariable);
var newNode = new Node(newFormula, Prover.gamma, nodeList);
newNode.instanceTerm = newVariable;
branch.addNode(newNode);
branch.tryClose(newNode);
if (!fromModalGamma && newNode.type != 'gamma') {
var outer = node;
while (outer.fromRule == Prover.gamma) outer = outer.fromNodes[0];
var priority = 9;
branch.todoList.push(Prover.makeTodoItem(Prover.gamma, [outer], priority));
}
}
Prover.gamma.priority = 7;
Prover.gamma.toString = function() { return 'gamma' }
Prover.modalGamma = function(branch, nodeList) {
var node = nodeList[0];
branch.todoList.push(Prover.makeTodoItem(Prover.modalGamma, nodeList));
if (branch.tree.prover.s5) {
return Prover.gamma(branch, nodeList, node.formula.matrix.sub2);
}
var wRx = node.formula.matrix.sub1.sub;
OUTERLOOP:
for (var i=0; i<branch.literals.length; i++) {
var wRy = branch.literals[i].formula;
if (wRy.predicate == wRx.predicate && wRy.terms[0] == wRx.terms[0]) {
for (var j=0; j<branch.nodes.length; j++) {
if (branch.nodes[j].fromRule == Prover.modalGamma &&
branch.nodes[j].fromNodes[0] == node &&
branch.nodes[j].fromNodes[1] == branch.literals[i]) {
continue OUTERLOOP;
}
}
var modalMatrix = node.formula.matrix.sub2;
var v = wRy.terms[1];
var newFormula = modalMatrix.substitute(node.formula.variable, v);
var newNode = new Node(newFormula, Prover.modalGamma, [node, branch.literals[i]]);
newNode.instanceTerm = v;
if (branch.addNode(newNode)) {
branch.tryClose(newNode);
break;
}
}
}
}
Prover.modalGamma.priority = 8;
Prover.modalGamma.toString = function() { return 'modalGamma' }
Prover.delta = function(branch, nodeList, matrix) {
var node = nodeList[0];
var fla = node.formula;
var funcSymbol = branch.tree.newFunctionSymbol(matrix);
if (branch.freeVariables.length > 0) {
if (branch.tree.prover.s5) {
var skolemTerm = branch.freeVariables.filter(function(v) {
return v[0] == (matrix ? '??' : '??');
});
}
else {
var skolemTerm = branch.freeVariables.copy();
}
skolemTerm.unshift(funcSymbol);
}
else {
var skolemTerm = funcSymbol;
}
var matrix = matrix || node.formula.matrix;
var newFormula = matrix.substitute(node.formula.variable, skolemTerm);
var newNode = new Node(newFormula, Prover.delta, nodeList);
newNode.instanceTerm = skolemTerm;
branch.addNode(newNode);
branch.tryClose(newNode);
}
Prover.delta.priority = 2;
Prover.delta.toString = function() { return 'delta' }
Prover.modalDelta = function(branch, nodeList) {
var node = nodeList[0];
if (branch.tree.prover.s5) {
return Prover.delta(branch, nodeList, node.formula.matrix.sub2);
}
var fla = node.formula;
var newWorldName = branch.tree.newWorldName();
var fla1 = node.formula.matrix.sub1.substitute(node.formula.variable, newWorldName);
var fla2 = node.formula.matrix.sub2.substitute(node.formula.variable, newWorldName);
var newNode1 = new Node(fla1, Prover.modalDelta, nodeList);
var newNode2 = new Node(fla2, Prover.modalDelta, nodeList);
newNode2.instanceTerm = newWorldName;
branch.addNode(newNode1);
branch.addNode(newNode2);
branch.tryClose(newNode2);
}
Prover.modalDelta.priority = 2;
Prover.modalDelta.toString = function() { return 'modalDelta' }
Prover.literal = function(branch, nodeList) {
var tree = branch.tree;
var prover = tree.prover;
var unifiers = [];
for (var i=0; i<nodeList.length; i++) {
unifiers.extendNoDuplicates(branch.getClosingUnifiers(nodeList[i]));
}
var altTrees = [];
var localTree = null;
for (var i=0; i<unifiers.length; i++) {
var altTree = tree.copy();
altTree.applySubstitution(unifiers[i]);
altTree.closeCloseableBranches();
if (altTree.openBranches.length == 0) {
prover.useTree(altTree);
return;
}
if (!localTree) {
if (!branch.unifierAffectsOtherBranches(unifiers[i])) {
localTree = altTree;
}
else {
altTrees.push(altTree);
}
}
}
if (localTree) {
prover.useTree(localTree);
prover.pruneAlternatives(localTree);
return;
}
if (tree.parser.hasEquality) {
var eqProbs = branch.createEqualityProblems(nodeList);
if (eqProbs.length) {
var altTree = tree.copy();
altTree.openBranches[0].todoList = eqProbs.map(function(p) {
return Prover.makeTodoItem(Prover.equalityReasoner, p);
});
altTrees.push(altTree);
}
}
if (!altTrees.length) {
return;
}
else if (branch.todoList.length) {
altTrees.push(tree);
}
var curTreeIndex = prover.curAlternativeIndex;
prover.alternatives.splice(curTreeIndex, 1);
if (altTrees.length) {
do {
var newTree = altTrees.shift();
prover.useTree(newTree, curTreeIndex);
prover.pruneAlternatives(newTree);
} while (newTree.removed && altTrees.length);
if (altTrees.length) {
prover.storeAlternatives(altTrees);
}
}
}
Prover.literal.priority = 0;
Prover.literal.toString = function() { return 'literal' };
Prover.equalityReasoner = function(branch, equalityProblem) {
var newProblems = equalityProblem.nextStep();
if (newProblems.length == 0) {
if (!branch.todoList[0]) {
branch.tree.prover.discardCurrentAlternative();
}
return;
}
var tree = branch.tree;
var prover = tree.prover;
var altTrees = [];
var localTree = null;
while (newProblems.length && !newProblems[0].nextStep) {
var solution = newProblems.shift();
var substitution = solution.getSubstitution();
var altTree = tree.copy();
altTree.openBranches[0].closeWithEquality(solution);
altTree.closeCloseableBranches();
if (altTree.openBranches.length == 0) {
prover.useTree(altTree);
return;
}
if (!localTree) {
if (!branch.unifierAffectsOtherBranches(substitution)) {
localTree = altTree;
}
else {
altTrees.push(altTree);
}
}
}
if (localTree) {
prover.useTree(localTree);
prover.pruneAlternatives(localTree);
return;
}
if (newProblems.length) {
var newTasks = newProblems.map(function(p) {
return Prover.makeTodoItem(Prover.equalityReasoner, p);
});
branch.todoList.extend(newTasks);
}
if (!altTrees.length) {
return;
}
else if (branch.todoList.length) {
altTrees.push(tree);
}
var curTreeIndex = prover.curAlternativeIndex;
prover.alternatives.splice(curTreeIndex, 1);
if (altTrees.length) {
do {
var newTree = altTrees.shift();
prover.useTree(newTree, curTreeIndex);
prover.pruneAlternatives(newTree);
} while (newTree.removed && altTrees.length);
if (altTrees.length) {
prover.storeAlternatives(altTrees);
}
}
}
Prover.equalityReasoner.priority = 0;
Prover.equalityReasoner.toString = function() { return 'equality' }
Prover.reflexivity = function(branch, nodeList) {
if (nodeList.length == 0) {
var worldName = branch.tree.parser.w;
}
else {
var worldName = nodeList[0].formula.terms[1];
}
var R = branch.tree.parser.R;
var formula = new AtomicFormula(R, [worldName, worldName]);
var newNode = new Node(formula, Prover.reflexivity, nodeList || []);
branch.addNode(newNode);
}
Prover.reflexivity.priority = 3;
Prover.reflexivity.needsPremise = false;
Prover.reflexivity.premiseCanBeReflexive = false;
Prover.reflexivity.toString = function() { return 'reflexivity' }
Prover.symmetry = function(branch, nodeList) {
var nodeFormula = nodeList[0].formula;
var R = branch.tree.parser.R;
var formula = new AtomicFormula(R, [nodeFormula.terms[1], nodeFormula.terms[0]]);
var newNode = new Node(formula, Prover.symmetry, nodeList);
branch.addNode(newNode);
}
Prover.symmetry.priority = 3;
Prover.symmetry.needsPremise = true;
Prover.symmetry.premiseCanBeReflexive = false;
Prover.symmetry.toString = function() { return 'symmetry' }
Prover.euclidity = function(branch, nodeList) {
var node = nodeList[0];
var nodeFla = node.formula;
var flaStrings = branch.nodes.map(function(n) {
return n.formula.string;
});
var R = branch.tree.parser.R;
for (var i=0; i<branch.nodes.length; i++) {
var earlierFla = branch.nodes[i].formula;
if (earlierFla.predicate != R) continue;
if (earlierFla.terms[0] == nodeFla.terms[0]) {
var newFla;
if (!flaStrings.includes(R + earlierFla.terms[1] + nodeFla.terms[1])) {
newFla = new AtomicFormula(R, [earlierFla.terms[1], nodeFla.terms[1]]);
}
else if (!flaStrings.includes(R + nodeFla.terms[1] + earlierFla.terms[1])) {
newFla = new AtomicFormula(R, [nodeFla.terms[1], earlierFla.terms[1]]);
}
if (newFla) {
var newNode = new Node(newFla, Prover.euclidity, [branch.nodes[i], node]);
if (branch.addNode(newNode)) {
branch.todoList.unshift(Prover.makeTodoItem(Prover.euclidity, nodeList, 0));
return;
}
}
}
if (branch.nodes[i] == node) break;
}
}
Prover.euclidity.priority = 3;
Prover.euclidity.needsPremise = true;
Prover.euclidity.premiseCanBeReflexive = false;
Prover.euclidity.toString = function() { return 'euclidity' }
Prover.transitivity = function(branch, nodeList) {
var R = branch.tree.parser.R;
var node = nodeList[0];
var nodeFla = node.formula;
for (var i=0; i<branch.nodes.length; i++) {
var earlierFla = branch.nodes[i].formula;
if (earlierFla.predicate != R) continue;
var newFla = null;
if (earlierFla.terms[1] == nodeFla.terms[0]) {
newFla = new AtomicFormula(R, [earlierFla.terms[0], nodeFla.terms[1]]);
}
else if (earlierFla.terms[0] == nodeFla.terms[1]) {
newFla = new AtomicFormula(R, [nodeFla.terms[0], earlierFla.terms[1]]);
}
if (newFla) {
var newNode = new Node(newFla, Prover.transitivity, [branch.nodes[i], node]);
if (branch.addNode(newNode)) {
branch.todoList.unshift(Prover.makeTodoItem(Prover.transitivity, nodeList, 0));
return;
}
}
if (branch.nodes[i] == node) break;
}
}
Prover.transitivity.priority = 3;
Prover.transitivity.needsPremise = true;
Prover.transitivity.premiseCanBeReflexive = false;
Prover.transitivity.toString = function() { return 'transitivity' }
Prover.seriality = function(branch, nodeList) {
var R = branch.tree.parser.R;
if (nodeList.length == 0) {
var oldWorld = branch.tree.parser.w;
}
else {
var oldWorld = nodeList[0].formula.terms[1];
}
for (var i=0; i<branch.nodes.length-1; i++) {
var earlierFla = branch.nodes[i].formula;
if (earlierFla.predicate == R && earlierFla.terms[0] == oldWorld) {
return;
}
}
var newWorld = branch.tree.newWorldName();
var newFla = new AtomicFormula(R, [oldWorld, newWorld]);
var newNode = new Node(newFla, Prover.seriality, []);
branch.addNode(newNode);
}
Prover.seriality.priority = 10;
Prover.seriality.needsPremise = false;
Prover.seriality.premiseCanBeReflexive = false;
Prover.seriality.toString = function() { return 'seriality' }
Prover.makeTodoItem = function(nextRule, args, priority) {
return {
nextRule: nextRule,
priority: priority || nextRule.priority,
args: args
}
}
function Tree(prover) {
if (!prover) return;
this.prover = prover;
this.parser = prover.parser;
this.openBranches = [new Branch(this)];
this.closedBranches = [];
this.numNodes = 0;
this.skolemSymbols = [];
this.string = "";
this.priority = 0;
}
Tree.prototype.addInitNodes = function(initFormulasNormalized) {
var initBranch = this.openBranches[0];
for (var i=0; i<initFormulasNormalized.length; i++) {
var node = new Node(initFormulasNormalized[i]);
initBranch.addNode(node);
initBranch.tryClose(node);
}
}
Tree.prototype.closeBranch = function(branch, complementary1, complementary2) {
branch.closed = true;
branch.todoList = [];
this.markUsedNodes(branch, complementary1, complementary2);
this.openBranches.remove(branch);
this.closedBranches.push(branch);
this.pruneBranch(branch, complementary1, complementary2);
this.string = this.openBranches.map(function(b) { return b.string }).join('|');
var priorityBoost = Math.min(1, (this.numNodes-this.priority)/40);
this.priority += priorityBoost*Math.max(1, 4-this.openBranches.length);
}
Tree.prototype.markUsedNodes = function(branch, complementary1, complementary2) {
var ancestors = [complementary1, complementary2];
var n;
while ((n = ancestors.shift())) {
if (n.used.indexOf(branch.id) == -1) {
n.used += branch.id;
for (var i=0; i<n.fromNodes.length; i++) {
ancestors.push(n.fromNodes[i]);
}
}
}
}
Tree.prototype.pruneBranch = function(branch, complementary1, complementary2) {
var obranches = this.openBranches.concat(this.closedBranches);
obranches.remove(branch);
for (var i=branch.nodes.length-1; i>0; i--) {
for (var j=0; j<obranches.length; j++) {
if (obranches[j].nodes[i] &&
obranches[j].nodes[i] != branch.nodes[i] &&
obranches[j].nodes[i].expansionStep == branch.nodes[i].expansionStep) {
if (branch.nodes[i].used) {
if (!obranches[j].closed) return;
}
else {
if (obranches[j].closed) {
this.closedBranches.remove(obranches[j]);
for (var k=0; k<i; k++) {
branch.nodes[k].used = branch.nodes[k].used.replace(obranches[j].id, '');
}
}
else {
this.openBranches.remove(obranches[j]);
obranches[j].removed = true;
}
this.numNodes -= (obranches[j].nodes.length - i);
}
}
}
if (!this.nodeIsUsed(branch.nodes[i])) {
this.removeNode(branch, i);
}
}
}
Tree.prototype.nodeIsUsed = function(node) {
if (node.used) return true;
var branches = this.openBranches.concat(this.closedBranches);
for (var i=0; i<branches.length; i++) {
for (var j=0; j<branches[i].nodes.length; j++) {
if (branches[i].nodes[j].expansionStep == node.expansionStep
&& branches[i].nodes[j].used) {
return true;
}
}
}
return false;
}
Tree.prototype.removeNode = function(branch, index) {
var node = branch.nodes[index];
var branches = this.openBranches.concat(this.closedBranches);
for (var i=0; i<branches.length; i++) {
if (branches[i].nodes[index] == node) {
branches[i].nodes.splice(index,1);
}
if (node.type == 'literal') {
branches[i].literals.remove(node);
}
}
this.numNodes--;
}
Tree.prototype.closeCloseableBranches = function() {
var openBranches = this.openBranches.copy();
var numOpenBranches = openBranches.length;
for (var k=0; k<openBranches.length; k++) {
var branch = openBranches[k];
if (branch.removed) continue;
N1LOOP:
for (var i=branch.nodes.length-1; i>=0; i--) {
var n1 = branch.nodes[i];
if (n1.formula.sub && n1.formula.sub.predicate == '='
&& [n1.formula.sub.terms[0]].equals([n1.formula.sub.terms[1]])) {
this.closeBranch(branch, n1, n1);
break N1LOOP;
}
var n1negated = (n1.formula.operator == '??');
for (var j=i-1; j>=0; j--) {
var n2 = branch.nodes[j];
if (n2.formula.operator == '??') {
if (n2.formula.sub.equals(n1.formula)) {
this.closeBranch(branch, n1, n2);
break N1LOOP;
}
}
else if (n1negated && n1.formula.sub.equals(n2.formula)) {
this.closeBranch(branch, n1, n2);
break N1LOOP;
}
}
}
}
}
Tree.prototype.getNumNodes = function() {
try {
return this.openBranches[0].todoList[0].args.newNodes.length +
this.numNodes;
}
catch {
return this.numNodes;
}
}
Tree.prototype.copy = function() {
var ntree = new Tree();
var nodemap = {}
ntree.prover = this.prover;
ntree.parser = this.parser;
ntree.numNodes = this.numNodes;
ntree.skolemSymbols = this.skolemSymbols.copy();
ntree.openBranches = [];
for (var i=0; i<this.openBranches.length; i++) {
ntree.openBranches.push(copyBranch(this.openBranches[i]));
}
ntree.closedBranches = [];
for (var i=0; i<this.closedBranches.length; i++) {
ntree.closedBranches.push(copyBranch(this.closedBranches[i]));
}
ntree.string = this.string;
ntree.priority = this.priority;
return ntree;
function copyBranch(orig) {
var nodes = [];
var literals = [];
var todoList = [];
for (var i=0; i<orig.nodes.length; i++) {
nodes.push(copyNode(orig.nodes[i]));
}
for (var i=0; i<orig.literals.length; i++) {
literals.push(nodemap[orig.literals[i].id]);
}
for (var i=0; i<orig.todoList.length; i++) {
var todo = {
nextRule: orig.todoList[i].nextRule,
priority: orig.todoList[i].priority
};
if (orig.todoList[i].args.equations) {
var eqProb = orig.todoList[i].args.copy();
eqProb.terms1Node = nodemap[eqProb.terms1Node.id];
eqProb.terms2Node = nodemap[eqProb.terms2Node.id];
eqProb.equations = eqProb.equations.map(function(n){ return nodemap[n.id] });
todo.args = eqProb;
}
else {
todo.args = orig.todoList[i].args.map(function(n) { return nodemap[n.id] });
}
todoList.push(todo);
}
var b = new Branch(ntree, nodes, literals,
orig.freeVariables.copy(),
todoList, orig.closed);
b.id = orig.id;
b.string = orig.string;
return b;
}
function copyNode(orig) {
if (nodemap[orig.id]) return nodemap[orig.id];
var n = new Node();
n.formula = orig.formula;
n.fromRule = orig.fromRule;
n.fromNodes = [];
for (var i=0; i<orig.fromNodes.length; i++) {
n.fromNodes.push(nodemap[orig.fromNodes[i].id]);
}
n.type = orig.type;
n.expansionStep = orig.expansionStep;
n.used = orig.used;
n.id = orig.id;
n.instanceTerm = orig.instanceTerm;
nodemap[orig.id] = n;
return n;
}
}
Tree.prototype.applySubstitution = function(sub) {
var branches = this.openBranches.concat(this.closedBranches);
for (var i=0; i<sub.length; i+=2) {
var nodeProcessed = {};
for (var b=0; b<branches.length; b++) {
for (var n=branches[b].nodes.length-1; n>=0; n--) {
var node = branches[b].nodes[n];
if (nodeProcessed[node.id]) break;
node.formula = node.formula.substitute(sub[i], sub[i+1]);
if (node.instanceTerm) {
node.instanceTerm = Formula.substituteInTerm(node.instanceTerm, sub[i], sub[i+1]);
}
nodeProcessed[node.id] = true;
}
branches[b].freeVariables.remove(sub[i]);
}
}
for (var b=0; b<this.openBranches.length; b++) {
this.openBranches[b].string = this.openBranches[b].nodes.map(function(n){
return n.formula.string
}).join(',');
}
this.string = this.openBranches.map(function(b) { return b.string }).join('|');
}
Tree.prototype.newFunctionSymbol = function(isWorldTerm) {
var sym = isWorldTerm ? '??' : '??';
var res = sym+'1';
for (var i=this.skolemSymbols.length-1; i>=0; i--) {
if (this.skolemSymbols[i][0] == sym) {
res = sym+(this.skolemSymbols[i].substr(1)*1+1);
break;
}
}
this.skolemSymbols.push(res);
return res;
}
Tree.prototype.newWorldName = function() {
return this.newFunctionSymbol(true);
}
Tree.prototype.toString = function() {
for (var i=0; i<this.closedBranches.length; i++) {
this.closedBranches[i].nodes[this.closedBranches[i].nodes.length-1].__markClosed = true;
}
var branches = this.closedBranches.concat(this.openBranches);
var res = "<table><tr><td align='center' style='font-family:monospace'>" +
getTree(branches[0].nodes[0])+"</td</tr></table>";
for (var i=0; i<this.closedBranches.length; i++) {
delete this.closedBranches[i].nodes[this.closedBranches[i].nodes.length-1].__markClosed;
}
res += "  todo: "+(this.openBranches[0] && this.openBranches[0].todoList.map(function(t) {
return Object.values(t); }).join(', '))+"<br>";
res += "  search depth: "+this.getNumNodes()+"-"+this.priority+"<br>";
return res;
function getTree(node) {
var recursionDepth = arguments[1] || 0;
if (++recursionDepth > 100) return "<b>...<br>[max recursion]</b>";
var children = [];
for (var i=0; i<branches.length; i++) {
for (var j=0; j<branches[i].nodes.length; j++) {
if (branches[i].nodes[j-1] != node) continue;
if (!children.includes(branches[i].nodes[j])) {
children.push(branches[i].nodes[j]);
}
}
}
var nodestr = node.toString().replace(/(??\d+)(\(.+?\))(?!\)|,)/g, function(m,p1,p2) {
var res = p1;
var extraClosed = (m.match(/\)/g) || []).length - (m.match(/\(/g) || []).length;
for (var i=0; i<extraClosed; i++) res += ')';
return res;
});
var res = node.used + ' ' + nodestr + (node.__markClosed ? "<br>x<br>" : "<br>");
if (children[1]) {
var tdStyle = "font-family:monospace; border-top:1px solid #999; padding:3px; border-right:1px solid #999";
var td = "<td align='center' valign='top' style='" + tdStyle + "'>";
res += "<table><tr>"+ td + getTree(children[0], recursionDepth) +"</td>\n"
+ td + getTree(children[1], recursionDepth) + "</td>\n</tr></table>";
}
else if (children[0]) res += getTree(children[0], recursionDepth);
return res;
}
}
function Branch(tree, nodes, literals, freeVariables, todoList, closed) {
this.tree = tree;
this.nodes = nodes || [];
this.literals = literals || [];
this.freeVariables = freeVariables || [];
this.todoList = todoList || [];
this.closed = closed || false;
this.id = 'b'+(Branch.counter++)+'.';
this.string = '';
}
Branch.counter = 0;
Branch.prototype.newVariable = function(isWorldTerm) {
var sym = isWorldTerm ? '??' : '??';
var res = sym+'1';
for (var i=this.freeVariables.length-1; i>=0; i--) {
if (this.freeVariables[i][0] == sym) {
res = sym+(this.freeVariables[i].substr(1)*1+1);
break;
}
}
this.freeVariables.push(res);
return res;
}
Branch.prototype.tryClose = function(node, dontPrune) {
var complFormula = (node.formula.operator == '??') ? node.formula.sub : node.formula.negate();
var complNode;
for (var i=0; i<this.nodes.length; i++) {
if (this.nodes[i].formula.equals(complFormula)) {
if (this.nodes[i].used || !complNode) {
complNode = this.nodes[i];
if (complNode.used) break;
}
}
}
if (complNode) {
this.tree.closeBranch(this, node, complNode);
if (!dontPrune) {
this.tree.prover.pruneAlternatives(this.tree);
}
return true;
}
return false;
}
Branch.prototype.unifierAffectsOtherBranches = function(unifier) {
for (var j=0; j<this.tree.openBranches.length; j++) {
var branch = this.tree.openBranches[j];
if (branch == this) continue;
for (var i=0; i<unifier.length; i+=2) {
if (branch.freeVariables.includes(unifier[i])) return true;
}
}
return false;
}
Branch.prototype.closeWithEquality = function(solution) {
for (var i=0; i<solution.newNodes.length; i++) {
var node = solution.newNodes[i].copy();
var nf0 = node.fromNodes[0];
var nf1 = node.fromNodes[1];
node.fromNodes[0] = this.getNodeById(node.fromNodes[0].id);
node.fromNodes[1] = this.getNodeById(node.fromNodes[1].id);
this.addNode(node, true);
node.expansionStep = this.tree.prover.step - solution.newNodes.length + i + 1;
}
var subs = solution.getSubstitution();
this.tree.applySubstitution(subs);
var closingNode1 = this.getNodeById(solution.terms1Node.id);
var closingNode2 = this.getNodeById(solution.terms2Node.id);
this.tree.closeBranch(this, closingNode1, closingNode2);
return;
}
Branch.prototype.getNodeById = function(id) {
for (var i=this.literals.length-1; i>=0; i--) {
if (this.literals[i].id == id) return this.literals[i];
}
}
Branch.prototype.copy = function() {
var res = new Branch(this.tree,
this.nodes.copy(),
this.literals.copy(),
this.freeVariables.copy(),
this.todoList.copy(),
this.closed);
res.string = this.string;
return res;
}
Branch.prototype.addNode = function(node, dontSkip) {
var addToTodo = true;
if (this.containsFormula(node.formula)) {
if (dontSkip) addToTodo = false;
else return null;
}
this.nodes.push(node);
this.string += (this.string ? ',' : '')+node.formula.string;
this.tree.string = this.tree.openBranches.map(function(b) { return b.string }).join('|');
this.tree.numNodes++;
if (node.type == 'literal') {
this.literals.push(node);
}
if (!this.closed && addToTodo) {
this.expandTodoList(node);
}
node.expansionStep = this.tree.prover.step;
return node;
}
Branch.prototype.containsFormula = function(formula) {
for (var i=0; i<this.nodes.length; i++) {
if (this.nodes[i].formula.string == formula.string) return true;
}
return false;
}
Branch.prototype.expandTodoList = function(node) {
var todo = node.getExpansionTask();
if (todo.nextRule == Prover.literal &&
this.todoList[0] && this.todoList[0].nextRule == Prover.literal) {
this.todoList[0].args.push(node);
}
else {
for (var i=0; i<this.todoList.length; i++) {
if (todo.priority <= this.todoList[i].priority) break;
}
this.todoList.insert(todo, i);
}
if (this.tree.parser.isModal) {
if (this.nodes.length == 1) {
this.addAccessibilityRuleApplications();
}
else if (node.formula.predicate == this.tree.parser.R) {
this.addAccessibilityRuleApplications(node);
}
}
}
Branch.prototype.addAccessibilityRuleApplications = function(node) {
for (var i=0; i<this.tree.prover.accessibilityRules.length; i++) {
var rule = this.tree.prover.accessibilityRules[i];
var pos = this.todoList.length;
while (pos > 0 && this.todoList[pos-1].priority >= rule.priority) pos--;
if (node) {
if (node.formula.terms[0] != node.formula.terms[1]
|| rule.premiseCanBeReflexive) {
this.todoList.insert(Prover.makeTodoItem(rule, [node]), pos);
}
}
else {
if (!rule.needsPremise) {
this.todoList.insert(Prover.makeTodoItem(rule, []), pos);
}
}
}
}
Branch.prototype.getClosingUnifiers = function(node) {
var nodeAtom = node.formula.sub || node.formula;
var unifiersHash = {};
for (var i=this.literals.length-1; i>=0; i--) {
var otherNode = this.literals[i];
if (otherNode == node) continue;
if (!otherNode.formula.sub == !node.formula.sub) continue;
var otherAtom = otherNode.formula.sub || otherNode.formula;
if (otherAtom.predicate != nodeAtom.predicate) continue;
var u = Formula.unifyTerms(nodeAtom.terms, otherAtom.terms);
if (u.isArray) {
unifiersHash[u.toString()] = u;
}
}
if (nodeAtom.predicate == '=' && node.formula.sub) {
var u = Formula.unifyTerms([nodeAtom.terms[0]], [nodeAtom.terms[1]]);
if (u.isArray) {
unifiersHash[u.toString()] = u;
}
}
return Object.values(unifiersHash);
}
Branch.prototype.createEqualityProblems = function(nodes) {
nodes = nodes.filter(function(n) {
return !(n.formula.predicate == '='
&& n.formula.terms[0].toString() == n.formula.terms[1].toString());
});
for (var i=0; i<nodes.length; i++) {
if (nodes[i].formula.predicate == '=') {
var recNodes = this.literals.filter(function(lit) {
return lit.formula.sub;
});
return this.createEqualityProblems(recNodes);
}
}
var res = [];
for (var i=0; i<nodes.length; i++) {
var node = nodes[i];
if (node.formula.sub && node.formula.sub.predicate == '=') {
var prob = this.createEqualityProblem(node, node)
if (prob) res.push(prob);
}
else {
for (var j=0; j<this.literals.length; j++) {
var lit = this.literals[j];
if ((node.formula.sub && lit.formula.predicate == node.formula.sub.predicate) ||
(lit.formula.sub && node.formula.predicate == lit.formula.sub.predicate)) {
var prob = this.createEqualityProblem(node, lit);
if (prob) res.push(prob);
}
}
}
}
return res;
}
Branch.prototype.createEqualityProblem = function(node1, node2) {
var equations = this.literals.filter(function(n) {
return n.formula.predicate == '='
&& ![n.formula.terms[0]].equals([n.formula.terms[1]]);
});
if (!equations.length) return null;
equations.reverse();
var prob = new EqualityProblem();
prob.init(equations, node1, node2);
return prob;
}
Branch.prototype.toString = function() {
return this.string;
}
function Node(formula, fromRule, fromNodes) {
if (!formula) return;
this.formula = formula;
this.type = formula.type;
this.id = Node.counter++;
this.fromRule = fromRule || null;
this.fromNodes = fromNodes || [];
this.used = '';
}
Node.counter = 0;
Node.prototype.getExpansionTask = function() {
var todo = {
nextRule: Prover[this.type],
priority: Prover[this.type].priority,
args: [this]
}
if (this.type == 'gamma' && this.formula.string.includes('???')) {
todo.priority -= 0.5;
}
else if (this.type == 'modalGamma' && this.formula.string.includes('???')) {
todo.priority -= 0.5;
}
return todo;
}
Node.prototype.copy = function() {
var res = new Node();
res.formula = this.formula;
res.fromRule = this.fromRule;
res.fromNodes = this.fromNodes.copy();
res.type = this.type;
res.id = this.id;
res.used = this.used;
return res;
}
Node.prototype.toString = function() {
return this.formula.toString();
}

function EqualityProblem(equationNodes) {
this.terms1 = null;
this.terms2 = null;
this.terms1Node = null;
this.terms2Node = null;
this.equations = [];
this.constraint = arguments[0] || new SubstitutionConstraint();
this.newNodes = [];
this.nextStep = this.start;
this.lastStep = null;
this.lrbsIndex = -1;
}
EqualityProblem.prototype.init = function(equationNodes, goalNode1, goalNode2) {
this.equations = equationNodes;
this.terms1Node = goalNode1;
this.terms2Node = goalNode2;
if (goalNode1 == goalNode2) {
this.terms1 = [goalNode1.formula.sub.terms[0]];
this.terms2 = [goalNode1.formula.sub.terms[1]];
}
else if (goalNode1.formula.sub) {
this.terms1 = goalNode1.formula.sub.terms;
this.terms2 = goalNode2.formula.terms;
}
else {
this.terms1 = goalNode1.formula.terms;
this.terms2 = goalNode2.formula.sub.terms;
}
}
EqualityProblem.prototype.addSkolemConstraints = function(terms) {
for (var i=0; i<terms.length; i++) {
if (!terms[i].isArray) continue;
if (terms[i][0][0] == '??' || terms[i][0][0] == '??') {
terms[i][0][0].isSkolemTerm = true;
var fvs = getVariablesInTermList(terms[i]);
for (var j=0; j<fvs.length; j++) {
this.constraint.addGreater(terms[i], fvs[j]);
}
}
}
}
function getVariablesInTermList(terms) {
var res = [];
var dupe = {};
for (var i=0; i<terms.length; i++) {
if (terms[i].isArray) {
res.extendNoDuplicates(getVariablesInTermList(terms[i]));
}
else if ((terms[i][0] == '??' || terms[i][0] == '??') && !dupe[terms[i]]) {
dupe[terms[i]] = true;
res.push(terms[i]);
}
}
return res;
}
EqualityProblem.prototype.start = function() {
return this.tryRrbs();
}
EqualityProblem.prototype.tryRrbs = function() {
var equations = this.lastStep == this.tryLrbs ?
[this.equations[this.lrbsIndex]] : this.equations;
var schedule = [];
for (var i=0; i<this.terms1.length; i++) {
var nc = this.constraint.tryAddEqual(this.terms1[i], this.terms2[i]);
if (nc && nc == this.constraint) {
continue;
}
for (var sIsTerms1=1; sIsTerms1>=0; sIsTerms1--) {
var s = sIsTerms1 ? this.terms1 : this.terms2;
var t = sIsTerms1 ? this.terms2 : this.terms1;
var fconstraint = this.constraint.tryAddGreater(s[i],t[i]);
if (!fconstraint) continue;
var siSubterms = subterms(s[i]);
for (var ei=0; ei<equations.length; ei++) {
for (var lIsLHS=1; lIsLHS>=0; lIsLHS--) {
var l = equations[ei].formula.terms[lIsLHS ? 0 : 1];
var r = equations[ei].formula.terms[lIsLHS];
var sconstraint = fconstraint.tryAddGreater(l,r);
if (!sconstraint) continue;
for (var j=0; j<siSubterms.length; j++) {
var p = siSubterms[j];
var tconstraint = sconstraint.tryAddEqual(l,p)
if (!tconstraint) continue;
var new_sis = replaceSubterm(s[i], p, r);
for (var g=0; g<new_sis.length; g++) {
var newProblem = this.copy(tconstraint);
newProblem.applyLLtoGoal(i, sIsTerms1, new_sis[g], equations[ei]);
newProblem.lastStep = this.tryRrbs;
if (newProblem.tryEr()) {
newProblem.nextStep = null;
schedule.unshift(newProblem);
}
else {
newProblem.nextStep = this.tryRrbs;
schedule.push(newProblem);
}
}
}
}
}
}
}
this.nextStep = this.tryLrbs;
schedule.push(this);
return schedule.removeDuplicates();
}
EqualityProblem.prototype.tryLrbs = function() {
var schedule = [];
for (var j=0; j<this.equations.length; j++) {
for (var sIsLHS=1; sIsLHS>=0; sIsLHS--) {
var s = this.equations[j].formula.terms[sIsLHS ? 0 : 1];
var t = this.equations[j].formula.terms[sIsLHS];
var fconstraint = this.constraint.tryAddGreater(s,t);
if (!fconstraint) continue;
var sourceEquations = (j <= this.lrbsIndex) ?
[this.equations[this.lrbsIndex]] : this.equations;
for (var i=0; i<sourceEquations.length; i++) {
for (var lIsLHS=1; lIsLHS>=0; lIsLHS--) {
var l = sourceEquations[i].formula.terms[lIsLHS ? 0 : 1];
var r = sourceEquations[i].formula.terms[lIsLHS];
var sconstraint = fconstraint.tryAddGreater(l,r);
if (!sconstraint) continue;
var sSubterms = subterms(s);
for (var k=0; k<sSubterms.length; k++) {
var p = sSubterms[k];
var tconstraint = sconstraint.tryAddEqual(l,p);
if (!tconstraint) continue;
var new_ss = replaceSubterm(s, p, r);
for (var g=0; g<new_ss.length; g++) {
var new_s = new_ss[g];
if (new_s.toString() == t.toString()) continue;
var newProblem = this.copy(tconstraint);
newProblem.applyLLtoEquation(j, sIsLHS, new_ss[g], sourceEquations[i]);
newProblem.lrbsIndex = j;
newProblem.lastStep = newProblem.tryLrbs;
newProblem.nextStep = newProblem.tryRrbs;
schedule.push(newProblem);
}
}
}
}
}
}
return schedule.removeDuplicates();
}
EqualityProblem.prototype.tryEr = function() {
var con = this.constraint;
for (var i=0; i<this.terms1.length; i++) {
con = con.tryAddEqual(this.terms1[i], this.terms2[i]);
if (!con) return false;
}
this.constraint = con;
return true;
}
EqualityProblem.prototype.applyLLtoGoal = function(i, sIsTerms1, new_si, equation) {
if (sIsTerms1) {
this.terms1 = this.terms1.copy();
this.terms1.splice(i, 1, new_si);
}
else {
this.terms2 = this.terms2.copy();
this.terms2.splice(i, 1, new_si);
}
if (this.terms1Node == this.terms2Node) {
var newFormula = new AtomicFormula('=', [this.terms1[0], this.terms2[0]]).negate();
var newNode = new Node(newFormula,
Prover.equalityReasoner,
[equation, this.terms1Node]
);
this.newNodes.push(newNode);
this.terms1Node = newNode;
this.terms2Node = newNode;
}
else {
var targetNode = sIsTerms1 ? this.terms1Node : this.terms2Node;
var targetAtom = targetNode.formula.sub || targetNode.formula;
var newFormula = new AtomicFormula(targetAtom.predicate,
sIsTerms1 ? this.terms1 : this.terms2);
if (targetNode.formula.sub) newFormula = newFormula.negate();
var newNode = new Node(newFormula,
Prover.equalityReasoner,
[equation, targetNode]
);
this.newNodes.push(newNode);
if (sIsTerms1) this.terms1Node = newNode;
else this.terms2Node = newNode;
}
}
EqualityProblem.prototype.applyLLtoEquation = function(j, sIsLHS, new_s, sourceEq) {
var targetEq = this.equations[j];
var newFormula = new AtomicFormula('=', [
sIsLHS ? new_s : targetEq.formula.terms[0],
sIsLHS ? targetEq.formula.terms[1] : new_s
]);
var newNode = new Node(newFormula,
Prover.equalityReasoner,
[sourceEq, targetEq]
);
this.newNodes.push(newNode);
this.equations = this.equations.copy();
this.equations.splice(j, 1, newNode);
}
EqualityProblem.prototype.getSubstitution = function() {
var sdict = this.constraint.solvedForms[0].solvedDict;
var res = [];
for (var v1 in sdict) {
res.push(v1, sdict[v1]);
}
return res;
}
EqualityProblem.prototype.deskolemize = function(node) {
var res = new Node();
res.id = node.id;
var atom = node.formula.sub || node.formula;
var newTerms = [];
for (var i=0; i<atom.terms.length; i++) {
if (atom.terms[i].isArray &&
(atom.terms[i][0][0] == '??' || atom.terms[i][0][0] == '??')
){}
}
var fvs = node.formula.getFreeVariables();
var newFormula = new AtomicFormula
}
EqualityProblem.prototype.copy = function(constraint) {
var res = new EqualityProblem(constraint || this.constraint);
res.terms1 = this.terms1;
res.terms2 = this.terms2;
res.equations = this.equations;
res.terms1Node = this.terms1Node;
res.terms2Node = this.terms2Node;
res.newNodes = this.newNodes.copy();
res.lastStep = this.lastStep;
res.nextStep = this.nextStep;
res.lrbsIndex = this.lrbsIndex;
return res;
}
EqualityProblem.prototype.toString = function() {
var nextStepStr = this.nextStep==this.tryRrbs ? 'rrbs' :
this.nextStep==this.tryLrbs ? 'lrbs' :
this.nextStep==this.tryEr ? 'er' :
this.nextStep==this.start ? 'start' :
this.nextStep==null ? '' : '???';
return '&lt;' + this.equations + ' ??? ' + this.terms1 + '=' + this.terms2
+ ' (' + this.constraint + ') *' + nextStepStr + '&gt;';
}
function subterms(term) {
if (term.isArray) {
if (term[0][0] == '??' || term[0][0] == '??') {
return [term];
}
var res = [term];
for (var i=1; i<term.length; i++) {
res.extendNoDuplicates(subterms(term[i]));
}
return res;
}
if (term[0] == '??' || term[0] == '??') return [];
return [term];
}
function replaceSubterm(term, sub, repl) {
var subStr = sub.toString();
if (term.toString() == subStr) return [repl];
if (!term.isArray || term[0][0] == '??' || term[0][0] == '??') return [];
var res = [];
for (var i=1; i<term.length; i++) {
var newSubterms = replaceSubterm(term[i], sub, repl);
for (var j=0; j<newSubterms.length; j++) {
var newTerm = term.copy()
newTerm.splice(i, 1, newSubterms[j]);
res.push(newTerm);
}
}
return res;
}
function SubstitutionConstraint(equalities, inequalities, solvedForms) {
this.equalities = equalities || [];
this.inequalities = inequalities || [];
this.solvedForms = solvedForms || [new SolvedForm()];
}
SubstitutionConstraint.prototype.tryAddEqual = function(s, t) {
var sfChanged = false;
var sfs = [];
for (var i=0; i<this.solvedForms.length; i++) {
var sf = this.solvedForms[i].addEqual(s,t);
if (sf.length != 1 || !sf[0].equals(this.solvedForms[i])) sfChanged = true;
sfs.extendNoDuplicates(sf);
}
if (sfs.length == 0) {
return null;
}
if (sfChanged) {
var newEqualities = this.equalities.copy();
newEqualities.push(s+'='+t);
return new SubstitutionConstraint(newEqualities, this.inequalities, sfs);
}
else {
return this;
}
}
SubstitutionConstraint.prototype.tryAddGreater = function(s, t) {
var sfChanged = false;
var sfs = [];
for (var i=0; i<this.solvedForms.length; i++) {
var sfa = this.solvedForms[i].addGreater(s,t);
if (sfa.length != 1 || !sfa[0].equals(this.solvedForms[i])) sfChanged = true;
sfs.extendNoDuplicates(sfa);
}
if (sfs.length == 0) {
return null;
}
if (sfChanged) {
var newInequalities = this.inequalities.copy();
newInequalities.push(s+'>'+t);
return new SubstitutionConstraint(this.equalities, newInequalities, sfs);
}
else {
return this;
}
}
SubstitutionConstraint.prototype.toString = function() {
return this.equalities.join(' ')+' '+this.inequalities.join(' ');
}
function SolvedForm() {
this.solvedDict = {};
this.solvedDictStr = [];
this.inequalities = [];
this.inequalitiesStr = [];
}
SolvedForm.prototype.addEqual = function(s, t) {
var sStr = s.toString();
var tStr = t.toString();
for (var v in this.solvedDict) {
if (sStr.includes(v)) {
s = Formula.substituteInTerm(s, v, this.solvedDict[v]);
sStr = s.toString();
}
if (tStr.includes(v)) {
t = Formula.substituteInTerm(t, v, this.solvedDict[v]);
tStr = t.toString();
}
}
if (sStr == tStr) {
return [this];
}
if (sStr[0] == '??' || sStr[0] == '??') {
if (this.occursCheckStr(sStr,tStr)) {
return [];
}
else {
return this.addSubs(s,t);
}
}
else if (tStr[0] == '??' || tStr[0] == '??') {
return this.addEqual(t,s);
}
else if (s.isArray && t.isArray) {
if (s[0] != t[0]) {
return [];
}
var res = [this];
for (var i=1; i<s.length; i++) {
var newRes = [];
for (var j=0; j<res.length; j++) {
newRes.extendNoDuplicates(res[j].addEqual(s[i],t[i]));
}
res = newRes;
}
return res;
}
else return [];
}
SolvedForm.prototype.addSubs = function(v, t) {
var sf = new SolvedForm();
for (v2 in this.solvedDict) {
sf.solvedDict[v2] = Formula.substituteInTerm(this.solvedDict[v2], v, t);
sf.solvedDictStr.push(v2+'='+sf.solvedDict[v2]);
}
sf.solvedDict[v] = t;
sf.solvedDictStr.push(v+'='+t);
sf.solvedDictStr.sort();
var res = [sf];
for (var i=0; i<this.inequalities.length; i++) {
var ineq = this.inequalities[i];
var newRes = [];
for (var j=0; j<res.length; j++) {
newRes.extendNoDuplicates(res[j].addGreater(ineq[0],ineq[1]));
}
res = newRes;
}
return res;
}
SolvedForm.prototype.addGreater = function(s, t) {
var sStr = s.toString();
var tStr = t.toString();
for (var v in this.solvedDict) {
if (sStr.includes(v)) {
s = Formula.substituteInTerm(s, v, this.solvedDict[v]);
sStr = s.toString();
}
if (tStr.includes(v)) {
t = Formula.substituteInTerm(t, v, this.solvedDict[v]);
tStr = t.toString();
}
}
var sIsVar = sStr[0] == '??' || sStr[0] == '??';
var tIsVar = tStr[0] == '??' || tStr[0] == '??';
if (sIsVar || tIsVar) {
if (this.inequalitiesStr.includes(sStr+'>'+tStr)) {
return [this];
}
if (sIsVar && this.occursCheckStr(sStr,tStr)) {
return [];
}
else if (tIsVar && this.occursCheckStr(tStr,sStr)) {
return [this];
}
else {
if (this.inequalitiesStr.includes(tStr+'>'+sStr)) {
return [];
}
var sf = this.copy();
sf.inequalities.push([s,t]);
sf.inequalitiesStr.push(sStr+'>'+tStr);
sf.inequalities.sort();
return [sf];
}
}
var sRoot = s.isArray ? s[0] : s;
var tRoot = t.isArray ? t[0] : t;
if (sRoot > tRoot) {
var res = [this];
if (t.isArray) {
for (var i=1; i<t.length; i++) {
var newRes = [];
for (var j=0; j<res.length; j++) {
newRes.extendNoDuplicates(res[j].addGreater(s,t[i]));
}
res = newRes;
}
}
return res;
}
else if (tRoot > sRoot) {
var res = [];
if (s.isArray) {
for (var i=1; i<s.length; i++) {
res.extendNoDuplicates(this.addEqual(s[i],t));
res.extendNoDuplicates(this.addGreater(s[i],t));
}
}
return res;
}
else {
if (!s.isArray) {
return [];
}
var res = [];
for (var i=1; i<s.length; i++) {
res.extendNoDuplicates(this.addEqual(s[i],t));
res.extendNoDuplicates(this.addGreater(s[i],t));
}
var eq = [this];
for (var i=1; i<s.length; i++) {
var h = [];
for (var j=0; j<eq.length; j++) {
h.extendNoDuplicates(eq[j].addGreater(s[i], t[i], 1));
}
for (var j=i+1; j<s.length; j++) {
var newH = [];
for (var k=0; k<h.length; k++) {
newH.extendNoDuplicates(h[k].addGreater(s[i], t[i], 1));
}
h = newH;
}
res.extendNoDuplicates(h);
var newEq = [];
for (var j=0; j<eq.length; j++) {
newEq.extendNoDuplicates(eq[j].addEqual(s[i], t[i], 1));
}
eq = newEq;
}
return res;
}
}
SolvedForm.prototype.occursCheck = function(v, t) {
if (t[0] == '??' || t[0] == '??') {
return t == v;
}
else if (t.isArray) {
for (var i=1; i<t.length; i++) {
if (this.occursCheck(v, t[i])) return true;
}
}
return false;
}
SolvedForm.prototype.occursCheckStr = function(v, t) {
var ts = t.split(v, 2);
if (ts.length == 2) {
return isNaN(ts[1][0]);
}
return false;
}
SolvedForm.prototype.checkSatisfiable = function() {
return true;
}
SolvedForm.prototype.copy = function() {
var res = new SolvedForm();
for (key in this.solvedDict) {
res.solvedDict[key] = this.solvedDict[key];
}
res.solvedDictStr = this.solvedDictStr.copy();
res.inequalities = this.inequalities.copy();
res.inequalitiesStr = this.inequalitiesStr.copy();
return res;
}
SolvedForm.prototype.equals = function(sf) {
if (this.solvedDictStr.join() != sf.solvedDictStr.join()) return false;
return (this.inequalitiesStr.join() == sf.inequalitiesStr.join());
}
SolvedForm.prototype.toString = function() {
return '{'+this.solvedDictStr.join(' ')+' '+this.inequalitiesStr.join(' ')+'}';
}

function ModelFinder(initFormulas, parser, accessibilityConstraints, s5) {
this.parser = parser;
this.s5 = s5;
if (s5) {
accessibilityConstraints = [];
initFormulas = initFormulas.map(function(f) {
return parser.stripAccessibilityClauses(f);
});
}
this.predicates = parser.getSymbols('predicate');
if (s5) this.predicates.remove(parser.R);
this.constants = parser.getSymbols('individual constant');
this.funcSymbols = parser.getSymbols('function symbol');
if (parser.isModal) {
this.constants.unshift(parser.w);
}
initFormulas = initFormulas.concat(accessibilityConstraints || []);
this.clauses = this.getClauses(initFormulas);
var numIndividuals = 1;
var numWorlds = this.parser.isModal ? 1 : 0;
this.model = new Model(this, numIndividuals, numWorlds);
this.alternativeModels = [];
}
ModelFinder.prototype.getClauses = function(formulas) {
var res = [];
for (var i=0; i<formulas.length; i++) {
var formula = formulas[i];
var distinctVars = this.makeVariablesDistinct(formula);
var skolemized = this.skolemize(distinctVars);
var quantifiersRemoved = skolemized.removeQuantifiers();
var clauses = this.tseitinCNF(quantifiersRemoved);
res.extendNoDuplicates(clauses);
}
res.sort(function(a,b){ return a.length - b.length; });
res = this.simplifyClauses(res);
return res;
}
ModelFinder.prototype.makeVariablesDistinct = function(formula) {
var usedVariables = arguments[1] || [];
var parser = this.parser;
if (formula.matrix) {
var nmatrix = formula.matrix;
var nvar = formula.variable;
if (usedVariables.includes(formula.variable)) {
nvar = parser.expressionType[nvar] == 'world variable' ?
parser.getNewWorldVariable() : parser.getNewVariable();
nmatrix = nmatrix.substitute(formula.variable, nvar);
}
usedVariables.push(nvar);
nmatrix = this.makeVariablesDistinct(nmatrix, usedVariables);
if (nmatrix == formula.matrix) return formula;
return new QuantifiedFormula(formula.quantifier, nvar, nmatrix, formula.overWorlds);
}
if (formula.sub1) {
var nsub1 = this.makeVariablesDistinct(formula.sub1, usedVariables);
var nsub2 = this.makeVariablesDistinct(formula.sub2, usedVariables);
if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
return formula;
}
ModelFinder.prototype.skolemize = function(formula) {
var boundVars = arguments[1] ? arguments[1].copy() : [];
var parser = this.parser;
if (formula.quantifier == '???') {
var skolemVars = [];
boundVars.forEach(function(v) {
if (formula.matrix.string.indexOf(v) > -1) skolemVars.push(v);
});
var isWorldType = parser.expressionType[formula.variable] == 'world variable';
var skolemTerm;
if (skolemVars.length > 0) {
var funcSymbol = parser.getNewFunctionSymbol(skolemVars.length, isWorldType);
var skolemTerm = skolemVars;
skolemTerm.unshift(funcSymbol);
}
else skolemTerm = isWorldType ? parser.getNewWorldName() : parser.getNewConstant();
var nmatrix = formula.matrix.substitute(formula.variable, skolemTerm);
nmatrix = this.skolemize(nmatrix, boundVars);
return nmatrix;
}
if (formula.quantifier) {
boundVars.push(formula.variable);
var nmatrix = this.skolemize(formula.matrix, boundVars);
if (nmatrix == formula.matrix) return formula;
return new QuantifiedFormula(formula.quantifier, formula.variable, nmatrix,
formula.overWorlds);
}
if (formula.sub1) {
var nsub1 = this.skolemize(formula.sub1, boundVars);
var nsub2 = this.skolemize(formula.sub2, boundVars);
if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
return formula;
}
ModelFinder.prototype.tseitinCNF = function(formula) {
if (formula.type == 'literal') {
return [[formula]];
}
if (formula.operator == '???') {
var res = this.tseitinCNF(formula.sub1).concatNoDuplicates(
this.tseitinCNF(formula.sub2))
res.sort(function(a,b){ return a.length - b.length; });
return res;
}
var subformulas = this.tseitinSubFormulas([formula]).removeDuplicates();
subformulas.sort(function(a,b) {
return tseitinComplexity(a) - tseitinComplexity(b);
});
if (!this.tseitsinFormulas) {
this.tseitsinFormulas = {};
}
var clauses = [];
while (subformulas.length) {
var subf = subformulas.shift();
var p = this.tseitsinFormulas[subf.string];
if (!p) {
var vars = this.parser.getVariables(subf);
var pSym = this.parser.getNewSymbol('$', 'tseitin predicate', vars.length);
p = new AtomicFormula(pSym, vars);
this.tseitsinFormulas[subf.string] = p;
var bicond = new BinaryFormula('???', p, subf);
clauses.extendNoDuplicates(this.cnf(bicond));
}
if (subformulas.length == 0) {
clauses.extendNoDuplicates([[p]]);
}
for (var i=0; i<subformulas.length; i++) {
subformulas[i] = this.tseitinReplace(subformulas[i], subf, p);
}
}
clauses.sort(function(a,b){ return a.length - b.length; });
return clauses;
function tseitinComplexity(formula) {
if (formula.sub) {
return 1 + tseitinComplexity(formula.sub);
}
if (formula.sub1) {
return 1 + Math.max(tseitinComplexity(formula.sub1),
tseitinComplexity(formula.sub2));
}
return 0;
}
}
ModelFinder.prototype.tseitinSubFormulas = function(formulas) {
var res = []
for (var i=0; i<formulas.length; i++) {
if (formulas[i].type != 'literal') {
var subformulas = formulas[i].sub ? [formulas[i].sub] :
formulas[i].sub1 ? [formulas[i].sub1, formulas[i].sub2] : null;
res.extend(this.tseitinSubFormulas(subformulas));
res.unshift(formulas[i]);
}
}
return res;
}
ModelFinder.prototype.tseitinReplace = function(formula, f1, f2) {
if (formula.equals(f1)) return f2;
if (formula.sub) {
var nsub = this.tseitinReplace(formula.sub, f1, f2);
if (nsub == formula.sub) return formula;
return new NegatedFormula(nsub);
}
if (formula.sub1) {
var nsub1 = this.tseitinReplace(formula.sub1, f1, f2);
var nsub2 = this.tseitinReplace(formula.sub2, f1, f2);
if (formula.sub1 == nsub1 && formula.sub2 == nsub2) return formula;
return new BinaryFormula(formula.operator, nsub1, nsub2);
}
return formula;
}
ModelFinder.prototype.cnf = function(formula) {
if (formula.type == 'literal') {
return [[formula]];
}
var con, dis;
switch (formula.operator) {
case '???': {
con = [this.cnf(formula.sub1), this.cnf(formula.sub2)];
break;
}
case '???': {
dis = [this.cnf(formula.sub1), this.cnf(formula.sub2)];
break;
}
case '???': {
dis = [this.cnf(formula.sub1.negate()), this.cnf(formula.sub2)];
break;
}
case '???' : {
var con1 = this.cnf(new BinaryFormula('???', formula.sub1, formula.sub2));
var con2 = this.cnf(new BinaryFormula('???', formula.sub2, formula.sub1));
con = [con1, con2];
break;
}
case '??' : {
var sub = formula.sub;
switch (sub.operator) {
case '???': {
dis = [this.cnf(sub.sub1.negate()), this.cnf(sub.sub2.negate())];
break;
}
case '???': {
con = [this.cnf(sub.sub1.negate()), this.cnf(sub.sub2.negate())];
break;
}
case '???': {
con = [this.cnf(sub.sub1), this.cnf(sub.sub2.negate())];
break;
}
case '???' : {
var con1 = this.cnf(new BinaryFormula('???', sub.sub1, sub.sub2));
var con2 = this.cnf(new BinaryFormula('???', sub.sub1.negate(), sub.sub2.negate()));
con = [con1, con2];
break;
}
case '??' : {
return this.cnf(sub.sub);
}
}
}
}
var res = [];
if (con) {
res = con[0].concatNoDuplicates(con[1]);
}
else if (dis) {
for (var i=0; i<dis[0].length; i++) {
for (var j=0; j<dis[1].length; j++) {
res.push(dis[0][i].concatNoDuplicates(dis[1][j]).sort());
}
}
}
res.sort(function(a,b){ return a.length - b.length });
return res;
}
ModelFinder.prototype.simplifyClauses = function(clauseList) {
var nl = clauseList.filter(function(clause) {
for (var i=0; i<clause.length; i++) {
for (var j=i+1; j<clause.length; j++) {
if (clause[i].sub && clause[i].sub.string == clause[j].string ||
clause[j].sub && clause[j].sub.string == clause[i].string) {
return false;
}
}
}
return true;
});
nl2 = nl.copy();
var literals2clauses = {};
for (var i=0; i<nl.length; i++) {
for (var k=0; k<nl[i].length; k++) {
var lit = nl[i][k].string;
if (!literals2clauses[lit]) literals2clauses[lit] = [nl[i]];
else literals2clauses[lit].push(nl[i]);
}
}
for (var i=0; i<nl.length; i++) {
var clause = nl[i];
var lit = clause[0].string;
var supersets = literals2clauses[lit];
for (var k=1; k<clause.length && supersets.length; k++) {
lit = clause[k].string;
supersets.intersect(literals2clauses[lit]);
}
for (var k=0; k<supersets.length; k++) {
if (nl.indexOf(supersets[k]) > nl.indexOf(clause)) {
nl2.remove(supersets[k]);
}
}
}
return nl2;
}
ModelFinder.prototype.nextStep = function() {
if (this.model.clauses.length == 0) {
return true;
}
var literal = this.model.clauses[0][0];
if (!literal) {
this.backtrack();
return false;
}
while (this.model.clauses[0].length == 1 && literal.string.indexOf('$') > -1) {
this.model.unitResolve(literal);
return false;
}
if (!this.model.termValues) {
this.model.initTermValues(literal);
}
else {
if (!this.model.iterateTermValues()) {
this.model.clauses[0].shift();
this.model.termValues = null;
return false;
}
}
while (true) {
var atom = literal.sub || literal;
var nterms = this.model.reduceTerms(atom.terms);
var redAtom = atom.predicate+nterms.toString();
if (this.model.getCurInt(redAtom) === (atom != literal)) {
if (!this.model.iterateTermValues()) {
this.model.clauses[0].shift();
this.model.termValues = null;
return false;
}
}
else {
this.alternativeModels.push(this.model.copy());
if (this.model.getCurInt(redAtom) === undefined) {
this.model.curInt[redAtom] = (atom==literal);
}
this.model.interpretation = this.model.curInt;
this.model.termValues = null;
this.model.clauses.shift();
this.model.simplifyRemainingClauses();
return false;
}
}
}
ModelFinder.prototype.backtrack = function() {
if (this.alternativeModels.length == 0) {
var numWorlds = this.model.worlds.length;
var numIndividuals = this.model.domain.length;
if (numWorlds && this.parser.isPropositional) {
numWorlds++;
}
else {
if (numWorlds && numWorlds < this.model.domain.length) {
numWorlds++;
}
else numIndividuals++;
}
this.model = new Model(this, numIndividuals, numWorlds);
}
else {
this.model = this.alternativeModels.pop();
this.model.curInt = {};
for (var p in this.model.interpretation) {
this.model.curInt[p] = this.model.interpretation[p];
}
var tvs = this.model.termValues;
for (var i=0; i<tvs.length; i++) {
var redTerm = this.model.reduceArguments(tvs[i][0]).toString();
if (tvs[i][2] !== null) {
this.model.curInt[redTerm] = tvs[i][2];
}
}
}
}
function Model(modelfinder, numIndividuals, numWorlds) {
if (!modelfinder) {
return;
}
this.modelfinder = modelfinder;
this.parser = modelfinder.parser;
this.domain = Array.getArrayOfNumbers(numIndividuals);
this.worlds = Array.getArrayOfNumbers(numWorlds);
this.isModal = numWorlds > 0;
this.interpretation = {};
this.clauses = this.getDomainClauses();
var terms = this.getTerms();
this.indivTerms = terms[0];
this.worldTerms = terms[1];
this.termValues = null;
this.curInt = {};
}
Model.prototype.getTerms = function() {
var indivTerms = [];
var worldTerms = this.parser.isModal ? [this.parser.w] : [];
for (var i=0; i<this.parser.symbols.length; i++) {
var s = this.parser.symbols[i];
var stype = this.parser.expressionType[s];
if (stype == 'individual constant') {
indivTerms.push(s);
}
else if (stype.indexOf('function symbol for world') > -1) {
var arity = this.parser.arities[s];
Model.getNTuples(arity, this.worlds.length-1).forEach(function(li) {
li.unshift(s);
worldTerms.push(li.toString());
});
}
else if (stype.indexOf('function symbol') > -1) {
var arity = this.parser.arities[s];
Model.getNTuples(arity, this.domain.length-1).forEach(function(li) {
li.unshift(s);
indivTerms.push(li.toString());
});
}
}
indivTerms.sort(function(a,b){ return a.length - b.length; });
worldTerms.sort(function(a,b){ return a.length - b.length; });
return [indivTerms, worldTerms];
}
Model.prototype.getDomainClauses = function() {
res = [];
for (var c=0; c<this.modelfinder.clauses.length; c++) {
var clause = this.modelfinder.clauses[c];
var variables = [];
for (var i=0; i<clause.length; i++) {
variables.extendNoDuplicates(this.parser.getVariables(clause[i]));
}
if (variables.length == 0) {
res.push(clause.copy());
continue;
}
var interpretations = this.getVariableAssignments(variables);
for (var i=0; i<interpretations.length; i++) {
var interpretation = interpretations[i];
var nclause = clause.map(function(formula) {
var nformula = formula;
for (var i=0; i<variables.length; i++) {
nformula = nformula.substitute(variables[i], interpretation[i]);
}
return nformula;
});
res.push(nclause);
}
}
res = this.modelfinder.simplifyClauses(res);
return res;
}
Model.prototype.getVariableAssignments = function(variables) {
var res = [];
var tuple = Array.getArrayOfZeroes(variables.length);
res.push(tuple.copy());
var maxValues = [];
for (var i=0; i<variables.length; i++) {
maxValues.push(this.parser.expressionType[variables[i]] == 'variable' ?
this.domain.length-1 : this.worlds.length-1);
}
while (Model.iterateTuple(tuple, maxValues)) {
res.push(tuple.copy());
}
return res;
}
Model.iterateTuple = function(tuple, maxValues) {
for (var i=tuple.length-1; i>=0; i--) {
if (tuple[i] < maxValues[i]) {
tuple[i]++;
return true;
}
tuple[i] = 0;
}
return false;
}
Model.getNTuples = function(n, maxval) {
if (n == 0) {
return [[]];
}
var res = [];
for (var i=0; i<maxval; i++) {
Model.getNTuples(n-1, maxval).forEach(function(li) {
li.unshift(i);
res.push(li);
});
}
return res;
}
Model.prototype.initTermValues = function(literal) {
var atom = literal.sub || literal;
var termIsOld = {};
var terms = [];
for (var i=0; i<atom.terms.length; i++) {
if (typeof atom.terms[i] == 'number') continue;
var termStr = atom.terms[i].toString();
if (termIsOld[termStr]) continue;
termIsOld[termStr] = true;
terms.push([atom.terms[i], termStr, null]);
}
for (var i=0; i<terms.length; i++) {
if (terms[i][0].isArray) {
for (var j=1; j<terms[i][0].length; j++) {
var subTerm = terms[i][0][j];
if (typeof subTerm == 'number') continue;
var termStr = subTerm.toString();
if (termIsOld[termStr]) continue;
termIsOld[termStr] = true;
terms.push([subTerm, termStr, null]);
}
}
}
terms.sort(function(a,b){
return a[1].length - b[1].length;
});
this.curInt = {};
for (var p in this.interpretation) {
this.curInt[p] = this.interpretation[p];
}
for (var i=0; i<terms.length; i++) {
var redTerm = this.reduceArguments(terms[i][0]).toString();
if (!(redTerm in this.curInt)) {
terms[i][2] = 0;
this.curInt[redTerm] = 0;
}
}
this.termValues = terms;
}
Model.prototype.isWorldTerm = function(term) {
if (!this.parser.isModal) {
return false;
}
if (term.isArray) {
return this.isWorldTerm(term[0]);
}
return (this.parser.expressionType[term].indexOf("world") > -1);
}
Model.prototype.getMaxValue = function(term, termStr) {
var isWorldTerm = this.isWorldTerm(term);
var domain = isWorldTerm ? this.worlds : this.domain;
var termList = isWorldTerm ? this.worldTerms : this.indivTerms;
var maxValue = domain.length - 1;
var index = termList.indexOf(termStr);
if (index > -1 && index < maxValue) {
maxValue = index;
if (term.isArray) {
for (var i=1; i<term.length; i++) {
if (term[i] >= maxValue) {
maxValue = term[i] + 1;
}
}
}
}
return maxValue;
}
Model.prototype.reduceArguments = function(term) {
if (term.isArray) {
var nterm = this.reduceTerms(term, 1);
nterm.unshift(term[0]);
return nterm;
}
return term;
}
Model.prototype.reduceTerms = function(terms, startIndex) {
var res = [];
for (var i=(startIndex || 0); i<terms.length; i++) {
if (typeof terms[i] == 'number') {
res.push(terms[i]);
}
else if (terms[i].isArray) {
var nterm = this.reduceTerms(terms[i], 1);
nterm.unshift(terms[i][0]);
var ntermStr = nterm.toString();
if (ntermStr in this.curInt) {
res.push(this.curInt[ntermStr]);
}
else {
res.push(nterm);
}
}
else {
if (terms[i] in this.curInt) {
res.push(this.curInt[terms[i]]);
}
else {
res.push(terms[i]);
}
}
}
return res;
}
Model.prototype.iterateTermValues = function() {
for (var i=this.termValues.length-1; i>=0; i--) {
var tv = this.termValues[i];
if (tv[2] === null) {
continue;
}
var redTerm = this.reduceArguments(tv[0]);
var redTermStr = redTerm.toString();
var maxValue = this.getMaxValue(redTerm, redTermStr);
if (tv[2] == maxValue) {
tv[2] = null;
if (!this.interpretation[redTermStr]) {
delete this.curInt[redTermStr];
}
continue;
}
tv[2]++;
this.curInt[redTermStr] = tv[2];
for (var j=0; j<i; j++) {
if (this.termValues[j][2] !== null) {
var rt = this.reduceArguments(this.termValues[j][0]).toString();
this.curInt[rt] = this.termValues[j][2];
}
}
for (var j=i+1; j<this.termValues.length; j++) {
var rt = this.reduceArguments(this.termValues[j][0]).toString();
if (this.curInt[rt] === undefined) {
this.termValues[j][2] = 0;
this.curInt[rt] = 0;
}
else {
this.termValues[j][2] = null;
}
}
if (this.isRedundant()) {
return this.iterateTermValues();
}
return true;
}
return false;
}
Model.prototype.isRedundant = function(checkWorldTerms) {
var terms = checkWorldTerms ? this.worldTerms : this.indivTerms;
var domain = checkWorldTerms ? this.worlds : this.domain;
var unusedEls = domain.copy();
for (var i=0; i<terms.length; i++) {
var term = terms[i];
if (term.indexOf('[') == 0) {
var args = term.slice(1,-1).split(',');
for (var j=1; j<args.length; j++) {
unusedEls.remove(args[j]**1);
}
if (unusedEls.length == 0) break;
}
var val = this.curInt[term];
if (!val || val == unusedEls[0]) {
unusedEls.shift();
if (unusedEls.length == 0) break;
}
if (val > unusedEls[0]) {
return true;
}
}
if (this.isModal && !checkWorldTerms) {
return this.isRedundant(true);
}
return false;
}
Model.prototype.satisfy = function(literal) {
var atom = literal.sub || literal;
this.curInt = this.interpretation;
var nterms = this.reduceTerms(atom.terms);
var redAtom = atom.predicate+nterms.toString();
if (redAtom in this.curInt && thic.curInt[redAtom] != (atom==literal)) {
return false;
}
this.interpretation[redAtom] = (atom==literal);
return true;
}
Model.prototype.simplifyRemainingClauses = function() {
var nclauses = [];
CLAUSELOOP:
for (var i=0; i<this.clauses.length; i++) {
var nclause = [];
for (var j=0; j<this.clauses[i].length; j++) {
var literal = this.clauses[i][j];
var atom = literal.sub || literal;
var nterms = this.reduceTerms(atom.terms);
var redAtomStr = atom.predicate+nterms.toString();
if (redAtomStr in this.curInt) {
if (this.curInt[redAtomStr] == (atom==literal)) {
continue CLAUSELOOP;
}
else {
continue;
}
}
if (atom.terms.toString() != nterms.toString()) {
var redAtom = new AtomicFormula(atom.predicate, nterms);
var nlit = atom == literal ? redAtom : new NegatedFormula(redAtom);
nclause.push(nlit);
}
else nclause.push(literal);
}
nclauses.push(nclause);
}
nclauses.sort(function(a,b) {
if (a.length == 1 && b.length == 1) {
return b[0].string.indexOf('$') - a[0].string.indexOf('$');
}
return a.length - b.length;
});
this.clauses = nclauses;
}
Model.prototype.unitResolve = function(literal) {
var negLiteralString = (literal.sub && literal.sub.string) || '??'+literal.string;
var nclauses = [];
CLAUSELOOP:
for (var i=1; i<this.clauses.length; i++) {
var nclause = [];
for (var j=0; j<this.clauses[i].length; j++) {
if (this.clauses[i][j].string == literal.string) {
continue CLAUSELOOP;
}
if (this.clauses[i][j].string != negLiteralString) {
nclause.push(this.clauses[i][j]);
}
}
nclauses.push(nclause);
}
nclauses.sort(function(a,b) {
if (a.length == 1 && b.length == 1) {
return b[0].string.indexOf('$') - a[0].string.indexOf('$');
}
return a.length - b.length;
});
this.clauses = nclauses;
}
Model.prototype.getCurInt = function(redAtom) {
if (redAtom[0] == '=') {
var terms = redAtom.slice(2,-1).split(',');
if (!isNaN(terms[0]) && !isNaN(terms[1])) {
return terms[0] == terms[1];
}
}
return this.curInt[redAtom];
}
Model.prototype.copy = function() {
var nmodel = new Model();
nmodel.modelfinder = this.modelfinder;
nmodel.parser = this.parser;
nmodel.domain = this.domain;
nmodel.worlds = this.worlds;
nmodel.isModal = this.isModal;
nmodel.interpretation = this.interpretation;
nmodel.termValues = this.termValues;
nmodel.clauses = this.clauses.copyDeep();
nmodel.indivTerms = this.indivTerms;
nmodel.worldTerms = this.worldTerms;
return nmodel;
}
Model.prototype.toHTML = function() {
var str = "<table>";
if (this.parser.isModal) {
function w(num) {
return 'w<sub>'+num+'</sub>';
}
str += "<tr><td align='right'>Worlds: </td><td align='left'>{ ";
str += this.worlds.map(function(n){return w(n)}).join(", ");
str += " }</td></tr>\n";
if (!this.parser.isPropositional) {
str += "<tr><td align='right'>Individuals: </td><td align='left'>{ ";
str += this.domain.join(", ");
str += " }</td></tr>\n";
}
}
else if (!this.parser.isPropositional) {
str += "<tr><td align='right'>Domain: </td><td align='left'>{ ";
str += this.domain.join(", ");
str += " }</td></tr>\n";
}
var extensions = this.getExtensions();
for (var i=0; i<this.modelfinder.constants.length; i++) {
var sym = this.modelfinder.constants[i];
var ext = extensions[sym];
var val = sym == this.parser.w ? w(ext) : ext;
if (sym == this.parser.w) sym = '@';
str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
}
for (var i=0; i<this.modelfinder.funcSymbols.length; i++) {
var sym = this.modelfinder.funcSymbols[i];
var ext = extensions[sym];
if (ext.length > 0 && !ext[0].isArray) {
var val = '{ '+ext.join(',')+' }';
}
else {
var val = '{ '+ext.map(function(tuple) {
return '('+tuple.join(',')+')';
}).join(', ')+' }';
}
str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
}
var isModal = this.parser.isModal;
var R = this.parser.R;
for (var i=0; i<this.modelfinder.predicates.length; i++) {
var sym = this.modelfinder.predicates[i];
if (sym == '=') continue;
var ext = extensions[sym];
var val;
if (!ext.isArray) {
val = ext;
}
else if (ext.length > 0 && !ext[0].isArray) {
if (isModal) ext = ext.map(function(n){return w(n)});
val = '{ '+ext.join(',')+' }';
}
else {
val = '{ '+ext.map(function(tuple) {
if (isModal) {
tuple[tuple.length-1] = w(tuple[tuple.length-1]);
if (sym == R) tuple[0] = w(tuple[0]);
}
return '('+tuple.join(',')+')';
}).join(', ')+' }';
}
if (sym == R && sym != 'R') {
sym = 'Accessibility'
}
str += "<tr><td align='right' class='formula'>" + sym + ": </td><td align='left'>" + val + "</td></tr>\n";
}
str += "</table>";
return str;
}
Model.prototype.getExtensions = function() {
var result = {};
for (var i=0; i<this.modelfinder.constants.length; i++) {
var cons = this.modelfinder.constants[i];
result[cons] = this.interpretation[cons] || 0;
}
var interpretedStrings = Object.keys(this.interpretation);
for (var i=0; i<this.modelfinder.funcSymbols.length; i++) {
var f = this.modelfinder.funcSymbols[i];
result[f] = [];
for (var j=0; j<interpretedStrings.length; j++) {
var expr = interpretedStrings[j];
if (expr.indexOf('['+f+',') == 0) {
var args = expr.slice(1,-1).split(',');
args.shift();
var val = this.interpretation[expr];
result[f].push(args.concat([val]));
}
}
result[f] = this.makeFunctionExtensionTotal(f, result[f]);
}
for (var i=0; i<this.modelfinder.predicates.length; i++) {
var p = this.modelfinder.predicates[i];
result[p] = (this.parser.arities[p] == 0) ? false : [];
for (var j=0; j<interpretedStrings.length; j++) {
var expr = interpretedStrings[j];
if (expr.indexOf(p+'[') == 0) {
var val = this.interpretation[expr];
var args = expr.substr(p.length).slice(1,-1).split(',');
if (args[0] == '') {
result[p] = val;
}
else {
if (!val) continue;
if (args.length == 1) {
result[p].push(args[0]);
}
else {
result[p].push(args);
}
}
}
}
}
return result;
}
Model.prototype.makeFunctionExtensionTotal = function(f, extension) {
var arity = this.parser.arities[f];
var args = Array.getArrayOfZeroes(arity);
var maxValue = this.domain.length - 1;
var maxValues = args.map(function(x){ return maxValue; });
var res = [];
ARGLOOP:
do {
for (var i=0; i<extension.length; i++) {
if (extension[i].slice(0,-1).equals(args)) {
res.push(extension[i]);
continue ARGLOOP;
}
}
res.push(args.concat([0]));
} while (Model.iterateTuple(args, maxValues));
return res;
}
Model.prototype.toString = function() {
return this.toHTML().replace(/<.+?>/g, '');
}
function dictToString(dict) {
var res = '';
var keys = Object.keys(dict);
for (var i=0; i<keys.length; i++) {
res += keys[i]+': '+dict[keys[i]]+'\n';
}
return res;
}
function SenTree(fvTree, parser) {
this.nodes = [];
this.isClosed = (fvTree.openBranches.length == 0);
this.initFormulas = fvTree.prover.initFormulas;
this.initFormulasNonModal = fvTree.prover.initFormulasNonModal;
this.initFormulasNormalized = fvTree.prover.initFormulasNormalized;
this.fvTree = fvTree;
this.parser = parser;
this.fvParser = fvTree.parser;
this.markEndNodesClosed();
this.transferNodes();
this.removeUnusedNodes();
this.replaceFreeVariablesAndSkolemTerms();
if (parser.isModal) this.modalize();
this.findComplementaryNodes();
}
SenTree.prototype.markEndNodesClosed = function() {
for (var i=0; i<this.fvTree.closedBranches.length; i++) {
var branch = this.fvTree.closedBranches[i];
branch.nodes[branch.nodes.length-1].closedEnd = true;
}
}
SenTree.prototype.findComplementaryNodes = function() {
for (var i=0; i<this.fvTree.closedBranches.length; i++) {
var branch = this.fvTree.closedBranches[i];
var lastNode = branch.nodes[branch.nodes.length-1];
while (lastNode.children[0]) lastNode = lastNode.children[0];
var n1 = lastNode;
var n2 = lastNode;
N1LOOP:
while (n1) {
while ((n2 = n2.parent)) {
if (!n2) throw 'wtf'
if ((n1.formula.operator == '??' && n1.formula.sub.string == n2.formula.string)
|| (n2.formula.operator == '??' && n2.formula.sub.string == n1.formula.string)) {
lastNode.closedBy = [n1, n2];
break N1LOOP;
}
};
if (n1.formula.operator == '??' && n1.formula.sub.predicate == '='
&& n1.formula.sub.terms[0].toString() == n1.formula.sub.terms[1].toString()) {
lastNode.closedBy = [n1];
break;
}
n1 = n1.parent;
n2 = lastNode;
}
if (lastNode.closedBy.length == 2 && n1.formula.world != n2.formula.world) {
lastNode.closedBy = null;
var addedNode = this.insertRigidIdentity(n1, n2);
}
}
}
SenTree.prototype.insertRigidIdentity = function(n1, n2) {
var identityNode = n1.formula.operator == '??' ? n2 : n1;
var negIdentityNode = n1.formula.operator == '??' ? n1 : n2;
var targetWorld = negIdentityNode.formula.world;
var newFormula = new AtomicFormula('=', identityNode.formula.terms);
newFormula.world = targetWorld;
var newNode = new Node(newFormula, null, [identityNode]);
this.makeNode(newNode);
newNode.parent = n1;
newNode.children = [];
n1.closedEnd = false;
n1.children = [newNode];
newNode.closedEnd = true;
newNode.closedBy = [newNode, negIdentityNode];
newNode.used = true;
this.nodes.push(newNode);
return newNode;
}
SenTree.prototype.transferNodes = function() {
//
//
this.addInitNodes();
var branches = this.fvTree.closedBranches.concat(this.fvTree.openBranches);
for (var b=0; b<branches.length; b++) {
var par;
for (var n=0; n<branches[b].nodes.length; n++) {
var node = branches[b].nodes[n];
if (node.isSenNode) {
par = node.swappedWith || node;
continue;
}
par = this.transferNode(node, par);
}
}
for (var i=0; i<this.nodes.length; i++) {
var node = this.nodes[i];
if (node.used && node.formula.type == 'doublenegation') {
var par = node;
while (par.children[0] && par.children[0].expansionStep == par.expansionStep) {
par = par.children[0];
}
this.expandDoubleNegation(node, par);
}
if (!node.dneNode) {
for (var j=0; j<node.fromNodes.length; j++) {
var from = node.fromNodes[j];
while (from.dneTo) from = from.dneTo;
node.fromNodes[j] = from;
}
}
}
}
SenTree.prototype.transferNode = function(node, par) {
//
//
var nodeFormula = node.formula;
for (var i=0; i<node.fromNodes.length; i++) {
if (node.fromNodes[i].dneTo) {
node.fromNodes[i] = node.fromNodes[i].dneTo;
}
}
switch (node.fromRule) {
case Prover.alpha : {
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
var f1 = fromFormula.alpha(1);
var f2 = fromFormula.alpha(2);
if (from.biconditionalExpansion) {
node.fromNodes = from.fromNodes;
node.expansionStep = from.expansionStep;
}
if (!nodeFormula.equals(f1.normalize())) node.formula = f2;
else if (!nodeFormula.equals(f2.normalize())) node.formula = f1;
else {
node.formula = (par.expansionStep == node.expansionStep && !par.biconditionalExpansion) ? f2 : f1;
}
this.appendChild(par, node);
var lastNode = node;
if (par.fromNodes[0] && par.fromNodes[0] == from && node.formula == f1) {
this.reverse(par, node);
lastNode = par;
}
return lastNode;
}
case Prover.beta: {
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
var f1 = fromFormula.beta(1);
var f2 = fromFormula.beta(2);
if (!nodeFormula.equals(f1.normalize())) node.formula = f2;
else if (!nodeFormula.equals(f2.normalize())) node.formula = f1;
else {
node.formula = (par.children && par.children.length) ? f2 : f1;
}
if (fromFormula.operator == '???' ||
(fromFormula.operator == '??' && fromFormula.sub.operator == '???')) {
node.biconditionalExpansion = true;
node.used = false;
}
this.appendChild(par, node);
if (par.children.length == 2 && node.formula == f1) {
par.children.reverse();
}
return node;
}
case Prover.gamma: case Prover.delta: {
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
var matrix = fromFormula.matrix || fromFormula.sub.matrix;
if (this.fvTree.prover.s5 && matrix.sub1 &&
matrix.sub1.predicate == this.fvParser.R) {
var newFla = fromFormula.sub ? matrix.sub2.negate() : matrix.sub2;
}
else {
var newFla = fromFormula.sub ? matrix.negate() : matrix;
}
var boundVar = fromFormula.sub ? fromFormula.sub.variable : fromFormula.variable;
if (node.instanceTerm) {
node.formula = newFla.substitute(boundVar, node.instanceTerm);
}
else {
node.formula = newFla;
}
this.appendChild(par, node);
return node;
}
case Prover.modalGamma: {
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
if (fromFormula.sub) {
var newFla = fromFormula.sub.matrix.sub2.negate();
var boundVar = fromFormula.sub.variable;
}
else {
var newFla = fromFormula.matrix.sub2;
var boundVar = fromFormula.variable;
}
node.formula = newFla.substitute(boundVar, node.instanceTerm);
this.appendChild(par, node);
return node;
}
case Prover.modalDelta:
var from = node.fromNodes[0];
var fromFormula = from.formula;
while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
if (node.formula.predicate == this.fvParser.R) {
this.appendChild(par, node);
}
else {
if (fromFormula.sub) {
var newFla = fromFormula.sub.matrix.sub2.negate();
var boundVar = fromFormula.sub.variable;
}
else {
var newFla = fromFormula.matrix.sub2;
var boundVar = fromFormula.variable;
}
node.formula = newFla.substitute(boundVar, node.instanceTerm);
this.appendChild(par, node);
}
return node;
default: {
this.appendChild(par, node);
return node;
}
}
}
SenTree.prototype.addInitNodes = function() {
var branch = this.fvTree.closedBranches.length > 0 ?
this.fvTree.closedBranches[0] : this.fvTree.openBranches[0];
for (var i=0; i<this.initFormulasNonModal.length; i++) {
var node = this.makeNode(branch.nodes[i]);
node.formula = this.initFormulasNonModal[i];
node.used = true;
if (i==0) this.nodes.push(node);
else this.appendChild(this.nodes[i-1], node);
}
}
SenTree.prototype.expandDoubleNegation = function(node, parent) {
var newNode = new Node(node.formula.sub.sub, null, [node]);
this.makeNode(newNode);
newNode.parent = parent;
newNode.children = parent.children;
parent.children = [newNode];
for (var i=0; i<newNode.children.length; i++) {
newNode.children[i].parent = newNode;
}
if (parent.closedEnd) {
parent.closedEnd = false;
newNode.closedEnd = true;
}
newNode.used = node.used;
newNode.dneNode = true;
node.dneTo = newNode;
this.nodes.push(newNode);
}
SenTree.prototype.replaceFreeVariablesAndSkolemTerms = function() {
var substitutions = [];
for (var n=0; n<this.nodes.length; n++) {
var node = this.nodes[n];
for (var i=0; i<substitutions.length; i++) {
var term = substitutions[i][0], repl = substitutions[i][1];
node.formula = node.formula.substitute(term, repl);
}
var skterms = getSkolemTerms(node.formula);
var term;
while ((term = skterms.shift())) {
var isWorldTerm = (term.toString()[0] == '??');
var repl = isWorldTerm ?
this.parser.getNewWorldName(true) : this.parser.getNewConstant();
substitutions.push([term, repl]);
node.formula = node.formula.substitute(term, repl);
skterms = Formula.substituteInTerms(skterms, term, repl);
}
var varMatches = node.formula.string.match(/[????]\d+/g);
if (varMatches) {
for (var j=0; j<varMatches.length; j++) {
var fv = varMatches[j];
if (fv[0] == '??') {
var repl = this.parser.w;
}
else {
var repl = this.parser.getSymbols('individual constant')[0] ||
this.parser.getNewConstant();
}
substitutions.push([fv, repl]);
node.formula = node.formula.substitute(fv, repl);
}
}
}
function getSkolemTerms(formula) {
var skterms = {};
var flas = [formula];
var fla;
while ((fla = flas.shift())) {
if (fla.isArray) {
for (var i=0; i<fla.length; i++) {
if (fla[i].isArray) {
if (fla[i][0][0].match(/[????]/)) {
skterms[fla[i].toString()] = fla[i];
}
else {
flas.unshift(fla[i]);
}
}
else if (fla[i][0].match(/[????]/)) {
skterms[fla[i].toString()] = fla[i];
}
}
}
else if (fla.sub) {
flas.unshift(fla.sub);
}
else if (fla.sub1) {
flas.unshift(fla.sub1);
flas.unshift(fla.sub2);
}
else if (fla.matrix) {
flas.unshift(fla.matrix);
}
else {
flas.unshift(fla.terms);
}
}
return Object.values(skterms);
}
}
SenTree.prototype.removeUnusedNodes = function() {
if (!this.isClosed) return;
for (var i=0; i<this.nodes.length; i++) {
var node = this.nodes[i];
if (node.used) {
var expansion = this.getExpansion(node);
for (var j=0; j<expansion.length; j++) {
if (!expansion[j].biconditionalExpansion) {
expansion[j].used = true;
}
}
}
}
for (var i=0; i<this.nodes.length; i++) {
if (!this.nodes[i].used) {
var ok = this.remove(this.nodes[i]);
if (ok) i--;
}
}
}
SenTree.prototype.modalize = function() {
for (var i=0; i<this.nodes.length; i++) {
var node = this.nodes[i];
node.formula = this.fvParser.translateToModal(node.formula);
if (node.formula.predicate == this.fvParser.R) {
node.formula.string = node.formula.terms[0] + this.fvParser.R
+ node.formula.terms[1];
}
}
}
SenTree.prototype.makeNode = function(node) {
node.parent = null;
node.children = [];
node.isSenNode = true;
return node;
}
SenTree.prototype.appendChild = function(oldNode, newNode) {
if (!newNode.isSenNode) {
newNode = this.makeNode(newNode);
}
newNode.parent = oldNode;
oldNode.children.push(newNode);
if (oldNode.closedEnd) {
oldNode.closedEnd = false;
newNode.closedEnd = true;
}
this.nodes.push(newNode);
return newNode;
}
SenTree.prototype.remove = function(node) {
if (node.isRemoved) return;
if (node.parent.children.length == 1) {
node.parent.children = node.children;
if (node.children[0]) {
node.children[0].parent = node.parent;
node.children[0].instanceTerm = node.instanceTerm;
}
if (node.children[1]) {
node.children[1].parent = node.parent;
node.children[1].instanceTerm = node.instanceTerm;
}
}
else {
if (node.children.length > 1) {
return false;
}
var i = (node == node.parent.children[0]) ? 0 : 1;
if (node.children[0]) {
node.parent.children[i] = node.children[0];
node.children[0].parent = node.parent;
node.children[0].instanceTerm = node.instanceTerm;
}
else node.parent.children.remove(node);
}
this.nodes.remove(node);
node.isRemoved = true;
return true;
}
SenTree.prototype.toString = function() {
return "<table><tr><td align='center' style='font-family:monospace'>"+getTree(this.nodes[0])+"</td</tr></table>";
function getTree(node) {
var recursionDepth = arguments[1] || 0;
if (++recursionDepth > 40) return "<b>...<br>[max recursion]</b>";
var res = (node.used ? '.' : '') + node
+ (node.formula.world ? ' ('+node.formula.world+')' : '')
+ (node.closedEnd ? "<br>x<br>" : "<br>");
if (node.children[1]) {
var tdStyle = "font-family:monospace; border-top:1px solid #999; padding:3px; border-right:1px solid #999";
var td = "<td align='center' valign='top' style='" + tdStyle + "'>";
res += "<table><tr>"+ td + getTree(node.children[0], recursionDepth) +"</td>\n"
+ td + getTree(node.children[1], recursionDepth) + "</td>\n"
+ "</tr></table>";
}
else if (node.children[0]) {
res += getTree(node.children[0], recursionDepth);
}
return res;
}
}
SenTree.prototype.substitute = function(oldTerm, newTerm) {
for (var i=0; i<this.nodes.length; i++) {
this.nodes[i].formula = this.nodes[i].formula.substitute(oldTerm, newTerm);
}
}
SenTree.prototype.reverse = function(node1, node2) {
node2.parent = node1.parent;
node1.parent = node2;
if (node2.parent.children[0] == node1) node2.parent.children[0] = node2;
else node2.parent.children[1] = node2;
node1.children = node2.children;
node2.children = [node1];
if (node1.children[0]) node1.children[0].parent = node1;
if (node1.children[1]) node1.children[1].parent = node1;
if (node2.closedEnd) {
node2.closedEnd = false;
node1.closedEnd = true;
}
node2.swappedWith = node1;
node1.swappedWith = node2;
}
SenTree.prototype.getExpansion = function(node) {
var res = [node];
if (!node.expansionStep) return res;
var par = node.parent;
while (par && par.expansionStep == node.expansionStep) {
res.unshift(par);
par = par.parent;
}
var ch = node.children[0];
while (ch && ch.expansionStep == node.expansionStep) {
res.push(ch);
ch = ch.children[0];
}
if (par) {
for (var i=0; i<par.children.length; i++) {
var sib = par.children[i];
while (sib && sib.expansionStep == node.expansionStep) {
if (!res.includes(sib)) res.push(sib);
sib = sib.children[0];
}
}
}
return res;
}
SenTree.prototype.getCounterModel = function() {
var endNode = null;
for (var i=0; i<this.nodes.length; i++) {
if (this.nodes[i].children.length || this.nodes[i].closedEnd) continue;
endNode = this.nodes[i];
break;
}
if (!endNode) return null;
var model = new Model(this.fvTree.prover.modelfinder, 0, 0);
var node = endNode;
if (this.parser.isModal) {
model.worlds = [0];
model.interpretation['w'] = 0;
}
do {
var fla = node.formula;
while (fla.operator == '??' && fla.sub.operator == '??') {
fla = fla.sub.sub;
}
var atom = (fla.operator == '??') ? fla.sub : fla;
if (!atom.predicate) continue;
var terms = atom.terms.copy();
for (var t=0; t<terms.length; t++) {
if (terms[t].isArray) {
for (var i=1; i<terms[t].length; i++) {
terms.push(terms[t][i]);
}
}
}
terms.sort(function(a,b) {
return a.toString().length - b.toString().length;
});
for (var t=0; t<terms.length; t++) {
var term = terms[t];
var rterm = model.reduceArguments(terms[t]).toString();
if (rterm in model.interpretation) continue;
var domain = this.fvParser.expressionType[term] &&
this.fvParser.expressionType[term].indexOf('world') > -1 ?
model.worlds : model.domain;
domain.push(domain.length);
model.interpretation[rterm] = domain.length-1;
}
if (!model.satisfy(fla)) {
return null;
}
} while ((node = node.parent));
if (model.domain.length == 0) {
model.domain = [0];
}
return model;
}
function TreePainter(senTree, rootAnchor) {
this.paintInterval = 200;
this.branchPadding = window.innerWidth < 500 ? 0 :
window.innerWidth < 800 ? 20 : 30;
this.branchingHeight = 40;
this.tree = senTree;
this.isModal = senTree.parser.isModal;
this.rootAnchor = rootAnchor;
this.rootAnchor.innerHTML = "";
rootAnchor.style.transform = "scale(1)";
this.minX = this.branchPadding/2 - rootAnchor.offsetLeft;
this.scale = 1;
this.curNodeNumber = 0;
this.highlighted = [];
}
TreePainter.prototype.paintTree = function() {
var node = this.getNextUnpaintedNode();
if (!node) {
this.highlightNothing();
return this.finished();
}
var paintNodes = this.tree.getExpansion(node);
for (var i=0; i<paintNodes.length; i++) {
this.paint(paintNodes[i]);
if (paintNodes[i].closedEnd) {
this.paint(this.makeCloseMarkerNode(paintNodes[i]));
}
}
this.highlight(paintNodes, node.fromNodes);
this.paintTimer = setTimeout(function(){
this.paintTree();
}.bind(this), this.paintInterval);
}
TreePainter.prototype.stop = function() {
clearTimeout(this.paintTimer);
}
TreePainter.prototype.finished = function() {
}
TreePainter.prototype.paint = function(node) {
if (!node.parent || node.parent.children.length == 2) {
node.container = this.makeContainer(node);
}
else {
node.container = node.parent.container;
}
node.div = this.makeNodeDiv(node);
node.container.appendChild(node.div);
node.div.style.top = node.container.h + "px";
node.container.h += node.div.offsetHeight + 3;
if (node.isCloseMarkerNode) {
node.container.h += this.branchPadding;
}
if (node.formulaSpan.offsetWidth > node.container.formulaWidth) {
node.container.formulaWidth = node.formulaSpan.offsetWidth + 10;
var n = node;
do {
n.formulaSpan.style.width = node.container.formulaWidth + "px";
n.div.style.left = -node.div.offsetWidth/2 + "px";
n = n.parent;
} while (n && n.container == node.container);
}
else {
node.formulaSpan.style.width = node.container.formulaWidth + "px";
node.div.style.left = -node.container.w/2 + "px";
}
node.container.w = Math.max(node.container.w, node.div.offsetWidth);
var fromSpan = node.div.childNodes[2];
var wOversize = fromSpan.scrollWidth - fromSpan.offsetWidth;
node.container.wOversize = Math.max(node.container.wOversize, wOversize);
this.repositionBranches(node);
this.keepTreeInView();
}
TreePainter.prototype.makeContainer = function(node, nodeId) {
var parContainer = node.parent ? node.parent.container : this.rootAnchor;
var container = document.createElement('div');
parContainer.appendChild(container);
if (node.parent) parContainer.subContainers.push(container);
container.subContainers = [];
container.style.width = "100%";
container.style.position = "absolute";
container.style.left = "0px";
container.style.top = node.parent ? parContainer.h + this.branchingHeight + "px" : "0px";
container.w = container.h = 0;
container.wOversize = 0;
container.str = "{ " + (this.curNodeNumber+1) + " "+node+ " }";
container.formulaClass = 'fla'+this.curNodeNumber;
container.formulaWidth = 0;
return container;
}
TreePainter.prototype.makeNodeDiv = function(node) {
var div = document.createElement('div');
div.className = 'treeNode';
var nodeNumberSpan = document.createElement('span');
nodeNumberSpan.className = 'nodenumber';
if (!node.isCloseMarkerNode) {
node.nodeNumber = ++this.curNodeNumber;
nodeNumberSpan.innerHTML = node.nodeNumber+'.';
}
div.appendChild(nodeNumberSpan);
div.id = 'n'+this.curNodeNumber;
node.formulaSpan = document.createElement('span');
node.formulaSpan.className = 'formula '+node.container.formulaClass;
node.formulaSpan.innerHTML = node.formula.toString();
div.appendChild(node.formulaSpan);
if (this.isModal) {
var worldSpan = document.createElement('span');
worldSpan.className = 'worldlabel';
worldSpan.innerHTML = node.formula.world ? '('+node.formula.world+')' : '';
div.appendChild(worldSpan);
}
var fromSpan = document.createElement('span');
fromSpan.className = 'fromnumbers';
var annot = node.fromNodes.map(function(n) { return n.nodeNumber; });
if (node.fromRule) {
var fromRule = node.fromRule.toString().substr(0,3);
if (!['alp', 'bet', 'gam', 'del', 'mod'].includes(fromRule)) {
fromRule += '.';
if (fromRule == 'equ.') fromRule = 'LL';
annot.push(fromRule);
}
}
fromSpan.innerHTML = annot.length>0 ? "("+annot.join(',')+")" : " ";
div.appendChild(fromSpan);
var painter = this;
if (node.isCloseMarkerNode) {
div.addEventListener("mouseenter", function(e) {
painter.highlight([], node.closedBy);
});
}
else {
div.addEventListener("mouseenter", function(e) {
painter.highlight(painter.tree.getExpansion(node), node.fromNodes);
});
}
div.addEventListener("mouseleave", function(e) {
painter.highlightNothing();
});
return div;
}
TreePainter.prototype.makeCloseMarkerNode = function(closingNode) {
var node = new Node();
node.formula = "<b>x</b>";
node.parent = closingNode;
node.fromNodes = [];
node.children = [];
node.isCloseMarkerNode = true;
node.closedBy = closingNode.closedBy;
return node;
}
TreePainter.prototype.repositionBranches = function(node) {
var par = node.container;
while ((par = par.parentNode).subContainers) {
if (!par.subContainers[1]) continue;
var overlap = this.getOverlap(par);
//log("comparing subcontainers for overlap: " + par.str);
if (overlap) {
var x1 = parseInt(par.subContainers[0].style.left) - Math.ceil(overlap/2);
var x2 = parseInt(par.subContainers[1].style.left) + Math.ceil(overlap/2);
par.subContainers[0].style.left = x1 + "px";
par.subContainers[1].style.left = x2 + "px";
if (par.branchLines) {
for (var i=0; i<par.branchLines.length; i++) {
par.removeChild(par.branchLines[i]);
}
}
var centre = this.isModal ? -8 : 0;
var line1 = this.drawLine(par, centre, par.h, x1+centre, par.h + this.branchingHeight-2);
var line2 = this.drawLine(par, centre, par.h, x2+centre, par.h + this.branchingHeight-2);
par.branchLines = [line1, line2];
}
}
}
TreePainter.prototype.getOverlap = function(par) {
var overlap = 0;
var co1, co2, co1s = [par.subContainers[0]], co2s;
par.__x = 0; par.__y = 0;
while ((co1 = co1s.shift())) {
co2s = [par.subContainers[1]];
while ((co2 = co2s.shift())) {
co1.__x = co1.parentNode.__x + parseInt(co1.style.left);
co1.__y = co1.parentNode.__y + parseInt(co1.style.top);
co2.__x = co2.parentNode.__x + parseInt(co2.style.left);
co2.__y = co2.parentNode.__y + parseInt(co2.style.top);
if ((co1.__y >= co2.__y) && (co1.__y < co2.__y + co2.h) ||
(co2.__y >= co1.__y) && (co2.__y < co1.__y + co1.h)) {
var co1w = co1.w + co1.wOversize;
var co2w = co2.w + co2.wOversize;
var overlap12 = (co1.__x + co1w/2 + painter.branchPadding) - (co2.__x - co2w/2);
overlap = Math.max(overlap, overlap12);
}
co2s = co2s.concat(co2.subContainers);
}
co1s = co1s.concat(co1.subContainers);
}
return Math.floor(overlap);
}
TreePainter.prototype.keepTreeInView = function() {
var mainContainer = this.rootAnchor.firstChild;
if (mainContainer.getBoundingClientRect) {
var midPoint = Math.round(mainContainer.getBoundingClientRect()['left']);
var winTreeRatio = window.innerWidth*1.0/(midPoint*2);
if (winTreeRatio < 1) {
this.scale = Math.max(winTreeRatio, 0.8);
rootAnchor.style.transform="scale("+this.scale+")";
}
}
var minX = this.getMinX();
if (minX < this.minX/this.scale) {
var invisibleWidth = (this.minX/this.scale - minX);
mainContainer.style.left = mainContainer.__x + invisibleWidth + "px";
}
}
TreePainter.prototype.getMinX = function() {
var minX = 0;
var con, cons = [this.rootAnchor.firstChild];
while ((con = cons.shift())) {
con.__x = (con.parentNode.__x || 0) + parseInt(con.style.left);
if (con.__x - con.w/2 < minX) {
minX = con.__x - con.w/2;
}
cons = cons.concat(con.subContainers);
}
return minX;
}
TreePainter.prototype.highlight = function(children, fromNodes) {
while (this.highlighted.length) {
this.highlighted.shift().div.childNodes[1].style.backgroundColor = 'unset';
}
for (var i=0; i<children.length; i++) {
children[i].div.childNodes[1].style.backgroundColor = '#00708333';
}
for (var i=0; i<fromNodes.length; i++) {
fromNodes[i].div.childNodes[1].style.backgroundColor = '#00708366';
}
this.highlighted = children.concat(fromNodes);
}
TreePainter.prototype.highlightNothing = function() {
this.highlight([], []);
}
TreePainter.prototype.drawLine = function(el, x1, y1, x2, y2) {
var a = x1 - x2;
var b = y1 - y2;
var length = Math.sqrt(a*a + b*b);
var sx = (x1 + x2) / 2
var x = sx - length / 2;
var y = (y1 + y2) / 2;
var angle = Math.PI - Math.atan2(-b, a);
var line = document.createElement("div");
var styles = 'border: 1px solid #678; '
+ 'width: ' + length + 'px; '
+ 'height: 0px; '
+ '-moz-transform: rotate(' + angle + 'rad); '
+ '-webkit-transform: rotate(' + angle + 'rad); '
+ '-o-transform: rotate(' + angle + 'rad); '
+ '-ms-transform: rotate(' + angle + 'rad); '
+ 'position: absolute; '
+ 'top: ' + y + 'px; '
+ 'left: ' + x + 'px; ';
line.setAttribute('style', styles);
el.appendChild(line);
return line;
}
TreePainter.prototype.getNextUnpaintedNode = function() {
var nodes = [this.tree.nodes[0]];
var node;
while ((node = nodes.shift())) {
do {
if (!node.div) return node;
if (node.children.length == 2) nodes.unshift(node.children[1]);
} while ((node = node.children[0]));
}
return null;
}
var flaFieldValue = '';
function updateInput() {
var ostr = document.forms[0].flaField.value;
if (ostr == flaFieldValue) {
return true;
}
cposition = this.selectionStart;
flaFieldValue = renderSymbols(ostr);
var diff = ostr.length - flaFieldValue.length
document.forms[0].flaField.value = flaFieldValue;
this.selectionEnd = cposition - diff;
toggleAccessibilityRow();
}
function renderSymbols(str) {
str = str.replace(/&|\^| and/ig, '???');
str = str.replace(/ v | or/ig, ' ??? ');
str = str.replace(/~| not/ig, '??');
str = str.replace(/<->|<=>| iff/ig, '???');
str = str.replace(/->|=>| then/g, '???');
str = str.replace(/\[\]/g, '???');
str = str.replace(/<>|???/g, '???');
str = str.replace(/!|???/g, '???');
str = str.replace(/\?/g, '???');
str = str.replace(/\(A([s-z])\)/g, '???$1');
str = str.replace(/\(E([s-z])\)/g, '???$1');
str = str.replace(/(?:^|\W)\(([s-z])\)/g, '???$1');
str = str.replace(/\\?forall[\{ ]?\}?/g, '???');
str = str.replace(/\\?exists[\{ ]?\}?/g, '???');
str = str.replace(/(\\neg|\\lnot)[\{ ]?\}?/g, '??');
str = str.replace(/(\\vee|\\lor)[\{ ]?\}?/g, '???');
str = str.replace(/(\\wedge|\\land)[\{ ]?\}?/g, '???');
str = str.replace(/(\\to|\\rightarrow)[\{ ]?\}?/g, '???');
str = str.replace(/\\leftrightarrow[\{ ]?\}?/g, '???');
str = str.replace(/\\[Bb]ox[\{ ]?\}?/g, '???');
str = str.replace(/\\[Dd]iamond[\{ ]?\}?/g, '???');
return str;
}
function toggleAccessibilityRow() {
if (/[??????]/.test(document.forms[0].flaField.value)) {
document.getElementById('accessibilitySpan').style.display = 'inline-block';
}
else {
document.getElementById('accessibilitySpan').style.display = 'none';
}


document.forms[0].flaField.insertAtCaret = function(str) {
if (document.selection) {
this.focus();
sel = document.selection.createRange();
sel.text = str;
this.focus();
}
else if (this.selectionStart || this.selectionStart === 0) {
var startPos = this.selectionStart;
var endPos = this.selectionEnd;
var scrollTop = this.scrollTop;
var val = this.value;
this.value = val.substring(0, startPos)+str+val.substring(endPos,val.length);
this.focus();
this.selectionStart = startPos + str.length;
this.selectionEnd = startPos + str.length;
this.scrollTop = scrollTop;
}
else {
this.value += str;
this.focus();
}
}
document.querySelectorAll('.symbutton').forEach(function(el) {
el.onclick = function(e) {
var field = document.forms[0].flaField;
var command = this.innerHTML;
field.insertAtCaret(command);
toggleAccessibilityRow();
}
});
var prover = null;
function startProof() {
var input = document.forms[0].flaField.value;
var parser = new Parser();
try {
var parsedInput = parser.parseInput(input);
}
catch (e) {
if (input.indexOf('v') > -1) {
e += "\nIf you mean disjunction by the letter 'v', put a space on either side.";
}
alert(e);
return false;
}
var premises = parsedInput[0];
var conclusion = parsedInput[1];
var initFormulas = premises.concat([conclusion.negate()]);
document.getElementById("intro").style.display = "none";
document.getElementById("model").style.display = "none";
document.getElementById("rootAnchor").style.display = "none";
document.getElementById("backtostartpage").style.display = "block";
document.getElementById("status").style.display = "block";
document.getElementById("statusmsg").innerHTML = "something went wrong: please email wo@umsu.de and tell me what you did";
document.getElementById("statusbtn").style.display = "block";
document.getElementById("statusbtn").innerHTML = "stop";
var accessibilityConstraints = [];
if (parser.isModal) {
document.querySelectorAll('.accCheckbox').forEach(function(el) {
if (el.checked) {
accessibilityConstraints.push(el.id);
}
});
}
prover = new Prover(initFormulas, parser, accessibilityConstraints);
prover.onfinished = function(treeClosed) {
var conclusionSpan = "<span class='formula'>"+conclusion+"</span>";
if (initFormulas.length == 1) {
var summary = conclusionSpan + " is " + (treeClosed ? "valid." : "invalid.");
}
else {
var summary = premises.map(function(f){
return "<span class='formula'>"+f+"</span>";
}).join(', ') + (treeClosed ? " entails " : " does not entail ") + conclusionSpan + ".";
}
document.getElementById("statusmsg").innerHTML = summary;
document.getElementById("statusbtn").style.display = "none";
var sentree = new SenTree(this.tree, parser);
if (!treeClosed) {
if (this.counterModel) {
document.getElementById("model").style.display = "block";
document.getElementById("model").innerHTML = "<b>Countermodel:</b><br>" +
this.counterModel.toHTML();
}
return;
}
document.getElementById("rootAnchor").style.display = "block";
self.painter = new TreePainter(sentree, document.getElementById("rootAnchor"));
self.painter.finished = function() { addExportButtons(); }
self.painter.paintTree();
}
prover.status = function(txt) {
document.getElementById("statusmsg").innerHTML = txt;
}
setTimeout(function(){
prover.start();
}, 1);
return false;
}
document.getElementById("statusbtn").onclick = function(e) {
var btn = document.getElementById("statusbtn");
if (btn.innerText == 'stop') {
btn.innerText = 'continue';
prover.stop();
}
else {
btn.innerText = 'stop';
prover.start();
}
}
onload = function(e) {
updateInput();
document.forms[0].flaField.onkeyup = updateInput;
document.forms[0].onsubmit = function(e) {
setTimeout(function() {
setHash();
startProof();
}, 1);
return false;
}
if (location.search.startsWith('?f=')) {
location.hash = location.search.substring(3);
hashChange();
}
else if (location.hash.length > 0) {
hashChange();
}
document.forms[0].flaField.focus();
}
var hashSetByScript = false;
function setHash() {
hashSetByScript = true;
var hash = encodeInputToHash(document.forms[0].flaField.value);
if (document.getElementById('accessibilitySpan').style.display != 'none') {
var accessibilityConstraints = [];
document.querySelectorAll('.accCheckbox').forEach(function(el) {
if (el.checked) {
accessibilityConstraints.push(el.id);
}
});
if (accessibilityConstraints.length > 0) {
hash += '||'+accessibilityConstraints.join('|');
}
}
location.hash = hash;
}
window.onhashchange = hashChange;
function hashChange() {
if (hashSetByScript) {
hashSetByScript = false;
return;
}
if (prover) prover.stop();
if (location.hash.length == 0) {
document.getElementById("intro").style.display = "block";
document.getElementById("model").style.display = "none";
document.getElementById("rootAnchor").style.display = "none";
document.getElementById("backtostartpage").style.display = "none";
document.getElementById("status").style.display = "none";
}
else {
var hashparts = location.hash.split('||');
document.forms[0].flaField.value = decodeHashToInput(hashparts[0].substring(1));
var accessibilityConstraints = hashparts[1] ? hashparts[1].split('|') : [];
document.querySelectorAll('.accCheckbox').forEach(function(el) {
el.checked = accessibilityConstraints.includes(el.id);
});
toggleAccessibilityRow();
startProof();
}
}
function encodeInputToHash(input) {
'???';
inputNoSpaces = input.replace(/\s/g, '');
var hash = inputNoSpaces.replace(new RegExp('['+symbols+']', 'g'), function(match) {
return '~'+symbols.indexOf(match);
});
return hash;
}
function decodeHashToInput(hash) {
if (hash.indexOf('%') > -1) {
hash = decodeURIComponent(hash.replace(/\+/g, '%20'));
}
var symbols = ' ??????????????????????????';
return hash.replace(/~./g, function(match) {
return symbols[parseInt(match[1])];
});
}
function addExportButtons() {
var el = document.createElement('div');
el.id = 'exportDiv';
el.style.position = 'absolute';
var treeCoords = getTreeCoords();
el.style.top = (treeCoords.bottom-treeCoords.top)/painter.scale + 'px';
var width = (treeCoords.right-treeCoords.left)/painter.scale;
el.style.width = width+'px';
el.style.left = Math.round(width/-2) +'px'
el.innerHTML = '<button onclick="exportImage()">save as png</button>';
painter.rootAnchor.firstChild.appendChild(el);
}
function getTreeCoords() {
rootCoords = document.getElementById('rootAnchor').getBoundingClientRect();
var treeCoords = {
left: rootCoords.left,
right: rootCoords.right,
top: rootCoords.top,
bottom: rootCoords.bottom
};
document.querySelectorAll('.treeNode').forEach(function(el) {
var coords = el.getBoundingClientRect();
if (coords.left < treeCoords.left) treeCoords.left = Math.round(coords.left);
if (coords.right > treeCoords.right) treeCoords.right = Math.round(coords.right);
if (coords.bottom > treeCoords.bottom) treeCoords.bottom = Math.round(coords.bottom);
});
return treeCoords;
}
function getTreeHTML() {
var root = document.getElementById('rootAnchor');
defaultStyles = {
'DIV' : getDefaultStyle('div'),
'SPAN' : getDefaultStyle('span')
}
document.querySelectorAll('#rootAnchor *').forEach(function(el) {
var computedStyle = window.getComputedStyle(el);
var defaultStyle = defaultStyles[el.tagName];
if (!defaultStyle) return;
for (var i=0; i<computedStyle.length; i++) {
var cssProperty = computedStyle[i];
var cssValue = computedStyle.getPropertyValue(cssProperty);
if (defaultStyle[cssProperty] != computedStyle[cssProperty]) {
el.style[cssProperty] = cssValue;
}
}
});
document.getElementById('exportDiv').style.display = 'none';
var html = root.outerHTML;
document.getElementById('exportDiv').style.display = 'block';
var treeCoords = getTreeCoords();
var width = treeCoords.right - treeCoords.left;
html = html.replace(/id="rootAnchor".+?>/, 'id="rootAnchor" style="position:relative; left:'+(width/2)+'px;">');
return html;
}
function getDefaultStyle(tagName) {
var defaultStyle = {};
var element = document.body.appendChild(document.createElement(tagName));
var computedStyle = window.getComputedStyle(element);
for (var i=0; i < computedStyle.length; i++) {
defaultStyle[computedStyle[i]] = computedStyle[computedStyle[i]];
}
document.body.removeChild(element);
return defaultStyle;
}
function exportImage() {
if (!document.getElementById('localfontstyle')) {
document.getElementsByTagName("head")[0].insertAdjacentHTML(
"beforeend",
'<link rel="stylesheet" id="localfontstyle" href="font.css" onload="exportImage()" type="text/css" />');
return;
}
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var treeCoords = getTreeCoords();
width = treeCoords.right - treeCoords.left;
height = treeCoords.bottom - treeCoords.top;
canvas.width = width;
canvas.height = height;
var tempImg = document.createElement('img');
tempImg.addEventListener('load', function(el) {
ctx.drawImage(el.target, 0, 0);
var dataURL = canvas.toDataURL('image/png');
var downloadLink = document.createElement('a');
downloadLink.setAttribute('download', 'proof.png');
var url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
downloadLink.setAttribute('href', url);
downloadLink.click();
document.body.removeChild(downloadLink);
});
tempImg.addEventListener('error', function(el) {
alert("sorry, this doesn't seem to work in your browser");
});
var html = getTreeHTML();
html = html.replace(/<br>/g, '<br/>');
var style = '';
var cssRules = document.styleSheets[2].cssRules;
for (var i=0; i<cssRules.length; i++) {
style += cssRules[i].cssText;
}
xml = '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">'
xml += '<defs><style>' + style + '</style></defs>';
xml += '<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">'+html+'</div></foreignObject>';
xml += '</svg>'
tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(xml);
}
}// Unlike Tree objects, SenTrees have their nodes really stored in tree form,
// with a root node and children/parent attributes.  Other than that, the nodes
// are the same Node objects as on Tree Branches.

function SenTree(fvTree, parser) {
    // turns fvTree into a textbook tableau
    this.nodes = [];
    this.isClosed = (fvTree.openBranches.length == 0);
    this.initFormulas = fvTree.prover.initFormulas;
    this.initFormulasNonModal = fvTree.prover.initFormulasNonModal;
    this.initFormulasNormalized = fvTree.prover.initFormulasNormalized;
    this.fvTree = fvTree;
    this.parser = parser; // parser for entered formulas
    this.fvParser = fvTree.parser; // parser with added symbols used in fvtree

    this.markEndNodesClosed();
    this.transferNodes();
    log(this.toString());
    this.removeUnusedNodes();
    log(this.toString());
    this.replaceFreeVariablesAndSkolemTerms();
    if (parser.isModal) this.modalize();
    this.findComplementaryNodes();
    log(this.toString());
}

SenTree.prototype.markEndNodesClosed = function() {
    for (var i=0; i<this.fvTree.closedBranches.length; i++) {
        var branch = this.fvTree.closedBranches[i]; 
        branch.nodes[branch.nodes.length-1].closedEnd = true;
    }
}

SenTree.prototype.findComplementaryNodes = function() {
    for (var i=0; i<this.fvTree.closedBranches.length; i++) {
        var branch = this.fvTree.closedBranches[i];
        var lastNode = branch.nodes[branch.nodes.length-1];
        while (lastNode.children[0]) lastNode = lastNode.children[0];
        var n1 = lastNode;
        var n2 = lastNode;
        N1LOOP:
        while (n1) {
            while ((n2 = n2.parent)) {
                if (!n2) throw 'wtf'
                if ((n1.formula.operator == '??' && n1.formula.sub.string == n2.formula.string)
                    || (n2.formula.operator == '??' && n2.formula.sub.string == n1.formula.string)) {
                    lastNode.closedBy = [n1, n2];
                    break N1LOOP;
                }
            };
            if (n1.formula.operator == '??' && n1.formula.sub.predicate == '='
                && n1.formula.sub.terms[0].toString() == n1.formula.sub.terms[1].toString()) {
                lastNode.closedBy = [n1];
                break;
            }
            n1 = n1.parent;
            n2 = lastNode;
        }
        log("complementary nodes: "+n1+", "+n2);
        if (lastNode.closedBy.length == 2 && n1.formula.world != n2.formula.world) {
            lastNode.closedBy = null;
            var addedNode = this.insertRigidIdentity(n1, n2);
        }
    }
}

SenTree.prototype.insertRigidIdentity = function(n1, n2) {
    // In modal trees, a node 'a=b (w)' is regarded as complementary with
    // '??(a=b) (v)'. We need to insert the missing 'a=b (v)' application of
    // Rigid Identity.
    var identityNode = n1.formula.operator == '??' ? n2 : n1;
    var negIdentityNode = n1.formula.operator == '??' ? n1 : n2;
    var targetWorld = negIdentityNode.formula.world;
    var newFormula = new AtomicFormula('=', identityNode.formula.terms);
    newFormula.world = targetWorld;
    var newNode = new Node(newFormula, null, [identityNode]);
    this.makeNode(newNode);
    newNode.parent = n1;
    newNode.children = [];
    n1.closedEnd = false;
    n1.children = [newNode];
    newNode.closedEnd = true;
    newNode.closedBy = [newNode, negIdentityNode];
    newNode.used = true;
    this.nodes.push(newNode);
    return newNode;
}
                                                 
SenTree.prototype.transferNodes = function() {
    // translates the free-variable tableau into sentence tableau and translate
    // all formulas back from negation normal form.
    //
    // If A is a formula and A' its NNF then expanding A' always results in
    // nodes that also correctly expand A, when denormalized. Remember that
    // normalization drives in all negations and converts (bi)conditionals into
    // ~,v,&. For example, |~(BvC)| = |~B|&|~C|. Expanding the NNF leads to |~B|
    // and |~C|. Expanding the original formula ~(BvC) would instead lead to ~B
    // and ~C. So we can construct the senTree by going through each node X on
    // the fvTree, identity the node Y corresponding to X's origin (the node
    // from which X is expanded), expand Y by the senTree rules and mark the
    // result as corresponding to X whenever the result's NNF is X.
    //
    // Exceptions: (1) NNFs remove double negations; so DNE steps have to be
    // reinserted. (2) Biconditionals are replaced by disjunctions of
    // conjunctions in NNF, but the classical senTree rules expand them in one
    // go, so we have to remove the conjunctive formulas.

    log("initializing sentence tableau nodes");

    this.addInitNodes();
    
    // go through all nodes on all branches, denormalize formulas and restore
    // standard order of subformula expansion:
    var branches = this.fvTree.closedBranches.concat(this.fvTree.openBranches);
    for (var b=0; b<branches.length; b++) {
        var par; // here we store the parent node of the present node
        for (var n=0; n<branches[b].nodes.length; n++) {
            var node = branches[b].nodes[n];
            if (node.isSenNode) {
                // node already on sentree
                par = node.swappedWith || node;
                continue;
            }
            // <node> not yet collected, <par> is its (already collected) parent
            log(this.toString());
            par = this.transferNode(node, par);
        }
    }
    // insert double negation elimination steps (best done here, after all alpha
    // steps have been completed):
    for (var i=0; i<this.nodes.length; i++) {
        var node = this.nodes[i];
        if (node.used && node.formula.type == 'doublenegation') {
            var par = node; // par is the node after which we insert the DNE nodes
            while (par.children[0] && par.children[0].expansionStep == par.expansionStep) {
                par = par.children[0];
            }
            this.expandDoubleNegation(node, par);
        }
        if (!node.dneNode) {
            for (var j=0; j<node.fromNodes.length; j++) {
                var from = node.fromNodes[j];
                while (from.dneTo) from = from.dneTo;
                node.fromNodes[j] = from;
            }
        }
    }
}

SenTree.prototype.transferNode = function(node, par) {
    // transfer <node> from fvTree and append it to <par> node on sentree;
    // return next par node.
    //
    // Example: <node> is expanded from ??(A???(B???C)). In the fvTree, the source
    // node has been normalized to A???(B?????C), and <node> is (B?????C). We need to
    // figure out that this is the second node coming from the source node, so
    // that expansions are in the right order (and later references to
    // expansions of <node> reference the correct node). We also need to epand
    // the node as ??(B???C) rather than (B?????C), to undo the normalization.
    //
    // So here's what we do: we first re-apply the rule (e.g. alpha) by which
    // <node> was created to the unnormalized source formula. We then check
    // which of these results, if normalized, equals <node>.formula and
    // overwrite <node>.formula with the unnormalized matching formula.
    
    var nodeFormula = node.formula;

    // adjust fromNodes for double negation elimination:
    for (var i=0; i<node.fromNodes.length; i++) {
        if (node.fromNodes[i].dneTo) {
            log('setting fromNode '+i+' of '+node+' to '+node.fromNodes[i].dneTo);
            node.fromNodes[i] = node.fromNodes[i].dneTo;
        }
    }
    
    switch (node.fromRule) {
    case Prover.alpha : {
        var from = node.fromNodes[0];
        log("transferring "+node+" (alpha from "+from+")");
        var fromFormula = from.formula;
        while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
        var f1 = fromFormula.alpha(1);
        var f2 = fromFormula.alpha(2);
        log("alpha1 "+f1+" alpha2 "+f2);

        // if <from> is the result of a biconditional application, reset
        // fromNodes[0] to the biconditional (A<->B is expanded to A&B | ~A&~B):
        if (from.biconditionalExpansion) {
            node.fromNodes = from.fromNodes;
            node.expansionStep = from.expansionStep;
        }
        
        // We know that <node> comes from the alpha formula <from>; <f1> and
        // <f2> are the two formulas that could legally be derived from <from>.
        // We need to find out which of these corresponds to <node>. [I used to
        // do node.formula = (node.formula.equals(f1.normalize())) ? f1 : f2;
        // but this breaks if f2.normalize() == f1.normalize() and f2 != f1,
        // e.g. in ??((A?????A)?????(??A???????A).]
        
        if (!nodeFormula.equals(f1.normalize())) node.formula = f2;
        else if (!nodeFormula.equals(f2.normalize())) node.formula = f1;
        else {
            // node formula matches both alpha1 and alpha2: if previous node
            // also originates from <from> by the alpha rule, this one must be
            // the second.
            log('both match');
            node.formula = (par.expansionStep == node.expansionStep && !par.biconditionalExpansion) ? f2 : f1;
        }
        this.appendChild(par, node);
        // restore correct order of alpha expansions:
        var lastNode = node;
        if (par.fromNodes[0] && par.fromNodes[0] == from && node.formula == f1) {
            this.reverse(par, node);
            lastNode = par;
        }
        return lastNode;
        
        // <>A = (Ev)(wRv & Av) is expanded to wRv & Av. 
        
    }
        
    case Prover.beta: {
        var from = node.fromNodes[0];
        log("transferring "+node+" (beta from "+from+")");
        var fromFormula = from.formula;
        while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
        var f1 = fromFormula.beta(1);
        var f2 = fromFormula.beta(2);
        log("beta1 "+f1+" beta2 "+f2);
        if (!nodeFormula.equals(f1.normalize())) node.formula = f2;
        else if (!nodeFormula.equals(f2.normalize())) node.formula = f1;
        else {
            // node formula matches both beta1 and beta2: if parent node already
            // has a child, this one is the second:
            node.formula = (par.children && par.children.length) ? f2 : f1;
        }
        // if <node> is the result of a biconditional application, mark it
        // unused for removal (A<->B is expanded to A&B | ~A&~B):
        if (fromFormula.operator == '???' ||
            (fromFormula.operator == '??' && fromFormula.sub.operator == '???')) {
            log('marking '+node+' as unused');
            node.biconditionalExpansion = true;
            node.used = false;
            // NB: after normalizing initNodes, we can't have a fvTree with
            // nodes ??(A&B) and (A<->B) that would be closed with the hidden
            // biconditional expansion node
        }
        this.appendChild(par, node);
        if (par.children.length == 2 && node.formula == f1) {
            log('swapping children because node.formula == beta1');
            par.children.reverse();
        }
        return node;
    }
        
    case Prover.gamma: case Prover.delta: {
        // <node> is the result of expanding a (possibly negated)
        // quantified formula (or a modal formula in S5).
        var from = node.fromNodes[0];
        log("transferring "+node+" (gamma/delta from "+from+")");
        var fromFormula = from.formula;
        while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
        var matrix = fromFormula.matrix || fromFormula.sub.matrix;
        if (this.fvTree.prover.s5 && matrix.sub1 &&
            matrix.sub1.predicate == this.fvParser.R) {
            // in S5, ???x(??wRxvAx) and ???x(wRx???Ax) are expanded directly to Ax;
            // ?????x(??wRxvAx) and ?????x(wRx???Ax) to ??Ax.
            var newFla = fromFormula.sub ? matrix.sub2.negate() : matrix.sub2;
        }
        else {
            var newFla = fromFormula.sub ? matrix.negate() : matrix;
        }
        var boundVar = fromFormula.sub ? fromFormula.sub.variable : fromFormula.variable;
        log(boundVar + ' is instantiated (in '+newFla+') by '+node.instanceTerm);
        if (node.instanceTerm) {
            node.formula = newFla.substitute(boundVar, node.instanceTerm);
        }
        else {
            node.formula = newFla;
        }
        this.appendChild(par, node);
        return node;
    }

    case Prover.modalGamma: {
        // <node> is the result of expanding a ??? or ????? formula.
        var from = node.fromNodes[0];
        log("transferring "+node+" (modalGamma from "+from+")");
        var fromFormula = from.formula;
        while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
        if (fromFormula.sub) { // from = ?????A = ?????v(wRv ??? Av)
            var newFla = fromFormula.sub.matrix.sub2.negate();
            var boundVar = fromFormula.sub.variable;
        }
        else { // from = ???A = ???v(wRv ??? Av)
            var newFla = fromFormula.matrix.sub2;
            var boundVar = fromFormula.variable;
        }
        log(boundVar + ' is instantiated (in '+newFla+') by '+node.instanceTerm);
        node.formula = newFla.substitute(boundVar, node.instanceTerm);
        this.appendChild(par, node);
        return node;
    }

    case Prover.modalDelta: 
        // <node> is the result of expanding a ??? formula ???v(wRv ??? Av) or a ?????
        // formula ?????v(wRv ??? Av); so <node> is either wRv or Av/??Av.
        var from = node.fromNodes[0];
        log("transferring "+node+" (modalDelta from "+from+")");
        var fromFormula = from.formula;
        while (fromFormula.sub && fromFormula.sub.sub) fromFormula = fromFormula.sub.sub;
        if (node.formula.predicate == this.fvParser.R) {
            this.appendChild(par, node);
        }
        else {
            if (fromFormula.sub) { 
                var newFla = fromFormula.sub.matrix.sub2.negate();
                var boundVar = fromFormula.sub.variable;
            }
            else {
                var newFla = fromFormula.matrix.sub2;
                var boundVar = fromFormula.variable;
            }
            node.formula = newFla.substitute(boundVar, node.instanceTerm);
            this.appendChild(par, node);
        }
        return node;
        
    default: {
        this.appendChild(par, node);
        return node;
    }
    }
}

SenTree.prototype.addInitNodes = function() {
    // add initNodes to tree with their original, but demodalized formula
    var branch = this.fvTree.closedBranches.length > 0 ?
        this.fvTree.closedBranches[0] : this.fvTree.openBranches[0];
    
    for (var i=0; i<this.initFormulasNonModal.length; i++) {
        log('adding init node '+branch.nodes[i]);
        var node = this.makeNode(branch.nodes[i]);
        node.formula = this.initFormulasNonModal[i];
        // Tes, we overwrite the node's original (normalized) formula -- don't
        // need it anymore.
        node.used = true; // Even unused init nodes shouldn't be removed.
        if (i==0) this.nodes.push(node);
        else this.appendChild(this.nodes[i-1], node);
    }
}

SenTree.prototype.expandDoubleNegation = function(node, parent) {
    // expand doublenegation node <node>, inserting the new nodes after <parent>
    log("expanding double negation "+node);
    var newNode = new Node(node.formula.sub.sub, null, [node]);
    this.makeNode(newNode);
    newNode.parent = parent;
    newNode.children = parent.children;
    parent.children = [newNode];
    for (var i=0; i<newNode.children.length; i++) {
        newNode.children[i].parent = newNode;
    }
    if (parent.closedEnd) {
        parent.closedEnd = false;
        newNode.closedEnd = true;
    }
    newNode.used = node.used;
    newNode.dneNode = true;
    node.dneTo = newNode;
    this.nodes.push(newNode);
    // if (newNode.formula.sub && newNode.formula.sub.sub) {
    //     // original node was quadruply negated
    //     node.dneTo = this.expandDoubleNegation(newNode);
    // }
    // return node.dneTo;
} 

SenTree.prototype.replaceFreeVariablesAndSkolemTerms = function() {
    log("replacing free variables and skolem terms by new constants");
    // Free variables and skolem terms are replaced by ordinary constants. We
    // want these to appear in a sensible order (first constant should be 'a',
    // etc.). Free variables all begin with '??' (worlds) or '??' (individuals).
    // Skolem terms all look like '??1', '??1(??1,??2..)' (for individuals) or '??1'
    // etc. (for worlds); after unification they can also be nested:
    // '??1(??1,??2(??1),??3..)'. Note that a skolem term can occur inside an
    // ordinary function term, as in expansions of ???xf(x).
    var substitutions = []; // list of [term, replacement] pairs
    for (var n=0; n<this.nodes.length; n++) {
        var node = this.nodes[n];
        log(node)
        // apply existing substitutions:
        for (var i=0; i<substitutions.length; i++) {
            var term = substitutions[i][0], repl = substitutions[i][1];
            node.formula = node.formula.substitute(term, repl);
        }
        log("replaced known variables and skolem terms: "+node);
        // replace additional skolem terms by new constants:
        var skterms = getSkolemTerms(node.formula);
        var term;
        while ((term = skterms.shift())) {
            var isWorldTerm = (term.toString()[0] == '??');
            var repl = isWorldTerm ?
                this.parser.getNewWorldName(true) : this.parser.getNewConstant();
            substitutions.push([term, repl]);
            log("replacing new skolem term "+term+" by "+repl);
            node.formula = node.formula.substitute(term, repl);
            // skolem terms can be nested:
            skterms = Formula.substituteInTerms(skterms, term, repl);
        }
        // replace leftover free variables by (old) constants:
        var varMatches = node.formula.string.match(/[????]\d+/g);
        if (varMatches) {
            for (var j=0; j<varMatches.length; j++) {
                var fv = varMatches[j];
                if (fv[0] == '??') {
                    var repl = this.parser.w;
                }
                else {
                    var repl = this.parser.getSymbols('individual constant')[0] ||
                        this.parser.getNewConstant();
                }
                substitutions.push([fv, repl]);
                log("replacing new variable "+fv+" by "+repl);
                node.formula = node.formula.substitute(fv, repl);
            }
        }
    }
    
    function getSkolemTerms(formula) {
        // return all skolem terms in <formula>, without duplicates
        var skterms = {}; // termstring => term
        var flas = [formula]; // formulas or term lists
        var fla;
        while ((fla = flas.shift())) {
            if (fla.isArray) { // term list, e.g. ['a', ['f','a']]
                for (var i=0; i<fla.length; i++) {
                    if (fla[i].isArray) {
                        if (fla[i][0][0].match(/[????]/)) {
                            skterms[fla[i].toString()] = fla[i];
                        }
                        else {
                            flas.unshift(fla[i]);
                        }
                    }
                    else if (fla[i][0].match(/[????]/)) {
                        skterms[fla[i].toString()] = fla[i];
                    }
                }
            }
            else if (fla.sub) {
                flas.unshift(fla.sub);
            }
            else if (fla.sub1) {
                flas.unshift(fla.sub1);
                flas.unshift(fla.sub2);
            }
            else if (fla.matrix) {
                flas.unshift(fla.matrix);
            }
            else {
                flas.unshift(fla.terms);
            }
        }
        return Object.values(skterms);
    }
}

SenTree.prototype.removeUnusedNodes = function() {
    log("removing unused nodes");
    if (!this.isClosed) return;
    // first, mark all nodes that were added along with used nodes as used:
    for (var i=0; i<this.nodes.length; i++) {
        var node = this.nodes[i];
        if (node.used) {
            var expansion = this.getExpansion(node);
            for (var j=0; j<expansion.length; j++) {
                if (!expansion[j].biconditionalExpansion) {
                    expansion[j].used = true;
                }
            }
        }
    }
    // now remove all unused nodes:
    for (var i=0; i<this.nodes.length; i++) {
        if (!this.nodes[i].used) {
            var ok = this.remove(this.nodes[i]);
            if (ok) i--; // reducing i because remove() removed it from the array
        }
    }
}

SenTree.prototype.modalize = function() {
    // undo standard translation for formulas on the tree
    log("modalizing tree");
    for (var i=0; i<this.nodes.length; i++) {
        var node = this.nodes[i];
        log('modalising '+node.formula);
        node.formula = this.fvParser.translateToModal(node.formula);
        if (node.formula.predicate == this.fvParser.R) {
            node.formula.string = node.formula.terms[0] + this.fvParser.R
                + node.formula.terms[1];
        }
    }
    log(this.toString());
}

SenTree.prototype.makeNode = function(node) {
    node.parent = null;
    node.children = [];
    node.isSenNode = true;
    return node;
}

SenTree.prototype.appendChild = function(oldNode, newNode) {
   log("appending "+newNode+" to "+ oldNode); 
   if (!newNode.isSenNode) {
       newNode = this.makeNode(newNode);
   }
   newNode.parent = oldNode;
   oldNode.children.push(newNode);
   if (oldNode.closedEnd) {
      oldNode.closedEnd = false;
      newNode.closedEnd = true;
   }
   this.nodes.push(newNode);
   return newNode;
}

SenTree.prototype.remove = function(node) {
    if (node.isRemoved) return;
    log("removing " + node + " (parent: " + node.parent + ", children: " + node.children + ")");
    if (node.parent.children.length == 1) {
        node.parent.children = node.children;
        if (node.children[0]) {
            node.children[0].parent = node.parent;
            node.children[0].instanceTerm = node.instanceTerm;
        }
        if (node.children[1]) {
            node.children[1].parent = node.parent;
            node.children[1].instanceTerm = node.instanceTerm;
        }
    }
    else {
        if (node.children.length > 1) {
            log("can't remove a node with two children that itself has a sibling");
            return false;
        }
        var i = (node == node.parent.children[0]) ? 0 : 1;
        if (node.children[0]) {
            node.parent.children[i] = node.children[0];
            node.children[0].parent = node.parent;
            node.children[0].instanceTerm = node.instanceTerm;
        }
        else node.parent.children.remove(node);
    }
    this.nodes.remove(node);
    node.isRemoved = true;
    return true;
}

SenTree.prototype.toString = function() {
    // for debugging only
    return "<table><tr><td align='center' style='font-family:monospace'>"+getTree(this.nodes[0])+"</td</tr></table>";
    function getTree(node) {
        var recursionDepth = arguments[1] || 0;
        if (++recursionDepth > 40) return "<b>...<br>[max recursion]</b>";
        var res = (node.used ? '.' : '') + node
            + (node.formula.world ? ' ('+node.formula.world+')' : '')
            + (node.closedEnd ? "<br>x<br>" : "<br>");
        if (node.children[1]) {
            var tdStyle = "font-family:monospace; border-top:1px solid #999; padding:3px; border-right:1px solid #999";
            var td = "<td align='center' valign='top' style='" + tdStyle + "'>"; 
            res += "<table><tr>"+ td + getTree(node.children[0], recursionDepth) +"</td>\n"
                + td + getTree(node.children[1], recursionDepth) + "</td>\n"
                + "</tr></table>";
        }
        else if (node.children[0]) {
            res += getTree(node.children[0], recursionDepth);
        }
        return res;
    }
}

SenTree.prototype.substitute = function(oldTerm, newTerm) {
    for (var i=0; i<this.nodes.length; i++) {
        log("substituting "+oldTerm+" by "+newTerm+" in "+this.nodes[i].formula);
        this.nodes[i].formula = this.nodes[i].formula.substitute(oldTerm, newTerm);
    }
}

SenTree.prototype.reverse = function(node1, node2) {
   // swaps the position of two immediate successor nodes
   node2.parent = node1.parent;
   node1.parent = node2;
   if (node2.parent.children[0] == node1) node2.parent.children[0] = node2;
   else node2.parent.children[1] = node2;
   node1.children = node2.children;
   node2.children = [node1];
   if (node1.children[0]) node1.children[0].parent = node1;
   if (node1.children[1]) node1.children[1].parent = node1;
   if (node2.closedEnd) {
      node2.closedEnd = false;
      node1.closedEnd = true;
   }
   node2.swappedWith = node1;
   node1.swappedWith = node2;
}

SenTree.prototype.getExpansion = function(node) {
    // returns all nodes that were added to the tree in the same expansion step
    // as <node>. Here we use Node.expansionStep, which is set by
    // Branch.addNode().
    
    var res = [node];

    if (!node.expansionStep) return res; // e.g. dne nodes

    // get ancestors from same rule application:
    var par = node.parent;
    while (par && par.expansionStep == node.expansionStep) {
        res.unshift(par);
        par = par.parent;
    }
    
    // get descendants from same rule application:
    var ch = node.children[0];
    while (ch && ch.expansionStep == node.expansionStep) {
        res.push(ch);
        ch = ch.children[0];
    }
    
    // get siblings from same rule application:
    if (par) {
        for (var i=0; i<par.children.length; i++) {
            var sib = par.children[i];
            while (sib && sib.expansionStep == node.expansionStep) {
                if (!res.includes(sib)) res.push(sib);
                sib = sib.children[0];
            }
        }
    }
    
    return res;
}

SenTree.prototype.getCounterModel = function() {
    // Read off a (canonical) countermodel from an open branch. At this point,
    // the tree is an ordinary, textbook (but non-modal) tableau, without free
    // variables and normalized formulas. (Modalization is best postponed, so
    // that the countermodel for a tree with a 'pw' node (modalized, 'p')
    // assigns to 'p' a set of worlds rather than a truth-value.)

    // This function is currently unused.

    // First, find an open branch:
    var endNode = null;
    for (var i=0; i<this.nodes.length; i++) {
        if (this.nodes[i].children.length || this.nodes[i].closedEnd) continue;
        endNode = this.nodes[i];
        break;
    }
    if (!endNode) return null;
    
    log("creating counterModel from endNode " + endNode);
    var model = new Model(this.fvTree.prover.modelfinder, 0, 0);
   
    // Next we set up the domain and map every term to a number in the
    // domain. Remember that f(a) may denote an individual that is not denoted
    // by any individual constant. A standard canonical model assigns to an
    // n-ary function term f a function F such that for all (t1...tn) for which
    // f(t1...tn) occurs on the branch, F(T1...Tn) = "f(t1...tn)", where Ti is
    // the intepretation of ti (i.e. the string "ti"). For all other arguments
    // not occuring on the branch as arguments of f, the value of F is
    // arbitrary. If we find f(t1...tn) on a branch, we simply set
    // model.interpretation["f(t1...tn)"] to a new element of the domain.  (Note
    // that in a complete canonical tableau, gamma formulas are expanded for all
    // terms on the branch. So if ???x??Gf(x) & Ga is on the branch, then so are
    // ??Gf(a), ??Gf(f(a)), etc.  Open branches on a complete canonical tableaux
    // containing functional terms are therefore often infinite. We never read
    // off countermodels from infinite trees.)

    var node = endNode;
    if (this.parser.isModal) {
        // make sure 'w' is assigned world 0:
        model.worlds = [0];
        model.interpretation['w'] = 0;
    }
    do {
        var fla = node.formula;
        // remove double negations:
        while (fla.operator == '??' && fla.sub.operator == '??') {
            fla = fla.sub.sub;
        }
        var atom = (fla.operator == '??') ? fla.sub : fla;
        if (!atom.predicate) continue;
        var terms = atom.terms.copy();
        for (var t=0; t<terms.length; t++) {
            if (terms[t].isArray) {
                for (var i=1; i<terms[t].length; i++) {
                    terms.push(terms[t][i]);
                }
            }
        }
        terms.sort(function(a,b) {
            return a.toString().length - b.toString().length;
        });
        for (var t=0; t<terms.length; t++) {
            var term = terms[t];
            var rterm = model.reduceArguments(terms[t]).toString();
            if (rterm in model.interpretation) continue;
            var domain = this.fvParser.expressionType[term] &&
                this.fvParser.expressionType[term].indexOf('world') > -1 ?
                model.worlds : model.domain;
            log("adding "+domain.length+" to domain for "+term);
            domain.push(domain.length);
            model.interpretation[rterm] = domain.length-1;
        }
        if (!model.satisfy(fla)) {
            log("!!! model doesn't satisfy "+fla);
            return null;
        }
        log(model.toString());
    } while ((node = node.parent));
    
    if (model.domain.length == 0) {
        model.domain = [0];
    }
    return model;
}


tests = {

    subterms: function() {
        assertEqual(subterms('a').toString(), '[a]');
        assertEqual(subterms(['f','b','b']).toString(), '[[f,b,b],b]');
        assertEqual(subterms(['g',['f',['f','b']]]).toString(), '[[g,[f,[f,b]]],[f,[f,b]],[f,b],b]');
        assertEqual(subterms(['g','??1','??2']).toString(), '[[g,??1,??2]]');
    },

    replaceSubterm: function() {
        assertEqual(replaceSubterm('a', 'a', 'b').toString(), '[b]');
        assertEqual(replaceSubterm('a', 'b', 'a').toString(), '[]');
        assertEqual(replaceSubterm(['f','a','a'], 'a', 'b').toString(), '[[f,b,a],[f,a,b]]');
        assertEqual(replaceSubterm(['f','a'], 'a', ['h','x']).toString(), '[[f,[h,x]]]');
        assertEqual(replaceSubterm(['f',['g','a'],['g',['g','a']]], ['g','a'], ['h','x']).toString(),
                    '[[f,[h,x],[g,[g,a]]],[f,[g,a],[g,[h,x]]]]');
    },

    solvedFormAddEqual: function() {
        var sf = new SolvedForm();
        assertEqual(sf.addEqual('b','b')[0], sf);
        assertEqual(sf.addEqual('a','b').length, 0);
        assertEqual(sf.addEqual('??1','b').length, 1);
        assertEqual(sf.addEqual(['f','??1'],'??1').length, 0);
    },
    
    solvedFormAddGreater: function() {
        var sf = new SolvedForm();
        assertEqual(sf.addGreater('b','b').length, 0);
        assertEqual(sf.addGreater('b','a')[0].inequalities.length, 0);
        assertEqual(sf.addGreater('??1','b')[0].inequalities.length, 1);
        assertEqual(sf.addGreater(['f','??1'],'??1').length, 1);
        assertEqual(sf.addGreater('??1',['f','??1']).length, 0);
    },

    eqProbLrbs: function() {
        // [b=d,c=d] ??? [b]=[c]
        var sols = solveEqualityProblem(['b'], ['c'], [
            new AtomicFormula('=', ['b','d']),
            new AtomicFormula('=', ['c','d'])
        ]);
        assertEqual(sols.length, 1);
    },

    eqProbBeckert98ex1: function() {
        var sols = solveEqualityProblem(['a'], ['c'], [
            new AtomicFormula('=', ['a','??1']),
            new AtomicFormula('=', ['b','c'])
        ]);
        assertEqual(sols.length, 2);
        assert(sols.includes('[??1,b]'));
        assert(sols.includes('[??1,c]'));
    },

    eqProbBeckert98ex2: function() {
        var sols = solveEqualityProblem([['g', ['g', ['g','??1']]]], ['??1'], [
            new AtomicFormula('=', [['f','a'],'a']),
            new AtomicFormula('=', [['g',['g','??1']],['f','a']])
        ]);
        assertEqual(sols.length, 1);
        assertEqual(sols[0], '[??1,[g,[f,a]]]');
    }

}

function solveEqualityProblem(terms1, terms2, equationFormulas) {
    // return list of all substitutions (as strings) that are found to solve the
    // given problem
    var ep = new EqualityProblem();
    for (var i=0; i<equationFormulas.length; i++) {
        ep.equations.push(new Node(equationFormulas[i]));
    }
    ep.terms1 = terms1;
    ep.terms2 = terms2;
    var eps = [ep];
    var solutions = [];
    while ((ep = eps.shift())) {
        var res = ep.nextStep();
        for (var i=0; i<res.length; i++) {
            if (!res[i].nextStep) solutions.push(res[i]);
            else eps.unshift(res[i]);
        }
    }
    var solstrs = solutions.map(function(ep) { return ep.getSubstitution().toString() });
    return solstrs.removeDuplicates();
}

tests = {

    parseAxFxandNegate: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???xFx');
        assertEqual(f.type, 'gamma');
        assertEqual(f.variable, 'x');
        var f2 = f.negate();
        assertEqual(f2.string, '?????xFx');
        assertEqual(f2.type, 'delta');
    },

    substitute: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???x(Fx ??? Fy)');
        var f2 = f.substitute('x', 'z');
        assertEqual(f, f2);
        var f2 = f.substitute('y', 'z');
        assertEqual(f2.string, '???x(Fx ??? Fz)');
        assertEqual(f.string, '???x(Fx ??? Fy)');
    },

    substitute2: function() {
        var parser = new Parser();
        var f = parser.parseFormula('(??Av???Bv)');
        var f2 = f.substitute('v', '??1');
        assertEqual(f2.string, '(??A??1 ??? B??1)');
    },

    substituteComplex: function() {
        var parser = new Parser();
        var f = parser.parseFormula('H(a,b,g(c,c))');
        var f2 = f.substitute('c', ['f','a','b','c'], true);
        assertEqual(f, f2);
        var f2 = f.substitute('c', ['f','a','b','c']);
        assertEqual(f2.string, 'Habg(f(a,b,c),f(a,b,c))');
    },

    normalize: function() {
        var parser = new Parser();
        var f = parser.parseFormula('?????x(Fx ??? Fx)').normalize();
        assertEqual(f, '???x(Fx ??? ??Fx)');
    },

    unify: function() {
        var parser = new Parser();
        var f1 = parser.parseFormula('Ff(a,b)');
        var f2 = parser.parseFormula('F??1');
        var u = Formula.unifyTerms(f1.terms, f2.terms);
        assertEqual(u[0], '??1');
        assertEqual(u[1].toString(), ['f','a','b']);
    },

    unify2: function() {
        var parser = new Parser();
        var f1 = parser.parseFormula('Q(a,g(??1,a),f(??2))');
        var f2 = parser.parseFormula('Q(a,g(f(b),a),??1)');
        var u = Formula.unifyTerms(f1.terms, f2.terms);
        assertEqual(u[0], '??1');
        assertEqual(u[1].toString(), ['f','b']);
        assertEqual(u[2], '??2');
        assertEqual(u[3], 'b');
    },

    unify3: function() {
        var parser = new Parser();
        var f1 = parser.parseFormula('p??1');
        var f2 = parser.parseFormula('pw');
        var u = Formula.unifyTerms(f1.terms, f2.terms);
        assert(u === false);
    }
    
}

tests = {

    setup: function() {
        var parser = new Parser();
        var mf = new ModelFinder([parser.parseFormula('p'), parser.parseFormula('Ff(a,a)')], parser);
        assert(mf.predicates.equals(['p','F']));
        assertEqual(mf.constants.toString(), '[a]');
        assertEqual(mf.funcSymbols.toString(), '[f]');
        assertEqual(mf.model.domain.length, 1);
        assertEqual(mf.model.worlds.length, 0);
    },

    skolemize: function() {
        var parser = new Parser();
        var mf = new ModelFinder([parser.parseFormula('p')], parser);
        var f = parser.parseFormula('???x???y(Fx??????zHxyz)');
        f = f.normalize();
        var sk = mf.skolemize(f);
        assertEqual(sk.toString(), '???x(Fx ??? ???zHxf(x)z)');
    },
    
    skolemize2: function() {
        var parser = new Parser();
        var mf = new ModelFinder([parser.parseFormula('p')], parser);
        var f = parser.parseFormula('???x???y???zHxyz ??? ???v???wGvw');
        f = f.normalize();
        var sk = mf.skolemize(f);
        assertEqual(sk.string, '(???xHxf(x)g(x) ??? ???wGaw)');
    },

    cnf_basic: function() {
        var parser = new Parser();
        var m = new ModelFinder([parser.parseFormula('p')], parser);
        var cnf = m.cnf(parser.parseFormula('p'));
        assertEqual(cnf.toString(), '[[p]]');
        var cnf = m.cnf(parser.parseFormula('??p'));
        assertEqual(cnf.toString(), '[[??p]]');
        var cnf = m.cnf(parser.parseFormula('p???q'));
        assertEqual(cnf.toString(), '[[p,q]]');
        var cnf = m.cnf(parser.parseFormula('p???q'));
        assertEqual(cnf.toString(), '[[p],[q]]');
        var cnf = m.cnf(parser.parseFormula('p???q'));
        assertEqual(cnf.toString(), '[[q,??p]]');
        var cnf = m.cnf(parser.parseFormula('p???q'));
        assertEqual(cnf.toString(), '[[q,??p],[p,??q]]');
        var cnf = m.cnf(parser.parseFormula('??(p???q)'));
        assertEqual(cnf.toString(), '[[??p],[??q]]');
        var cnf = m.cnf(parser.parseFormula('??(p???q)'));
        assertEqual(cnf.toString(), '[[??p,??q]]');
        var cnf = m.cnf(parser.parseFormula('??(p???q)'));
        assertEqual(cnf.toString(), '[[p],[??q]]');
        var cnf = m.cnf(parser.parseFormula('??(p???q)'));
        assertEqual(cnf.toString(), '[[p,q],[??p,??q]]');
        var cnf = m.cnf(parser.parseFormula('????p'));
        assertEqual(cnf.toString(), '[[p]]');
    },

    cnf_sort_and_simplify: function() {
        var parser = new Parser();
        var m = new ModelFinder([parser.parseFormula('p')], parser);
        var cnf = m.cnf(parser.parseFormula('(p???p)'));
        assertEqual(cnf.toString(), '[[p]]');
        var cnf = m.cnf(parser.parseFormula('(p???q)???(p???q)'));
        assertEqual(cnf.toString(), '[[p,q]]');
        var cnf = m.cnf(parser.parseFormula('(p???q)???(q???p)'));
        assertEqual(cnf.toString(), '[[p,q]]');
        var cnf = m.cnf(parser.parseFormula('(p???q)???(q???p???q)'));
        assertEqual(cnf.toString(), '[[p,q]]');
    },
    
    cnf1: function() {
        var parser = new Parser();
        var m = new ModelFinder([parser.parseFormula('p')], parser);
        var cnf = m.cnf(parser.parseFormula('((a???b)???(c???d))???e'));
        assertEqual(cnf.toString(), '[[a,c,e],[a,d,e],[b,c,e],[b,d,e]]');
    },

    cnf2: function() {
        var parser = new Parser();
        var m = new ModelFinder([parser.parseFormula('p')], parser);
        var f = parser.parseFormula('((??F???G)???(B?????W))???((C?????E)???(??T???D))');
        var cnf = m.cnf(f);
        // wolframalpha: CNF (((~F || G) && (B && ~W)) || ((C && ~E) && (~T || D)))
        // var correct = '[[??F,G,C],[??F,G,??E],[??F,G,??T,D],[B,C],[B,??E],[B,??T,D],[??W,C],[??W,??E],[??W,??T,D]]';
        var correct = '[[B,C],[B,??E],[C,??W],[??E,??W],[B,D,??T],[D,??T,??W],[C,G,??F],[G,??E,??F],[D,G,??F,??T]]';
        assertEqual(cnf.toString(), correct);
    },

    cnf3: function() {
        var parser = new Parser();
        var m = new ModelFinder([parser.parseFormula('p')], parser);
        var f = parser.parseFormula("(??Px???((??Py???Pf(xy))???(Qxg(x)???(??Pg(x)?????Rcg(x)))))");
        var cnf = m.cnf(f);
        assertEqual(cnf.toString(), '[[Qxg(x),??Px],[Pf(x,y),??Px,??Py],[??Pg(x),??Px,??Rcg(x)]]');
    },

    tseitinCNF_basic: function() {
        var parser = new Parser();
        var m = new ModelFinder([parser.parseFormula('p')], parser);
        var cnf = m.tseitinCNF(parser.parseFormula('p'));
        assertEqual(cnf.toString(), '[[p]]');
        var cnf = m.tseitinCNF(parser.parseFormula('??p'));
        assertEqual(cnf.toString(), '[[??p]]');
        var cnf = m.tseitinCNF(parser.parseFormula('p???q'));
        assertEqual(cnf.toString(), '[[$],[$,??p],[$,??q],[p,q,??$]]');
        var cnf = m.tseitinCNF(parser.parseFormula('p???q'));
        assertEqual(cnf.toString(), '[[p],[q]]');
        // assertEqual(cnf.toString(), '[[$2],[p,??$2],[q,??$2],[$2,??p,??q]]');
    },
    
    // transformations2: function() {
    //     // example from http://www8.cs.umu.se/kurser/TDBB08/vt98b/Slides4/norm1_4.pdf
    //     var parser = new Parser();
    //     var f = parser.parseFormula('???x(Px???(???y(Py???Pf(x,y)))????????y(Qxy???(Py???Rcy)))');
    //     f = f.normalize();
    //     var mf = new ModelFinder([f], parser);
    //     var cnf = mf.clauses;
    //     assertEqual(cnf.toString(), '[[??Px,??Py,Pf(xy)],[??Px,Qxg(x)],[??Px,??Pg(x),??Rcg(x)]]');
    // },

    simplifyCNF: function() {
        var parser = new Parser();
        var m = new ModelFinder([parser.parseFormula('p')], parser);
        var f = parser.parseFormula(
            '(p ??? q) ??? (q ??? q ??? r) ??? (q ??? r ??? t) ??? (r ??? s) ??? (s ??? r) ??? p '
        );
        var cnf = m.simplifyClauses(m.cnf(f));
        assertEqual(cnf, '[[p],[q,r],[r,s]]');
    },

    simplifyCNF2: function() {
        var parser = new Parser();
        var m = new ModelFinder([parser.parseFormula('p')], parser);
        var f = parser.parseFormula('((p???(Fa???Fb))???(p???(Fc???Fd)))???((q???(Fe???Ff))???(q???(Fg???Fh)))');
        var cnf = m.simplifyClauses(m.cnf(f));
        assertEqual(cnf, '[[p],[q],[Fa,Fc],[Fa,Fd],[Fb,Fc],[Fb,Fd],[Fe,Fg],[Fe,Fh],[Ff,Fg],[Ff,Fh]]');
    },

    tseitin1: function() {
        var parser1 = new Parser();
        var parser2 = new Parser();
        var m1 = new ModelFinder([parser1.parseFormula('p')], parser1);
        var m2 = new ModelFinder([parser2.parseFormula('p')], parser2);
        var f = parser1.parseFormula('((p???q)???r)?????s');
        // var tseitin = parser2.parseFormula('($?????s)???($???(p???q))???($2???($???r))???($3???($2???$3))???$3');
        // [[$3],[$,??p],[$,??q],[$,??$2],[r,??$2],[$2,$3],[$3,s],[p,q,??$],[$2,??$,??r],[??$2,??$3,??s]]
        var res = m1.tseitinCNF(f);
        var tseitin = parser2.parseFormula('($???(p???q))???($2???($???r))???($3???($2?????s))???$3');
        var cnf = m2.cnf(tseitin);
        assertEqual(res.toString(), cnf.toString());
    },

    // tseitin2_fails_because_in_cnf: function() {
    //     var parser = new Parser();
    //     var m = new ModelFinder([parser.parseFormula('p')], parser);
    //     var f = parser.parseFormula('(??(p?????q)???r)?????s');
    //     var res = m.tseitinCNF(f);
    //     assertEqual(res.toString(), '[(p2?????s),(p3?????q),(p4???(p???p3)),(p5?????p4),(p6???(p5???r)),(p7???(p6???p2)),p7]');
    // },

    transformation1: function() {
        var parser = new Parser();
        var mf = new ModelFinder([parser.parseFormula('???x???y(Fx??????zHxyz)')], parser);
        // skolem: Fx & Hxf(x)z
        // tseitin: p & (p<->(Fx & Hxf(x)z)
        // cnf: p & (~p v Fx) & (~p v Hxf(x)z)) & (p v ~Fx v ~Hxf(x)z) 
        //    = p & (~p v Fx) & (~p v Hxf(x)z))
        // assertEqual(mf.clauses.toString(), '[[$xz],[Fx,??$xz],[Hxf(x)z,??$xz]]');
        // but since we don't tseitin expand conjunctions, we should simply get
        // Fx & Hxf(x)z
        assertEqual(mf.clauses.toString(), '[[Fx],[Hxf(x)z]]');
    },

    transformation2: function() {
        var parser = new Parser();
        var f = parser.parseFormula('?????y???x(Fy???Fx)').normalize();
        var mf = new ModelFinder([f], parser);
        // skolem: Fy & ~Ff(y)
        // assertEqual(mf.clauses.toString(), '[[$y],[Fy,??$y],[??$y,??Ff(y)]]');
        assertEqual(mf.clauses.toString(), '[[Fy],[??Ff(y)]]');
    },

    transformation3: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???p');
        f = parser.translateFromModal(f).normalize();
        var mf = new ModelFinder([f], parser);
        //assertEqual(mf.initFormulas.toString(), '[(Rwu???pu)]');
        // assertEqual(mf.clauses.toString(), '[[$],[Rwu,??$],[pu,??$]]');
        assertEqual(mf.clauses.toString(), '[[Rwu],[pu]]');
        assertEqual(parser.expressionType['u'], 'world constant');
    },

    several_inputformulas: function() {
        var parser = new Parser();
        var initflas = [parser.parseFormula('r???p'), parser.parseFormula('q???(r???p)')];
        var m = new ModelFinder(initflas, parser);
        // assertEqual(m.clauses.toString(), '[[$],[$2],[r,??$],[p,??$],[q,??$2]]');
        assertEqual(m.clauses.toString(), '[[r],[p],[q]]');
        initflas.push(parser.parseFormula('Fa'))
        m = new ModelFinder(initflas, parser);
        // assertEqual(m.clauses.toString(), '[[$3],[$4],[Fa],[r,??$3],[p,??$3],[q,??$4]]');
        assertEqual(m.clauses.toString(), '[[r],[p],[q],[Fa]]');
    },

    modelclauses_quantified1: function() {
        var parser = new Parser();
        var initflas = [parser.parseFormula('???xFx')];
        var mf = new ModelFinder(initflas, parser);
        var m = mf.model;
        assertEqual(m.clauses.toString(), '[[F0]]');
        m = new Model(mf, 2, 0);
        assertEqual(m.clauses.toString(), '[[F0],[F1]]');
    },

    modelclauses_quantified2: function() {
        var parser = new Parser();
        var initflas = [parser.parseFormula('???x???yGxy')];
        // skolemized: Gxf(x)
        var mf = new ModelFinder(initflas, parser);
        var m = mf.model;
        assertEqual(m.clauses.toString(), '[[G0f(0)]]');
        m = new Model(mf, 2, 0);
        assertEqual(m.clauses.toString(), '[[G0f(0)],[G1f(1)]]');
        assertEqual(mf.constants.toString(), '[]');
    },

    modelclauses_quantified3: function() {
        var parser = new Parser();
        var initflas = [parser.parseFormula('???x???y(Fx??????zHxyz)')];
        // skolemized: (Fx???Hxf(x)z); tseitin-cnf: [$xz],[Fx,??$xz],[Hxf(x)z,??$xz],[$xz,??Fx,??Hxf(x)z]]');
        var mf = new ModelFinder(initflas, parser);
        var m = mf.model;
        // assertEqual(m.clauses.toString(), '[[$00],[F0,??$00],[H0f(0)0,??$00]]');
        assertEqual(m.clauses.toString(), '[[F0],[H0f(0)0]]');
        m = new Model(mf, 2, 0);
        // var correct = '[[$00],[$01],[$10],[$11],[F0,??$00],[F0,??$01],[F1,??$10],[F1,??$11],[H0f(0)0,??$00],[H0f(0)1,??$01],[H1f(1)0,??$10],[H1f(1)1,??$11]]'
        // reduces to [[F0],[F1],[H0f(0)0],[H0f(0)1],[H1f(1)0],[H1f(1)1]]
        var correct = '[[F0],[F1],[H0f(0)0],[H0f(0)1],[H1f(1)0],[H1f(1)1]]';
        assertEqual(m.clauses.toString(), correct);
    },

    countermodel1: function() {
        var parser = new Parser();
        var mf = new ModelFinder([parser.parseFormula('??p')], parser);
        mf.nextStep();
        var res = mf.nextStep();
        assertEqual(res, true);
        assertEqual(mf.model.toString().trim(), 'p: false');
    },

    countermodel2: function() {
        var parser = new Parser();
        var mf = new ModelFinder([parser.parseFormula('p'), parser.parseFormula('??q')], parser);
        mf.nextStep();
        var res = mf.nextStep();
        assertEqual(res, false);
        res = mf.nextStep();
        assertEqual(res, true);
        assertEqual(mf.model.toString().trim(), 'p: true\nq: false');
    },

    countermodel3: function() {
        var parser = new Parser();
        var mf = new ModelFinder([parser.parseFormula('Ff(a,b)')], parser);
        mf.nextStep();
        var res = mf.nextStep();
        assertEqual(res, true);
        assert(mf.model.toString().indexOf('f: { (0,0,0) }')>0);
        assert(mf.model.toString().indexOf('F: { 0 }')>0);
    },

    countermodel4: function() {
        var parser = new Parser();
        var f = parser.parseFormula('Ff(a)?????Ff(f(a))').normalize();
        var mf = new ModelFinder([f], parser);
        for (var i=0; i<100; i++) {
            if (mf.nextStep()) break;
        }
        assert(mf.model.toString().indexOf('f: { (0,1), (1,0) }')>0);
        assert(mf.model.toString().indexOf('a: 0')>0);
        assert(mf.model.toString().indexOf('F: { 1 }')>0);
    },

    countermodel5: function() {
        var parser = new Parser();
        var mf = new ModelFinder([parser.parseFormula('???xFx')], parser);
        var m = mf.nextStep();
        assert(mf.model.toString().indexOf('F: { 0 }')>0);
    },

    countermodel6: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('Fa ??? ??Fb')];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<100; i++) {
            if (mf.nextStep()) break;
        }
        assertEqual(mf.model.domain.length, 2);
        assert(mf.model.toString().indexOf('F: { 0 }')>0);
    },

    countermodel7: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('???x???yRxy ??? ?????xRxx').normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<100; i++) {
            if (mf.nextStep()) break;
        }
        assertEqual(mf.model.domain.length, 2);
        assert(mf.model.toString().indexOf('R: { (0,1), (1,0) }') > 0);
    },

    countermodel8a: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('(???xFx??????xGx)??????x(Fx???Gx)').negate().normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<800; i++) {
            if (mf.nextStep()) break;
        }
        assert(i<500);
        assertEqual(mf.model.domain.length, 2);
        assert(mf.model.toString().indexOf('F: { 1 }') > 0);
        assert(mf.model.toString().indexOf('G: { 0 }') > 0);
    },

    countermodel8: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('???y???x(Fx???Gx) ??? (???xFx ??? ???xGx)').negate().normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<500; i++) {
            if (mf.nextStep()) break;
        }
        assert(i<500);
        assertEqual(mf.model.domain.length, 2);
        log(mf.model.toString());
        assert(mf.model.toString().indexOf('F: { 0,1 }') > 0);
        // assert(mf.model.toString().indexOf('F: { 1 }') > 0); would do as well
        assert(mf.model.toString().indexOf('G: { 0 }') > 0);
    },

    countermodel9: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('???y???z???x((Fx???Gy)???(Gz???Fx))??????x???y(Fy???Gy)').negate().normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<500; i++) {
            if (mf.nextStep()) break;
        }
        assert(i<500);
        assertEqual(mf.model.domain.length, 2);
        assert(mf.model.toString().indexOf('F: { 1 }') > 0);
        assert(mf.model.toString().indexOf('G: { 0 }') > 0);
    },

    countermodel10: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('p???p').normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<10; i++) {
            if (mf.nextStep()) break;
        }
        assert(i<5);
    },
     
    countermodel_shortestformulawith3individuals: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('???y???x(Ryx ??? ??Rxy)').normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<100; i++) {
            if (mf.nextStep()) break;
        }
        assertEqual(mf.model.domain.length, 3);
    },

    countermodel_shortestformulawith4individuals: function() { 
        var parser = new Parser();
        var fs = [parser.parseFormula('???z???y???x(Rzx ??? ??Rxy)').normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<10000; i++) {
            if (mf.nextStep()) break;
        }
        assert(i<10000);
        assertEqual(mf.model.domain.length, 4);
    },
    
    iterateTermValues: function() {
        // If termValues aren't iterated properly a countermodel is found for this valid formula.
        var parser = new Parser();
        var fs = [parser.parseFormula('Na??????x(Nx???Nf(x))???Nf(f(f(f(f(a)))))').negate().normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<1000; i++) {
            if (mf.nextStep()) break;
        }
        assertEqual(i, 1000);
    },
    
    countermodel_modal1: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('???p'), parser.parseFormula('??p')];
        fs = fs.map(function(f){return parser.translateFromModal(f).normalize()});
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<100; i++) {
            if (mf.nextStep()) break;
        }
        assertEqual(mf.model.worlds.length, 2);
        assert(mf.model.toString().indexOf('@: w0') > 0);
        assert(mf.model.toString().indexOf('R: { (w0,w1) }') > 0);
        assert(mf.model.toString().indexOf('p: { w1 }') > 0);
    },

    countermodel_modal2: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('???p???p')];
        fs = fs.map(function(f){return parser.translateFromModal(f).normalize()});
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<100; i++) {
            if (mf.nextStep()) break;
        }
        assertEqual(mf.model.worlds.length, 1);
        assert(mf.model.toString().indexOf('p: { w0 }') > 0);
    },

    countermodel_modal3: function() {
        var parser = new Parser();
        var fs = [parser.translateFromModal(parser.parseFormula('???p')).normalize(),
                  parser.parseAccessibilityFormula('???v???u(Rvu)')];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<100; i++) {
            if (mf.nextStep()) break;
        }
        assertEqual(mf.model.worlds.length, 1);
        assert(mf.model.toString().indexOf('R: { (w0,w0) }') > 0);
        assert(mf.model.toString().indexOf('p: { w0 }') > 0);
    },

    countermodel_s5: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('???p')];
        fs = fs.map(function(f){
            var f2 = parser.translateFromModal(f).normalize();
            return parser.stripAccessibilityClauses(f2);
        });
        var mf = new ModelFinder(fs, parser, [], true);
        for (var i=0; i<100; i++) {
            if (mf.nextStep()) break;
        }
        assertEqual(mf.model.worlds.length, 1);
        assertEqual(mf.model.toString().indexOf('R:'), -1);
        assert(mf.model.toString().indexOf('p: { w0 }') >= 0);
    },

    totalfunctions1: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('f(a)=a?????Fb').negate().normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<500; i++) {
            if (mf.nextStep()) break;
        }
        assert(mf.model.toString().indexOf('f: { (0,0) }') > 0);
    },

    totalfunctions2: function() {
        var parser = new Parser();
        var fs = [parser.parseFormula('f(a)=a???(Fa?????Fa)???g(a,b)=a').negate().normalize()];
        var mf = new ModelFinder(fs, parser);
        for (var i=0; i<500; i++) {
            if (mf.nextStep()) break;
        }
        assert(mf.model.toString().indexOf('f: { (0,0), (1,0) }') > 0);
        assert(mf.model.toString().indexOf('g: { (0,0,1), (0,1,0), (1,0,0), (1,1,0) }') > 0);
    },

    github_issue_3_chrome: function() {
        var parser = new Parser();
        var f = parser.parseFormula('(((???x(Mx???(???Px????????Px))??????xMx)???(???x(Sx???(???Mx????????Mx))??????xSx))???(???x(Sx???(???Px????????Px))??????xSx))');
        fs = [parser.translateFromModal(f).negate().normalize(),
              parser.parseAccessibilityFormula('???v???uRvu'),
              parser.parseAccessibilityFormula('???v???u???t(Rvu???(Rut???Rvt))'),
              parser.parseAccessibilityFormula('???v???u???t(Rvu???(Rvt???Rut))')];
        var mf = new ModelFinder(fs, parser, [], true);
        for (var i=0; i<1000; i++) {
            if (mf.nextStep()) break;
        }
        assert(i<1000);
        assertEqual(mf.model.worlds.length, 2);
    }

}

tests = {

    parseterms1: function() {
        var parser = new Parser();
        var t = parser.parseTerms('abc', []);
        assertEqual(t.length, 3)
        assertEqual(t[1], 'b')
    },

    parseterms2: function() {
        var parser = new Parser();
        var t = parser.parseTerms('f(a,b,g(c,c))', []);
        assertEqual(t.length, 1)
        assertEqual(t[0].length, 4)
        assertEqual(t[0][0], 'f')
        assertEqual(t[0][1], 'a')
        assertEqual(t[0][3].length, 3)
        assertEqual(t[0][3][0], 'g')
    },

    parsep: function() {
        var parser = new Parser();
        var f = parser.parseFormula('p');
        assertEqual(f.type, 'literal');
        assertEqual(f.toString(), 'p');
    },

    checkArities: function() {
        var parser = new Parser();
        var f = parser.parseFormula('Ff(a)b');
        assertEqual(parser.arities['F'], 2);
        assertEqual(parser.arities['f'], 1);
    },
    
    parseGab: function() {
        var parser = new Parser();
        var f = parser.parseFormula('Gab');
        assertEqual(f.type, 'literal');
        var f2 = parser.parseFormula('G(a,b)');
        assertEqual(f2.type, 'literal');
        assert(f.equals(f2));
    },

    parseF1: function() {
        var parser = new Parser();
        var f = parser.parseFormula('F1');
        assertEqual(f.type, 'literal');
        assertEqual(f.predicate, 'F1');
        assertEqual(f.terms.length, 0);
    },

    parseNonWff: function() {
        var parser = new Parser();
        try {
            parser.parseFormula('???(???x(??Fx???Fy) ??? ???xFx ??? ??????Fa');
            assert(false);
        }
        catch {
            assert(true);
        }
    },
    
    translateFromModal1: function() {
        var parser = new Parser();
        var f = parser.parseFormula('??p');
        var f2 = parser.translateFromModal(f);
        assertEqual(f2.string, '??pw');
    },

    translateFromModal2: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???p');
        var f2 = parser.translateFromModal(f);
        assert(parser.isModal);
        assert(parser.isPropositional);
        assertEqual(f2.string, '???v(Rwv ??? pv)');
    },

    translateFromModal3: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???p???p');
        var f2 = parser.translateFromModal(f);
        assertEqual(parser.arities['p'], 1);
        assertEqual(parser.arities['w'], 0);
        assertEqual(parser.expressionType['w'], 'world constant');
    },

    translateToModal: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???p??????p');
        var f2 = parser.translateFromModal(f);
        var f3 = parser.translateToModal(f2);
        assertEqual(f3.string, '(???p ??? ???p)');
    },

    useRinModalFormula: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???R');
        var prover = new Prover([f], parser, ['symmetry']);
        // should not crash on double use of 'R'
        prover.pauseLength = 0;
        prover.start();
        assert(true);
    },

    parensAroundPremises: function() {
        var parser = new Parser();
        var res = parser.parseInput('(Ff(a,b), p) |= q');
        assertEqual(res[0].length, 2);
    },

    threePremises: function() {
        var parser = new Parser();
        var res = parser.parseInput('Ff(a,b), ???p, (p???q) |= q');
        assertEqual(res[0].length, 3);
    },

    parseK: function() {
        var parser = new Parser();
        var res = parser.parseInput('???(p???q)??????p??????q');
        assertEqual(res[1].string, '(???(p???q) ??? (???p ??? ???q))');
    }

}

tests = {

    // Recall that Prover takes the /negated/ sentence that is to be proved
    // as input; i.e. Prover is really a Refuter.

    noRuleApplication: function() {
        var parser = new Parser();
        var f = parser.parseFormula('p');
        var prover = new Prover([f, f.negate()], parser);
        prover.pauseLength = 0;
        prover.start();
        assertEqual(prover.tree.closedBranches.length, 1);
    },

    pruneBranch: function() {
        var parser = new Parser();
        var f = parser.parseFormula('(??R?????S???((R?????S)???(??R???S))???(Q???P))').normalize();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        assertEqual(prover.tree.closedBranches.length, 2);
    },

    refutepandnotp: function() {
        var parser = new Parser();
        var f = parser.parseFormula('p?????p');
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        assert(prover.tree.openBranches.length == 0);
    },

    prooftest2: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???x(Fx???Fx)').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        assert(prover.tree.openBranches.length == 0);
    },

    prooftest4: function() {
        var parser = new Parser();
        var f = parser.parseFormula('?????y???x(Fy???Fx)');
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        assertEqual(prover.tree.openBranches.length, 0);
    },

    dontMarkUsedNodesUnused: function() {
        // see commit fd1eaff: When the tree for the below input is found to
        // close, some closed branches are removed by pruneBranch. One of these
        // branches was originally closed by expanding an earlier beta node.
        // Before this fix, that beta node was marked unused (and therefore
        // removed from the sentence tree) even though it is also used to close
        // another branch that is not removed. Now I check that a node is
        // really not used anywhere else before marking it as unused in
        // pruneBranch.
        var input = 'Ac, ???x(Ax???Tx), ???x(Mx?????Tx), Mb, ???xIxx, ???x???y(Ixy???Iyx), ???x???y(Ixy???(Ax???Ay)), ???x???y(Ixy???(Mx???My)), ???x???y(Ixy???(Tx???Ty)) |= ??Ibc';
        var parser = new Parser();
        var parsedInput = parser.parseInput(input);
        var premises = parsedInput[0];
        var conclusion = parsedInput[1];
        var initFormulas = premises.concat([conclusion.negate()]);
        var prover = new Prover(initFormulas, parser);
        prover.pauseLength = 0;
        prover.start();
        var nodes = prover.tree.closedBranches[0].nodes;
        for (var i=0; i<nodes.length; i++) {
            if (nodes[i].formula.string == '(??Ac ??? Tc)') {
                assert(nodes[i].used != '');
                return;
            }
        }
        assert(false)
    },

    equality1: function() {
        // checks that termsNode properties in equality problems are
        // adjusted when trees are copied for backtracking
        var parser = new Parser();
        var f = parser.parseFormula('???x(g(x)=f(x) ??? ??(x=a)) ??? ???x(g(f(x))=x) ??? b=c ??? Pg(g(a))b ??? Pac').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        assertEqual(prover.tree.openBranches.length, 0);
        var numUsed = 0;
        var nodes = prover.tree.closedBranches[0].nodes;
        for (var i=0; i<nodes.length; i++) {
            if (nodes[i].used) numUsed++;
        }
        assert(numUsed > 10);
    },    

    modalT: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???p???p').negate();
        ['universality', 'reflexivity'].forEach(function(c) {
            var prover = new Prover([f], parser, [c]);
            prover.pauseLength = 0;
            prover.start();
            assertEqual(prover.tree.openBranches.length, 0);
            var numNodes = c == 'universality' ? 4 : 5;
            assertEqual(prover.tree.closedBranches[0].nodes.length, numNodes);
        });
        var prover = new Prover([f], parser, ['seriality']);
        prover.pauseLength = 0;
        prover.start();
        assertEqual(prover.tree.openBranches.length, 1);
    },    

    modalG1: function() {
        var parser = new Parser();
        var f = parser.parseFormula('??????p?????????p').negate();
        ['universality', 'euclidity'].forEach(function(c) {
            var prover = new Prover([f], parser, [c]);
            prover.pauseLength = 0;
            prover.start();
            assertEqual(prover.tree.openBranches.length, 0);
            var numNodes = c == 'universality' ? 7 : 11;
            assertEqual(prover.tree.closedBranches[0].nodes.length, numNodes);
        });
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        assertEqual(prover.tree.openBranches.length, 1);
    },

    // emil: function() {
    //     var parser = new Parser();
    //     var f = parser.parseFormula('??????A???(??????B?????????(A???B))').negate();
    //     var prover = new Prover([f], parser, ['reflexivity', 'symmetry', 'transitivity']);
    //     prover.pauseLength = 0;
    //     prover.start();
    //     assertEqual(prover.tree.openBranches.length, 0);
    // },    

    noSerialityLoop: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???(p??????q)??????(p??????q)').negate();
        var prover = new Prover([f], parser, ['seriality']);
        prover.pauseLength = 0;
        prover.start();
        assertEqual(prover.tree.openBranches.length, 0);
    },

    invalidtest1: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???x??Ff(ab)').negate(); // old prover says invalid and stops at the double negation!
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        assert(prover.tree.openBranches.length > 0);
    },

    s5_Fails_should_be_able_to_detect_infinite_tree: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???p').negate();
        var prover = new Prover([f], parser, ['universality']);
        prover.pauseLength = 0;
        prover.modelfinder.nextStep = function() { return false; };
        prover.onfinished = function(res) {
            assertEqual(res, 0);
            return true;
        }
        for (var i=0; i<100; i++) {
            prover.stopTimeout = true;
            if (prover.nextStep()) break;
        }
        assert(i<100);
    },
    
    
}

tests = {

    atoa: function() {
        var parser = new Parser();
        var f = parser.parseFormula('A???A').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 3);
    },

    peirce: function() {
        var parser = new Parser();
        var f = parser.parseFormula('((A???B)???A)???A').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 7);
        assertEqual(sentree.nodes[2].children[1].formula.string, 'A');
    },
    
    dne: function() {
        var parser = new Parser();
        var f = parser.parseFormula('??((A?????A)???(A?????A))').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 8);
        assertEqual(sentree.nodes[0].children.length, 1);
    },
    
    dne2: function() {
        var parser = new Parser();
        var f = parser.parseFormula('?????x(Fx??????y??Fy)').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 9);
    },

    dne3: function() {
        // handle triply and quadruply negated formulas
        var parser = new Parser();
        var f = parser.parseFormula('?????????x(Fx???Gx)??????x??(Fx???Gx)').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 21);
    },

    dne4: function() {
        // don't branch for DNE
        var parser = new Parser();
        var f = parser.parseFormula('?????x(Fx???Gx)??????x??(Fx???Gx)').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes[3].children.length, 1);
    },
    
    dne5: function() {
        // expand DNE nodes that are only needed for closing a branch (not in any fromNodes)
        var parser = new Parser();
        var f = parser.parseFormula('????????????p???p').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 6);
    },
    
    dne6: function() {
        var parser = new Parser();
        var f = parser.parseFormula('????????((A???A)???(A???????????A))').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 27);
    },
    
    bicondAndDn: function() {
        var parser = new Parser();
        var f = parser.parseFormula('??(A?????A)').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 7);
        assertEqual(sentree.nodes[0].children[0].children[0].formula.string, 'A');
    },

    emil: function() {
        var parser = new Parser();
        var f = parser.parseFormula('??????A???(??????B?????????(A???B))').negate();
        var prover = new Prover([f], parser, ['reflexivity', 'symmetry', 'transitivity']);
        prover.pauseLength = 0;
        prover.start();
        assertEqual(prover.tree.openBranches.length, 0);
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes.length, 19);
    },    
    
    nicenames: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???y???x(Fy???Fx)').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assertEqual(sentree.nodes[1].formula.string, '?????x(Fa ??? Fx)');
        assertEqual(sentree.nodes[2].formula.string, '??(Fa ??? Fb)');
    },

    catchSkolemTermsInFunctions: function() {
        var parser = new Parser();
        var f = parser.parseFormula('???xFf(x)????????x??F(x)').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assert(sentree.toString().indexOf('Ff(a)')>0);
        assert(sentree.toString().indexOf('??') == -1);
    },

    replaceSkolemTerms: function() {
        var parser = new Parser();
        var f = parser.parseFormula('((???x???yRyx ??? ???x???yByx) ??? ???x???y(Cy??? ??Byx))??????x???y(Cx???Rxy)').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assert(sentree.toString().indexOf('??') == -1);
    },

    replaceNestedSkolemTerms: function() {
        var parser = new Parser();
        var f = parser.parseFormula('(???x???yCxy??????x???y(Cxy???Cyx)??????x???y???z((Cxy???Cyz)???Cxz))??????xCxx').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentreeString = new SenTree(prover.tree, parser).toString();
        assert(sentreeString.indexOf('??') == -1);
        // only need two constants; these should be 'a' and 'c':
        assert(sentreeString.indexOf('a') > 0);
        assert(sentreeString.indexOf('b') > 0);
        assert(sentreeString.match(/cdefgh/) == null);
    },

    removeUnusedBranches: function() {
        var parser = new Parser();
        var f = parser.parseFormula('(???x???y???z((Ixy???Iyz)???Ixz)???((IaW(a)???IbW(b))???(???x???y???z(Ixy???(IzW(x)???IzW(y)))?????Iba)))').negate();
        var prover = new Prover([f], parser);
        prover.pauseLength = 0;
        prover.start();
        var sentree = new SenTree(prover.tree, parser);
        assert(sentree.nodes.length, 15);
    }
    
    // getcountermodel: function() {
    //     var parser = new Parser();
    //     var f = parser.parseFormula('Fa').negate();
    //     var prover = new Prover([f], parser);
    //     prover.pauseLength = 0;
    //     prover.start();
    //     var sentree = new SenTree(prover.tree, parser);
    //     var m = sentree.getCounterModel();
    //     assertEqual(m.domain.length, 1);
    //     assert(m.toString().indexOf('a: 0') > 0);
    // },

    // getcountermodel2: function() {
    //     var parser = new Parser();
    //     var f = parser.parseFormula('Ff(ab)').negate();
    //     var prover = new Prover([f], parser);
    //     prover.pauseLength = 0;
    //     prover.start();
    //     var sentree = new SenTree(prover.tree, parser);
    //     var m = sentree.getCounterModel();
    //     assertEqual(m.domain.length, 3);
    // },
    
    // getcountermodel3: function() {
    //     var parser = new Parser();
    //     var f = parser.parseFormula('p???q').negate();
    //     var prover = new Prover([f], parser);
    //     prover.pauseLength = 0;
    //     prover.start();
    //     var sentenceTree = new SenTree(prover.tree, parser);
    //     var m = sentenceTree.getCounterModel();
    //     assert(m.toString().indexOf('p: true') >= 0);
    //     assert(m.toString().indexOf('q: false') >= 0);
    // },
    
    // getcountermodel4: function() {
    //     var parser = new Parser();
    //     var f = parser.parseFormula('??(p???q)').negate();
    //     var prover = new Prover([f], parser);
    //     prover.pauseLength = 0;
    //     prover.start();
    //     var sentenceTree = new SenTree(prover.tree, parser);
    //     var m = sentenceTree.getCounterModel();
    //     assert(m.toString().indexOf('p: false') >= 0);
    //     assert(m.toString().indexOf('q: true') >= 0);
    // },
    
    // getcountermodelModal1: function() {
    //     var parser = new Parser();
    //     var f = parser.parseFormula('???p').negate();
    //     var prover = new Prover([f], parser);
    //     prover.pauseLength = 0;
    //     prover.start();
    //     var sentenceTree = new SenTree(prover.tree, parser);
    //     var m = sentenceTree.getCounterModel();
    //     assertEqual(m.worlds.length, 2)
    //     assert(m.toString().indexOf('R: { (w0,w1) }') >= 0);
    //     assert(m.toString().indexOf('p: {  }') >= 0);
    // },
    
    // getcountermodelModal2: function() {
    //     var parser = new Parser();
    //     var f = parser.parseFormula('???p').negate();
    //     var prover = new Prover([f], parser);
    //     prover.pauseLength = 0;
    //     prover.start();
    //     var sentenceTree = new SenTree(prover.tree, parser);
    //     var m = sentenceTree.getCounterModel();
    //     assertEqual(m.worlds.length, 1)
    //     assert(m.toString().indexOf('R: {  }') >= 0);
    //     assert(m.toString().indexOf('p: {  }') >= 0);
    // },

    // getcountermodels5: function() {
    //     var parser = new Parser();
    //     var f = parser.parseFormula('???p').negate();
    //     var prover = new Prover([f], parser, ['universality']);
    //     prover.pauseLength = 0;
    //     prover.modelfinder.nextStep = function() { return false; };
    //     prover.start();
    //     var sentenceTree = new SenTree(prover.tree, parser);
    //     var m = sentenceTree.getCounterModel();
    //     assertEqual(m.worlds.length, 2)
    //     assert(m.toString().indexOf('R') == -1);
    //     assert(m.toString().indexOf('p: {  }') >= 0);
    // },
    
    
}

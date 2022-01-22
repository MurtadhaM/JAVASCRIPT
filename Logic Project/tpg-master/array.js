Array.prototype.isArray = true;

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

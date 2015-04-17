export function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
};

export function isObjInArray (arr, obj) {
    var comparableArray = arr.map(obj => JSON.stringify(obj))
    var comparableObj = JSON.stringify(obj);

    return comparableArray.indexOf(comparableObj) >=0 ? true : false;
}
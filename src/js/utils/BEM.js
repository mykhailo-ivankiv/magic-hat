function getBEMPAth(blockData) {
    var base = blockData.b;

    if (typeof(blockData.e) === "string") {
        base += "__" + blockData.e
    }

    return base + " " + blockData.m.map(modifier => {
            var result;
            if (typeof modifier === "string") {
                result = base + "--" + modifier;
            } else {
                result = base + "--" + modifier.name;

                if(modifier.value) {
                    result += "_" + modifier.value;
                }
            }

            return result;
        }).join(" ")
}

var BEM = {
    b(b) {
        return function (elementName, modifiers={}) {
            var e, m;
            if (typeof elementName === "string") {
                e = elementName;
            } else {
                modifiers = elementName || {};
            }

            m = Object.keys(modifiers).filter((modifier) => modifiers[modifier]) || [];

            return getBEMPAth({b, e, m})
        }
    }
}

export default BEM;
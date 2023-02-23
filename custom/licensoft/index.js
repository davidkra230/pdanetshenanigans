const { randomBytes } = require("node:crypto");

exports.decode = (stuff) => {
    let vstuff = [];
    let xstuff = [];
    stuff = stuff.replaceAll("-", "");
    for (let i = 0; i < stuff.length; i++) {
        // off by one, for some reason.
        if (i % 6 == 0) {
            vstuff.splice(i, 1);
        } else {
            vstuff[i] = stuff[i];
        }
    }
    vstuff = vstuff.filter((v) => v != null);
    vstuff = atob(vstuff.join(""));
    xstuff = vstuff;
    xstuff = xstuff.split("\x00");

    return xstuff[2].toString().slice(0, xstuff[1]);
};
exports.encode = (key) => {
    let chars = [];
    let final = [];
    let finalString = "";
    let finalfinal = [];
    for (let i = 0; i < 1; i++) {
        chars.push(randomBytes(1).toString("base64url"));
    }
    for (let i = 0; i < 1; i++) {
        final.push(randomBytes(1).toString("base64url"));
    }
    final.push("\0");
    key.length
        .toString()
        .split()
        .forEach((chr) => {
            final.push(chr);
        });
    final.push("\0");
    final.push(key);
    final.push(chars.join(""));
    finalString = final.join("");
    finalString = btoa(finalString).replaceAll("=", "");
    for (let i = 0; i < finalString.length; i++) {
        if (i % 5 == 0) {
            finalfinal.push(
                randomBytes(1).toString("hex").slice(0, 1) + finalString[i]
            );
        } else {
            finalfinal.push(finalString[i]);
        }
    }
    finalString = finalfinal.join("");
    return finalfinal.join("");
};
exports.verify = (key) => {
    //console.log(exports.decode(key));
    try {
        return exports.decode(key).includes("vld") ? true : false;
    } catch {
        return false;
    }
};

return exports;

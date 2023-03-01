const express = require("express");
const dns2 = require("dns2");
const dns = new dns2();
const { Packet } = dns2;
const dnsServer = dns2.createServer({ udp: true });
const localIp = require("local-ipv4-address");
const prompt = require("prompt-sync")();
const keys = require("./custom/licensoft/index");
const app = express();
app.use(express.text());

var ip = null;
var halt = false;
var doneSetup = { dns: false, web: false };

// keys
//var keyInput = prompt(
//    "[Licensing] If you are an organization enter your key here (individual? press enter): "
//);
//if (
//    keyInput == "\n" ||
//    keyInput == "" ||
//    keyInput == "\r\n" ||
//    keyInput == "\n\r"
//) {
//    console.log("[Licensing] ok cool.");
//} else if (keys.verify(keyInput) == true) {
//    console.log("[Licensing] kthxbye");
//} else {
//    console.log("[Licensing] Invalid?");
//    return;
//}

localIp().then((yessir) => {
    console.log(
        "(If you have a spare router, you can use it for this process. turn it on, connect, and enter your private ip)"
    );
    let input = prompt(
        `Does "${yessir}" look like the correct ip? (enter for yes, or type in the correct ip): `
    );
    if (input == "\n" || input == "" || input == "\r\n" || input == "\n\r") {
        ip = yessir;
        return;
    }
    ip = input;
});

shenaniganHandler = (req, res) => {
    try {
        return atob(req.query.p.slice(1, req.query.p.length))
            .split("r=")[1]
            .split("&")[0];
    } catch {
        res.send();
    }
};

app.get("/android/plus5?.php", (req, res) => {
    try {
        console.log(
            "Authorized with verification token: " + shenaniganHandler(req, res)
        );
        res.send("Q" + btoa(shenaniganHandler(req, res)));
    } catch {
        res.send();
    }
});
app.get("*", (_, res) => {
    switch (_.hostname) {
        // switch fall-through
        case "127.0.0.1":
        case "localhost":
        case "[::1]":
        case "junefabrics.com":
        case "connectivitycheck.gstatic.com":
        /*
            Turi ip ip ip
            Ip ip ip ip tsha ik
        */
        case ip:
            res.send("Everything is functioning!");
            break;
        case _.hostname.includes(".") ? _.hostname : false:
            res.send("You prob forgor 💀 to change back the dns settings.");
            break;
        default:
            res.send();
            break;
    }
});

// iis had me tripped up, nice.
startListening = () => {
    app.listen(80, () => {
        if (halt != true) {
            console.log("Web Server Listening.");
        }
        doneSetup.web = true;
    }).on("error", () => {
        if (halt != true) {
            console.log(
                "The web server failed to start, check if port 80 (http) is in use, if it isn't you can retry with admin privileges."
            );
        }
        halt = true;
        new Promise(() => {}).then();
    });

    dnsServer.listen({ udp: 53 }).then(() => {
        if (halt != true) {
            console.log("DNS Server Listening.");
        }
        doneSetup.dns = true;
    });
    dnsServer.on("error", () => {
        if (halt != true) {
            console.log(
                "Failed to start the DNS server, you could use SysInternals' TcpView to see what's holding you up, restarting with admin privileges may help."
            );
        }
        halt = true;
        new Promise(() => {}).then();
    });
};
var startedTMP = false;
var tempInterval = setInterval(() => {
    if (ip != null) {
        if (startedTMP == false) startListening();
        startedTMP = true;
        if (doneSetup.dns === true && doneSetup.web === true) {
            clearInterval(tempInterval);
            tempInterval = undefined;
            dnsServer.on("request", (request, send, client) => {
                const response = Packet.createResponseFromRequest(request);
                const [question] = request.questions;
                const { name } = question;
                response.answers = [];
                response.answers.push({
                    name,
                    type: Packet.TYPE.A,
                    class: Packet.CLASS.IN,
                    ttl: 1,
                    address: ip,
                });
                send(response);
            });
            console.log(
                '\n\nIf everything has loaded any you have accepted the windows network prompt (if any), use the ip: "' +
                    ip +
                    '" as the dns server to start tinkering.'
            );
        }
    }
}, 25);

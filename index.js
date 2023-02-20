const express = require("express");
const dns2 = require("dns2");
const dns = new dns2();
const { Packet } = dns2;
const dnsServer = dns2.createServer({ udp: true });
const localIp = require("local-ipv4-address");
const app = express();

app.use(express.text());

var ip = null;
localIp().then((yessir) => {
	ip = yessir;
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
			"Cracked with verification token: " + shenaniganHandler(req, res)
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

app.listen(80, () => {
	console.log("Web Server Listening.");
});
dnsServer.listen({ udp: 53 }).then(() => {
	console.log("DNS Server Listening.");
});

var tempInterval = setInterval(() => {
	if (ip != null) {
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
			'If everything has loaded any you have accepted the windows network prompt, use the ip: "' +
				ip +
				'" as the dns server to start tinkering. (high chance of breaking with multiple connections.)'
		);
	}
}, 10);

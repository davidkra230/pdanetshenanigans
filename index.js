const express = require("express")
const dns2 = require("dns2")
const dns = new dns2()
const { Packet } = dns2
const dnsServer = dns2.createServer({ udp: true })
const localIp = require("local-ipv4-address")
const app = express()

app.use(express.text())

var ip = null
localIp().then((yessir)=>{
    ip = yessir
})

shenaniganHandler = (req,res) => {
    try {
        return atob(req.query.p.slice(1, req.query.p.length)).split("r=")[1].split("&")[0]
    } catch {
        res.send()
    }
}

app.get("/android/plus5?.php", (req, res) => {
    try {
        console.log("Cracked with verification token: " + shenaniganHandler(req,res))
        res.send("Q" + btoa(shenaniganHandler(req,res)))
    } catch {
        res.send()
    }
})
app.get("*", (_, res) => {
  res.send("POV: You forgor 💀 to change back the dns settings.")
})


app.listen(80, () => {
    console.log("Web Server Listening.")
})
dnsServer.listen({ udp: 53 }).then(()=>{
    console.log("DNS Server Listening.")
})


var tempInterval = setInterval(()=>{
    if (ip != null) {
        clearInterval(tempInterval)
        tempInterval = undefined
        dnsServer.on('request', (request, send, client) => {
            const response = Packet.createResponseFromRequest(request);
            const [ question ] = request.questions;
            const { name } = question;
            response.answers = []
            response.answers.push({
            name,
            type    : Packet.TYPE.A,
            class   : Packet.CLASS.IN,
            ttl     : 0,
            address : ip,
            });
            send(response);
        });
        console.log("If everything has loaded, use the ip: \""+ip+"\" as the dns server ip to get free pdanet/foxfi.")
    }
},50)
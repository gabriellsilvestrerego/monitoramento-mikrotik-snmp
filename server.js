const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const snmp = require('net-snmp');

// --- CONFIGURAÇÕES ---
const MIKROTIK_IP = "192.168.1.86"; // CONFIRA SE SEU IP AINDA É ESSE!
const COMMUNITY = "public";
const PORT = 3000;


// OIDs para Mikrotik CHR (Geralmente ether1 é o índice 2)
const OID_RX = "1.3.6.1.2.1.2.2.1.10.2";
const OID_TX = "1.3.6.1.2.1.2.2.1.16.2";

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Cria a sessão SNMP
const session = snmp.createSession(MIKROTIK_IP, COMMUNITY);

let prevRx = 0;
let prevTx = 0;
let prevTime = 0;

function lerTrafego() {
    const oids = [OID_RX, OID_TX];

    session.get(oids, function (error, varbinds) {
        if (error) {
            console.error("❌ Erro SNMP: " + error.toString());
            console.error("Dica: Verifique se o IP mudou ou se o SNMP está ativo no Mikrotik.");
        } else {
            // Se o índice estiver errado, o Mikrotik retorna erro "NoSuchInstance"
            if (snmp.isVarbindError(varbinds[0])) {
                console.error("❌ Erro de OID. Tente trocar o final .2 por .1 no código.");
                return;
            }

            let currentRx = parseInt(varbinds[0].value);
            let currentTx = parseInt(varbinds[1].value);
            let currentTime = Date.now();

            if (prevTime !== 0) {
                let timeDiff = (currentTime - prevTime) / 1000; // Segundos

                // Cálculo: (Diferença Bytes * 8) / Tempo / 1 milhão = Mbps
                let speedRx = ((currentRx - prevRx) * 8 / timeDiff) / 1000000;
                let speedTx = ((currentTx - prevTx) * 8 / timeDiff) / 1000000;

                // Proteção contra números negativos ou NaN
                if (speedRx < 0 || isNaN(speedRx)) speedRx = 0;
                if (speedTx < 0 || isNaN(speedTx)) speedTx = 0;

                console.log(`📡 Leitura: Download ${speedRx.toFixed(2)} Mbps | Upload ${speedTx.toFixed(2)} Mbps`);

                io.emit('traffic-data', {
                    time: new Date().toLocaleTimeString(),
                    rx: speedRx.toFixed(2),
                    tx: speedTx.toFixed(2)
                });
            }

            prevRx = currentRx;
            prevTx = currentTx;
            prevTime = currentTime;
        }
    });
}

// Roda a cada 3 segundos
setInterval(lerTrafego, 3000);

server.listen(PORT, () => {
    console.log(`✅ Servidor rodando! Abra no navegador: http://localhost:${PORT}`);
});
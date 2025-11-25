# 📊 Mikrotik Network Telemetry (Real-Time)

Aplicação Fullstack para monitoramento de tráfego de rede (Throughput) em tempo real via protocolo SNMP. O sistema coleta dados de um roteador Mikrotik virtualizado e exibe métricas instantâneas em um Dashboard interativo estilo NOC.

## 🚀 Tecnologias e Arquitetura

* **Backend:** Node.js + `net-snmp` (Coleta UDP na porta 161).
* **Frontend:** HTML5 + ApexCharts (Velocímetros e Gráficos de Área).
* **Comunicação:** WebSockets (`socket.io`) para atualização em tempo real (Push).
* **Infraestrutura:** Mikrotik RouterOS CHR rodando em VirtualBox (Modo Bridge/Layer 2).

## ⚙️ Funcionalidades Técnicas

1.  **Coleta via Polling:** O servidor realiza requisições SNMP a cada 3 segundos.
2.  **Cálculo de Derivada:** O sistema converte os contadores brutos de bytes acumulados em velocidade instantânea (Mbps) utilizando cálculo diferencial.
    > Fórmula: `(BytesAtual - BytesAnterior) * 8 / Tempo`
3.  **Visualização Híbrida:** * **Gauges (Velocímetros):** Para leitura instantânea de Download/Upload.
    * **Area Chart:** Para análise de histórico de tráfego.

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado.
* Um roteador Mikrotik (físico ou virtual) com SNMP habilitado (`public`).

### Passo a Passo
1.  Clone este repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure o IP do seu Mikrotik no arquivo `server.js` (linha 7).
4.  Inicie o servidor:
    ```bash
    node server.js
    ```
5.  Acesse no navegador: `http://localhost:3000`

---
*Projeto desenvolvido para a disciplina de Projeto e Administração de Redes.*

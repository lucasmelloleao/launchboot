require('dotenv').config();
const api = require('./api');
const WebSocket = require('ws');


// Configurações iniciais
const args = process.argv.slice(2);
const SYMBOL = args[0] || process.env.SYMBOL;

const PROFIT = parseFloat(process.env.PROFIT); // Fator de lucro (exemplo: 1.05 para 5%)
const BUY_QTY = parseFloat(process.env.BUY_QTY);

// Conexão WebSocket com Binance
const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${SYMBOL.toLowerCase()}@bookTicker`);

// Variáveis globais
let quantity = 0;
let buyPrice = 0;

let bestAsk = 0;
let bestBid = 0;
let currentPrice = 0;
let initialLoop = false;
let initialPrice = 0;
let gain = 0;
let cont = 0;
let initialTicket = 0;
let endTicket = 0;

// Tratamento de erro do WebSocket
ws.on('error', (err) => {
    console.error('WebSocket Error:', err);
    process.exit(1);
});

// Evento ao receber mensagem do WebSocket
ws.onmessage = async (event) => {
    try {
        const data = JSON.parse(event.data);

        // Atualiza valores
        bestAsk = parseFloat(data.a);
        bestBid = parseFloat(data.b);
        currentPrice = parseFloat(((bestAsk + bestBid) / 2).toFixed(8)); // 8 casas decimais para valores de preço

        cont++;

        if (gain < -0.02){
            cont = 0;
           initialLoop = false;
        }


        // Reinicia o loop se um novo ticket é detectado
        if (data.u > endTicket) {
         cont = 0;
            initialLoop = false;
        }

        // Define os preços iniciais no início do loop
        if (!initialLoop) {
            initialTicket = data.u;
            endTicket = initialTicket + 25000; // Define um intervalo de tempo (15 segundos)
            initialPrice = currentPrice;
            initialLoop = true;
        }

        // Calcula o ganho percentual
        gain = (parseFloat((((currentPrice / initialPrice) - 1) * 100).toFixed(2))); // 2 casas decimais para percentual

        // Exibe informações formatadas
        console.clear();
        console.log(`Contador: ${cont} | Ticket Atual: ${data.u} | Símbolo: ${data.s}`);
        console.log(`Best Ask: ${bestAsk.toFixed(8)} | Best Bid: ${bestBid.toFixed(8)}`);
        console.log(`Preço Inicial: ${initialPrice.toFixed(8)} | Preço Atual: ${currentPrice.toFixed(8)}`);
        console.log(`Ganho (%): ${gain.toFixed(3)}%`);

        // Lógica de compra
        if (quantity === 0) {
            quantity = -1; // Marca como processando compra

            // Simulação de compra (descomentar caso API de compra seja usada)
            // const order = await api.buy(SYMBOL, BUY_QTY);
            // if (order.status !== 'FILLED') {
            //     console.error('Erro ao comprar:', order);
            //     process.exit(1);
            // }
            // quantity = parseFloat(order.executedQty);
            // buyPrice = parseFloat(order.fills[0].price);

            return;
        }

        // Lógica de venda
        if (quantity > 0 && bestBid > (buyPrice * PROFIT)) {
            // Simulação de venda (descomentar caso API de venda seja usada)
            // const order = await api.sell(SYMBOL, quantity);
            // if (order.status !== 'FILLED') {
            //     console.error('Erro ao vender:', order);
            // } else {
            //     console.log(`Vendido às ${new Date()} pelo preço ${order.fills[0].price}`);
            // }
            // process.exit(1);
        }
    } catch (err) {
        console.error('Erro ao processar dados do WebSocket:', err);
        process.exit(1);
    }
};

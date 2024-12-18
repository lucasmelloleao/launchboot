const { exec } = require('child_process');
const path = require('path');

// Função para executar o script .bat passando um parâmetro
const args = process.argv.slice(2);
const SYMBOL = args[0] || process.env.SYMBOL;

const runBotWithSymbol = (symbol) => {
    const batFilePath = path.join(__dirname, 'execute.bat'); // Caminho para o arquivo .bat no mesmo diretório
    const command = `"${batFilePath}" ${symbol}`;  // Montando o comando para chamar o .bat com o parâmetro

    console.log(`Executando o comando: "${command}"...`);

    // Executando o arquivo .bat com o símbolo como argumento
    exec(command, (error, stdout, stderr) => {
        if (error) {
            // Se houver um erro na execução
            console.error(`Erro ao executar o comando: ${error}`);
            return;
        }

        if (stderr) {
            // Se houver erro no stderr
            console.error(`stderr: ${stderr}`);
            return;
        }

        // Caso contrário, exibe a saída do comando
        console.log(`stdout: ${stdout}`);
    });
};

// Chamando a função para executar o script .bat com o símbolo 'BTCUSDT'
runBotWithSymbol(SYMBOL);

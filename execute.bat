@echo off
:: Adiciona o caminho do Node.js (se necessário)


:: Recebe o parâmetro passado e executa o comando
set SYMBOL=%1

echo Executando o bot com o par: %SYMBOL%



:: Executa o comando 'yarn start' com o símbolo passado como argumento
::node index.js %SYMBOL%

node index.js ETHUSDT

node index.js BTCUSDT

pause
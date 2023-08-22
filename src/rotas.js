const express = require('express');
const { listaContas, criarContaBancaria, atualizarUsuario, excluirConta, depositar, sacar, transferir, consultarSaldo, extrato } = require('./controladores/contas');
const { validarSenha, senhaSaldo, senhaSacar, senhaTransferir } = require('./intermediarios');
const rotas = express();

rotas.get('/contas', validarSenha, listaContas);
rotas.post('/contas', criarContaBancaria);
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', senhaSacar, sacar);
rotas.post('/transacoes/transferir', senhaTransferir, transferir);
rotas.get('/contas/saldo', senhaSaldo, consultarSaldo);
rotas.get('/contas/extrato', senhaSaldo, extrato);



module.exports = rotas
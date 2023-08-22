let { contas, depositos, saques, transferencias } = require('../bancodedados');
let numeroUnico = 1;
const { format } = require('date-fns')


const listaContas = (req, res) => {
    if (contas.length === 0) {
        return res.status(200).json({ mensagem: "Nenhuma conta encontrada." })
    }
    return res.status(200).json(contas)
};


const criarContaBancaria = (req, res) => {
    const { nome, email, cpf, data_nascimento, telefone, senha } = req.body;
    if (!nome) {
        return res.status(400).json({ mensagem: "O nome é obrigatório." })
    } if (!email) {
        return res.status(400).json({ mensagem: "O email é obrigatório." })
    } if (!cpf) {
        return res.status(400).json({ mensagem: "O CPF é obrigatório." })
    } if (!data_nascimento) {
        return res.status(400).json({ mensagem: "A data de nascimento é obrigatória." })
    } if (!telefone) {
        return res.status(400).json({ mensagem: "O telefone é obrigatório." })
    } if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória." })
    }

    const encontrarEmail = contas.find((conta) => {
        return conta.usuario.email === email;
    });

    if (encontrarEmail) {
        return res.status(400).json({ mensagem: "Email já cadastrado." })
    };

    const encontrarCpf = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });

    if (encontrarCpf) {
        return res.status(400).json({ mensagem: "CPF já cadastrado." })
    };
    const novaConta = {
        numero: `${numeroUnico++}`,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }

    };

    contas.push(novaConta);
    res.status(201).json(novaConta)
};

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!numeroConta) {
        return res.status(400).json({ mensagem: "O numero da conta é obrigatório." })
    };

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: "É obrigatório informar pelo menos um campo para ser atualizado. " })
    };


    if (email) {
        if (encontrarNumeroConta.usuario.email === email) {
            return res.status(400).json({ mensagem: "Esse email já está registrado em nosso sistema." })
        };
        encontrarNumeroConta.usuario.email = email;
    };

    if (cpf) {
        if (encontrarNumeroConta.usuario.cpf === cpf) {
            return res.status(400).json({ mensagem: "Esse CPF já está registrado em nosso sistema." })
        };
        encontrarNumeroConta.usuario.cpf = cpf;
    };


    if (nome) {
        encontrarNumeroConta.usuario.nome = nome;
    } if (data_nascimento) {
        encontrarNumeroConta.usuario.data_nascimento = data_nascimento;
    } if (telefone) {
        encontrarNumeroConta.usuario.telefone = telefone;
    } if (senha) {
        encontrarNumeroConta.usuario.senha = senha;
    }

    return res.status(200).json({ mensagem: 'alteração feita com sucesso.' });

};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const encontrarNumeroConta = contas.find((conta) => {
        return conta.numero === numeroConta;
    });

    if (!encontrarNumeroConta) {
        return res.status(404).json({ mensagem: "Numero de conta não encontrado." })
    };
    if (encontrarNumeroConta.saldo > 0) {
        return res.status(400).json({ mensagem: "Não é possível excluir uma conta com saldo bancário." })
    };

    const indiceConta = contas.indexOf(encontrarNumeroConta);
    contas.splice(indiceConta, 1);

    return res.status(200).json({ mensagem: "Conta removida com sucesso." })
};

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: "Por favor, informe o número da conta. " })
    }; if (!valor) {
        return res.status(400).json({ mensagem: "Por favor, adicione um valor para deposito. " })
    }; if (valor < 1) {
        return res.status(400).json({ mensagem: "O valor informado não é válido." })
    }

    const encontrarNumeroConta = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!encontrarNumeroConta) {
        return res.status(404).json({ mensagem: "Numero de conta não encontrado." })
    };

    encontrarNumeroConta.saldo += valor;
    const data = new Date()
    const extratoDeposito = {
        data: format(data, "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    };

    depositos.push(extratoDeposito)

    return res.status(200).json({ mensagem: "Depósito realizado com sucesso" });

};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    if (!valor) {
        return res.status(400).json({ mensagem: "Por favor, informe o valor de saque." })
    } if (!senha) {
        return res.status(400).json({ mensagem: "Por favor, informe a senha para efetuar o saque." })
    }

    const encontrarNumeroConta = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!encontrarNumeroConta) {
        return res.status(404).json({ mensagem: "Numero de conta não encontrado." })
    };

    if (valor > encontrarNumeroConta.saldo) {
        return res.status(400).json({ mensagem: "O valor informado é maior que o saldo que você possui em conta." })
    };
    if (valor < 0) {
        return res.status(400).json({ mensagem: "Não é possivel sacar esse valor." })
    };

    encontrarNumeroConta.saldo -= valor;
    const data = new Date();
    const extratoSaque = {
        data: format(data, "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    };

    saques.push(extratoSaque)

    res.status(200).json({ mensagem: "Saque realizado com sucesso." })

};
const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: "O numero da conta de origem é obrigatório." });
    }; if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: "O numero da conta de destino é obrigatório." });
    }; if (!valor) {
        return res.status(400).json({ mensagem: "Por favor, nos diga qual valor gostaria de transferir." });
    }; if (!senha) {
        return res.status(400).json({ mensagem: "Por favor, nos diga qual é a senha da sua conta." });
    };

    const encontrarNumeroContaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem;
    });

    const encontrarNumeroContaDestino = contas.find((conta) => {
        return conta.numero === numero_conta_destino;
    });

    if (!encontrarNumeroContaOrigem) {
        return res.status(400).json({ mensagem: "Dei uma olhada aqui e não encontrei essa conta de origem." })
    }; if (!encontrarNumeroContaDestino) {
        return res.status(400).json({ mensagem: "Dei uma olhada aqui e não encontrei essa conta de destino." })
    };

    if (valor > encontrarNumeroContaOrigem.saldo) {
        return res.status(400).json({ mensagem: "O valor informado é maior que o saldo que você possui em conta." })
    };
    if (valor < 0) {
        return res.status(400).json({ mensagem: "Não é possivel transferir esse valor." })
    };

    encontrarNumeroContaOrigem.saldo -= valor;
    encontrarNumeroContaDestino.saldo += valor;
    const data = new Date();
    const extratoTransferencia = {
        data: format(data, "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };

    transferencias.push(extratoTransferencia);
    return res.status(200).json({ mensagem: "Transferência feita com sucesso." })

};

const consultarSaldo = (req, res) => {
    const { numero_conta } = req.query;
    if (!numero_conta) {
        return res.status(400).json({ mensagem: "O numero da conta é obrigatório." })
    };

    const encontrarNumeroConta = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!encontrarNumeroConta) {
        return res.status(404).json({ mensagem: "O numero da conta não foi encontrado." })
    };

    const saldo = encontrarNumeroConta.saldo


    return res.status(200).json({ saldo })

};

const extrato = (req, res) => {
    const { numero_conta } = req.query;
    if (!numero_conta) {
        return res.status(400).json({ mensagem: "O numero da conta é obrigatório." })
    };
    const encontrarNumeroConta = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!encontrarNumeroConta) {
        return res.status(404).json({ mensagem: "O numero da conta não foi encontrado." })
    };

    const transferenciaEnviada = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta;
    });
    const transferenciaRecebida = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;
    });

    const extratoSaques = saques.filter((saque) => {
        return saque.numero_conta === numero_conta;
    });

    const extratoDepositos = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta;
    });



    return res.json({ depositos: extratoDepositos, saques: extratoSaques, transferenciaEnviada: transferenciaEnviada, transferenciaRecebida: transferenciaRecebida });
};


module.exports = {
    listaContas,
    criarContaBancaria,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    extrato
}
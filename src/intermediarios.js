const { banco, contas } = require('./bancodedados')


const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query

    if (!senha_banco) {
        return res.status(401).json({ mensagem: "Senha não informada." })
    };
    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta.' })
    };

    next()

};

const senhaSaldo = (req, res, next) => {
    const { senha, numero_conta } = req.query;

    const encontrarConta = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!senha && !encontrarConta) {
        return res.status(401).json({ mensagem: "Senha não informada." });
    };

    if (!encontrarConta) {
        return res.status(400).json({ mensagem: "Numero de conta não encontrado." })
    };

    if (encontrarConta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    };

    next();
};

const senhaSacar = (req, res, next) => {
    const { senha, numero_conta } = req.body;

    const encontrarConta = contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!encontrarConta) {
        return res.status(400).json({ mensagem: "Numero de conta não encontrado." })
    }

    if (!numero_conta) {
        return res.status(400).json({ mensagem: "Por favor, informe o numero da conta." })
    }
    if (!senha) {
        return res.status(401).json({ mensagem: "Senha não informada." });
    };
    if (encontrarConta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    };

    next();
};
const senhaTransferir = (req, res, next) => {
    const { senha, numero_conta_origem } = req.body;

    const encontrarNumeroContaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem;
    });
    if (!encontrarNumeroContaOrigem) {
        return res.status(400).json({ mensagem: "Conta de origem não encontrado." })

    }
    if (!senha) {
        return res.status(401).json({ mensagem: "Senha não informada." });
    };

    if (encontrarNumeroContaOrigem.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
    };

    next();
};




module.exports = {
    validarSenha,
    senhaSaldo,
    senhaSacar,
    senhaTransferir
}
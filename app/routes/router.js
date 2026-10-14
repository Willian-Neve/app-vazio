
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.get("/", (req, res) => {
    res.render("pages/index");
});

router.get("/contato", (req, res) => {
    res.render("pages/contatos", {
        erros: [],
        sucesso: null
    });
});

router.post("/contato", [
    body("nome")
        .trim()
        .notEmpty()
        .withMessage("O nome é obrigatório!")
        .isAlpha("pt-BR", { ignore: " " })
        .withMessage("O nome deve conter apenas letras!"),

    body("email")
        .isEmail()
        .withMessage("Não parece um e-mail válido!"),

    body("telefone")
        .isMobilePhone("pt-BR")
        .withMessage("Não parece um telefone válido!"),

    body("mensagem")
        .notEmpty()
        .withMessage("A mensagem é obrigatória!")
], (req, res) => {

    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.render("pages/contatos", {
            erros: erros.array(),
            sucesso: null
        });
    }

    const { nome, email, telefone, mensagem } = req.body;

    const emailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: "Mensagem recebida pelo site",
        text: `
Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}

Mensagem:
${mensagem}
        `
    };

    transporter.sendMail(emailOptions, (erro, info) => {

        if (erro) {
            console.log(erro);

            return res.render("pages/contatos", {
                erros: [{ msg: "Erro ao enviar o e-mail!" }],
                sucesso: null
            });
        }

        console.log("E-mail enviado: " + info.response);

        res.render("pages/contatos", {
            erros: [],
            sucesso: "E-mail enviado com sucesso!"
        });

    });

});

module.exports = router;

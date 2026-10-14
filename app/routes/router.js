const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
router.get("/", (req, res) => {
    res.render("pages/index");
})
router.get("/contato", (req, res) => {
    res.render("pages/contatos", {erros: []});
})
router.post("/contato", [
         body("nome").trim().isString().isAlpha().withMessage("O nome deve apenas conter letras!").notEmpty().withMessage("O nome é obrigatório!"),
        body("email").isEmail().withMessage("Nao parece um email"),
        body("telefone").isMobilePhone("pt-BR").withMessage("Nao parece um telefone existente"),
        body("mensagem").notEmpty().withMessage("A mensagem é obrigatória!")
    ], (req, res) => {
        const erros = validationResult(req);
        if(!erros.isEmpty()){
            res.render("pages/contatos", {erros: erros.array()})
            
        }

       
})



module.exports = router;    
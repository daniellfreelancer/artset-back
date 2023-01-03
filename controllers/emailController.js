const Email = require('../models/emailModel');
const Joi = require('joi');

const subsValidator = Joi.object({
    "email": Joi.string().email().messages({
        'string.empty': 'Escriba su correo electrónico',
        'string.email': 'Debe introducir una dirección de correo electrónico válida'
    })
})

const emailController = {
    newsletter : async (req, res) =>{
        let { email } = req.body;

        try {
            await subsValidator.validateAsync(req.body)
            let suscriber = await Email.findOne({email});

            if(!suscriber){
                suscriber = await new Email({
                    email
                }).save()
                res.status(201).json({
                    message: "Gracias por suscribirte a nuestro boletín.",
                    success: true
                })
            } else {
                res.status(400).json({
                    message: "Ya te encuentras suscrito a nuestro boletín.",
                    success: false
                })
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: error.message,
                success: false
            })
        }
        
    },
    read: async (req, res) => {

        const { id } = req.params

        try {

            let suscriber = await Email.findOne({ _id: id })

            if (suscriber) {
                res.status(200).json({
                    message: 'Lista de suscritos al boletin',
                    response: suscriber,
                    succes: true
                })
            } else {
                res.status(404).json({
                    message: 'No se encontro ningun suscriptor',
                    succes: false
                })
            }

        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: error.message,
                succes: false
            })
        }

    },
    readAll: async (req, res) => {

        let all

        try {

            all = await Email.find()
            if (all.length > 0) {
                res.status(200).json({
                    message: 'Usuarios registrados',
                    response: all,
                    succes: true
                })
            }

        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: 'Cannot read users',
                succes: false
            })
        }

    },
}

module.exports = emailController;
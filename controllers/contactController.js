const Contact = require('../models/contactModel');
const Joi = require('joi')


const formContactValidator = Joi.object({
    "fullName":Joi.string().messages({
        'string.empty': 'Escriba su Nombre y Apellido',
    }),
    "email": Joi.string().email().messages({
        'string.empty': 'Ingresá tu correo electrónico',
        'string.email': 'Ingresá una dirección de correo electrónico válida'
    }),
    "areaText":Joi.string().min(10).messages({
        'string.empty': 'Ingresá tu consulta',
        'string.min':'Ingresá más de 10 caracteres'
    }),
})

const contactController = {

    contactForm: async (req, res) =>{
        let { email, fullName, areaText } = req.body;

        let messageForm
       


        try {
          let responseForm =  await formContactValidator.validateAsync(req.body)
            if( responseForm){
                messageForm = await new Contact({
                    email,
                    fullName,
                    areaText
                }).save()
                res.status(201).json({
                    message: "Gracias por tu mensaje, pronto estaremos respondiendo tu consulta.",
                    success: true
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
    readContactForm: async (req, res) => {

        let all

        try {

            all = await Contact.find()
            if (all.length > 0) {
                res.status(200).json({
                    message: 'Mensajes de Contacto',
                    response: all,
                    succes: true
                })
            } else {
                res.status(200).json({
                    message: 'No existen mensajes',
                    succes: false
                }) 
            }

        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: 'No se puede leer los mensajes',
                succes: false
            })
        }

    }

   





}

module.exports = contactController;
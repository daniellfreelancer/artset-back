const AdminUsers = require('../models/adminModel');
const Joi = require('joi')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


const adminUserCreateValidator = Joi.object({
    "name":Joi.string().messages({
        'string.empty': 'Por favor, escriba su nombre'
    }).required(),
    "email": Joi.string().email().messages({
        'string.empty': 'Escriba su correo electrónico',
        'string.email': 'Debe introducir una dirección de correo electrónico válida'
    })
        .required(),
    "password": Joi.string().alphanum().min(6).messages({
        'string.empty': 'Escriba una contraseña',
        'string.alphanum': 'Debe introducir una contraseña que contenga números o letras',
        'string.min': 'Su contraseña debe tener al menos 6 caracteres'
    }).required(),
    "from": Joi.string().required(),
    "role": Joi.string(),
})


const adminUserLoginValidator = Joi.object({
    "email": Joi.string()
        .email()
        .required(),
    "password": Joi.string()
        .required(),
    "from": Joi.string().required()
})


const adminController = {

    signUp: async (req, res) => {
        let {   
            name,
            email,
            password,
            from,
            role
        } = req.body;

        try {
            await adminUserCreateValidator.validateAsync(req.body)
            let adminUser = await AdminUsers.findOne({ email })
            password = bcryptjs.hashSync(password, 10)
            logged = false;
            if(!adminUser){
                adminUser = await new AdminUsers({
                    name,
                    email,
                    password,
                    from,
                    role,
                    logged
                }).save()
                res.status(201).json({
                    message: "usuario registrado",
                    success: true
                })
            } else {
                if (adminUser.from.includes(from)) {
                    res.status(200).json({
                        message: "El usuario ya existe " + from,
                        success: false
                    })
                } else {
                    adminUser.from.push(from)
                    adminUser.password.push(bcryptjs.hashSync(password, 10))
                    await user.save()
                    res.status(201).json({
                        message: "El usuario se registró desde" + from,
                        success: true
                    })
                }
            }

        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: error.message,
                success: false
            })
        }
    
    },
    signIn: async (req, res) => {
        let { email, password, from } = req.body;

        try {
            await adminUserLoginValidator.validateAsync(req.body);

            let adminUser = await AdminUsers.findOne({ email })

            const token = jwt.sign(
                {
                    id: adminUser._id,
                    role: adminUser.role
                },
                process.env.KEY_JWT,
                { expiresIn: 60 * 60 * 24 })

            if(!adminUser) {
                res.status(404).json({
                    message: 'El usuario no existe, por favor regístrese',
                    success: false
                })
            } else {
                const adminUserPass = adminUser.password.filter(adminpass => bcryptjs.compareSync(password, adminpass))
                if (from === "form"){
                    if (adminUserPass.length > 0) {
                        const adminlogin = {
                            _id: adminUser._id,
                            name: adminUser.name,
                            from: adminUser.from,
                            email: adminUser.email,
                            role: adminUser.role
                        }
                        adminUser.logged = true
                        await adminUser.save();

                        
                        res.status(200).json({
                            message: 'Inicio de sesión exitoso',
                            success: true,
                            response: {
                                user: adminlogin,
                                token
                            }
                        })
                    } else {

                        res.status(400).json({
                            message: 'Fallo en el inicio de sesión, por favor, compruebe su correo electrónico y contraseña',
                            success: false
                        })
                    }
                } else {
                    if (adminUserPass.length > 0) {
                        const adminlogin = {
                            _id: adminUser._id,
                            name: adminUser.name,
                            from: adminUser.from,
                            email: adminUser.email,
                            role: adminUser.role
                        }
                        adminUser.logged = true
                        await adminUser.save();

                        
                        res.status(200).json({
                            message: 'Iniciar sesión con éxito desde Google',
                            success: true,
                            response: {
                                user: adminlogin,
                                token: token
                            }
                        })
                    } else {

                        res.status(400).json({
                            message: 'Fallo en el inicio de sesión, por favor, compruebe su correo electrónico y contraseña',
                            success: false
                        })
                    }
                }
            }


        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: error.message,
                success: false
            })
        }
    },
    signOut: async (req, res) => {
        let { email } = req.body;
        try {

            const adminUser = await AdminUsers.findOne({ email })

            if (adminUser) {

                adminUser.logged = false;
                await adminUser.save();

                res.status(200).json({
                    message: 'Hasta luego, Cierre de sesión con exito',
                    success: true,
                    response: adminUser.logged
                })

            }else {
                res.status(400).json({
                    message: 'No podés cerrar sesión, ya que no estas loguead@',
                    success: false
                })
            }
            
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: "Error al intentar finalizar tu sesión",
                success: false
            })
        }
    }
    



}

module.exports = adminController;
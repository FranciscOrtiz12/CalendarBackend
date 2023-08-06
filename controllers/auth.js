const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/UsuarioModel');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });
        if( usuario ) return res.status(400).json({ ok: false, msg: 'El correo electronico ya esta registrado' });

        usuario = new Usuario( req.body );
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}


const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });
        if( !usuario ) return res.status(400).json({ ok: false, msg: 'El correo no se encuentra registrado' });

        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ) return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas' });

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        throw new Error('Consulte al admin');
    }
}


const revalidarToken = async(req, res = response) => {
    const { uid, name } = req;

    const newToken = await generarJWT(uid, name);

    res.status(200).json({
        ok: true,
        name,
        newToken,
    })
    
}


module.exports = { 
    crearUsuario,
    login,
    revalidarToken,
};
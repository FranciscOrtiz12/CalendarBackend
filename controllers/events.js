const { response } = require('express');
const Evento = require('../models/EventoModel');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');

    res.status(200).json({
        ok: true,
        eventos
    })
};


const crearEvento = async (req, res = response) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;
        const eventoSaved = await evento.save();

        res.json({
            ok: true,
            eventoSaved: eventoSaved
        })
        
    } catch (error) {
        console.log(error)    
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};


const updateEvento = async (req, res = response) => {

    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById( eventoId );
        const uid = req.uid;

        if( !evento ){
            res.status(204).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilgeio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoUpdated = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoUpdated
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
            
        });
    }


};


const deleteEvento = async (req, res = response) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById( eventoId );
        const uid = req.uid;

        if( !evento ){
            res.status(204).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilgeio de editar este evento'
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.status(200).json({ ok: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
};


module.exports = {
    getEventos,
    crearEvento,
    updateEvento,
    deleteEvento,
}
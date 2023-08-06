const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { getEventos, crearEvento, updateEvento, deleteEvento } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT);

// Obtener eventos
router.get('/', getEventos);

router.post('/', crearEvento);

router.put('/:id', updateEvento);

router.delete('/:id', deleteEvento);

module.exports = router;
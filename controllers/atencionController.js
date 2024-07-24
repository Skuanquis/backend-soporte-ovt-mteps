const atencionModel = require('../models/atencionModel');

const createAtencion = (req, res) => {
    const id_usuario = req.user.id;
    const atencionData = { ...req.body, id_usuario };

    atencionModel.createAtencion(atencionData, (err, results) => {
        if (err) {
            console.error('Error creating atencion:', err);
            return res.status(500).send({ error: 'Error al registrar la atención.' });
        }
        res.status(201).send({ message: 'La atención se registro exitosamente.', atencionId: results.insertId });
    });
};

const getAtencionesByUser = (req, res) => {
    const userId = req.user.id;

    atencionModel.getAtencionesByUserId(userId, (err, atenciones) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching atenciones' });
        }
        res.send(atenciones);
    });
};

const updateAtencion = (req, res) => {
    const id = req.params.id;
    const atencionData = req.body;

    atencionModel.updateAtencion(id, atencionData, (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Error al actulalizar la atención' });
        }
        res.send({ message: 'Atencion actualizada exitosamente' });
    });
};


module.exports = {
    createAtencion,
    getAtencionesByUser,
    updateAtencion
};

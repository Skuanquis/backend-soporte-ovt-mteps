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

const getAtencionesByDate = (req, res) => {
    const userId = req.user.id;
    const { fechaInicio, fechaFin } = req.query;
    atencionModel.getAtencionesByDate(userId, fechaInicio, fechaFin, (err, atenciones) => {
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

const getReporteAnual = (req, res) => {

    atencionModel.getReporteAnual((err, report) => {
        if (err) {
            console.error('Error generating report:', err);
            return res.status(500).send({ error: 'Error generating report' });
        }
        res.status(200).send(report);
    });
};

const getReporteAnualMensual = (req, res) => {

    atencionModel.getReporteAnualMensual((err, report) => {
        if (err) {
            console.error('Error generating report:', err);
            return res.status(500).send({ error: 'Error generating report' });
        }
        res.status(200).send(report);
    });
};

const getReporteAnioMes = (req, res) => {
    const anio = req.params.anio;
    const mes = req.params.mes;
    atencionModel.getReporteAnioMes(anio, mes, (err, report) => {
        if (err) {
            console.error('Error generating report:', err);
            return res.status(500).send({ error: 'Error generating report' });
        }
        res.status(200).send(report);
    });
};

const getReporteAnioMesUserId = (req, res) =>{
    const id_usuario = req.params.id
    //console.log(req)
    atencionModel.getReporteAnioMesUserId(id_usuario, (err, report) => {
        if (err) {
            console.error('Error generating report:', err);
            return res.status(500).send({ error: 'Error generating report' });
        }
        res.status(200).send(report);
    });
}
module.exports = {
    createAtencion,
    getAtencionesByUser,
    updateAtencion,
    getReporteAnual,
    getReporteAnualMensual,
    getReporteAnioMes,
    getAtencionesByDate,
    getReporteAnioMesUserId
};

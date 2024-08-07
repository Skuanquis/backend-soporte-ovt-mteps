// controllers/activityController.js
const activityModel = require('../models/actividadesModel');

const createActivity = (req, res) => {
    if (req.user.role !== 'supervisor') {
        return res.status(403).send({ message: 'Acceso denegado' });
    }

    const activity = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        hora: req.body.hora,
        fecha: req.body.fecha,
        id_usuario: req.body.id_usuario  // Asegúrate de que el frontend envíe el ID correcto del operador
    };

    activityModel.createActivity(activity, (err, activityId) => {
        if (err) {
            console.error('Error creating activity:', err);
            return res.status(500).send({ error: 'Error al crear la actividad' });
        }
        res.status(201).send({ message: 'Actividad creada', activityId });
    });
};

const getAllActivities = (req, res) => {
    activityModel.getAllActivities((err, activities) => {
        if (err) {
            console.error('Error fetching activities:', err);
            return res.status(500).send({ error: 'Error al obtener las actividades' });
        }
        res.status(200).send(activities);
    });
};

const getActivitiesByUserId = (req, res) => {
    const userId = req.user.id; 
    activityModel.getActivitiesByUserId(userId, (err, activities) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener las actividades', error: err });
        }
        res.json(activities);
    });
};

const getActivitiesByUserIdCompletadas = (req, res) => {
    const userId = req.user.id; 

    activityModel.getActivitiesByUserIdCompletadas(userId, (err, activities) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener las actividades', error: err });
        }
        res.json(activities);
    });
};

const marcarActividadCompletada = (req, res) => {
    const { id } = req.params; 
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    //console.log(id,formattedDate)
    activityModel.marcarActividadCompletada(id, formattedDate, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Error al marcar la actividad como completada', error: err });
        }
        res.json({ message: 'Actividad completada exitosamente' });
    });
};
const updateActivity = async (req, res) => {
    const { id } = req.params;
    const activityData = req.body;

    try {
        await activityModel.updateActivity(id, activityData);
        res.status(200).send({ message: 'Actividad actualizada exitosamente' });
    } catch (error) {
        res.status(500).send({ message: 'Error al actualizar la actividad', error });
    }
};

module.exports = {
    createActivity,
    getAllActivities,
    getActivitiesByUserId,
    marcarActividadCompletada,
    getActivitiesByUserIdCompletadas,
    updateActivity
};

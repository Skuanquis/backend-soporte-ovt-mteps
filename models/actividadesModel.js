// models/activityModel.js
const db = require('../db/db');

const createActivity = (activity, callback) => {
    //console.log("hora: ",activity.hora,"fecha: ",activity.fecha);
    const sql = `INSERT INTO actividades (titulo, descripcion, hora, fecha, estado, id_usuario) VALUES (?, ?, ?, ?, 'pendiente', ?)`;
    db.query(sql, [activity.titulo, activity.descripcion, activity.hora, activity.fecha, activity.id_usuario], (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
    });
};

const getAllActivities = (callback) => {
    const sql = `SELECT a.id_actividad, a.titulo, a.descripcion, a.hora, a.fecha, a.estado, u.nombre as usuario, u.id_usuario, a.fecha_completado
                 FROM actividades a
                 JOIN usuarios u ON a.id_usuario = u.id_usuario
                 ORDER BY a.fecha DESC, a.hora DESC`;
    db.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const getActivitiesByUserId = (id, callback) => {
    const sql = "SELECT * FROM actividades WHERE id_usuario = ? AND estado = 'pendiente'  ORDER BY fecha DESC, hora DESC";
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const getActivitiesByUserIdCompletadas = (id, callback) => {
    const sql = "SELECT * FROM actividades WHERE id_usuario = ? AND estado = 'completada'  ORDER BY fecha DESC, hora DESC";
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};


const marcarActividadCompletada = (id, fecha_completado, callback) => {
    const sql = "UPDATE actividades SET estado = 'completada', fecha_completado = ? WHERE id_actividad = ?";
    db.query(sql, [fecha_completado, id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};


const updateActivity = (id, activityData) => {
    const { titulo, descripcion, hora, fecha, estado, id_usuario } = activityData;
    const sql = `UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, fecha = ?, estado = ?, id_usuario = ? WHERE id_actividad = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [titulo, descripcion, hora, fecha, estado, id_usuario, id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    createActivity,
    getAllActivities,
    getActivitiesByUserId,
    marcarActividadCompletada,
    getActivitiesByUserIdCompletadas,
    updateActivity
};

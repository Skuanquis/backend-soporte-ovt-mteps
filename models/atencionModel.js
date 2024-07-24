const db = require('../db/db');

const createAtencion = (atencionData, callback) => {
    const {
        id_usuario, fecha, tipo_atencion, nombre_empleador, correo, telefono, nombre_empresa, nit, matricula,
        problema, subproblema, estado, asistencia_remota
    } = atencionData;
    const sql = `
        INSERT INTO atencion (
            id_usuario, fecha, tipo_atencion, nombre_empleador, correo, telefono, nombre_empresa, nit, matricula,
            problema, subproblema, estado, asistencia_remota
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
        id_usuario, fecha, tipo_atencion, nombre_empleador, correo, telefono, nombre_empresa, nit, matricula,
        problema, subproblema, estado, asistencia_remota
    ], callback);
};

const getAtencionesByUserId = (userId, callback) => {
    const query = 'SELECT * FROM atencion WHERE id_usuario = ?';
    db.query(query, [userId], callback);
};

const updateAtencion = (id, atencionData, callback) => {
    const {
        fecha, tipo_atencion, nombre_empleador, correo, telefono, nombre_empresa, nit, matricula,
        problema, subproblema, estado, asistencia_remota
    } = atencionData;
    const sql = `
        UPDATE atencion SET
            fecha = ?, tipo_atencion = ?, nombre_empleador = ?, correo = ?, telefono = ?, nombre_empresa = ?, nit = ?, matricula = ?,
            problema = ?, subproblema = ?, estado = ?, asistencia_remota = ?
        WHERE id_atencion = ?
    `;
    db.query(sql, [
        fecha, tipo_atencion, nombre_empleador, correo, telefono, nombre_empresa, nit, matricula,
        problema, subproblema, estado, asistencia_remota, id
    ], callback);
};
 
module.exports = {
    createAtencion,
    getAtencionesByUserId,
    updateAtencion
};

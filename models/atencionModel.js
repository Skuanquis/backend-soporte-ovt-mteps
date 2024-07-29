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

const getAtencionesByDate = (userId, fechaInicio, fechaFin, callback) => {
    const query = 'SELECT * FROM atencion WHERE id_usuario = ? AND fecha BETWEEN ? AND ?';
    db.query(query, [userId, fechaInicio, fechaFin], (error, results) => {
        callback(error, results);
    });
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

const getReporteAnual = (callback) => {
    const sql = `
    SELECT 
        YEAR(fecha) AS Anio,
        COUNT(CASE WHEN tipo_atencion = 'Correo' THEN 1 END) AS Total_Correos,
        COUNT(CASE WHEN tipo_atencion = 'Telefono' THEN 1 END) AS Total_Llamadas,
        COUNT(CASE WHEN tipo_atencion = 'Presencial' THEN 1 END) AS Total_Presencial,
        COUNT(*) AS Total_Casos,
        COUNT(CASE WHEN problema = 'Planillas' THEN 1 END) AS Total_Inconvenientes_Planillas,
        COUNT(CASE WHEN subproblema = 'Mensual' THEN 1 END) AS Subproblema_Mensual,
        COUNT(CASE WHEN subproblema = 'Retroactiva' THEN 1 END) AS Subproblema_Retroactiva,
        COUNT(CASE WHEN subproblema = 'Aguinaldo' THEN 1 END) AS Subproblema_Aguinaldo,
        COUNT(CASE WHEN subproblema = 'Rectificacion' THEN 1 END) AS Subproblema_Rectificacion,
        COUNT(CASE WHEN subproblema = 'Fuera de plazo' THEN 1 END) AS Subproblema_Fueradeplazo,
        COUNT(CASE WHEN subproblema = 'Declaración en cero' THEN 1 END) AS Subproblema_Declaracionencero,
        COUNT(CASE WHEN subproblema = 'Tipo de declaración' THEN 1 END) AS Subproblema_Tipodeclaracion,
        COUNT(CASE WHEN subproblema = 'No figura sucursal' THEN 1 END) AS Subproblema_Nofigurasucursal,
        COUNT(CASE WHEN subproblema = 'Incumplimiento de declaración' THEN 1 END) AS Subproblema_Incumplimientodeclaracion,
        COUNT(CASE WHEN subproblema = 'Error al importar' THEN 1 END) AS Subproblema_Errorimportar,
        COUNT(CASE WHEN problema = 'ROE' THEN 1 END) AS Total_ROE,
        COUNT(CASE WHEN subproblema = 'Dar de baja el ROE' THEN 1 END) AS Subproblema_DarbajaROE,
        COUNT(CASE WHEN subproblema = 'Correo de confirmación' THEN 1 END) AS Subproblema_Correodeconfirmacion,
        COUNT(CASE WHEN subproblema = 'Multa RM°105/18' THEN 1 END) AS Subproblema_MultaRM105,
        COUNT(CASE WHEN subproblema = 'Inicio de actividades' THEN 1 END) AS Subproblema_Iniciodeactividades,
        COUNT(CASE WHEN subproblema = 'Sucursal inactiva' THEN 1 END) AS Subproblema_Sucursalinactiva,
        COUNT(CASE WHEN subproblema = 'Inscripcion al ROE' THEN 1 END) AS Subproblema_InscripcionROE,
        COUNT(CASE WHEN subproblema = 'Pendiente de firma' THEN 1 END) AS Subproblema_Pendientedefirma,
        COUNT(CASE WHEN subproblema = 'Actualizar ROE' THEN 1 END) AS Subproblema_ActualizarROE,
        COUNT(CASE WHEN subproblema = 'Error interno' THEN 1 END) AS Subproblema_Errorinterno,
        COUNT(CASE WHEN subproblema = 'Representante legal' THEN 1 END) AS Subproblema_Representantelegal,
        COUNT(CASE WHEN problema = 'Trabajadores' THEN 1 END) AS Total_Trabajadores,
        COUNT(CASE WHEN subproblema = 'No es jubilado' THEN 1 END) AS Subproblema_Noesjubilado,
        COUNT(CASE WHEN subproblema = 'Retiro de trabajador' THEN 1 END) AS Subproblema_Retirotrabajador,
        COUNT(CASE WHEN subproblema = 'No valida dependiente' THEN 1 END) AS Subproblema_Novalidadependiente,
        COUNT(CASE WHEN subproblema = 'No valida trabajador' THEN 1 END) AS Subproblema_Novalidatrabajador,
        COUNT(CASE WHEN problema = 'Contraseña' THEN 1 END) AS Total_Contraseña,
        COUNT(CASE WHEN problema = 'Falla interoperabilidad' THEN 1 END) AS Total_Falla_Interoperabilidad,
        COUNT(CASE WHEN problema = 'Otro' THEN 1 END) AS Total_Otro
    FROM
        atencion
    GROUP BY
        YEAR(fecha)
    ORDER BY \`Subproblema_Novalidadependiente\` DESC;
    `;
    db.query(sql, callback);
}

const getReporteAnualMensual = (callback) => {
    const sql = `
    SELECT 
        YEAR(fecha) AS Anio,
        MONTH(fecha) AS Mes,
        COUNT(CASE WHEN tipo_atencion = 'Correo' THEN 1 END) AS Total_Correos,
        COUNT(CASE WHEN tipo_atencion = 'Telefono' THEN 1 END) AS Total_Llamadas,
        COUNT(CASE WHEN tipo_atencion = 'Presencial' THEN 1 END) AS Total_Presencial,
        COUNT(CASE WHEN tipo_atencion IN ('Correo', 'Telefono', 'Presencial') THEN 1 END) AS Total_Casos
    FROM
        atencion
    GROUP BY
        YEAR(fecha), MONTH(fecha)
    ORDER BY
        YEAR(fecha) DESC, MONTH(fecha) DESC;
    `;
    db.query(sql, callback);
}

const getReporteAnioMes = (anio, mes, callback) =>{
    const sql = `
    SELECT 
    YEAR(fecha) AS Anio,
    MONTH(fecha) AS Mes,
    COUNT(*) AS Total_Casos,
    COUNT(CASE WHEN tipo_atencion = 'Correo' THEN 1 END) AS Total_Correos,
    COUNT(CASE WHEN tipo_atencion = 'Telefono' THEN 1 END) AS Total_Llamadas,
    COUNT(CASE WHEN tipo_atencion = 'Presencial' THEN 1 END) AS Total_Presencial,
    COUNT(CASE WHEN problema = 'Planillas' THEN 1 END) AS Total_Inconvenientes_Planillas,
    COUNT(CASE WHEN subproblema = 'Mensual' THEN 1 END) AS Subproblema_Mensual,
    COUNT(CASE WHEN subproblema = 'Retroactiva' THEN 1 END) AS Subproblema_Retroactiva,
    COUNT(CASE WHEN subproblema = 'Aguinaldo' THEN 1 END) AS Subproblema_Aguinaldo,
    COUNT(CASE WHEN subproblema = 'Rectificacion' THEN 1 END) AS Subproblema_Rectificacion,
    COUNT(CASE WHEN subproblema = 'Fuera de plazo' THEN 1 END) AS Subproblema_Fueradeplazo,
    COUNT(CASE WHEN subproblema = 'Declaración en cero' THEN 1 END) AS Subproblema_Declaracionencero,
    COUNT(CASE WHEN subproblema = 'Tipo de declaración' THEN 1 END) AS Subproblema_Tipodeclaracion,
    COUNT(CASE WHEN subproblema = 'No figura sucursal' THEN 1 END) AS Subproblema_Nofigurasucursal,
    COUNT(CASE WHEN subproblema = 'Incumplimiento de declaración' THEN 1 END) AS Subproblema_Incumplimientodeclaracion,
    COUNT(CASE WHEN subproblema = 'Error al importar' THEN 1 END) AS Subproblema_Errorimportar,
    COUNT(CASE WHEN problema = 'ROE' THEN 1 END) AS Total_ROE,
    COUNT(CASE WHEN subproblema = 'Dar de baja el ROE' THEN 1 END) AS Subproblema_DarbajaROE,
    COUNT(CASE WHEN subproblema = 'Correo de confirmación' THEN 1 END) AS Subproblema_Correodeconfirmacion,
    COUNT(CASE WHEN subproblema = 'Multa RM°105/18' THEN 1 END) AS Subproblema_MultaRM105,
    COUNT(CASE WHEN subproblema = 'Inicio de actividades' THEN 1 END) AS Subproblema_Iniciodeactividades,
    COUNT(CASE WHEN subproblema = 'Sucursal inactiva' THEN 1 END) AS Subproblema_Sucursalinactiva,
    COUNT(CASE WHEN subproblema = 'Inscripcion al ROE' THEN 1 END) AS Subproblema_InscripcionROE,
    COUNT(CASE WHEN subproblema = 'Pendiente de firma' THEN 1 END) AS Subproblema_Pendientedefirma,
    COUNT(CASE WHEN subproblema = 'Actualizar ROE' THEN 1 END) AS Subproblema_ActualizarROE,
    COUNT(CASE WHEN subproblema = 'Error interno' THEN 1 END) AS Subproblema_Errorinterno,
    COUNT(CASE WHEN subproblema = 'Representante legal' THEN 1 END) AS Subproblema_Representantelegal,
    COUNT(CASE WHEN problema = 'Trabajadores' THEN 1 END) AS Total_Trabajadores,
    COUNT(CASE WHEN subproblema = 'No es jubilado' THEN 1 END) AS Subproblema_Noesjubilado,
    COUNT(CASE WHEN subproblema = 'Retiro de trabajador' THEN 1 END) AS Subproblema_Retirotrabajador,
    COUNT(CASE WHEN subproblema = 'No valida dependiente' THEN 1 END) AS Subproblema_Novalidadependiente,
    COUNT(CASE WHEN subproblema = 'No valida trabajador' THEN 1 END) AS Subproblema_Novalidatrabajador,
    COUNT(CASE WHEN problema = 'Contraseña' THEN 1 END) AS Total_Contraseña,
    COUNT(CASE WHEN problema = 'Falla interoperabilidad' THEN 1 END) AS Total_Falla_Interoperabilidad,
    COUNT(CASE WHEN problema = 'Otro' THEN 1 END) AS Total_Otro
    FROM
        atencion
    WHERE
        YEAR(fecha) = ? AND MONTH(fecha) = ?
    GROUP BY
        YEAR(fecha), MONTH(fecha);
    `;
    db.query(sql, [anio, mes], callback);
    }

module.exports = {
    createAtencion,
    getAtencionesByUserId,
    updateAtencion,
    getReporteAnual,
    getReporteAnualMensual,
    getReporteAnioMes,
    getAtencionesByDate
};

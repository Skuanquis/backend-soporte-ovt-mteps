const db = require('../db/db');

const getUserByUsername = (username, callback) => {
    const sql = `SELECT * FROM usuarios WHERE username = ?`;
    db.query(sql, [username], (err, results) => {
        if (err) return callback(err);
        return callback(null, results[0]);
    });
};

const getUserById = (id, callback) => {
    const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        if (results.length === 0) {
            return callback(new Error('User not found'), null);
        }
        return callback(null, results[0]);
    });
};

const createUser =(userData, callback) =>{
    const {nombre, direccion, ci, numero, username,password, rol} = userData;
    const sql = 'INSERT INTO usuarios (nombre, direccion, ci, numero, username, password, rol) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre, direccion, ci, numero, username,password, rol], callback);
};

const getPasantes = (callback) => {
    const sql = `
        SELECT u.id_usuario, u.nombre, u.ci, u.numero AS celular, COUNT(a.id_atencion) AS casos, u.estado, u.rol
        FROM usuarios u
        LEFT JOIN atencion a ON u.id_usuario = a.id_usuario
        WHERE u.rol IN ('operador', 'supervisor')
        GROUP BY u.id_usuario, u.nombre, u.ci, u.numero;

        `;
    db.query(sql, callback);
};

const getPasanteById = (id, callback) => {
    const sql = `SELECT * FROM usuarios WHERE id_usuario = ? AND rol IN ('operador', 'supervisor')`;
    db.query(sql, [id], callback);
};

const updatePasante = (id, pasanteData, callback) => {
    const { nombre, direccion, ci, numero, estado, password, rol } = pasanteData;  // Incluir 'rol' en la desestructuración
    const sql = password 
        ? `UPDATE usuarios SET nombre = ?, direccion = ?, ci = ?, numero = ?, password = ?, estado = ?, rol = ? WHERE id_usuario = ?`
        : `UPDATE usuarios SET nombre = ?, direccion = ?, ci = ?, numero = ?, estado = ?, rol = ? WHERE id_usuario = ?`;
    const params = password ? [nombre, direccion, ci, numero, password, estado, rol, id] : [nombre, direccion, ci, numero, estado, rol, id];
    db.query(sql, params, callback);
};



const updateUserProfile = (id, userData, callback) => {
    const query = 'UPDATE usuarios SET nombre = ?, direccion = ?, ci = ?, numero = ? WHERE id_usuario = ?';
    const { nombre, direccion, ci, numero } = userData;
    db.query(query, [nombre, direccion, ci, numero, id], callback);
};

const updateUserPassword = (id, hashedPassword, callback) => {
    const query = 'UPDATE usuarios SET password = ? WHERE id_usuario = ?';
    db.query(query, [hashedPassword, id], callback);
};

const getAtencionesUsuario = (id, callback) => {
    const query = 'SELECT tipo_atencion, COUNT(*) AS total FROM atencion WHERE id_usuario = ? GROUP BY tipo_atencion'
    db.query(query, [id], callback);
};

const getTodasAtenciones = (callback) => {
    const query = 'SELECT tipo_atencion, COUNT(*) AS total FROM atencion WHERE YEAR(fecha) = YEAR(CURRENT_DATE()) GROUP BY tipo_atencion;'
    db.query(query, callback);
}

const getPendientesUsuario = (id, callback) => {
    const query = `SELECT tipo_atencion, COUNT(*) AS cantidad FROM atencion WHERE estado = 'Pendiente' AND id_usuario = ? GROUP BY tipo_atencion`;
    db.query(query, [id], callback);
}

const getTotalPendientes = (callback) => {
    const query = `SELECT tipo_atencion, COUNT(*) AS cantidad FROM atencion WHERE estado = 'Pendiente' AND YEAR(fecha) = YEAR(CURRENT_DATE()) GROUP BY tipo_atencion;`
    db.query(query, callback);
}

const getCasosSolucionadosMesPasante = (id, callback) => {
    const query = `SELECT DAY(fecha) AS dia, COUNT(*) AS solucionados FROM atencion WHERE estado = 'solucionado' AND id_usuario = ? AND MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE()) GROUP BY DAY(fecha);`
    db.query(query, [id],callback)
}

const getCasosPendientesMesPasante = (id, callback) => {
    const query = `SELECT DAY(fecha) AS dia, COUNT(*) AS pendientes FROM atencion WHERE estado = 'pendiente' AND id_usuario = ? AND MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE()) GROUP BY DAY(fecha);`
    db.query(query, [id],callback)
}

const getTotalCasosSolucionadosMes = (callback) => {
    const query = `SELECT DAY(fecha) AS dia, COUNT(*) AS solucionados FROM atencion WHERE estado = 'solucionado' AND MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE()) GROUP BY DAY(fecha);`
    db.query(query, callback)
}

const getTotalCasosPendientesMes = (callback) => {
    const query = `SELECT DAY(fecha) AS dia, COUNT(*) AS pendientes FROM atencion WHERE estado = 'pendiente' AND MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE()) GROUP BY DAY(fecha);`
    db.query(query, callback)
}

const getAtencionesMesPasante = (id, callback) => {
    const query = `SELECT tipo_atencion, COUNT(*) AS total FROM atencion WHERE id_usuario = ? AND MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE()) GROUP BY tipo_atencion;`
    db.query(query, [id], callback)
}

const getAtencionesMesTotal = (callback) => {
    const query = `SELECT tipo_atencion, COUNT(*) AS total FROM atencion WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE()) GROUP BY tipo_atencion;`
    db.query(query, callback)
}

const getPlanillasPasante = (id, callback) =>{
    const query = `SELECT subproblema, COUNT(*) AS total FROM atencion WHERE problema = 'planillas' AND id_usuario = ? AND MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR (fecha) = YEAR(CURRENT_DATE) GROUP BY subproblema;`
    db.query(query, [id], callback)
}

const getRoePasante = (id, callback) =>{
    const query = `SELECT subproblema, COUNT(*) AS total FROM atencion WHERE problema = 'roe' AND id_usuario = ? AND MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR(fecha) = YEAR(CURRENT_DATE) GROUP BY subproblema;`
    db.query(query, [id], callback)
}

const getTrabajadoresPasante = (id, callback) =>{
    const query = `SELECT subproblema, COUNT(*) AS total FROM atencion WHERE problema = 'trabajadores' AND id_usuario = ? AND MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR(fecha) = YEAR(CURRENT_DATE) GROUP BY subproblema;`
    db.query(query, [id], callback)
}

const getPlanillas = (callback) =>{
    const query = `SELECT subproblema, COUNT(*) AS total FROM atencion WHERE problema = 'planillas' AND MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR(fecha) = YEAR(CURRENT_DATE) GROUP BY subproblema;`
    db.query(query, callback)
}

const getRoe = (callback) =>{
    const query = `SELECT subproblema, COUNT(*) AS total FROM atencion WHERE problema = 'roe' AND MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR(fecha) = YEAR(CURRENT_DATE) GROUP BY subproblema;`
    db.query(query, callback)
}

const getTrabajadores = (callback) =>{
    const query = `SELECT subproblema, COUNT(*) AS total FROM atencion WHERE problema = 'trabajadores' AND MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR(fecha) = YEAR(CURRENT_DATE) GROUP BY subproblema;`
    db.query(query, callback)
}

const getOtrosProblemasPasante = (id, callback) => {
    const query = `SELECT problema, COUNT(*) AS total FROM atencion WHERE problema IN ('falla interoperabilidad', 'contraseña', 'otro') AND id_usuario = ? AND MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR(fecha) = YEAR(CURRENT_DATE) GROUP BY problema;`
    db.query(query, [id], callback)
}

const getOtrosProblemas = (callback) => {
    const query = `SELECT problema, COUNT(*) AS total FROM atencion WHERE problema IN ('falla interoperabilidad', 'contraseña', 'otro') AND MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR(fecha) = YEAR(CURRENT_DATE) GROUP BY problema;`
    db.query(query, callback)
}

const getPreguntasFrecuentes = (callback) => {
    const query = 'SELECT id_pregunta, categoria, pregunta, respuesta FROM preguntas_frecuentes;'
    db.query(query, callback);
};

const addPregunta = (nuevaPregunta, callback) => {
    const query = 'INSERT INTO preguntas_frecuentes (categoria, pregunta, respuesta, id_usuario) VALUES (?, ?, ?, ?)';
    const { categoria, pregunta, respuesta, id_usuario } = nuevaPregunta;
    db.query(query, [categoria, pregunta, respuesta, id_usuario], callback);
};

const getListaPasantes = (callback) => {
    const query = `SELECT id_usuario, nombre FROM usuarios WHERE rol IN ('operador', 'supervisor') AND estado = 'activo'`;
    db.query(query, callback);
}

const getPreguntaById = (id, callback) => {
    const sql = 'SELECT * FROM preguntas_frecuentes WHERE id_pregunta = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        if (results.length === 0) {
            return callback(new Error('Pregunta no encontrada'), null);
        }
        return callback(null, results[0]);
    });
};

const updatePregunta = (id, preguntaData, callback) => {
    const { categoria, pregunta, respuesta } = preguntaData;
    const sql = 'UPDATE preguntas_frecuentes SET categoria = ?, pregunta = ?, respuesta = ? WHERE id_pregunta = ?';
    db.query(sql, [categoria, pregunta, respuesta, id], (err, result) => {
        if (err) {
            return callback(err);
        }
        return callback(null, result);
    });
};

const getOperadores = (callback) => {
    const sql = `SELECT id_usuario, nombre FROM usuarios WHERE rol = 'operador' AND estado = 'activo'`;
    db.query(sql, callback);
};

const updateRolSupervisor = (id, callback) => {
    const sql = `UPDATE usuarios SET rol = 'supervisor' WHERE id_usuario = ?;`;
    db.query(sql, [id], callback);
};

const updateRolOperador = (id, callback) => {
    const sql = `UPDATE usuarios SET rol = 'operador' WHERE id_usuario = ?;`;
    db.query(sql, [id], callback);
};

const getOperadoresSupervisores = (callback) => {
    const sql = `SELECT id_usuario, nombre FROM usuarios WHERE rol IN ('operador', 'supervisor') AND estado = 'activo'`;
    db.query(sql, callback);
};

const getReport = (filters, callback) => {
    const { tipoAtencion, pasante, estado, problema, subproblema, fechaInicio, fechaFin } = filters;
    
    const formattedFechaInicio = new Date(fechaInicio).toISOString().split('T')[0];
    const formattedFechaFin = new Date(fechaFin).toISOString().split('T')[0];
    console.log("fecha ini: ",formattedFechaInicio, "fecha fin: ",formattedFechaFin);
    let query = `
        SELECT
            a.tipo_atencion, u.nombre AS nombre_pasante, a.problema, a.subproblema, a.estado,
            a.fecha, a.nit, a.nombre_empresa
        FROM atencion a
        JOIN usuarios u ON a.id_usuario = u.id_usuario
        WHERE a.fecha >= ? AND a.fecha <= ? ORDER BY fecha DESC
    `;
    const params = [formattedFechaInicio, formattedFechaFin];
    
    if (tipoAtencion !== 'Todos') {
        query += ' AND a.tipo_atencion = ?';
        params.push(tipoAtencion);
    }

    if (estado !== 'Todos') {
        query += ' AND a.estado = ?';
        params.push(estado);
    }

    if (problema !== 'Todos') {
        query += ' AND a.problema = ?';
        params.push(problema);
    }

    if (subproblema !== 'Todos') {
        query += ' AND a.subproblema = ?';
        params.push(subproblema);
    }
    
    if (pasante !== 'Todos') {
        query += ' AND u.nombre = ?';
        params.push(pasante);
    }

    db.query(query, params, (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
};

module.exports = {
    getUserByUsername,
    getUserById,
    createUser,
    getPasantes,
    getPasanteById,
    updatePasante,
    updateUserProfile,  
    updateUserPassword,
    getAtencionesUsuario,
    getTodasAtenciones,
    getPendientesUsuario,
    getTotalPendientes,
    getCasosPendientesMesPasante,
    getCasosSolucionadosMesPasante,
    getTotalCasosPendientesMes,
    getTotalCasosSolucionadosMes,
    getAtencionesMesPasante,
    getAtencionesMesTotal,
    getPlanillasPasante,
    getRoePasante,
    getTrabajadoresPasante,
    getPlanillas,
    getRoe,
    getTrabajadores,
    getOtrosProblemas,
    getOtrosProblemasPasante,
    getPreguntasFrecuentes,
    addPregunta,
    getListaPasantes,
    getReport,
    getPreguntaById,
    updatePregunta,
    getOperadores,
    updateRolSupervisor,
    updateRolOperador,
    getOperadoresSupervisores
};
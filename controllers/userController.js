const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const loginUser = (req, res) => {
    const { username, password } = req.body;

    userModel.getUserByUsername(username, async (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send({ error: 'Error al encontrar al usuario' });
        }
        if (!user) {
            return res.status(400).send({ error: 'Credendiales invalidas' });
        }
        if (user.estado !== 'activo') {
            return res.status(401).send({ error: 'La cuenta del usuario esta inactiva' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ error: 'Credendiales invalidas' });
        }

        const accessToken = jwt.sign({ id: user.id_usuario, role: user.rol }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).send({ accessToken });
    });
};


const getUserInfo = (req, res) => {
    const userId = req.user.id;

    userModel.getUserById(userId, (err, user) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).send({ error: 'Error fetching user info' });
        }
        res.status(200).send(user);
    });
};

const createUser = async (req, res) => {
    let userData = req.body;
    try {
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        userData.password = hashedPassword;

        userModel.createUser(userData, (err, results) => {
            if (err) {
                res.status(500).send({ error: 'Error al registrar al pasante' });
            } else {
                res.status(201).send({ message: 'Pasante registrado exitosamente', userId: results.insertId });
            }
        });
    } catch (error) {
        res.status(500).send({ error: 'Error hashing password' });
    }
};

const getPasantes = (req, res) => {
    userModel.getPasantes((err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching pasantes' });
        }
        res.status(200).send(results);
    });
};

const getPasanteById = (req, res) => {
    const id = req.params.id;
    userModel.getPasanteById(id, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching pasante' });
        }
        res.status(200).send(results[0]);
    });
};

const updatePasante = async (req, res) => {
    const id = req.params.id;
    const pasanteData = req.body;

    if (pasanteData.password) {
        try {
            const hashedPassword = await bcrypt.hash(pasanteData.password, 10);
            pasanteData.password = hashedPassword;
        } catch (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ error: 'Error hashing password' });
        }
    } else {
        delete pasanteData.password;
    }

    userModel.updatePasante(id, pasanteData, (err, results) => {
        if (err) {
            console.error('Error updating pasante:', err);
            return res.status(500).send({ error: 'Error updating pasante' });
        }
        res.status(200).send({ message: 'Pasante updated successfully' });
    });
};

const updateUserProfile = (req, res) => {
    const userId = req.params.id;
    const { nombre, direccion, ci, numero } = req.body;

    userModel.updateUserProfile(userId, { nombre, direccion, ci, numero }, (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).send({ error: 'Error updating profile' });
        }
        res.status(200).send({ message: 'Profile updated successfully' });
    });
};

const updateUserPassword = (req, res) => {
    const userId = req.params.id;
    const { passwordAnterior, nuevaPassword } = req.body;

    userModel.getUserById(userId, async (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send({ error: 'Error fetching user' });
        }

        if (!user || !user.password) {
            console.error('User or password not found:', user);
            return res.status(400).send({ error: 'Invalid user or password' });
        }

        try {
            const validPassword = await bcrypt.compare(passwordAnterior, user.password);
            if (!validPassword) {
                return res.status(400).send({ error: 'Invalid current password' });
            }
            
            const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
            userModel.updateUserPassword(userId, hashedPassword, (err, result) => {
                if (err) {
                    console.error('Error updating password:', err);
                    return res.status(500).send({ error: 'Error updating password' });
                }
                res.status(200).send({ message: 'Password updated successfully' });
            });
        } catch (error) {
            console.error('Error during password comparison:', error);
            return res.status(500).send({ error: 'Error during password comparison' });
        }
    });
};

const getAtencionesUsuario = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getTodasAtenciones((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getAtencionesUsuario(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getPendientesUsuario = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getTotalPendientes((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getPendientesUsuario(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getSolucionesMes = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getTotalCasosSolucionadosMes((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getCasosSolucionadosMesPasante(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getPendientesMes = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getTotalCasosPendientesMes((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getCasosPendientesMesPasante(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getTotalAtencionesMes = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getAtencionesMesTotal((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getAtencionesMesPasante(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getTotalPlanillas = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getPlanillas((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getPlanillasPasante(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getTotalRoe = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getRoe((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getRoePasante(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getTotalTrabajadores = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getTrabajadores((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getTrabajadoresPasante(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getTotalOtros = (req, res) => {  
    if (req.user.role === 'administrador') {
        userModel.getOtrosProblemas((err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    } else {
        userModel.getOtrosProblemasPasante(req.user.id, (err, atenciones) => {
            if(err){
                return res.status(500).send({ error: 'Error fetching atenciones' });
            }
            res.status(200).send(atenciones);
        })
    }
}

const getPreguntasFrecuentes = (req, res) => {
    userModel.getPreguntasFrecuentes((err, preguntas) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching preguntas' });
        }
        res.status(200).send(preguntas);
    })
}

const createPregunta = (req, res) => {
    const nuevaPregunta = {
        categoria: req.body.categoria,
        pregunta: req.body.pregunta,
        respuesta: req.body.respuesta,
        id_usuario: req.body.id_usuario 
    };

    userModel.addPregunta(nuevaPregunta, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Pregunta añadida exitosamente' });
    });
};


const getListaPasantes = (req, res) => {
    if (req.user.role === 'administrador') {
        userModel.getListaPasantes((err, pasantes) => {
            if (err) {
                console.error('Error fetching pasantes:', err);
                return res.status(500).send({ error: 'Error fetching pasantes' });
            }
            pasantes.push({ id_usuario: 'Todos', nombre: 'Todos' });
            res.status(200).send(pasantes);
        });
    }else{
        return res.status(403).send({ error: 'Acceso denegado' });
    }
};

const getPreguntaById = (req, res) => {
    const id = req.params.id;
    userModel.getPreguntaById(id, (err, pregunta) => {
      if (err) {
        console.error('Error fetching pregunta:', err);
        return res.status(500).send({ error: 'Error al obtener la pregunta' });
      }
      res.status(200).send(pregunta);
    });
  };
  
const updatePregunta = (req, res) => {
    const id = req.params.id;
    const preguntaData = req.body;
    userModel.updatePregunta(id, preguntaData, (err, result) => {
      if (err) {
        console.error('Error updating pregunta:', err);
        return res.status(500).send({ error: 'Error al actualizar la pregunta' });
      }
      res.status(200).send({ message: 'Pregunta actualizada exitosamente' });
    });
  };

const getOperadores = (req, res) => {
    userModel.getOperadores((err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching operadores' });
        }
        res.status(200).send(results);
    });
};

const updateRolSupervisor = (req, res) => {
    const id = req.params.id;
    userModel.updateRolSupervisor(id, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error al designar supervisor' });
        }
        res.status(200).send({ message:"Supervisor asignado con exito"});
    });
};

const updateRolesSupervisor = (req, res) => {
    const idSupervisor = parseInt(req.params.idSupervisor, 10);
    const idUser = parseInt(req.params.idUser, 10);

    if (!idSupervisor || !idUser) {
        return res.status(400).send({ error: 'Faltan parámetros requeridos o son inválidos.' });
    }

    userModel.updateRolSupervisor(idSupervisor, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error al actualizar roles', details: err.message });
        }else{
            userModel.updateRolOperador(idUser, (err, results) => {
                if (err) {
                    return res.status(500).send({ error: 'Error al actualizar roles', details: err.message });
                }
            });
        }
        res.status(200).send({ message: "Roles actualizados con éxito" });
    });
};


const getReport = (req, res) => {
    const filters = req.body;

    userModel.getReport(filters, (err, report) => {
        if (err) {
            console.error('Error generating report:', err);
            return res.status(500).send({ error: 'Error generating report' });
        }
        res.status(200).send(report);
    });
};

module.exports = {
    loginUser,
    getUserInfo,
    createUser,
    getPasantes,
    getPasanteById,
    updatePasante,
    updateUserProfile,
    updateUserPassword,
    getAtencionesUsuario,
    getPendientesUsuario,
    getSolucionesMes,
    getPendientesMes,
    getTotalAtencionesMes,
    getTotalPlanillas,
    getTotalRoe,
    getTotalTrabajadores,
    getTotalOtros,
    getPreguntasFrecuentes,
    createPregunta,
    getListaPasantes,
    getReport,
    getPreguntaById,
    updatePregunta,
    getOperadores,
    updateRolSupervisor,
    updateRolesSupervisor
};
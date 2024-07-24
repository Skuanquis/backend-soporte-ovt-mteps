const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddlewares');

router.post('/users', userController.createUser);
router.get('/pasantes', userController.getPasantes);
router.get('/pasantes/:id', userController.getPasanteById);
router.put('/pasantes/:id', userController.updatePasante);
router.post('/login', userController.loginUser);
router.get('/info', authenticateToken, userController.getUserInfo);
router.put('/perfil/:id', authenticateToken, userController.updateUserProfile); 
router.put('/password/:id', authenticateToken, userController.updateUserPassword); 
router.get('/atenciones-usuario', authenticateToken, userController.getAtencionesUsuario);
router.get('/pendientes-usuario', authenticateToken, userController.getPendientesUsuario);
router.get('/pendientes-mes', authenticateToken, userController.getPendientesMes);
router.get('/solucionados-mes', authenticateToken, userController.getSolucionesMes);
router.get('/atenciones-mes', authenticateToken, userController.getTotalAtencionesMes);
router.get('/total-planillas', authenticateToken, userController.getTotalPlanillas);
router.get('/total-roe', authenticateToken, userController.getTotalRoe);
router.get('/total-trabajadores', authenticateToken, userController.getTotalTrabajadores);
router.get('/total-otros', authenticateToken, userController.getTotalOtros);
router.get('/preguntas-frecuentes', authenticateToken, userController.getPreguntasFrecuentes);
router.post('/add-preguntas', authenticateToken, userController.createPregunta);
router.get('/lista-pasantes', authenticateToken, userController.getListaPasantes)
router.post('/reportes', authenticateToken, userController.getReport)
router.get('/preguntas/:id', authenticateToken, userController.getPreguntaById);
router.put('/preguntas/:id', authenticateToken, userController.updatePregunta);
router.get('/operadores', authenticateToken, userController.getOperadores);
router.put('/update-operadores/:id', authenticateToken, userController.updateRolSupervisor);
router.put('/update-roles/:idSupervisor/:idUser',authenticateToken, userController.updateRolesSupervisor);

module.exports = router;

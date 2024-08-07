const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadesController');
const authenticateToken = require('../middlewares/authMiddlewares');

router.post('/crear-actividad', authenticateToken, actividadController.createActivity);
router.get('/get-actividades', authenticateToken, actividadController.getAllActivities);
router.get('/get-actividades-id', authenticateToken, actividadController.getActivitiesByUserId);
router.put('/marcar-actividad/:id/complete', authenticateToken, actividadController.marcarActividadCompletada);
router.get('/get-actividades-completadas', authenticateToken, actividadController.getActivitiesByUserIdCompletadas);
router.put('/actividades/:id/update', authenticateToken, actividadController.updateActivity);

module.exports = router;
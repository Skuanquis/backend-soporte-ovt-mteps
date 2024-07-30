const express = require('express');
const router = express.Router();
const atencionController = require('../controllers/atencionController');
const authenticateToken = require('../middlewares/authMiddlewares');

router.post('/atenciones', authenticateToken, atencionController.createAtencion);
router.get('/atenciones', authenticateToken, atencionController.getAtencionesByUser); 
router.put('/atenciones/:id', authenticateToken, atencionController.updateAtencion);
router.get('/atenciones-anual', authenticateToken, atencionController.getReporteAnual);
router.get('/atenciones-anual-mensual', authenticateToken, atencionController.getReporteAnualMensual);
router.get('/atenciones-anual-mes/:anio/:mes', authenticateToken, atencionController.getReporteAnioMes);
router.get('/atenciones/intervalo', authenticateToken, atencionController.getAtencionesByDate);
router.get('/reporte-atenciones-usuario/:id', authenticateToken, atencionController.getReporteAnioMesUserId);

module.exports = router;

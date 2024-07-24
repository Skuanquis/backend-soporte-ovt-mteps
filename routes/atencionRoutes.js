const express = require('express');
const router = express.Router();
const atencionController = require('../controllers/atencionController');
const authenticateToken = require('../middlewares/authMiddlewares');

router.post('/atenciones', authenticateToken, atencionController.createAtencion);
router.get('/atenciones', authenticateToken, atencionController.getAtencionesByUser); 
router.put('/atenciones/:id', authenticateToken, atencionController.updateAtencion);

module.exports = router;

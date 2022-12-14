import {Router} from 'express';
import {create, findAll} from ''

const router = Router();

router.post('/categories', create);
router.get('/categories'.findAll);

export default router;
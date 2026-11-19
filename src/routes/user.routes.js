const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { validateBody, validateId } = require('../middleware/validate');

const schema = {
  email: { type: 'string', required: true, email: true, max: 255 },
  username: { type: 'string', required: true, min: 3, max: 50 },
  password: { type: 'string', required: true, min: 6, max: 100 },
  role: { type: 'string', oneOf: ['USER', 'ADMIN'] },
};

router.get('/', controller.getAll);
router.get('/:id', validateId(), controller.getOne);
router.post('/', validateBody(schema), controller.create);
router.put('/:id', validateId(), validateBody(schema, { partial: true }), controller.update);
router.delete('/:id', validateId(), controller.remove);

module.exports = router;

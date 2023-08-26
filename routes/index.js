const router = require('express').Router();
const apiRoutes = require('./api');

//create api endpoint for users and thoughts
router.use('/api', apiRoutes);

router.use((req, res) => res.send('Wrong route dude!'));


module.exports = router;
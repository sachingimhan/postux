const express = require('express');

const router = express.Router();

router.post('/', (req, res, next) => {
    return res.send({ data:'success' });
});

module.exports = router;
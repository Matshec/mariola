const router = require('express').Router();
const service = require('./service');
const ensureFacultyMember = require('utils/guards').ensureFacultyMember;

router.get('/:facultyId', ensureFacultyMember(), (req, res) => {
    service.findAllIntentionsByFacultyId(req.params.facultyId)
        .then(exchanges => res.send(exchanges))
});

router.post('/', /*ensureFacultyMember(),*/ (req, res, next) => {
    service.create(req.body.forId, req.user.id)
        .then(ex => res.send({id: ex.id}))
        .catch(err => next(err))
});

router.post('/specific', ensureFacultyMember(), (req, res, next) => {
   service.exchange(req.body.intentionId, req.user.id)
        .then(() => res
            .status(201)
            .end())
        .catch(err => next(err))
});

router.delete('/:intentionId', /*ensureFacultyMember(),*/ (req, res, next) => {
    service.remove(req.params.intentionId)
        .then(() => res
            .status(204)
            .end())
        .catch(err => next(err))
});



module.exports = router;

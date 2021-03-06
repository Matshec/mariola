const passport = require('passport-mariola');


const blacklistedDecryptedTokens = new Set;


const unauthenticate = user => {
    const encryptedUser = encryptUser(user);
    blacklistedDecryptedTokens.add(encryptedUser);
    // setTimeout(() => blacklistedDecryptedTokens.remove(encryptedUser), (user.exp - user.iat) * 1000)
};


const encryptUser = ({id, iat, exp}) => JSON.stringify({id, iat, exp});


const ensureFacultyMember = (idGetter=defaultIdGetter) => (req, res, next) => {
    if(idGetter(req) in req.user.faculties){
        next()
    } else {
        res.send(403, {message: 'You are not member of faculty!'})
    }
};

const ensureAuthenticated = passport.authenticate('jwt', {session: false})


const ensureIsAdmin = (idGetter=defaultIdGetter) => (req, res, next) => {
    if(req.user.faculties[idGetter(req)]){
        next()
    } else {
        res.send(403, {message: 'You are the root!'})
    }
};


const ensureNotLogout = (req, res, next) => {
    if( !blacklistedDecryptedTokens.has(encryptUser(req.user)) ){
        next()
    } else {
        res
            .status(401)
            .end()
    }
};


const defaultIdGetter = req => req.params.facultyId || req.body.facultyId;


module.exports={
    ensureAuthenticated,
    ensureFacultyMember,
    ensureIsAdmin,
    ensureNotLogout,
    unauthenticate
};
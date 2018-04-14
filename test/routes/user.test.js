const app = require('../../app');
const chai= require('chai');
const chaiHttp = require('chai-http');
const jwt = require('passport-mariola/jwt');

chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const assert = chai.assert;

describe('User test', function () {

    describe('GET /api/users/me', function () {
        let user = {
            id: 0,
            name: "Jaś",
            lastName: "Fasola",
        };

        let token = jwt(user);

        it('Should return Jaś Fasola user', function () {
            request(app)
                .get('/api/users/me')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    assert.equal(user.name, res.body.name, "Expected name to be Jaś, not " + res.body.name)
                })
        });

        it('Should return status 401 without user info', function () {
            request(app)
                .get('/api/users/me')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    assert.equal(Object.keys(res.body), 0, "response should be empty")
                })
        })
    })
});
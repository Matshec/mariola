const app = require('../../app');
const chai= require('chai');
const chaiHttp = require('chai-http');
const jwt = require('passport-mariola/jwt');

chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const assert = chai.assert;

const db = require('database')


describe('Faculty endpoints', function () {
    let tester = {
        name: "Jaś",
        lastName: "Fasola",
        profileId: 'asdf'
    };

    let token;
    beforeEach('Create database', async function () {
        await db.connection.sync({force: true})
        await db.User.create(tester);
        token = jwt(tester)
    });

    describe('GET /api/faculties/available', function () {

        it('Should return list with one element', async function () {
            await db.AvailableFaculty.create({
                name: 'Informatyka',
                semester: 4,
                url: 'http://planzajec.eaiib.agh.edu.pl/view/timetable/334/events'
            });

            request(app)
                .get('/api/faculties/available')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    assert.lengthOf(res.body, 1, `List of available faculties should be equal 1, not ${res.body.length}`);
                })
        });

        it('Should return empty list', function () {
            request(app)
                .get('/api/faculties/available')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    assert.lengthOf(res.body, 0, `List of available faculties should be empty`);
                })
        });

    });

    describe('GET /api/faculties', function () {

        it('Should return list with two elements', async function () {
            let availableFaculty1 = await db.AvailableFaculty.create({
                name: 'Informatyka',
                semester: 4,
                url: 'http://planzajec.eaiib.agh.edu.pl/view/timetable/334/events'
            });

            let availableFaculty2 = await db.AvailableFaculty.create({
                name: 'Informatyka',
                semester: 6,
                url: 'http://planzajec.eaiib.agh.edu.pl/view/timetable/336/events'
            });

            await db.Faculty.create({
                name: 'Informatyka 3 rok',
                availableFacultyId: availableFaculty1.id,
            });

            await db.Faculty.create({
                name: 'Informatyka 3 rok',
                availableFacultyId: availableFaculty2.id,
            });

            request(app)
                .get('/api/faculties')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    assert.lengthOf(res.body, 2, `List of faculties should be equal 2, not ${res.body.length}`);
                })
        });

        it('Should return empty list', function () {
            request(app)
                .get('/api/faculties')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    assert.lengthOf(res.body, 0, `List of faculties should be empty`);
                })
        });

    })


    describe('POST /api/faculties/create', function () {

        it('Should create faculty, download plan and assign tester to this faculty as admin', async function () {
            let availableFaculty = await db.AvailableFaculty.create({
                name: 'Informatyka',
                semester: 6,
                url: 'http://student.agh.edu.pl/~miwas/plan-mocks.json'
            });

            request(app)
                    .post('/api/faculties/create')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        name: "Informatyka 3 rok",
                        facultyId: availableFaculty.id,
                        initialGroup: "4b"
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                    })

        });
    })
});


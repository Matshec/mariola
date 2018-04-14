const app = require('../../app');
const chai= require('chai');
const chaiHttp = require('chai-http');
const jwt = require('passport-mariola/jwt');

chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const assert = chai.assert;

const db = require('database');



describe('Exchange endpoints', function () {
    let tester = {
        name: "Jaś",
        lastName: "Fasola",
        profileId: 'asdf'
    };

    let token;
    beforeEach('Create database', async function () {
        await db.connection.sync({force: true});

        const secodnTester = await db.User.create({
            name: "James",
            lastName: "Bond",
            profileId: 'asdffasdf'
        });

        tester = await db.User.create(tester);

        let availableFaculty = await db.AvailableFaculty.create({
            name: 'Informatyka',
            semester: 6,
            url: 'url'
        });

        let faculty = await db.Faculty.create({
            name: 'Informatyka 3 rok',
            availableFacultyId: availableFaculty.id,
        });

        await db.UserFaculty.create({
            userId: tester.id,
            facultyId: faculty.id,
            isAdmin: false
        });

        await db.UserFaculty.create({
            userId: secodnTester.id,
            facultyId: faculty.id,
            isAdmin: false
        });



        token = jwt(tester)
    });

    describe('GET /api/exchanges', function () {

        it('Should return list with one element', async function () {


            request(app)
                .get('/api/exchanges')
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

    describe('POST /api/exchanges', function () {

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
});


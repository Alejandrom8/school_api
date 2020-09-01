const SubjectConnector = require('../src/models/connectors/Subject.connector');

describe('testing the subject connector', () => {

    function testResponse(res) {
        expect(res).not.toBeNull();
        expect(typeof res).toBe('object');
        expect(res.success).toBeTruthy();
        expect(res.success).toBe(true);
    }

    it('get the info of a subject', async () => {
        let subjectID = '9439FFA';
        let result = await SubjectConnector.getSubject(subjectID);

        testResponse(result);
        expect(result.data).not.toBeNull();
    });

    it('get various subjects by ID', async () => {
        let subjects = ['9439FFA', '9DD95E1', 'EEDDBBE', 'ED87FF4'];
        let result = await SubjectConnector.getManySubjects(subjects);

        testResponse(result);
        expect(result.data).toBeTruthy();
        expect(typeof result.data).toBe('object');
        expect(result.data).toHaveLength(subjects.length);
    });

    it('get all the subjects for the given semester ID', async () => {
        let semester = 1;
        let result = await SubjectConnector.getSubjectsBySemester(semester);

        testResponse(result);
        expect(result.data).toBeTruthy();
        expect(typeof result.data).toBe('object');
        expect(result.data).toHaveLength(18);
    });
});
const ActivityConnector = require('../src/models/connectors/Activity.connector');

describe('testing the activity connector', () => {

    function testResponse(res) {
        expect(res).not.toBeNull();
        expect(typeof res).toBe('object');
        expect(res.success).toBeTruthy();
        expect(res.success).toBe(true);
    }

    it('get the info of an activity', async () => {
        let activityID = '042D947';
        let result = await ActivityConnector.getActivity(activityID);

        testResponse(result);
        expect(result.data).not.toBeNull();
    });

    it('get various activities by ID', async () => {
        let activities = ['042D947', 'A0AE67C', 'ECBB402', 'B8591DF'];
        let result = await ActivityConnector.getActivities(activities);

        testResponse(result);
        expect(result.data).toBeTruthy();
        expect(typeof result.data).toBe('object');
        expect(result.data).toHaveLength(activities.length);
    });

    it('get all the activities for the given module ID', async () => {
        let moduleID = 'A2ED5B3';
        let result = await ActivityConnector.getModuleActivities(moduleID);

        testResponse(result);
        expect(result.data).toBeTruthy();
        expect(typeof result.data).toBe('object');
    });
});
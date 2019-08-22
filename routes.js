var express = require('express');
var router = express.Router();
const DatabaseService = require('./database/DatabaseService');
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json();

// REMOVE ME IF NOT NEEDED
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/* GET home page. */
router.get('/', (request, response) => response.render('index'));


router.get('/teams', (request, response) => DatabaseService.getAllTeams((error, result) => {
    if (error) handleError(error);
    else response.send(result.rows);
}));


router.get('/stories', (request, response) => {

    // Check for teamId query parameter in request URL
    const teamId = request.query.teamId;

    // If teamId is present, send stories belonging to that team
    if (teamId) DatabaseService.getStoriesByTeamId(teamId, (error, result) => {
        if (error) handleError(error);
        else response.send(result.rows);
    });

    // Otherwise, send all stories
    else DatabaseService.getAllStories((error, result) => {
        if (error) handleError(error);
        else response.send(result.rows);
    });
});

router.get('/stories/:storyId', (request, response) => {

    const storyId = request.params.storyId;

    DatabaseService.getStoryById(storyId, (error, result) => {
        if (error) handleError(error);
        else response.send(result.rows[0]);
    });
});


router.get('/sprints', (request, response) => {

    // Check for query parameters in request URL
    const teamId = request.query.teamId;

    // If teamId is present, send sprints belonging to that team
    if (teamId) {
        DatabaseService.getSprintsByTeamId(teamId, (error, result) => {
            if (error) handleError(error);
            else response.send(result.rows);
        });

    // Otherwise, send all sprints
    } else DatabaseService.getAllSprints((error, result) => {
        if (error) handleError(error);
        else response.send(result.rows);
    });
});


router.post('/stories/new', jsonParser, (request, response) => {
    const newStory = request.body;
    DatabaseService.insertNewStory(newStory, (error, insertResult) => {
        if (error) handleError(error);
        else response.send(insertResult);
    });
});

router.post('/stories/:storyId', (request, response) => {
    const story = request.body;
    DatabaseService.updateExistingStory(story, (error, updateResult) => {
        if (error) handleError(error);
        else response.send(updateResult);
    });
});

router.post('/sprints/new', jsonParser, (request, response) => {
    const newSprint = request.body;
    DatabaseService.insertNewSprint(newSprint, (error, insertResult) => {
        if (error) handleError(error);
        else response.send(insertResult);
    });
});

router.get('/statuses', (request, response) => {
    DatabaseService.getAllStoryStatuses((error, result) => {
        if (error) handleError(error);
        else response.send(result.rows);
    });
});

router.get('/sidebar/:userId', (request, response) => {
    const userId = request.params.userId;
    DatabaseService.getSidebarInfo(userId, (error, result) => {
        if (error) handleError(error);
        else response.send(result);
    });
});


const handleError = error => console.log("ERROR: " + error);

module.exports = router;

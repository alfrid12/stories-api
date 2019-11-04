var express = require('express');
var router = express.Router();
const DatabaseService = require('./database/DatabaseService');
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json();

/* GET home page. */
router.get('/', (request, response) => response.render('index'));





///////////////////////////////////////////
// Route for retrieving multiple stories //
///////////////////////////////////////////

router.get('/stories', (request, response) => {

    // Extract teamId from URL
    const teamId = request.query.teamId;
    const creatorId = request.query.creatorId;
    const assigneeId = request.query.assigneeId;

    // If teamId is specified, send stories belonging to that team
    if (teamId) {
        DatabaseService.getStoriesByTeamId(teamId, (error, result) => {
            if (error) handleError(error);
            else response.send(result.rows);
        });

    // If creatorId is specified, send stories created by that user
    } else if (creatorId) {
        DatabaseService.getStoriesByCreatorId(creatorId, (error, result) => {
            if (error) handleError(error);
            else response.send(result.rows);
        });
    
    //If assigneeId is specified, send stories assigned to that user
    } else if (assigneeId) {
        DatabaseService.getStoriesByAssigneeId(assigneeId, (error, result) => {
            if (error) handleError(error);
            else response.send(result.rows);
        });
    }

    // Otherwise, send all stories
    else DatabaseService.getAllStories((error, result) => {
        if (error) handleError(error);
        else response.send(result.rows);
    });
});







// Route for retrieving individual story
router.get('/stories/:storyId', (request, response) => {

    // Extract storyId from URL
    const storyId = request.params.storyId;

    // Extract userId from request params
    const userId = request.query.userId;

    // If userId is specified, get favorite information along with story information
    if (userId) {

        const storyPromise = () => {
            return new Promise((resolve, reject) => {
                DatabaseService.getStoryById(storyId, (error, result) => {
                    if (error) reject(error);
                    else resolve(result.rows[0]);
                });
            });
        };

        const favoritePromise = () => {
            return new Promise((resolve, reject) => {
                DatabaseService.getFavoriteByStoryIdAndUserId(storyId, userId, (error, result) => {
                    if (error) reject(error);
                    else resolve(result.rows[0]);
                });
            });
        };

        Promise.all([storyPromise(), favoritePromise()]).then(results => {
            const [story, favorite] = results;

            let responseObject = {};

            if (story) responseObject = story;

            if (favorite) responseObject.isFavoritedByUser = true;

            response.send(responseObject);
        });
    } else {
        DatabaseService.getStoryById(storyId, (error, result) => {
            if (error) handleError(error);
            else response.send(result.rows[0]);
        });
    }
});

// Route for creating new story
router.post('/stories', jsonParser, (request, response) => {
    const newStory = request.body;
    DatabaseService.insertNewStory(newStory, (error, insertResult) => {
        if (error) handleError(error);
        else response.send(insertResult);
    });
});

// Route for updating existing story
router.post('/stories/:storyId', (request, response) => {
    const story = request.body;
    DatabaseService.updateExistingStory(story, (error, updateResult) => {
        if (error) handleError(error);
        else response.send(updateResult);
    });
});

// Route for retrieving multiple teams
router.get('/teams', (request, response) => DatabaseService.getAllTeams((error, result) => {
    if (error) handleError(error);
    else response.send(result.rows);
}));

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

router.get('/favorites/:userId', (request, response) => {

    // Extract userId from URL
    const userId = request.params.userId;
    
    DatabaseService.getFavoritesByUserId(userId, (error, result) => {
        if (error) handleError(error);
        else response.send(result.rows);
    });
});

router.post('/favorites', jsonParser, (request, response) => {

    const storyId = request.body.storyId;
    const userId = request.body.userId;

    DatabaseService.addFavorite(storyId, userId, (error, insertResult) => {
        if (error) handleError(error);
        else response.send(insertResult);
    });
});


router.delete('/favorites', (request, response) => {

    // Check for query parameters in request URL
    const storyId = request.query.storyId;
    const userId = request.query.userId;

    if (storyId && userId) {
        DatabaseService.removeFavorite(storyId, userId, (error, deleteResult) => {
            if (error) handleError(error);
            else response.send(deleteResult);
        });
    } else response.end();
});

const handleError = error => console.log("ERROR: " + error);

module.exports = router;

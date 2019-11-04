const { Client } = require('pg');
const databaseConfig = require('./dbConfig.json')


/////////////////////////////////////
//  ALL EXPORTED FUNCTIONS GO HERE //
/////////////////////////////////////

const getAllTeams = callback => {
    connectToDb(client => {
        let sql = `SELECT * FROM teams;`;

        client.query(sql, (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getAllStories = callback => {
    connectToDb(client => {
        let sql = `SELECT s.id,
                          s."createdBy",
                          s.title,
                          s."statusId",
                          s."teamId",
                          s."createdTimestamp",
                          s."parentId",
                          s.notes,
                          s."acceptanceCriteria",
                          s."resolvedTimestamp",
                          s."storyPoints",
                          ss.name AS "statusName"
                   FROM stories AS s, "storyStatuses" AS ss
                   WHERE s."statusId" = "ss".id;`;

        client.query(sql, (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getStoriesByTeamId = (teamId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM stories
                   WHERE stories."teamId" = $1;`;

        client.query(sql, [teamId], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getStoriesByCreatorId = (creatorId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM stories 
                   WHERE stories."createdBy" = $1;`;

        client.query(sql, [creatorId], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getStoriesByAssigneeId = (assigneeId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM "storyAssignees", stories
                   WHERE "storyAssignees"."userId" = $1 AND 
                   stories.id = "storyAssignees"."storyId";`;

        client.query(sql, [assigneeId], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getStoryById = (storyId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM stories
                   WHERE stories.id = $1;`;

        client.query(sql, [storyId], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getStoryByIdForUser = (storyId, userId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM stories INNER JOIN favorites
                   ON stories.id = favorites."storyId" AND favorites."userId" = $2
                   WHERE stories.id = $1;`;

        client.query(sql, [storyId, userId], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getFavoriteByStoryIdAndUserId = (storyId, userId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM favorites
                   WHERE favorites."storyId" = $1 AND 
                         favorites."userId" = $2;`;

        client.query(sql, [storyId, userId], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getAllSprints = callback => {
    connectToDb(client => {
        let sql = `SELECT * FROM sprints;`;

        client.query(sql, [], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getSprintsByTeamId = (teamId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM sprints
                   WHERE sprints."teamId" = $1;`;

        client.query(sql, [teamId], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const getAllStoryStatuses = callback => {
    connectToDb(client => {
        let sql = `SELECT * FROM "storyStatuses";`;
        client.query(sql, (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const insertNewTeam = (team, callback) => {
    connectToDb(client => {
        let sql = `INSERT INTO teams (id, name, userGroup)
                   VALUES ($1, $2, $3);`;
        const values = [team.id, team.name, team.userGroup];

        client.query(sql, values, (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const insertNewSprint = (sprint, callback) => {
    connectToDb(client => {
        let sql = `INSERT INTO sprints (name, "teamId", "startTimestamp", "endTimestamp")
                   VALUES ($1, $2, $3, $4);`;
        const values = [sprint.name, sprint.teamId, sprint.startTimestamp, sprint.endTimestamp];

        client.query(sql, values, (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const insertNewStory = (story, callback) => {
    connectToDb(client => {

        // First, get number of stories under specified team
        let sql = 'SELECT COUNT(stories.id) FROM stories WHERE stories."teamId" = $1;';

        client.query(sql, [story.teamId], (error, response) => {
            if (error) handleDatabaseError(error);
            else {

                /*  The new story's number will be the number of stories
                under that team plus one. Ex.- there are already three stories,
                new story will be #4    */
                const newStoryNumber = parseInt(response.rows[0].count) + 1;
                const newStoryId = story.teamId + '-' + newStoryNumber

                sql = `INSERT INTO stories (
                        "id",
                        "createdBy",
                        "title",
                        "statusId",
                        "teamId",
                        "createdTimestamp",
                        "parentId",
                        "notes",
                        "acceptanceCriteria",
                        "storyPoints"
                    ) VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;

                const values = [
                    newStoryId,                    
                    story.createdBy,
                    story.title,
                    story.statusId,
                    story.teamId,
                    Date.now(),
                    story.parentId,
                    story.notes,
                    story.acceptanceCriteria,
                    story.storyPoints
                ];

                client.query(sql, values, (error, response) => callback(error, response));
            }
        });
    });
}

const updateExistingStory = (story, callback) => {
    connectToDb(client => {
        let sql = `UPDATE stories
                   SET title = $1,
                       "statusId" = $2,
                       "teamId" = $3,
                       "parentId" = $4,
                       notes = $5,
                       "acceptanceCriteria" = $6,
                       "storyPoints" = $7
                   WHERE stories.id = $8;`;

        const values = [
            story.title, story.statusId, story.teamId, story.parentId,
            story.notes, story.acceptanceCriteria, story.storyPoints, story.id
        ];

        client.query(sql, values, (error, response) => {
            client.end();
            callback(error, response);
        });
    });
}

const getFavoritesByUserId = (userId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM favorites WHERE favorites."userId" = $1;`;

        client.query(sql, [userId], (error, response) => {
            client.end();
            callback(error, response);
        });
    });
}

const addFavorite = (storyId, userId, callback) => {
    connectToDb(client => {
        let sql = `INSERT INTO favorites ("storyId", "userId") VALUES ($1, $2);`;

        client.query(sql, [storyId, userId], (error, response) => {
            client.end();
            callback(error, response);
        });
    });
};

const removeFavorite = (storyId, userId, callback) => {
    connectToDb(client => {
        let sql = `DELETE FROM favorites
                   WHERE "storyId" = $1 AND
                         "userId" = $2;`;

        client.query(sql, [storyId, userId], (error, response) => {
            client.end();
            callback(error, response);
        });
    });
};

/////////////////
//  UTILITIES  //
/////////////////

// FIXME: extract creds to environment file
const connectToDb = callback => {

    const client = new Client({
        user: databaseConfig.user,
        host: databaseConfig.databaseUrl,
        database: databaseConfig.databaseName,
        password: databaseConfig.password,
        port: databaseConfig.port,
    });

    client.connect();
    callback(client);
}

const handleDatabaseError = error => console.log(error);

module.exports = {
    getAllTeams,
    insertNewTeam,
    getAllStories,
    getStoriesByTeamId,
    getStoriesByCreatorId,
    getStoriesByAssigneeId,
    getStoryById,
    getStoryByIdForUser,
    getFavoriteByStoryIdAndUserId,
    insertNewStory,
    updateExistingStory,
    getAllSprints,
    getSprintsByTeamId,
    insertNewSprint,
    getAllStoryStatuses,
    getFavoritesByUserId,
    addFavorite,
    removeFavorite
};

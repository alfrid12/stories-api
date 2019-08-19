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
                          s."storyNumber",
                          s.title,
                          s."statusId",
                          s."teamId",
                          s."createdTimestamp",
                          s."parentId",
                          s.description,
                          s."acceptanceCriteria",
                          s."resolvedTimestamp",
                          s."storyPoints",
                          t.abbreviation AS "teamAbbreviation",
                          ss.name AS "statusName"
                   FROM stories AS s, teams AS t, "storyStatuses" AS ss
                   WHERE s."teamId" = t.id AND
                         s."statusId" = "ss".id;`;

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

const getStoryByStoryName = (storyName, callback) => {

    const storyNumber = getStoryNumberFromStoryName(storyName);
    const teamAbbreviation = getTeamAbbreviationFromStoryName(storyName);

    connectToDb(client => {
        let sql = `SELECT s.id,
                          s."statusId",
                          s.title,
                          s.description,
                          s."acceptanceCriteria",
                          s."teamId",
                          s."createdTimestamp",
                          s."storyPoints",
                          t.name AS "teamName",
                          t.abbreviation AS "teamAbbreviation"
                   FROM stories AS s, teams AS t
                   WHERE s."storyNumber" = $1 AND
                         t.abbreviation = $2 AND
                         s."teamId" = t."id";`;

        client.query(sql, [storyNumber, teamAbbreviation], (error, result) => {
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

const getSprintsByTeamAbbreviation = (teamAbbreviation, callback) => {
    connectToDb(client => {
        let sql = `SELECT s.id, s.name, s."teamId", s."startTimestamp", s."endTimestamp"
                   FROM sprints AS s, teams AS t
                   WHERE s."teamId" = t.id AND
                   t."abbreviation" = $1;`;

        client.query(sql, [teamAbbreviation], (error, result) => {
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

const getFavoritesByUserId = (userId, callback) => {
    connectToDb(client => {
        let sql = `SELECT * FROM favorites
                   WHERE favorites."userId" = $1;`;
        
        client.query(sql, [userId], (error, result) => {
            client.end();
            callback(error, result);
        });
    });
}

const insertNewTeam = (team, callback) => {
    connectToDb(client => {
        let sql = `INSERT INTO teams (name, abbreviation, userGroup, storyCounter)
                   VALUES ($1, $2, $3, $4);`;
        const values = [team.name, team.abbreviation, team.userGroup, 0];

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
                const storyNumber = parseInt(response.rows[0].count) + 1;

                sql = `INSERT INTO stories (
                        "createdBy",
                        "storyNumber",
                        "title",
                        "statusId",
                        "teamId",
                        "createdTimestamp",
                        "parentId",
                        "description",
                        "acceptanceCriteria",
                        "storyPoints"
                    ) VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;

                const values = [
                    story.createdBy,
                    storyNumber,
                    story.title,
                    story.statusId,
                    story.teamId,
                    Date.now(),
                    story.parentId,
                    story.description,
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
                       description = $5,
                       "acceptanceCriteria" = $6,
                       "storyPoints" = $7
                   WHERE stories.id = $8`;

        const values = [
            story.title, story.statusId, story.teamId, story.parentId, 
            story.description, story.acceptanceCriteria, story.storyPoints, story.id
        ];

        client.query(sql, values, (error, response) => {
            client.end();
            callback(error, response);
        });
    });
}

// Query stories for assigned to and created by
// Query favorites
const getSidebarInfo = (userId, callback) => {
    connectToDb(client => {

        let sql = ``;

        client.query(sql, [], (error, response) => {
            client.end();
            callback(error, response);
        });
    });
}


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

const getStoryNumberFromStoryName = storyName => {
    const indexOfHyphen = storyName.indexOf('-');
    const storyNumber = storyName.substring(indexOfHyphen + 1, storyName.length);
    return storyNumber;
}

const getTeamAbbreviationFromStoryName = storyName => {
    const indexOfHyphen = storyName.indexOf('-');
    const teamAbbreviation = storyName.substring(0, indexOfHyphen);
    return teamAbbreviation;
}


module.exports = {
    getAllTeams,
    getAllStories,
    getSprintsByTeamId,
    getSprintsByTeamAbbreviation,
    getStoriesByTeamId,
    insertNewTeam,
    insertNewStory,
    insertNewSprint,
    updateExistingStory,
    getStoryByStoryName,
    getAllStoryStatuses,
    getSidebarInfo
};

DROP TABLE IF EXISTS "favorites";
DROP TABLE IF EXISTS "storyAssignees";
DROP TABLE IF EXISTS "storyPlanning";
DROP TABLE IF EXISTS "storyComments";
DROP TABLE IF EXISTS "stories";
DROP TABLE IF EXISTS "storyStatuses";

DROP TABLE IF EXISTS "sprints";
DROP TABLE IF EXISTS "teams";

CREATE TABLE "teams" (
    "id" VARCHAR(10) PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "userGroup" VARCHAR(200) NOT NULL
);

CREATE TABLE "sprints" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "teamId" VARCHAR(10) REFERENCES "teams"(id) NOT NULL,
    "startTimestamp" BIGINT,
    "endTimestamp" BIGINT
);

CREATE TABLE "storyStatuses" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL
);

CREATE TABLE "stories" (
    "id" VARCHAR(20) PRIMARY KEY,
    "createdBy" VARCHAR(30) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "statusId" INT REFERENCES "storyStatuses"(id) NOT NULL,
    "teamId" VARCHAR(10) REFERENCES "teams"(id) NOT NULL,
    "createdTimestamp" BIGINT NOT NULL,
    "parentId" VARCHAR(20) REFERENCES "stories"(id),
    "notes" VARCHAR(10000),
    "acceptanceCriteria" VARCHAR(10000),
    "resolvedTimestamp" BIGINT,
    "storyPoints" INT
);

CREATE TABLE "storyComments" (
    "id" SERIAL PRIMARY KEY,
    "storyId" VARCHAR(20) NOT NULL REFERENCES "stories"(id),
    "userId" VARCHAR(50) NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "createdTimestamp" BIGINT NOT NULL
);

CREATE TABLE "storyPlanning" (
    "id" SERIAL PRIMARY KEY,
    "storyId" VARCHAR(20) REFERENCES "stories"(id) NOT NULL,
    "sprintId" INT REFERENCES "sprints"(id) NOT NULL
);

CREATE TABLE "storyAssignees" (
    "id" SERIAL PRIMARY KEY,
    "storyId" VARCHAR(20) REFERENCES "stories"(id) NOT NULL,
    "userId" VARCHAR(30) NOT NULL
);

CREATE TABLE "favorites" (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(100) NOT NULL,
    "url" VARCHAR(200) NOT NULL,
    "displayText" VARCHAR(100) NOT NULL
);

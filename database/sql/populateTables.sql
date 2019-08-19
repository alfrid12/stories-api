INSERT INTO "storyStatuses" (name) VALUES 
('Ready for Refinement'),
('Ready for Planning'),
('In Progress'),
('Blocked'),
('Resolved'),
('Closed');

INSERT INTO "teams" ("name", "abbreviation", "userGroup") VALUES 
('The ABC team', 'ABC', 'ldap group 1'),
('The DEF team', 'DEF', 'ldap group 2'),
('TEAM ALEX', 'ABF', 'ldap group 3');

INSERT INTO sprints ("name", "teamId") VALUES 
('ABC team sprint 1', 1),
('ABC team sprint 2', 1),
('DEF sprint', 2),
('Alex"s first sprint', 3);

INSERT INTO stories ("createdBy", "storyNumber", "title", "statusId", "teamId", "createdTimestamp", "description", "acceptanceCriteria") VALUES
('n0350204', 1, 'Test story 1', 1, 1, 1561110953, 'description 1', 'acceptance criteria 1'),
('n0350204', 1, 'Test story 2', 1, 2, 1561110953, 'description 2', 'acceptance criteria 1'),
('n0350204', 1, 'Test story 3', 1, 3, 1561110953, 'description 3', 'acceptance criteria 3');
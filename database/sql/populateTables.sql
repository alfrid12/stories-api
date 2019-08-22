INSERT INTO "storyStatuses" (name) VALUES 
('Ready for Refinement'),
('Ready for Planning'),
('In Progress'),
('Blocked'),
('Resolved'),
('Closed');

INSERT INTO "teams" ("id", "name", "userGroup") VALUES 
('ABC', 'The ABC team', 'ldap group 1'),
('DEF', 'The DEF team', 'ldap group 2'),
('ABF', 'TEAM ALEX', 'ldap group 3');

INSERT INTO sprints ("name", "teamId") VALUES 
('ABC team sprint 1', 'ABC'),
('ABC team sprint 2', 'ABC'),
('DEF sprint', 'DEF'),
('Alex''s first sprint', 'ABF');

INSERT INTO stories ("id", "createdBy", "title", "statusId", "teamId", "createdTimestamp", "notes", "acceptanceCriteria") VALUES
('ABC-1', 'n0350204', 'Test story 1', 1, 'ABC', 1561110953, 'notes 1', 'acceptance criteria 1'),
('ABC-2', 'n0350204', 'Test story 2', 1, 'ABC', 1561110953, 'notes 2', 'acceptance criteria 1'),
('DEF-1', 'n0350204', 'Test story 3', 1, 'DEF', 1561110953, 'notes 3', 'acceptance criteria 3');
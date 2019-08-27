INSERT INTO "storyStatuses" (name) VALUES 
('Ready for Refinement'),
('Ready for Planning'),
('In Progress'),
('Blocked'),
('Resolved'),
('Closed');

INSERT INTO "teams" ("id", "name", "userGroup") VALUES 
('UND', 'The Undergrads', 'ldap group 1'),
('GSA', 'Grad School Applications', 'ldap group 2'),
('ABF', 'TEAM ALEX', 'ldap group 3');

INSERT INTO sprints ("name", "teamId") VALUES 
('Undergrads 1.1', 'ABC'),
('Undergrads 1.2', 'ABC'),
('Grad School 1.1', 'DEF'),
('Alex''s first sprint', 'ABF');

INSERT INTO stories ("id", "createdBy", "title", "statusId", "teamId", "createdTimestamp", "notes", "acceptanceCriteria") VALUES
('UND-1', 'n0350204', 'Choose front end framework', 1, 'UND', 1561110953, 'Options: Angular, Vue', 'A front end framework has been chosen'),
('UND-2', 'n0000000', 'Choose back end stack', 1, 'UND', 1561110953, 'Options: Django, Spoot, Scala, Go, MySQL, MongoDB', 'A backend language, framework, and database has been chosen'),
('GSA-1', 'n0000000', 'Choose potential schools', 3, 'GSA', 1561110953, 'So far: Illinois, UMD, University of Michigan, Ann Arbor, Northeastern', 'A definitive list of grad schools has been chosen'),
('GSA-2', 'n1111111', 'GRE', 3, 'GSA', 1561110953, '', 'GRE scores have been received by all intended schools');

INSERT INTO "storyAssignees" ("storyId", "userId") VALUES 
('GSA-1', 'n0350204');

INSERT INTO favorites ("userId", "url", "displayText") VALUES 
('n0350204', '/stories/GSA-2', 'GSA-2'),
('n0350204', '/stories/UND-2', 'UND-2');
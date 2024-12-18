CREATE TYPE member_status AS ENUM('active', 'inactive');

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  parent_id INT DEFAULT NULL,
  name character varying(255) NOT NULL,
  description character varying(1000) DEFAULT NULL,
  department character varying(255) DEFAULT NULL
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name character varying(255) NOT NULL,
  role character varying(255),
  status member_status NOT NULL,
  team_id INT,
  CONSTRAINT fk_teams FOREIGN KEY (team_id)
  REFERENCES teams(id)
);


INSERT INTO teams (id, parent_id, name, description, department) VALUES
(1, NULL, 'Leadership', NULL, NULL),
(2, 1, 'Engineering', 'The engineering department of the organisation', 'Engineering'),
(3, 2, 'Platform', 'The team in charge of maintaining and developing our platform product', 'Engineering'),
(4, 2, 'ORM', 'The team in charge of developing our ORM', 'Engineering'),
(5, 1, 'Customer Support', 'The team making sure our users get the most benefits out of our products', 'Custoemr Support');

INSERT INTO members (id, name, role, status, team_id) VALUES
(1, 'John Sommers', 'CEO', 'active', 1),
(2, 'Jean Moreau', 'CTO', 'active', 1),
(3, 'Michael Ross', 'CFO', 'active', 1),
(4, 'Penelope Diaz', 'Software Engineer', 'active', 3),
(5, 'Roland Darcy', 'Software Engineer', 'active', 3),
(6, 'Theodore Mackenzie', 'Softawre Engineer', 'active', 3),
(7, 'Jack Elias', 'VP of Engineering', 'active', 2),
(8, 'Mary Tinsdale', 'Softare Engineer', 'active', 4),
(9, 'Juan Perez', 'Software Engineer', 'active', 4),
(10, 'Jennifer Lid', 'Softare Engineer', 'active', 4),
(11, 'Victor Laurel', 'Customer Support Agent', 'active', 5),
(12, 'Thomas Ryan', 'Customer Support Agent', 'inactive', 5);

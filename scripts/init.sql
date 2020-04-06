CREATE DATABASE db;
USE db;

/* -------------------- BEGIN SCHEMA -------------------- */

CREATE TABLE league
(
    name VARCHAR(40),
    country VARCHAR(40),
    yearFounded INTEGER,
    PRIMARY KEY(name, country)
);


CREATE TABLE manager
(
    managerID VARCHAR(7) PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    numCareerWins INTEGER,
    numCareerLoses INTEGER,
    numCareerDraws INTEGER
);


CREATE TABLE club1
(
    name VARCHAR(40),
    country VARCHAR(40),
    location VARCHAR(40),
    PRIMARY KEY(name, country)
);


CREATE TABLE club2
(
    name VARCHAR(40),
    managerID VARCHAR(7),
    leagueName VARCHAR(40),
    country VARCHAR(40),
    UNIQUE(managerID),
    PRIMARY KEY (name, leagueName),
    FOREIGN KEY (leagueName, country)
        REFERENCES league (name, country)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (managerID)
        REFERENCES manager (managerID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE TABLE player
(
    playerID VARCHAR(7) PRIMARY KEY,
    clubName VARCHAR(40),
    leagueName VARCHAR(40),
    number INTEGER NOT NULL,
    name VARCHAR(40) NOT NULL,
    birthdate DATE,
    heightCM REAL,
    weightKG REAL,
    goals INTEGER,
    assists INTEGER,
    numRedCards INTEGER,
    numYellowCards INTEGER,
    UNIQUE(clubName, leagueName, number),
    FOREIGN KEY (clubName, leagueName)
        REFERENCES club2 (name, leagueName)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE TABLE fieldPlayer
(
    playerID VARCHAR(7) PRIMARY KEY,
    penaltyShotsTaken INTEGER,
    penaltyShotsScored INTEGER,
    FOREIGN KEY (playerID)
        REFERENCES player (playerID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE goalkeeper
(
    playerID VARCHAR(7) PRIMARY KEY,
    cleansheets INTEGER,
    goalsConceded INTEGER,
    penaltyShotsSaved INTEGER,
    penaltyShotsConceded INTEGER,
    FOREIGN KEY (playerID)
        REFERENCES player (playerID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE referee
(
    refID VARCHAR(7) PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    birthdate DATE,
    numCareerMatches INTEGER
);


CREATE TABLE game1
(
    dateAndTime TIMESTAMP,
    c1Name VARCHAR(40),
    c2Name VARCHAR(40),
    location VARCHAR(40) NOT NULL,
    c1Score INTEGER NOT NULL,
    c2Score INTEGER NOT NULL,
    PRIMARY KEY (dateAndTime, c1Name, c2Name)
);


CREATE TABLE game2
(
    gameID VARCHAR(7) PRIMARY KEY,
    dateAndTime TIMESTAMP,
    c1Name VARCHAR(40),
    c2Name VARCHAR(40),
    leagueName VARCHAR(40),
    FOREIGN KEY (c1Name, leagueName)
        REFERENCES club2 (name, leagueName)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (c2Name, leagueName)
        REFERENCES club2 (name, leagueName)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE TABLE officiates
(
    refID VARCHAR(7),
    gameID VARCHAR(7),
    PRIMARY KEY (refID, gameID),
    FOREIGN KEY (refID)
        REFERENCES referee (refID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (gameID)
        REFERENCES game2 (gameID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE injury
(
    playerID VARCHAR(7),
    dateAndTime DATE,
    duration REAL,
    type VARCHAR(40) NOT NULL,
    PRIMARY KEY (playerID, dateAndTime),
    FOREIGN KEY (playerID)
        REFERENCES player (playerID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE penalty
(
    playerID VARCHAR(7),
    gameID VARCHAR(7),
    refID VARCHAR(7),
    minuteInGame INTEGER,
    cardColor VARCHAR(7) NOT NULL,
    PRIMARY KEY (playerID, gameID, refID),
    FOREIGN KEY (playerID)
        REFERENCES player (playerID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (refID)
        REFERENCES referee (refID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (gameID)
        REFERENCES game2 (gameID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMIT;

/* -------------------- END SCHEMA -------------------- */

/* -------------------- BEGIN INSERTING DATA -------------------- */
INSERT INTO league
    (name, country, yearFounded)
VALUES
    ('English Premier League', 'England', 1992),
    ('La Liga',                'Spain',   1929),
    ('Bundesliga',             'Germany', 1963),
    ('Serie A',                'Italy',   1898),
    ('Ligue 1',                'France',  1930);


INSERT INTO manager
    (managerID, name, numCareerWins, numCareerLoses, numCareerDraws)
VALUES
    ('0001', 'Mikel Arteta',         8,   2,   5),
    ('0002', 'Frank Lampard',        47,  29,  23),
    ('0003', 'Brendan Rodgers',      293, 136, 104),
    ('0004', 'Jürgen Klopp',         442, 193, 205),
    ('0005', 'Pep Guardiola',        466, 73,  88),
    ('0006', 'Ole Gunnar Solskjaer', 200, 103, 69),
    ('0007', 'Hans-Dieter Flick',    147, 109, 80),
    ('0008', 'Lucien Favre',         363, 224, 171),
    ('0009', 'Maurizio Sarri',       400, 202, 241),
    ('0010', 'Antonio Conte',        264, 82,  107),
    ('0011', 'Thomas Tuchel',        234, 99,  86),
    ('0012', 'André Villas-Boas',    240, 78,  75),
    ('0013', 'Quique Setién',        194, 171, 144),
    ('0014', 'Zinedine Zidane',      149, 38 , 52);
    

INSERT INTO club1
    (name, country, location)
VALUES
    ('Arsenal FC',                'England', 'Islington'),
    ('Chelsea FC',                'England', 'Stamford Bridge'),
    ('Leicester City FC',         'England', 'King Power Stadium'),
    ('Liverpool FC',              'England', 'Anfield'),
    ('Manchester City FC',        'England', 'Etihad Stadium'),
    ('Manchester United FC',      'England', 'Old Trafford'),
    ('FC Bayern Munich',          'Germany', 'Allianz Arena'),
    ('Borussia Dortmund FC',      'Germany', 'Signal Iduna Park'),
    ('Juventus FC',               'Italy',   'Allianz Stadium'),
    ('FC Inter Milan',            'Italy',   'San Siro Stadium'),
    ('Paris Saint-Germain FC',    'France',  'Parc des Princes'),
    ('Olympique de Marseille FC', 'France',  'Orange Vélodrome'),
    ('FC Barcelona',              'Spain',   'Camp Nou'),
    ('Real Madrid CF',            'Spain',   'Santiago Bernabéu Stadium');


INSERT INTO club2
    (name, managerID, leagueName, country)
VALUES
    ('Arsenal FC',                '0001', 'English Premier League', 'England'),
    ('Chelsea FC',                '0002', 'English Premier League', 'England'),
    ('Leicester City FC',         '0003', 'English Premier League', 'England'),
    ('Liverpool FC',              '0004', 'English Premier League', 'England'),
    ('Manchester City FC',        '0005', 'English Premier League', 'England'),
    ('Manchester United FC',      '0006', 'English Premier League', 'England'),
    ('FC Bayern Munich',          '0007', 'Bundesliga',             'Germany'),
    ('Borussia Dortmund FC',      '0008', 'Bundesliga',             'Germany'),
    ('Juventus FC',               '0009', 'Serie A',                'Italy'),
    ('FC Inter Milan',            '0010', 'Serie A',                'Italy'),
    ('Paris Saint-Germain FC',    '0011', 'Ligue 1',                'France'),
    ('Olympique de Marseille FC', '0012', 'Ligue 1',                'France'),
    ('FC Barcelona',              '0013', 'La Liga',                'Spain'),
    ('Real Madrid CF',            '0014', 'La Liga',                'Spain');


INSERT INTO player
    (playerID, name, leagueName, clubName, number, birthdate, heightCM, weightKG, goals, assists, numRedCards, numYellowCards)
VALUES
    /* Arsenal FC starting 11 */
    ('0101', 'Bernd Leno',                'English Premier League', 'Arsenal FC', 1,  '1992-03-04', 189, 79, 0,   0,   0,  16),
    ('0102', 'Sokratis Papastathopoulos', 'English Premier League', 'Arsenal FC', 5,  '1988-06-09', 186, 82, 22,  7,   10, 113),
    ('0103', 'David Luiz',                'English Premier League', 'Arsenal FC', 23, '1987-04-22', 189, 86, 34,  26,  2,  115),
    ('0104', 'Pablo Marí',                'English Premier League', 'Arsenal FC', 22, '1993-08-31', 193, 79, 15,  2,   5,  56),
    ('0105', 'Bukayo Saka',               'English Premier League', 'Arsenal FC', 77, '2001-09-05', 178, 65, 25,  26,  0,  6),
    ('0106', 'Granit Xhaka',              'English Premier League', 'Arsenal FC', 34, '1992-09-27', 186, 82, 34,  32,  10, 101),
    ('0107', 'Dani Ceballos',             'English Premier League', 'Arsenal FC', 8,  '1996-08-07', 179, 65, 13,  13,  1,  29),
    ('0108', 'Nicolas Pépé',              'English Premier League', 'Arsenal FC', 19, '1995-05-29', 183, 69, 53,  29,  0,  16),
    ('0109', 'Mesut Özil',                'English Premier League', 'Arsenal FC', 10, '1988-10-15', 180, 76, 105, 216, 3,  47),
    ('0110', 'Pierre-Emerick Aubameyang', 'English Premier League', 'Arsenal FC', 14, '1989-06-18', 187, 80, 257, 81,  2,  29),
    ('0111', 'Eddie Nketiah',             'English Premier League', 'Arsenal FC', 30, '1999-05-30', 180, 72, 57,  12,  0,  4),
    /* Chelsea FC starting 11 */
    ('0201', 'Kepa Arrizabalaga',       'English Premier League', 'Chelsea FC', 1,  '1994-10-03', 186, 88, 0,   0,   1, 16),
    ('0202', 'César Azpilicueta',       'English Premier League', 'Chelsea FC', 28, '1989-08-23', 178, 77, 15,  54,  2, 66),
    ('0203', 'Antonio Rüdiger',         'English Premier League', 'Chelsea FC', 2,  '1993-03-03', 190, 85, 18,  8,   6, 55),
    ('0204', 'Kurt Zouma',              'English Premier League', 'Chelsea FC', 15, '1994-10-27', 190, 96, 12,  9,   2, 21),
    ('0205', 'Marcos Alonso',           'English Premier League', 'Chelsea FC', 3,  '1990-12-28', 188, 85, 35,  28,  6, 67),
    ('0206', 'Billy Gilmour',           'English Premier League', 'Chelsea FC', 47, '2001-06-11', 170, 60, 19,  14,  1, 8),
    ('0207', 'Ross Barkley',            'English Premier League', 'Chelsea FC', 8,  '1993-12-05', 185, 87, 46,  42,  1, 26),
    ('0208', 'Mason Mount',             'English Premier League', 'Chelsea FC', 19, '1999-01-10', 178, 70, 37,  30,  0, 18),
    ('0209', 'Willian Borges da Silva', 'English Premier League', 'Chelsea FC', 10, '1988-08-09', 175, 88, 99,  130, 1, 44),
    ('0210', 'Pedro Rodriguez',         'English Premier League', 'Chelsea FC', 11, '1987-07-28', 167, 67, 142, 90,  2, 48),
    ('0211', 'Olivier Giroud',          'English Premier League', 'Chelsea FC', 18, '1986-09-30', 193, 91, 203, 80,  6, 57),
    /* Leicester City FC starting 11 */
    ('0301', 'Kasper Schmeichel', 'English Premier League', 'Leicester City FC', 1,  '1986-11-05', 189, 89, 0,  0,  1, 23),
    ('0302', 'Ricardo Pereira',   'English Premier League', 'Leicester City FC', 21, '1993-10-06', 175, 70, 20, 30, 0, 42),
    ('0303', 'Caglar Söyüncü',    'English Premier League', 'Leicester City FC', 4,  '1996-05-23', 187, 82, 4,  2,  2, 32),
    ('0304', 'Jonny Evans',       'English Premier League', 'Leicester City FC', 6,  '1988-01-03', 188, 79, 19, 13, 4, 50),
    ('0305', 'James Justin',      'English Premier League', 'Leicester City FC', 2,  '1998-02-23', 183, 80, 7,  15, 0, 4),
    ('0306', 'Wilfred Ndidi',     'English Premier League', 'Leicester City FC', 25, '1996-12-16', 183, 80, 15, 10, 2, 31),
    ('0307', 'Marc Albrighton',   'English Premier League', 'Leicester City FC', 11, '1989-11-18', 175, 67, 29, 63, 2, 39),
    ('0308', 'James Maddison',    'English Premier League', 'Leicester City FC', 10, '1996-11-23', 175, 73, 40, 36, 2, 22),
    ('0309', 'Dennis Praet',      'English Premier League', 'Leicester City FC', 26, '1994-05-14', 181, 70, 32, 48, 1, 30),
    ('0310', 'Harvey Barnes',     'English Premier League', 'Leicester City FC', 15, '1997-12-09', 180, 66, 40, 31, 0, 7),
    ('0311', 'Kelechi Iheanacho', 'English Premier League', 'Leicester City FC', 14, '1996-10-03', 185, 82, 44, 24, 0, 9),
    /* Liverpool FC starting 11 */
    ('0401', 'Alisson Becker',          'English Premier League', 'Liverpool FC', 1,  '1992-10-02', 191, 91, 0,   0,  1, 7),
    ('0402', 'Trent Alexander-Arnold',  'English Premier League', 'Liverpool FC', 66, '1998-10-07', 180, 69, 10,  38, 0, 20),
    ('0403', 'Virgil van Dijk',         'English Premier League', 'Liverpool FC', 4,  '1991-07-08', 193, 92, 41,  18, 5, 38),
    ('0404', 'Joe Gomez',               'English Premier League', 'Liverpool FC', 12, '1997-05-23', 188, 77, 1,   4,  1, 19),
    ('0405', 'Andrew Robertson',        'English Premier League', 'Liverpool FC', 26, '1994-05-11', 178, 64, 15,  44, 1, 47),
    ('0406', 'Jordan Henderson',        'English Premier League', 'Liverpool FC', 14, '1990-06-17', 187, 80, 34,  63, 2, 52),
    ('0407', 'Alex Oxlade-Chamberlain', 'English Premier League', 'Liverpool FC', 15, '1993-08-15', 175, 70, 42,  50, 0, 14),
    ('0408', 'Georginio Wijnaldum',     'English Premier League', 'Liverpool FC', 5,  '1990-11-11', 175, 74, 112, 56, 0, 23),
    ('0409', 'Mohamed Salah',           'English Premier League', 'Liverpool FC', 11, '1992-06-15', 175, 71, 168, 90, 1, 17),
    ('0410', 'Sadio Mané',              'English Premier League', 'Liverpool FC', 10, '1992-04-10', 174, 69, 148, 81, 7, 49),
    ('0411', 'Roberto Firmino',         'English Premier League', 'Liverpool FC', 9,  '1991-10-02', 181, 76, 134, 95, 0, 42),
    /* Manchester City FC starting 11 */
    ('0501', 'Ederson Santana de Moraes',  'English Premier League', 'Manchester City FC', 31, '1993-08-17', 188, 89, 0,   0,   3,  26),
    ('0502', 'João Cancelo',               'English Premier League', 'Manchester City FC', 27, '1994-05-27', 182, 74, 9,   37,  5,  47),
    ('0503', 'Fernandinho',                'English Premier League', 'Manchester City FC', 25, '1985-05-04', 179, 66, 75,  74,  10, 143),
    ('0504', 'Nicolás Otamendi',           'English Premier League', 'Manchester City FC', 30, '1988-02-12', 183, 82, 28,  12,  3,  105),
    ('0505', 'Oleksandr Zinchenko',        'English Premier League', 'Manchester City FC', 11, '1996-12-15', 175, 61, 5,   24,  1,  7),
    ('0506', 'Rodrigo Hernández Cascante', 'English Premier League', 'Manchester City FC', 16, '1996-06-22', 191, 82, 11,  8,   0,  35),
    ('0507', 'David Silva',                'English Premier League', 'Manchester City FC', 20, '1986-01-08', 170, 67, 109, 170, 3,  68),
    ('0508', 'Ilkay Gündogan',             'English Premier League', 'Manchester City FC', 8,  '1990-10-24', 180, 80, 72,  49,  0,  35),
    ('0509', 'Phil Foden',                 'English Premier League', 'Manchester City FC', 47, '2000-05-28', 171, 70, 31,  23,  1,  2),
    ('0510', 'Raheem Sterling',            'English Premier League', 'Manchester City FC', 7,  '1994-12-08', 170, 69, 120, 107, 1,  44),
    ('0511', 'Sergio Agüero',              'English Premier League', 'Manchester City FC', 10, '1988-06-02', 173, 77, 372, 118, 5,  69),
    /* Manchester United FC starting 11 */
    ('0601', 'David de Gea',                   'English Premier League', 'Manchester United FC', 1,  '1990-11-07', 189, 82,  0,   0,   0, 9),
    ('0602', 'Brandon Williams',               'English Premier League', 'Manchester United FC', 53, '2000-09-03', 182, 63,  4,   15,  2, 14),
    ('0603', 'Harry Maguire',                  'English Premier League', 'Manchester United FC', 5,  '1993-05-05', 194, 100, 23,  21,  4, 71),
    ('0604', 'Eric Bailly',                    'English Premier League', 'Manchester United FC', 3,  '1994-04-12', 187, 77,  2,   1,   6, 35),
    ('0605', 'Luke Shaw',                      'English Premier League', 'Manchester United FC', 23, '1995-07-12', 181, 75,  2,   14,  1, 33),
    ('0606', 'Fred Rodrigues de Paula Santos', 'English Premier League', 'Manchester United FC', 17, '1993-03-05', 169, 62,  25,  27,  2, 64),
    ('0607', 'Scott McTominay',                'English Premier League', 'Manchester United FC', 39, '1996-12-08', 190, 88,  10,  1,   0, 15),
    ('0608', 'Juan Mata',                      'English Premier League', 'Manchester United FC', 8,  '1988-04-28', 170, 61,  127, 152, 1, 40),
    ('0609', 'Bruno Fernandes',                'English Premier League', 'Manchester United FC', 18, '1994-09-08', 183, 69,  91,  74,  2, 66),
    ('0610', 'Daniel James',                   'English Premier League', 'Manchester United FC', 21, '1997-11-10', 170, 76,  18,  29,  0, 8),
    ('0611', 'Odion Ighalo',                   'English Premier League', 'Manchester United FC', 25, '1989-06-16', 183, 73,  135, 27,  1, 33),
    /* FC Bayern Munich */
    ('0701', 'Manuel Neuer',  'Bundesliga', 'FC Bayern Munich', 1,  '1986-03-27', 193, 92, 0,  0,  0, 19),
    ('0702', 'Serge Gnabry',  'Bundesliga', 'FC Bayern Munich', 22, '1995-07-14', 175, 75, 72, 42, 0, 4),
    /* Borussia Dortmund FC */
    ('0801', 'Roman Bürki',  'Bundesliga', 'Borussia Dortmund FC', 1, '1990-11-04', 187, 85, 0,  0,  2, 23),
    ('0802', 'Jadon Sancho', 'Bundesliga', 'Borussia Dortmund FC', 7, '2000-03-25', 180, 76, 55, 53, 1, 6),
    /* Juventus FC */
    ('0901', 'Wojciech Szczesny', 'Serie A', 'Juventus FC', 1, '1990-04-18', 196, 90, 0,   0,   2,  17),
    ('0902', 'Cristiano Ronaldo', 'Serie A', 'Juventus FC', 7, '1985-02-05', 187, 84, 626, 215, 11, 99),
    /* FC Inter Milan */
    ('1001', 'Samir Handanovic',  'Serie A', 'FC Inter Milan', 1,  '1984-07-14', 193, 92, 0,   0,   4, 33),
    ('1002', 'Christian Eriksen', 'Serie A', 'FC Inter Milan', 24, '1992-02-14', 182, 76, 107, 155, 0, 26),
    /* Paris Saint-Germain FC */
    ('1101', 'Keylor Navas',                  'Ligue 1', 'Paris Saint-Germain FC', 1,  '1986-12-15', 185, 80, 0,   0,   1, 14),
    ('1102', 'Neymar da Silva Santos Júnior', 'Ligue 1', 'Paris Saint-Germain FC', 10, '1992-02-05', 175, 68, 244, 151, 6, 105),
    /* Olympique de Marseille FC */
    ('1201', 'Steve Mandanda',  'Ligue 1', 'Olympique de Marseille FC', 30, '1985-03-28', 185, 82, 0,  0,  5, 19),
    ('1202', 'Florian Thauvin', 'Ligue 1', 'Olympique de Marseille FC', 26, '1993-01-26', 179, 70, 89, 57, 3, 32),
    /* FC Barcelona */
    ('1301', 'Marc-André ter Stegen', 'La Liga', 'FC Barcelona', 1,  '1992-04-30', 187, 85, 0,   0,   0, 13),
    ('1302', 'Lionel Messi',          'La Liga', 'FC Barcelona', 10, '1987-06-24', 170, 72, 627, 261, 0, 75),
    /* Real Madrid CF */
    ('1401', 'Thibaut Courtois', 'La Liga', 'Real Madrid CF', 13, '1992-05-11', 199, 96, 0,   0,   3, 16),
    ('1402', 'Eden Hazard',      'La Liga', 'Real Madrid CF', 7,  '1991-01-07', 175, 74, 161, 150, 1, 29);


INSERT INTO fieldPlayer
    (playerID, penaltyShotsTaken, penaltyShotsScored)
VALUES
    /* Arsenal */
    ('0102', 0,  0),
    ('0103', 2,  2),
    ('0104', 0,  0),
    ('0105', 2,  1),
    ('0106', 3,  1),
    ('0107', 0,  0),
    ('0108', 12, 1),
    ('0109', 8,  4),
    ('0110', 26, 9),
    ('0111', 5,  3),
    /* Chelsea */
    ('0202', 0,  0),
    ('0203', 0,  0),
    ('0204', 0,  0),
    ('0205', 0,  0),
    ('0206', 9,  2),
    ('0207', 3,  2),
    ('0208', 0,  0),
    ('0209', 5,  1),
    ('0210', 4,  0),
    ('0211', 18, 1),
    /* Leicester City */
    ('0302', 0, 0),
    ('0303', 0, 0),
    ('0304', 0, 0),
    ('0305', 0, 0),
    ('0306', 0, 0),
    ('0307', 0, 0),
    ('0308', 5, 1),
    ('0309', 0, 1),
    ('0310', 1, 0),
    ('0311', 2, 0),
    /* Liverpool */
    ('0402', 4,  0),
    ('0403', 0,  0),
    ('0404', 0,  0),
    ('0405', 0,  0),
    ('0406', 1,  0),
    ('0407', 1,  0),
    ('0408', 7,  4),
    ('0409', 14, 3),
    ('0410', 2,  4),
    ('0411', 5,  4),
    /* Manchester City */
    ('0502', 0,  0),
    ('0503', 11, 6),
    ('0504', 0,  0),
    ('0505', 0,  0),
    ('0506', 0,  0),
    ('0507', 2,  1),
    ('0508', 9,  1),
    ('0509', 0,  0),
    ('0510', 1,  1),
    ('0511', 46, 13),
    /* Manchester United */
    ('0602', 0,  0),
    ('0603', 0,  0),
    ('0604', 0,  0),
    ('0605', 0,  0),
    ('0606', 0,  0),
    ('0607', 0,  0),
    ('0608', 12, 4),
    ('0609', 22, 2),
    ('0610', 1,  0),
    ('0611', 20, 5),
    /* Bayern Munich */
    ('0702', 1, 1),
    /* Dortmund */
    ('0802', 7, 1),
    /* Juventus */
    ('0902', 121, 22),
    /* Inter Milan */
    ('1002', 8, 2),
    /* PSG */
    ('1102', 51, 13),
    /* Marseille */
    ('1202', 10, 2),
    /* Barcelona */
    ('1302', 89, 26),
    /* Real Madrid */
    ('1402', 48, 7);
    

INSERT INTO goalkeeper
    (playerID, cleansheets, goalsConceded, penaltyShotsSaved, penaltyShotsConceded)
VALUES
    ('0101', 146, 560, 14, 59),
    ('0201', 84,  271, 5,  16),
    ('0301', 196, 648, 21, 60),
    ('0401', 90,  176, 5,  11),
    ('0501', 116, 220, 6,  31),
    ('0601', 168, 555, 11, 45),
    ('0701', 300, 507, 20, 44),
    ('0801', 148, 561, 7,  34),
    ('0901', 149, 393, 17, 43),
    ('1001', 203, 667, 39, 68),
    ('1101', 119, 335, 15, 32),
    ('1201', 208, 686, 5,  68),
    ('1301', 171, 395, 12, 33),
    ('1401', 173, 400, 7,  36);


INSERT INTO referee
    (refID, name, birthdate, numCareerMatches)
VALUES
    ('0001', 'Mike Dean',       '1968-01-02', 503),
    ('0002', 'Martin Atkinson', '1971-03-31', 1048),
    ('0003', 'Micheal Oliver',  '1985-02-20', 939),
    ('0004', 'Andre Marriner',  '1971-01-01', 400),
    ('0005', 'Anthony Taylor',  '1978-10-20', 102);


INSERT INTO game1
    (dateAndTime, c1Name, c2Name, location, c1Score, c2Score)
VALUES
    ('2019-01-01 09:00:00.00', 'Liverpool FC',   'Arsenal FC',     'Anfield',                   1, 0),
    ('2019-06-01 09:00:00.00', 'Real Madrid CF', 'FC Barcelona',   'Santiago Bernabéu Stadium', 0, 3),
    ('2019-03-03 09:00:00.00', 'Arsenal FC',     'Liverpool FC',   'Islington',                 0, 2),
    ('2019-09-04 09:00:00.00', 'FC Barcelona',   'Real Madrid CF', 'Camp Nou',                  0, 1),
    ('2019-10-06 09:00:00.00', 'Juventus FC',    'FC Inter Milan', 'Allianz Stadium',           1, 0);


INSERT INTO game2
    (gameID, dateAndTime, c1Name, c2Name, leagueName)
VALUES
    ('000001', '2019-01-01 09:00:00.00', 'Liverpool FC',   'Arsenal FC',     'English Premier League'),
    ('000002', '2019-06-01 09:00:00.00', 'Real Madrid CF', 'FC Barcelona',   'La Liga'),
    ('000003', '2019-03-03 09:00:00.00', 'Arsenal FC',     'Liverpool FC',   'English Premier League'),
    ('000004', '2019-09-04 09:00:00.00', 'FC Barcelona',   'Real Madrid CF', 'La Liga'),
    ('000005', '2019-10-06 09:00:00.00', 'Juventus FC',    'FC Inter Milan', 'Serie A');


INSERT INTO officiates
    (refID, gameID)
VALUES
    ('0001', '000001'),
    ('0003', '000002'),
    ('0005', '000004'),
    ('0002', '000003'),
    ('0004', '000005');


INSERT INTO injury
    (playerID, dateAndTime, duration, type)
VALUES
    ('0102', '2019-01-02', 7, 'Knee'),
    ('0204', '2019-02-25', 2, 'Foot'),
    ('0306', '2019-05-04', 30,  'Leg'),
    ('0902', '2019-06-09', 5, 'Head'),
    ('0607', '2019-07-10', 7, 'Back');


INSERT INTO penalty
    (playerID, gameID, refID, minuteInGame, cardColor)
VALUES
    ('0108', '000001', '0001', 53, 'yellow'),
    ('1402', '000002', '0003', 25, 'yellow'),
    ('0403', '000003', '0002', 10, 'yellow'),
    ('1302', '000004', '0005', 36, 'yellow'),
    ('0902', '000005', '0004', 20, 'red');


COMMIT;
/* -------------------- END INSERTING DATA -------------------- */


/* -------------------- BEGIN SCHEMA -------------------- */

CREATE TABLE LEAGUE
(
    name VARCHAR(40),
    country VARCHAR(40),
    yearFounded INTEGER,
    PRIMARY KEY(name, country)
);


/* having circular foreign keys (Club2->Manager & Manager->Club2) is not recommended and 
its throwing an error here so commented Manager->Club out to make it simpler and error free */
CREATE TABLE MANAGER
(
    managerID INTEGER PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    /*clubName VARCHAR(40),
    leagueName VARCHAR(40),*/
    numCareerWins INTEGER,
    numCareerLoses INTEGER,
    numCareerDraws INTEGER
    /*FOREIGN KEY (clubName, leagueName)
        REFERENCES CLUB2 (name, leagueName)
        ON UPDATE CASCADE
        ON DELETE SET NULL*/
);


CREATE TABLE CLUB1
(
    name VARCHAR(40),
    country VARCHAR(40),
    location VARCHAR(40),
    PRIMARY KEY(name, country)
);


CREATE TABLE CLUB2
(
    name VARCHAR(40),
    managerID INTEGER,
    leagueName VARCHAR(40),
    country VARCHAR(40),
    UNIQUE(managerID),
    PRIMARY KEY (name, leagueName),
    FOREIGN KEY (leagueName, country)
        REFERENCES LEAGUE (name, country)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    /* Changed this from SET NULL to CASCADE otherwise it throws an error as  
        leagueName is part of the primary key and can't be NULL */
    FOREIGN KEY (managerID)
        REFERENCES MANAGER (managerID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE TABLE PLAYER
(
    playerID INTEGER PRIMARY KEY,
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
        REFERENCES CLUB2 (name, leagueName)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE TABLE FIELD_PLAYER
(
    playerID INTEGER PRIMARY KEY,
    penaltyShotsTaken INTEGER,
    penaltyShotsScored INTEGER,
    FOREIGN KEY (playerID)
        REFERENCES PLAYER (playerID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE GOALKEEPER
(
    playerID INTEGER PRIMARY KEY,
    cleansheets INTEGER,
    goalsConceded INTEGER,
    penaltyShotsSaved INTEGER,
    penaltyShotsConceded INTEGER,
    FOREIGN KEY (playerID)
        REFERENCES PLAYER (playerID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE REFEREE
(
    refID INTEGER PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    birthdate DATE,
    numCareerMatches INTEGER
);


CREATE TABLE GAME1
(
    date DATE,
    c1Name VARCHAR(40),
    c2Name VARCHAR(40),
    location VARCHAR(40) NOT NULL,
    c1Score INTEGER NOT NULL,
    c2Score INTEGER NOT NULL,
    PRIMARY KEY (date, c1Name, c2Name)
);


CREATE TABLE GAME2
(
    gameID INTEGER PRIMARY KEY,
    date DATE,
    c1Name VARCHAR(40),
    c2Name VARCHAR(40),
    leagueName VARCHAR(40),
    FOREIGN KEY (c1Name, leagueName)
        REFERENCES CLUB2 (name, leagueName)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (c2Name, leagueName)
        REFERENCES CLUB2 (name, leagueName)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE TABLE OFFICIATES
(
    refID INTEGER,
    gameID INTEGER,
    PRIMARY KEY (refID, gameID),
    FOREIGN KEY (refID)
        REFERENCES REFEREE (refID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (gameID)
        REFERENCES GAME2 (gameID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE INJURY
(
    playerID INTEGER,
    dateAndTime DATE,
    duration REAL,
    type VARCHAR(40) NOT NULL,
    PRIMARY KEY (playerID, dateAndTime),
    FOREIGN KEY (playerID)
        REFERENCES PLAYER (playerID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE PENALTY
(
    playerID INTEGER,
    gameID INTEGER,
    refID INTEGER,
    timeInGame INTEGER,
    cardColor VARCHAR(7) NOT NULL,
    PRIMARY KEY (playerID, gameID, refID),
    FOREIGN KEY (playerID)
        REFERENCES PLAYER (playerID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    /* Changed this from SET NULL to CASCADE otherwise it throws an error as  
        playerID is part of the primary key and can't be NULL */
    FOREIGN KEY (refID)
        REFERENCES REFEREE (refID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    /* Changed this from SET NULL to CASCADE otherwise it throws an error as  
        refID is part of the primary key and can't be NULL */
    FOREIGN KEY (gameID)
        REFERENCES GAME2 (gameID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    /* Changed this from SET NULL to CASCADE otherwise it throws an error as  
        gameID is part of the primary key and can't be NULL */
);



COMMIT;

/* -------------------- END SCHEMA -------------------- */





/* -------------------- BEGIN INSERTING DATA -------------------- */
INSERT INTO LEAGUE
    (name, country, yearFounded)
VALUES
    ('English Premiet League', 'England', 1992),
    ('La Liga', 'Spain', 1929),
    ('Bundesliga', 'Germany', 1963),
    ('Serie A', 'Italy', 1898),
    ('Ligue 1', 'France', 1930);


INSERT INTO MANAGER
    (managerID, name, numCareerWins, numCareerLoses, numCareerDraws)
VALUES
    (1111, 'Jürgen Klopp', 442, 193, 205),
    (2222, 'Quique Setién', 194, 171, 144),
    (3333, 'Hans-Dieter Flick', 147, 109, 80),
    (4444, 'Maurizio Sarri', 400, 202, 241),
    (5555, 'Thomas Tuchel', 234, 99, 86),
    (8888, 'Frank Lampard', 400, 102, 240),
    (7777, 'Zinedine Zidane', 300, 102, 90);


INSERT INTO CLUB1
    (name, country, location)
VALUES
    ('Liverpool F.C.', 'England', 'Anfield'),
    ('Arsenal F.C.', 'England', 'Islington'),
    ('FC Bayern Munich', 'Germany', 'Allianz Arena'),
    ('Paris Saint-Germain F.C.', 'France', 'Parc des Princes'),
    ('FC Barcelona', 'Spain', 'Camp Nou'),
    ('Real Madrid C.F.', 'Spain', 'Santiago Bernabéu Stadium'),
    ('Chelsea F.C.', 'England', 'Stamford Bridge');


INSERT INTO CLUB2
    (name, managerID, leagueName, country)
VALUES
    ('Liverpool F.C.', 1111, 'English Premier League', 'England'),
    ('Arsenal F.C.', 2222, 'nglish Premier League', 'England'),
    ('FC Bayern Munich', 3333, 'Bundesliga', 'Germany'),
    ('Juventus F.C.', 4444, 'Serie A', 'Italy'),
    ('Paris Saint-Germain F.C.', 5555, 'Ligue 1', 'France'),
    ('FC Barcelona', 2222, 'La Liga', 'Spain'),
    ('Real Madrid C.F.', 7777, 'La Liga', 'Spain'),
    ('Chelsea F.C.', 8888, 'Stamford Bridge', 'England');


INSERT INTO PLAYER
    (playerID, name, leagueName, clubName, number, birthdate, heightCM, weightKG, goals, assists, numRedCards, numYellowCards)
VALUES
    (1000, 'Mohamed Salah', 'English Premier League', 'Liverpool F.C.', 11, NULL, NULL, NULL, 167, 37, 1, 17),
    (1001, 'Alisson Becker', 'English Premier League', 'Liverpool F.C.', 1, NULL, NULL, NULL, 0, 0, 1, 7),
    (2000, 'Lionel Messi', 'La Liga', 'FC Barcelona', 10, NULL, NULL, NULL, 626, 261, 0, 73),
    (2001, 'Marc-André ter Stegen', 'La Liga', 'FC Barcelona', 1, NULL, NULL, NULL, 0, 0, 0, 13),
    (3000, 'Serge Gnabryh', 'Bundesliga', 'FC Bayern Munich', 22, NULL, NULL, NULL, 71, 41, 0, 4),
    (3001, 'Manuel Neuer', 'Bundesliga', 'FC Bayern Munich', 1, NULL, NULL, NULL, 0, 0, 0, 19),
    (4000, 'Christiano Ronaldo', 'Serie A', 'Juventus F.C.', 7, NULL, NULL, NULL, 626, 214, 11, 98),
    (4001, 'Wojciech Szczesny', 'Serie A', 'Juventus F.C.', 1, NULL, NULL, NULL, 0, 0, 2, 17),
    (5000, 'Neymar da Silva Santos Júnior', 'Ligue 1', 'Paris Saint - Germain F.C.', 10, NULL, NULL, NULL, 242, 151, 6, 103),
    (5001, 'Keylor Navas', 'Ligue 1', 'Paris Saint - Germain F.C.', 1, NULL, NULL, NULL, 0, 0, 1, 14);


INSERT INTO FIELD_PLAYER
    (playerID, penaltyShotsTaken, penaltyShotsScored)
VALUES
    (1000, 17, 3),
    (2000, 114, 88),
    (3000, 2, 1),
    (4000, 143, 121),
    (5000, 63, 50);


INSERT INTO GOALKEEPER
    (playerID, cleansheets, goalsConceded,penaltyShotsSaved, penaltyShotsConceded)
VALUES
    (1001, 90, 173, 5, 11),
    (2001, 170, 392, 12, 33),
    (3001, 297, 507, 20, 44),
    (4001, 148, 393, 17, 43),
    (5001, 117, 334, 15, 32);


INSERT INTO REFEREE
    (refID, name, birthdate, numCareerMatches)
VALUES
    (1212, 'Mike Dean', 1968-01-02, 503),
    (2323, 'Martin Atkinson', 1971-03-31, 1048),
    (3434, 'Micheal Oliver', 1985-02-20, 939),
    (4545, 'Andre Marriner', 1971-01-01, 400),
    (5656, 'Anthony Taylor', 1978-10-20, 102);


INSERT INTO GAME1
    (date, c1Name, c2Name, location, c1Score, c2Score)
VALUES
    (2019-01-01, 'Liverpool F.C', 'Arsenal F.C.', 'Anfield', 1, 0),
    (2019-06-01, 'Real Madrid C.F.', 'FC Barcelona', 'Santiago Bernabéu Stadium', 0, 3),
    (2019-03-03, 'Arsenal F.C.', 'Liverpool F.C.', 'Islington', 0, 2),
    (2019-09-04, 'FC BarcelonaC', 'Real Madrid C.F.', 'Camp Nou', 0, 1),
    (2019-10-06, 'Chelsea F.C.', 'Arsenal F.C.', 'Stamford Bridge', 1, 0);


INSERT INTO GAME2
    (gameID, date, c1Name, c2Name, leagueName)
VALUES
    (1111, 2019-01-01, 'Liverpool F.C', 'Arsenal F.C.', 'English Premier League'),
    (2222, 2019-06-01, 'Real Madrid C.F.', 'FC Barcelona', 'La Liga'),
    (3333, 2019-03-03, 'Arsenal F.C.', 'Liverpool F.C.', 'English Premier League'),
    (4444, 2019-09-04, 'FC BarcelonaC', 'Real Madrid C.F.', 'La Liga'),
    (5555, 2019-10-06, 'Chelsea F.C.', 'Arsenal F.C.', 'English Premier League');


INSERT INTO OFFICIATES
    (refID, gameID)
VALUES
    (1212, 1111),
    (2323, 1111),
    (3434, 3333),
    (4545, 4444),
    (5656, 3333);


INSERT INTO INJURY
    (playerID, dateAndTime, duration, type)
VALUES
    (2000, 2019-01-02, 2628000, 'Knee'),
    (2001, 2019-02-25, 4000000, 'Foot'),
    (3000, 2019-05-04, 623500, 'Leg'),
    (3001, 2019-06-09, 1000000, 'Head'),
    (5000, 2019-07-10, 3200000, 'Back');


INSERT INTO PENALTY
    (playerID, gameID, refID, timeInGame, cardColor)
VALUES
    (2000, 1111, 1212, 5300, 'yellow'),
    (2001, 1111, 2323, 2500, 'yellow'),
    (3000, 3333, 3434, 1000, 'yellow'),
    (3001, 4444, 4545, 3630, 'yellow'),
    (5000, 3333, 5656, 2000, 'red');


COMMIT;
/* -------------------- END INSERTING DATA -------------------- */


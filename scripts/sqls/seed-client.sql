INSERT OR IGNORE INTO Client (clientId, clientSecret, name) 
VALUES ('d654d2fc-118b-8592-020a-f5b13c4eafbe', 'clientSecret', 'clientName');


INSERT OR IGNORE INTO Scope (id, clientId, name) 
VALUES 
('123e4567-e89b-12d3-a456-426614174001', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'openid'),
('123e4567-e89b-12d3-a456-426614174002', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'profile'),
('123e4567-e89b-12d3-a456-426614174003', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'email'),
('123e4567-e89b-12d3-a456-426614174004', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'address'),
('123e4567-e89b-12d3-a456-426614174005', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'phone');

INSERT OR IGNORE INTO AllowRedirectUrl (id, clientId, url) 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'http://localhost:3000');
INSERT OR IGNORE INTO AllowRedirectUrl (id, clientId, url) 
VALUES ('123e4567-e89b-12d3-a456-426614174006', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'http://localhost:3030');
INSERT OR IGNORE INTO AllowRedirectUrl (id, clientId, url) 
VALUES ('123e4567-e89b-12d3-a456-426614174007', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'https://slide-for-interview.pages.dev');
INSERT OR IGNORE INTO AllowRedirectUrl (id, clientId, url) 
VALUES ('123e4567-e89b-12d3-a456-426614174008', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'http://localhost:5173');

INSERT OR IGNORE INTO User (id, email, password) 
VALUES ('123e4567-e89b-12d3-a456-426614174010', 'test@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
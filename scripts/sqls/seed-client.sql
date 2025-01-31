INSERT OR IGNORE INTO Client (clientId, clientSecret, name) 
VALUES ('d654d2fc-118b-8592-020a-f5b13c4eafbe', 'clientSecret', 'clientName');

INSERT OR IGNORE INTO AllowRedirectUrl (id, clientId, url) 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'http://localhost:3000');


INSERT OR IGNORE INTO AllowRedirectUrl (id, clientId, url) 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'http://localhost:3030');

INSERT OR IGNORE INTO Scope (id, clientId, name) 
VALUES 
('123e4567-e89b-12d3-a456-426614174001', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'openid'),
('123e4567-e89b-12d3-a456-426614174002', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'profile'),
('123e4567-e89b-12d3-a456-426614174003', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'email'),
('123e4567-e89b-12d3-a456-426614174004', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'address'),
('123e4567-e89b-12d3-a456-426614174005', 'd654d2fc-118b-8592-020a-f5b13c4eafbe', 'phone');
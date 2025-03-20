-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SignKey";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PrivateKey" (
    "kid" TEXT NOT NULL PRIMARY KEY,
    "privateKey" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PublicKey" (
    "kid" TEXT NOT NULL PRIMARY KEY,
    "publicKey" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WrapKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL
);
INSERT INTO "new_WrapKey" ("id", "key") SELECT "id", "key" FROM "WrapKey";
DROP TABLE "WrapKey";
ALTER TABLE "new_WrapKey" RENAME TO "WrapKey";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

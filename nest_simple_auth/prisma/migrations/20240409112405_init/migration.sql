-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "shirtSize" TEXT,
    "preferredTechnology" TEXT,
    "bearerToken" TEXT
);
INSERT INTO "new_User" ("bearerToken", "email", "firstName", "id", "lastName", "password", "phoneNumber", "preferredTechnology", "shirtSize") SELECT "bearerToken", "email", "firstName", "id", "lastName", "password", "phoneNumber", "preferredTechnology", "shirtSize" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

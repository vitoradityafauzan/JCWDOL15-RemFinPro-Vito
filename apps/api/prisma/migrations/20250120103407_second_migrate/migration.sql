/*
  Warnings:

  - You are about to drop the column `flow` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the column `totalItems` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the `_producttostock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_stockdesctouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stockdesc` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalStock` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_producttostock` DROP FOREIGN KEY `_ProductToStock_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttostock` DROP FOREIGN KEY `_ProductToStock_B_fkey`;

-- DropForeignKey
ALTER TABLE `_stockdesctouser` DROP FOREIGN KEY `_StockDescToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_stockdesctouser` DROP FOREIGN KEY `_StockDescToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `Stock_userId_fkey`;

-- DropForeignKey
ALTER TABLE `stockdesc` DROP FOREIGN KEY `StockDesc_productId_fkey`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `debitCard` VARCHAR(191) NULL,
    ADD COLUMN `payType` ENUM('CASH', 'DEBIT') NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'PAID') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `product` MODIFY `imageUrls` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `stock` DROP COLUMN `flow`,
    DROP COLUMN `totalItems`,
    DROP COLUMN `userId`,
    ADD COLUMN `productId` INTEGER NOT NULL,
    ADD COLUMN `totalStock` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_producttostock`;

-- DropTable
DROP TABLE `_stockdesctouser`;

-- DropTable
DROP TABLE `stockdesc`;

-- CreateTable
CREATE TABLE `StockHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockId` INTEGER NOT NULL,
    `adminId` INTEGER NOT NULL,
    `currentStock` INTEGER NOT NULL,
    `flowType` ENUM('IN', 'OUT') NOT NULL,
    `itemAmount` INTEGER NOT NULL,
    `newStock` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CashRegisterHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cashierId` INTEGER NOT NULL,
    `CheckInTime` DATETIME(3) NOT NULL,
    `currentCashTotal` DOUBLE NOT NULL,
    `CheckoutTime` DATETIME(3) NOT NULL,
    `newCashTotal` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashRegisterHistory` ADD CONSTRAINT `CashRegisterHistory_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

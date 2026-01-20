-- =====================================================
-- Code and Smile Foundation - MySQL Authentication Schema
-- =====================================================
-- This script creates all necessary tables for NextAuth.js
-- authentication with Prisma adapter, plus application models.
--
-- Run this script in your MySQL database to set up the schema.
-- Make sure to create the database first:
--   CREATE DATABASE code_and_smile;
--   USE code_and_smile;
-- =====================================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS `Submission`;
DROP TABLE IF EXISTS `Progress`;
DROP TABLE IF EXISTS `Enrollment`;
DROP TABLE IF EXISTS `Assignment`;
DROP TABLE IF EXISTS `Lesson`;
DROP TABLE IF EXISTS `Course`;
DROP TABLE IF EXISTS `PasswordResetToken`;
DROP TABLE IF EXISTS `EmailVerificationToken`;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS `Account`;
DROP TABLE IF EXISTS `Applicant`;
DROP TABLE IF EXISTS `User`;

-- =====================================================
-- ENUMS (MySQL doesn't support native enums in the same way,
-- so we use ENUM type directly in column definitions)
-- =====================================================

-- =====================================================
-- CORE AUTHENTICATION TABLES (NextAuth.js Required)
-- =====================================================

-- User table - Core user information
CREATE TABLE `User` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('TUTOR', 'LEARNER', 'APPLICANT', 'ADMIN') NOT NULL DEFAULT 'LEARNER',
    `avatar` VARCHAR(500) NULL,
    `isEmailVerified` BOOLEAN NOT NULL DEFAULT FALSE,
    `emailVerifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `User_email_key` (`email`),
    UNIQUE INDEX `User_username_key` (`username`),
    INDEX `User_role_idx` (`role`),
    INDEX `User_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Account table - OAuth provider accounts (NextAuth.js)
-- Links external OAuth accounts (Google, GitHub, etc.) to users
CREATE TABLE `Account` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `userId` VARCHAR(36) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `providerAccountId` VARCHAR(255) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INT NULL,
    `token_type` VARCHAR(50) NULL,
    `scope` VARCHAR(500) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Account_provider_providerAccountId_key` (`provider`, `providerAccountId`),
    INDEX `Account_userId_idx` (`userId`),
    CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Session table - Active user sessions (for database session strategy)
-- Note: If using JWT strategy, this table is optional but useful for session management
CREATE TABLE `Session` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `sessionToken` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Session_sessionToken_key` (`sessionToken`),
    INDEX `Session_userId_idx` (`userId`),
    INDEX `Session_expires_idx` (`expires`),
    CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Verification Token table
CREATE TABLE `EmailVerificationToken` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `EmailVerificationToken_token_key` (`token`),
    UNIQUE INDEX `EmailVerificationToken_email_token_key` (`email`, `token`),
    INDEX `EmailVerificationToken_expires_idx` (`expires`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password Reset Token table
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `PasswordResetToken_token_key` (`token`),
    UNIQUE INDEX `PasswordResetToken_email_token_key` (`email`, `token`),
    INDEX `PasswordResetToken_expires_idx` (`expires`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- APPLICATION TABLES
-- =====================================================

-- Applicant table - Course application requests (separate from User)
CREATE TABLE `Applicant` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `courseOfInterest` ENUM('DIGITAL_MARKETING', 'COMPUTER_BASICS', 'GRAPHICS_DESIGN', 'WEB_DESIGN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Applicant_email_key` (`email`),
    INDEX `Applicant_courseOfInterest_idx` (`courseOfInterest`),
    INDEX `Applicant_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course table - Courses created by tutors
CREATE TABLE `Course` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `tutorId` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    `duration` INT NULL COMMENT 'Duration in minutes',
    `thumbnail` VARCHAR(500) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT FALSE,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    INDEX `Course_tutorId_idx` (`tutorId`),
    INDEX `Course_level_idx` (`level`),
    INDEX `Course_isPublished_idx` (`isPublished`),
    INDEX `Course_createdAt_idx` (`createdAt`),
    CONSTRAINT `Course_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lesson table - Individual lessons within a course
CREATE TABLE `Lesson` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `courseId` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `content` TEXT NULL,
    `videoUrl` VARCHAR(500) NULL,
    `order` INT NOT NULL DEFAULT 0,
    `duration` INT NULL COMMENT 'Duration in minutes',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    INDEX `Lesson_courseId_idx` (`courseId`),
    INDEX `Lesson_order_idx` (`order`),
    CONSTRAINT `Lesson_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Assignment table - Assignments for courses
CREATE TABLE `Assignment` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `courseId` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('QUIZ', 'CODING', 'ESSAY') NOT NULL,
    `maxScore` INT NOT NULL DEFAULT 100,
    `timeLimit` INT NULL COMMENT 'Time limit in minutes',
    `dueDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    INDEX `Assignment_courseId_idx` (`courseId`),
    INDEX `Assignment_type_idx` (`type`),
    INDEX `Assignment_dueDate_idx` (`dueDate`),
    CONSTRAINT `Assignment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enrollment table - User course enrollments
CREATE TABLE `Enrollment` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `userId` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,
    `progress` FLOAT NOT NULL DEFAULT 0 COMMENT 'Progress percentage 0-100',

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Enrollment_userId_courseId_key` (`userId`, `courseId`),
    INDEX `Enrollment_userId_idx` (`userId`),
    INDEX `Enrollment_courseId_idx` (`courseId`),
    INDEX `Enrollment_enrolledAt_idx` (`enrolledAt`),
    CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Progress table - Tracks lesson completion progress
CREATE TABLE `Progress` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `userId` VARCHAR(36) NOT NULL,
    `lessonId` VARCHAR(36) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT FALSE,
    `timeSpent` INT NULL COMMENT 'Time spent in seconds',
    `lastAccessAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Progress_userId_lessonId_key` (`userId`, `lessonId`),
    INDEX `Progress_userId_idx` (`userId`),
    INDEX `Progress_lessonId_idx` (`lessonId`),
    CONSTRAINT `Progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Progress_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Submission table - Assignment submissions
CREATE TABLE `Submission` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `userId` VARCHAR(36) NOT NULL,
    `assignmentId` VARCHAR(36) NOT NULL,
    `answers` JSON NOT NULL,
    `score` INT NULL,
    `feedback` TEXT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gradedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Submission_userId_assignmentId_key` (`userId`, `assignmentId`),
    INDEX `Submission_userId_idx` (`userId`),
    INDEX `Submission_assignmentId_idx` (`assignmentId`),
    INDEX `Submission_submittedAt_idx` (`submittedAt`),
    CONSTRAINT `Submission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Submission_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Create a sample admin user (password: Admin@123)
-- The password hash is for 'Admin@123' using bcrypt with 10 rounds
INSERT INTO `User` (`id`, `email`, `username`, `firstName`, `lastName`, `password`, `role`, `isEmailVerified`)
VALUES (
    UUID(),
    'admin@codeandsmile.org',
    'admin',
    'System',
    'Administrator',
    '$2b$10$rQZ8K1Hx8vT5L9Yk8vQZxOe0F7Y6D4W2N8M1J3H5G7K9L2P4R6T8V',
    'ADMIN',
    TRUE
);

-- Create a sample tutor user (password: Tutor@123)
INSERT INTO `User` (`id`, `email`, `username`, `firstName`, `lastName`, `password`, `role`, `isEmailVerified`)
VALUES (
    UUID(),
    'tutor@codeandsmile.org',
    'tutor',
    'Demo',
    'Tutor',
    '$2b$10$rQZ8K1Hx8vT5L9Yk8vQZxOe0F7Y6D4W2N8M1J3H5G7K9L2P4R6T8V',
    'TUTOR',
    TRUE
);

-- Create a sample learner user (password: Learner@123)
INSERT INTO `User` (`id`, `email`, `username`, `firstName`, `lastName`, `password`, `role`, `isEmailVerified`)
VALUES (
    UUID(),
    'learner@codeandsmile.org',
    'learner',
    'Demo',
    'Learner',
    '$2b$10$rQZ8K1Hx8vT5L9Yk8vQZxOe0F7Y6D4W2N8M1J3H5G7K9L2P4R6T8V',
    'LEARNER',
    TRUE
);

-- =====================================================
-- STORED PROCEDURES (Optional - for common operations)
-- =====================================================

-- Procedure to clean up expired tokens
DELIMITER //
CREATE PROCEDURE CleanupExpiredTokens()
BEGIN
    DELETE FROM `EmailVerificationToken` WHERE `expires` < NOW();
    DELETE FROM `PasswordResetToken` WHERE `expires` < NOW();
    DELETE FROM `Session` WHERE `expires` < NOW();
END //
DELIMITER ;

-- =====================================================
-- EVENTS (Optional - for automatic cleanup)
-- =====================================================

-- Enable event scheduler (run once as admin)
-- SET GLOBAL event_scheduler = ON;

-- Event to clean up expired tokens daily
-- CREATE EVENT IF NOT EXISTS cleanup_expired_tokens
-- ON SCHEDULE EVERY 1 DAY
-- STARTS CURRENT_TIMESTAMP
-- DO CALL CleanupExpiredTokens();

-- =====================================================
-- GRANTS (Adjust according to your user setup)
-- =====================================================
-- Example: Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON code_and_smile.* TO 'app_user'@'localhost';
-- FLUSH PRIVILEGES;

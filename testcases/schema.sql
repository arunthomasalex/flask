DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(250) NOT NULL,
  UNIQUE(`username`)
);

DROP TABLE IF EXISTS `testcases`;
CREATE TABLE testcases (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `total` BIGINT NOT NULL,
  `completed` BIGINT NOT NULL,
  `passed` BIGINT NOT NULL,
  `dated` DATETIME NOT NULL
);

DROP TABLE IF EXISTS `settings`;
CREATE TABLE settings (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `value` VARCHAR(50) NOT NULL
);

ALTER TABLE `testcases` ADD COLUMN `suite` VARCHAR(50) NULL AFTER `dated`;
UPDATE `testcases` SET `suite`='Smoke' WHERE 1;
ALTER TABLE `testcases` ALTER `suite` DROP DEFAULT;
ALTER TABLE `testcases` CHANGE COLUMN `suite` `suite` VARCHAR(50) NOT NULL AFTER `dated`;

ALTER TABLE `testcases` ADD COLUMN `type` VARCHAR(25) NULL AFTER `suite`;
UPDATE `testcases` SET `type`='ui' WHERE 1;
ALTER TABLE `testcases` ALTER `type` DROP DEFAULT;
ALTER TABLE `testcases` CHANGE COLUMN `type` `type` VARCHAR(25) NOT NULL AFTER `suite`;
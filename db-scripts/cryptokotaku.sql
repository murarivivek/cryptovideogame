
CREATE DATABASE IF NOT EXISTS `cryptokotaku`;
USE `cryptokotaku`;

DROP TABLE IF EXISTS `user_subscription`;


CREATE TABLE `user_subscription` (
  `wallet_address` varchar(255) NOT NULL,
  `subscriber_id` varchar(1023) NOT NULL,
  `end_point` varchar(255) DEFAULT NULL,
  `browser_type` tinyint(1) NOT NULL DEFAULT '1',
  `email` varchar(255) DEFAULT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(255) NOT NULL,
  `last_modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_user` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`wallet_address`, `browser_type`),
  KEY `subscriber_idx` (`subscriber_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


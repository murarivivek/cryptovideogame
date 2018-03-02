
CREATE DATABASE IF NOT EXISTS `cryptokotaku`;
USE `cryptokotaku`;

DROP TABLE IF EXISTS `user_subscription`;


CREATE TABLE `user_subscription` (
  `subscriber_id` varchar(1023) NOT NULL,
  `wallet_address` varchar(255) DEFAULT NULL,
  `network_id` tinyint(1) NOT NULL DEFAULT '1',
  `end_point` varchar(255) DEFAULT NULL,
  `browser_type` tinyint(1) NOT NULL DEFAULT '1',
  `email` varchar(255) DEFAULT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(255) NOT NULL,
  `last_modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_user` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`subscriber_id`),
  KEY `network_idx` (`network_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `notification` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `tag` varchar(255) NOT NULL,
  `action_url` varchar(255) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_user` varchar(255) NOT NULL,
  `last_modified_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_user` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
/*

insert into notification (id, title, body, icon, tag, action_url, created_user, last_modified_user) values (0, 'Hurry up!', 'New items available.', '','default','/', 'admin', 'admin');

*/
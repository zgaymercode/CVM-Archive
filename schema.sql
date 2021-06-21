/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/ vcbot /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE vcbot;

DROP TABLE IF EXISTS channels;
CREATE TABLE `channels` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(50) DEFAULT NULL,
  `joinchan` varchar(50) DEFAULT NULL,
  `oid` varchar(50) DEFAULT NULL,
  `coowner` varchar(500) DEFAULT NULL,
  `locked` int(1) DEFAULT '0',
  `created` timestamp NULL DEFAULT NULL,
  `last_rename` timestamp NULL DEFAULT NULL,
  `is_stage` int(11) DEFAULT '0',
  `adjust_limit` int(11) DEFAULT '0',
  `ownerleavetimestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`num`),
  KEY `created` (`created`)
) ENGINE=InnoDB AUTO_INCREMENT=401 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS forbiddonwords;
CREATE TABLE `forbiddonwords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `word` varchar(50) DEFAULT NULL,
  `gid` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS joinchans;
CREATE TABLE `joinchans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `joinchan` varchar(50) DEFAULT NULL,
  `template` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `prefix` varchar(100) CHARACTER SET utf8mb4 DEFAULT NULL,
  `increment` int(1) DEFAULT '0',
  `lockable` int(1) DEFAULT '0',
  `is_stage` int(1) DEFAULT '0',
  `adjust_limit` int(1) DEFAULT '0',
  `autolock` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1 COMMENT='?';

DROP TABLE IF EXISTS modlog;
CREATE TABLE `modlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(50) DEFAULT NULL,
  `member_id` varchar(50) DEFAULT NULL,
  `guild_id` varchar(50) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `action` varchar(120) CHARACTER SET utf8mb4 DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS queue;
CREATE TABLE `queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(30) DEFAULT NULL,
  `vcid` varchar(30) DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS servers;
CREATE TABLE `servers` (
  `inc` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(50) NOT NULL DEFAULT '0',
  `prefix` varchar(5) NOT NULL DEFAULT '0',
  `modlog` varchar(50) DEFAULT NULL,
  `adminlog` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`inc`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
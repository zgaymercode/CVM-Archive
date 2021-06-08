/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for vcbot
CREATE DATABASE IF NOT EXISTS `vcbot` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `vcbot`;

-- Dumping structure for table vcbot.blacklistedwords
CREATE TABLE IF NOT EXISTS `blacklistedwords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `word` varchar(50) DEFAULT NULL,
  `gid` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table vcbot.catagory
CREATE TABLE IF NOT EXISTS `catagory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gid` varchar(50) DEFAULT NULL,
  `pid` varchar(50) DEFAULT NULL,
  `joinchan` varchar(50) DEFAULT NULL,
  `template` varchar(50) DEFAULT NULL,
  `increment` int(11) DEFAULT '0',
  `lockable` int(11) DEFAULT '0',
  `is_stage` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

-- Dumping structure for table vcbot.channels
CREATE TABLE IF NOT EXISTS `channels` (
  `num` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(50) DEFAULT NULL,
  `oid` varchar(50) DEFAULT NULL,
  `locked` int(1) DEFAULT '0',
  `created` timestamp NULL DEFAULT NULL,
  `last_rename` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`num`),
  KEY `created` (`created`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

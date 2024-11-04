-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: etsify.cudcshmqmhr2.us-east-1.rds.amazonaws.com    Database: etsifydb
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `address_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `full_name` varchar(255) NOT NULL,
  `street_name` varchar(255) DEFAULT NULL,
  `apt_number` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `country_id` int unsigned NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `user_id` (`user_id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `addresses_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (2,'2024-11-02 11:19:10','2024-11-02 11:19:10',48),(3,'2024-11-03 21:34:35','2024-11-03 21:34:35',50),(4,'2024-11-04 12:10:56','2024-11-04 12:10:56',22);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts_items`
--

DROP TABLE IF EXISTS `carts_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts_items` (
  `quantity` int unsigned NOT NULL DEFAULT '0',
  `discount_percent` int unsigned DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `cart_id` bigint unsigned NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`cart_id`,`item_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `carts_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carts_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts_items`
--

LOCK TABLES `carts_items` WRITE;
/*!40000 ALTER TABLE `carts_items` DISABLE KEYS */;
INSERT INTO `carts_items` VALUES (1,NULL,'2024-11-04 12:40:52','2024-11-04 12:40:52',4,3);
/*!40000 ALTER TABLE `carts_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subcategory_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `subcategory_id` (`subcategory_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `country_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (4,'Afghanistan','AF'),(5,'Ãland Islands','AX'),(6,'Albania','AL'),(7,'Algeria','DZ'),(8,'American Samoa','AS'),(9,'Andorra','AD'),(10,'Angola','AO'),(11,'Anguilla','AI'),(12,'Antarctica','AQ'),(13,'Antigua and Barbuda','AG'),(14,'Argentina','AR'),(15,'Armenia','AM'),(16,'Aruba','AW'),(17,'Australia','AU'),(18,'Austria','AT'),(19,'Azerbaijan','AZ'),(20,'Bahamas','BS'),(21,'Bahrain','BH'),(22,'Bangladesh','BD'),(23,'Barbados','BB'),(24,'Belarus','BY'),(25,'Belgium','BE'),(26,'Belize','BZ'),(27,'Benin','BJ'),(28,'Bermuda','BM'),(29,'Bhutan','BT'),(30,'Bolivia','BO'),(31,'Bosnia and Herzegovina','BA'),(32,'Botswana','BW'),(33,'Bouvet Island','BV'),(34,'Brazil','BR'),(35,'British Indian Ocean Territory','IO'),(36,'Brunei Darussalam','BN'),(37,'Bulgaria','BG'),(38,'Burkina Faso','BF'),(39,'Burundi','BI'),(40,'Cambodia','KH'),(41,'Cameroon','CM'),(42,'Canada','CA'),(43,'Cape Verde','CV'),(44,'Cayman Islands','KY'),(45,'Central African Republic','CF'),(46,'Chad','TD'),(47,'Chile','CL'),(48,'China','CN'),(49,'Christmas Island','CX'),(50,'Cocos (Keeling) Islands','CC'),(51,'Colombia','CO'),(52,'Comoros','KM'),(53,'Congo','CG'),(54,'Congo, The Democratic Republic of the','CD'),(55,'Cook Islands','CK'),(56,'Costa Rica','CR'),(57,'Cote D\'Ivoire','CI'),(58,'Croatia','HR'),(59,'Cuba','CU'),(60,'Cyprus','CY'),(61,'Czech Republic','CZ'),(62,'Denmark','DK'),(63,'Djibouti','DJ'),(64,'Dominica','DM'),(65,'Dominican Republic','DO'),(66,'Ecuador','EC'),(67,'Egypt','EG'),(68,'El Salvador','SV'),(69,'Equatorial Guinea','GQ'),(70,'Eritrea','ER'),(71,'Estonia','EE'),(72,'Ethiopia','ET'),(73,'Falkland Islands (Malvinas)','FK'),(74,'Faroe Islands','FO'),(75,'Fiji','FJ'),(76,'Finland','FI'),(77,'France','FR'),(78,'French Guiana','GF'),(79,'French Polynesia','PF'),(80,'French Southern Territories','TF'),(81,'Gabon','GA'),(82,'Gambia','GM'),(83,'Georgia','GE'),(84,'Germany','DE'),(85,'Ghana','GH'),(86,'Gibraltar','GI'),(87,'Greece','GR'),(88,'Greenland','GL'),(89,'Grenada','GD'),(90,'Guadeloupe','GP'),(91,'Guam','GU'),(92,'Guatemala','GT'),(93,'Guernsey','GG'),(94,'Guinea','GN'),(95,'Guinea-Bissau','GW'),(96,'Guyana','GY'),(97,'Haiti','HT'),(98,'Heard Island and Mcdonald Islands','HM'),(99,'Holy See (Vatican City State)','VA'),(100,'Honduras','HN'),(101,'Hong Kong','HK'),(102,'Hungary','HU'),(103,'Iceland','IS'),(104,'India','IN'),(105,'Indonesia','ID'),(106,'Iran, Islamic Republic Of','IR'),(107,'Iraq','IQ'),(108,'Ireland','IE'),(109,'Isle of Man','IM'),(110,'Israel','IL'),(111,'Italy','IT'),(112,'Jamaica','JM'),(113,'Japan','JP'),(114,'Jersey','JE'),(115,'Jordan','JO'),(116,'Kazakhstan','KZ'),(117,'Kenya','KE'),(118,'Kiribati','KI'),(119,'Korea, Democratic People\'S Republic of','KP'),(120,'Korea, Republic of','KR'),(121,'Kuwait','KW'),(122,'Kosovo','XK'),(123,'Kyrgyzstan','KG'),(124,'Lao People\'S Democratic Republic','LA'),(125,'Latvia','LV'),(126,'Lebanon','LB'),(127,'Lesotho','LS'),(128,'Liberia','LR'),(129,'Libyan Arab Jamahiriya','LY'),(130,'Liechtenstein','LI'),(131,'Lithuania','LT'),(132,'Luxembourg','LU'),(133,'Macao','MO'),(134,'North Macedonia','MK'),(135,'Madagascar','MG'),(136,'Malawi','MW'),(137,'Malaysia','MY'),(138,'Maldives','MV'),(139,'Mali','ML'),(140,'Malta','MT'),(141,'Marshall Islands','MH'),(142,'Martinique','MQ'),(143,'Mauritania','MR'),(144,'Mauritius','MU'),(145,'Mayotte','YT'),(146,'Mexico','MX'),(147,'Micronesia, Federated States of','FM'),(148,'Moldova, Republic of','MD'),(149,'Monaco','MC'),(150,'Mongolia','MN'),(151,'Montserrat','MS'),(152,'Morocco','MA'),(153,'Mozambique','MZ'),(154,'Myanmar','MM'),(155,'Namibia','NA'),(156,'Nauru','NR'),(157,'Nepal','NP'),(158,'Netherlands','NL'),(159,'Netherlands Antilles','AN'),(160,'New Caledonia','NC'),(161,'New Zealand','NZ'),(162,'Nicaragua','NI'),(163,'Niger','NE'),(164,'Nigeria','NG'),(165,'Niue','NU'),(166,'Norfolk Island','NF'),(167,'Northern Mariana Islands','MP'),(168,'Norway','NO'),(169,'Oman','OM'),(170,'Pakistan','PK'),(171,'Palau','PW'),(172,'Palestinian Territory, Occupied','PS'),(173,'Panama','PA'),(174,'Papua New Guinea','PG'),(175,'Paraguay','PY'),(176,'Peru','PE'),(177,'Philippines','PH'),(178,'Pitcairn','PN'),(179,'Poland','PL'),(180,'Portugal','PT'),(181,'Puerto Rico','PR'),(182,'Qatar','QA'),(183,'Reunion','RE'),(184,'Romania','RO'),(185,'Russian Federation','RU'),(186,'RWANDA','RW'),(187,'Saint Helena','SH'),(188,'Saint Kitts and Nevis','KN'),(189,'Saint Lucia','LC'),(190,'Saint Pierre and Miquelon','PM'),(191,'Saint Vincent and the Grenadines','VC'),(192,'Samoa','WS'),(193,'San Marino','SM'),(194,'Sao Tome and Principe','ST'),(195,'Saudi Arabia','SA'),(196,'Senegal','SN'),(197,'Serbia and Montenegro','CS'),(198,'Seychelles','SC'),(199,'Sierra Leone','SL'),(200,'Singapore','SG'),(201,'Slovakia','SK'),(202,'Slovenia','SI'),(203,'Solomon Islands','SB'),(204,'Somalia','SO'),(205,'South Africa','ZA'),(206,'South Georgia and the South Sandwich Islands','GS'),(207,'Spain','ES'),(208,'Sri Lanka','LK'),(209,'Sudan','SD'),(210,'Suriname','SR'),(211,'Svalbard and Jan Mayen','SJ'),(212,'Swaziland','SZ'),(213,'Sweden','SE'),(214,'Switzerland','CH'),(215,'Syrian Arab Republic','SY'),(216,'Taiwan, Province of China','TW'),(217,'Tajikistan','TJ'),(218,'Tanzania, United Republic of','TZ'),(219,'Thailand','TH'),(220,'Timor-Leste','TL'),(221,'Togo','TG'),(222,'Tokelau','TK'),(223,'Tonga','TO'),(224,'Trinidad and Tobago','TT'),(225,'Tunisia','TN'),(226,'Turkey','TR'),(227,'Turkmenistan','TM'),(228,'Turks and Caicos Islands','TC'),(229,'Tuvalu','TV'),(230,'Uganda','UG'),(231,'Ukraine','UA'),(232,'United Arab Emirates','AE'),(233,'United Kingdom','GB'),(234,'United States','US'),(235,'United States Minor Outlying Islands','UM'),(236,'Uruguay','UY'),(237,'Uzbekistan','UZ'),(238,'Vanuatu','VU'),(239,'Venezuela','VE'),(240,'Viet Nam','VN'),(241,'Virgin Islands, British','VG'),(242,'Virgin Islands, U.S.','VI'),(243,'Wallis and Futuna','WF'),(244,'Western Sahara','EH'),(245,'Yemen','YE'),(246,'Zambia','ZM'),(247,'Zimbabwe','ZW');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_items`
--

DROP TABLE IF EXISTS `favorite_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_items` (
  `item_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`item_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `favorite_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorite_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_items`
--

LOCK TABLES `favorite_items` WRITE;
/*!40000 ALTER TABLE `favorite_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_stores`
--

DROP TABLE IF EXISTS `favorite_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_stores` (
  `store_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`store_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `favorite_stores_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorite_stores_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_stores`
--

LOCK TABLES `favorite_stores` WRITE;
/*!40000 ALTER TABLE `favorite_stores` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite_stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `quantity` int unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `rating` int unsigned NOT NULL DEFAULT '0',
  `discount_percent` int unsigned DEFAULT NULL,
  `image_url` varchar(360) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `store_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Peony Oil Painting Original Flower Artwork','Peonies oil painting. Peonies are painted with oil paints on a 6*8 inch panel (without frame). WE WILL PAINT TO ORDER',1,5.99,5,NULL,'https://etsifybucket.s3.us-east-1.amazonaws.com/peony.jpg','2024-10-31 23:05:20','2024-10-31 23:05:20',51),(2,'Sunflowers Oil Painting Panel Original Floral Art','The sunflower is hand painted with oil paints on hardboard, it is an original painting and a work of art. WE MADE TO ORDER',2,10.99,4,NULL,'https://etsifybucket.s3.us-east-1.amazonaws.com/sunflower.png','2024-10-31 23:15:20','2024-10-31 23:15:20',51),(3,'Cartoon Carrot Dog Chew Toy- Bite-Proof Cotton Rope','Treat your furry friend to endless fun and healthy playtime with our adorable Cartoon Carrot Dog Chew Toy!',12,21.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730721080212_93543581122211.jpg','2024-11-04 11:51:20','2024-11-04 11:51:20',48),(4,' Ninja Cat T-Shirt, Kids T-Shirt',' Each shirt is meticulously designed to offer both durability and breathability, ensuring a soft touch against your skin while keeping you cool and comfortable all day long.',16,13.50,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730722640054_112346435t76.jpg','2024-11-03 11:51:20','2024-11-03 11:51:20',48),(17,'Cat VS Dog Chess Set, Handmade Ceramic','Elevate your game with our exquisite Handmade Ceramic Chess Board. Each of the 32 pieces is meticulously crafted, showcasing one-of-a-kind designs that embody distinct personalities and playful charm.',1,0.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730689008891_cats.jpg','2024-11-04 02:56:49','2024-11-04 02:56:49',51),(44,'Custom Handmade Name Puzzle with Animals','A Great Educational Toy, Super Cute Gift Option\nBy taking Puzzle, one of the oldest known educational and entertaining games, to a different dimension with its incredibly beautiful, tried-and-tested colors and shapes, we have created puzzles that will be a perfect educational-busy board toy, a super sweet gift, and a perfect decoration and keepsake.',6,58.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730719103215_il_794xN.6397453190_q63d.jpg','2024-11-04 11:18:23','2024-11-04 11:18:23',55),(45,'Night Light for Baby, Toddler and Kids','Light Up Their World, Enchanted Dreams\nElevating the timeless charm of personalized gifts, our Personalized Name Night Light for babies brings a unique blend of enchantment and practicality to any child\'s space.',12,65.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730719202070_il_794xN.6379053917_n918.jpg','2024-11-04 11:20:02','2024-11-04 11:20:02',55),(46,'Custom Kids Gift - Personalized Wooden Domino Puzzle ','Looking for a one year old girl gift or one year old boy gift? Our captivating Wooden Picture Domino Puzzle is meticulously designed to stimulate young minds while nurturing essential skills. It\'s an ideal baby toy for 1-year-olds and makes an extraordinary baby first birthday gift.',15,32.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730719454328_918.jpg','2024-11-04 11:24:14','2024-11-04 11:24:14',55),(47,'Montessori number board - Math Counting Board','Made from sustainably sourced, top-quality wood, our counting board boasts a large rectangular design with smooth, safe edges, ensuring tranquil playtime. Each number, from one to ten, is matched with vibrant beads and precisely carved grooves, aiding your child in grasping numerical concepts effortlessly. ',27,31.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730719549494_9354358.jpg','2024-11-04 11:25:49','2024-11-04 11:25:49',55),(48,'Quiet Book Printabler','Looking for engaging, educational activities for your toddler? This French Busy Book is the perfect solution for creating quiet, focused moments while enhancing key developmental skills',36,15.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730719734680_93543581111.png','2024-11-04 11:28:55','2024-11-04 11:28:55',55),(49,'Activity Board, Best Gift for Toddler','Busy board is the best educational toys for toddler!\nOne of the tools of this approach is the busy board☺️',7,136.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730719879181_93543581122211.jpg','2024-11-04 11:31:19','2024-11-04 11:31:19',55),(50,'Calming Cat Bed - Donut Cat Bed - Fluffy Pet Bed','Your cat needs a safe, calming and comfortable place to get rest and be healthy. Our calming donut cat bed relieves anxiety and has anti-stress properties. It improves sleep and overall makes your cat\'s life better!',4,44.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730720645114_93543581122211.jpg','2024-11-04 11:44:05','2024-11-04 11:57:47',48),(51,'Rabbit House Teepee Canvas Small Pet','This small bunny bed: a rabbit teepee has for walls and an entrance, decorated with pompom trim. The rabbit tee pee is equipped with natural wood vertical and horizontal poles. It ensures that the rabbit teepee is standing still at all times. Great for rabbits, small dogs, guinea pigs.\n',3,120.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730720914981_93543581122211.jpg','2024-11-04 11:48:35','2024-11-04 11:48:35',48),(55,'Bitsy robot','A brass robot figurine',1,13.00,0,NULL,'https://etsifybucket.s3.amazonaws.com/1730731744183_bitsy.png','2024-11-04 14:49:04','2024-11-04 14:49:04',56);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_categories`
--

DROP TABLE IF EXISTS `items_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_categories` (
  `category_id` bigint unsigned NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`category_id`,`item_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `items_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `items_categories_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_categories`
--

LOCK TABLES `items_categories` WRITE;
/*!40000 ALTER TABLE `items_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `items_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(50) DEFAULT 'Pending',
  `tracking` varchar(255) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_method` varchar(50) NOT NULL,
  `payment_ref` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `street_name` varchar(255) DEFAULT NULL,
  `apt_number` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `store_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `store_id` (`store_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'pending',NULL,125.00,'','','Alex Green',NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','2024-11-04 00:37:23',51,40),(2,'completed',NULL,78.55,'','','John Baker',NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','2024-11-03 18:10:18',51,15),(3,'pending',NULL,36.29,'','','Cathy Black',NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','2024-11-03 01:19:29',51,15),(4,'completed',NULL,36.29,'','','Denis Brown',NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','2024-11-04 00:33:06',51,22),(8,'Pending',NULL,27.97,'Stripe','pi_1J5J9vKXr6fXj5Z2J9J9J9J9','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 05:43:43','2024-11-04 05:43:43',NULL,48),(9,'Pending',NULL,27.97,'Stripe','pi_1J5J9vKXr6fXj5Z2J9J9J9J9','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 05:56:33','2024-11-04 05:56:33',NULL,48),(10,'Pending',NULL,27.97,'Stripe','pi_1J5J9vKXr6fXj5Z2J9J9J9J9','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 06:06:31','2024-11-04 06:06:31',NULL,48),(11,'Pending',NULL,27.97,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 06:17:51','2024-11-04 06:17:51',NULL,48),(12,'Pending',NULL,27.97,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 06:18:28','2024-11-04 06:18:28',NULL,48),(13,'Pending',NULL,27.97,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 06:24:22','2024-11-04 06:24:22',NULL,48),(14,'Pending',NULL,120.00,'Stripe','pi_3QHP9QHD9HkikHGL0dTfP3cQ','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:13:23','2024-11-04 12:13:23',NULL,48),(15,'Pending',NULL,120.00,'Stripe','pi_3QHPHkHD9HkikHGL0rAUYnAN','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:21:57','2024-11-04 12:21:57',NULL,48),(16,'Pending',NULL,0.00,'Stripe','pi_3QHPHkHD9HkikHGL0rAUYnAN','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:25:22','2024-11-04 12:25:22',NULL,48),(17,'Pending',NULL,21.00,'Stripe','pi_3QHPLeHD9HkikHGL0Or83T7a','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:25:59','2024-11-04 12:25:59',NULL,48),(18,'Pending',NULL,0.00,'Stripe','pi_3QHPLeHD9HkikHGL0Or83T7a','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:27:20','2024-11-04 12:27:20',NULL,48),(19,'Pending',NULL,32.00,'Stripe','pi_3QHPOpHD9HkikHGL1k2q7Mul','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:29:34','2024-11-04 12:29:34',NULL,48),(20,'Pending',NULL,234.99,'Stripe','pi_3QHPYuHD9HkikHGL1DXxPSlv','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:40:00','2024-11-04 12:40:00',NULL,48),(21,'Pending',NULL,0.00,'Stripe','pi_3QHPYuHD9HkikHGL1DXxPSlv','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:40:05','2024-11-04 12:40:05',NULL,48),(22,'Pending',NULL,0.00,'Stripe','pi_3QHPYuHD9HkikHGL1DXxPSlv','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:40:59','2024-11-04 12:40:59',NULL,48),(23,'Pending',NULL,0.00,'Stripe','pi_3QHPYuHD9HkikHGL1DXxPSlv','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:41:02','2024-11-04 12:41:02',NULL,48),(24,'Pending',NULL,0.00,'Stripe','pi_3QHPYuHD9HkikHGL1DXxPSlv','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:42:06','2024-11-04 12:42:06',NULL,48),(25,'Pending',NULL,0.00,'Stripe','pi_3QHPYuHD9HkikHGL1DXxPSlv','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:42:09','2024-11-04 12:42:09',NULL,48),(26,'Pending',NULL,0.00,'Stripe','pi_3QHPYuHD9HkikHGL1DXxPSlv','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:43:37','2024-11-04 12:43:37',NULL,48),(27,'Pending',NULL,0.00,'Stripe','pi_3QHPYuHD9HkikHGL1DXxPSlv','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:43:39','2024-11-04 12:43:39',NULL,48),(28,'Pending',NULL,21.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:44:49','2024-11-04 12:44:49',NULL,48),(29,'Pending',NULL,0.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:45:04','2024-11-04 12:45:04',NULL,48),(30,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:45:04','2024-11-04 12:45:04',NULL,48),(31,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:46:38','2024-11-04 12:46:38',NULL,48),(32,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:47:08','2024-11-04 12:47:08',NULL,48),(33,'Pending',NULL,0.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:47:08','2024-11-04 12:47:08',NULL,48),(34,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:47:29','2024-11-04 12:47:29',NULL,48),(35,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:49:11','2024-11-04 12:49:11',NULL,48),(36,'Pending',NULL,0.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:49:11','2024-11-04 12:49:11',NULL,48),(37,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:50:04','2024-11-04 12:50:04',NULL,48),(38,'Pending',NULL,0.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:50:04','2024-11-04 12:50:04',NULL,48),(39,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:50:07','2024-11-04 12:50:07',NULL,48),(40,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:50:56','2024-11-04 12:50:56',NULL,48),(41,'Pending',NULL,0.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:50:59','2024-11-04 12:50:59',NULL,48),(42,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:50:59','2024-11-04 12:50:59',NULL,48),(43,'Pending',NULL,0.00,'Stripe','pi_3QHDeXHD9HkikHGL1TRNx2Ho','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:51:53','2024-11-04 12:51:53',NULL,48),(44,'Pending',NULL,0.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:51:53','2024-11-04 12:51:53',NULL,48),(45,'Pending',NULL,0.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:53:30','2024-11-04 12:53:30',NULL,48),(46,'Pending',NULL,0.00,'Stripe','pi_3QHPddHD9HkikHGL1Yz3gukj','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 12:54:12','2024-11-04 12:54:12',NULL,48),(47,'Pending',NULL,201.00,'Stripe','pi_3QHQ97HD9HkikHGL1g01aiDT','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 13:17:21','2024-11-04 13:17:21',NULL,48),(48,'Pending',NULL,0.00,'Stripe','pi_3QHQ97HD9HkikHGL1g01aiDT','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 13:17:57','2024-11-04 13:17:57',NULL,48),(49,'Pending',NULL,0.00,'Stripe','pi_3QHQ97HD9HkikHGL1g01aiDT','Danny',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 13:50:47','2024-11-04 13:50:47',NULL,48),(50,'Pending',NULL,40.00,'Stripe','pi_3QHRcsHD9HkikHGL1A1DAwtp','Tamara Plante',NULL,NULL,NULL,NULL,NULL,NULL,'2024-11-04 14:52:04','2024-11-04 14:52:04',NULL,50);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_items`
--

DROP TABLE IF EXISTS `orders_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_items` (
  `name` varchar(255) NOT NULL,
  `quantity` int unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_percent` int unsigned DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `item_id` bigint unsigned NOT NULL,
  `order_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`item_id`,`order_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `orders_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_items_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_items`
--

LOCK TABLES `orders_items` WRITE;
/*!40000 ALTER TABLE `orders_items` DISABLE KEYS */;
INSERT INTO `orders_items` VALUES ('Peony Oil Painting Original Flower Artwork',1,5.99,NULL,'2024-11-04 05:43:43','2024-11-04 05:43:43',1,8),('Peony Oil Painting Original Flower Artwork',1,5.99,NULL,'2024-11-04 05:56:33','2024-11-04 05:56:33',1,9),('Peony Oil Painting Original Flower Artwork',1,5.99,NULL,'2024-11-04 06:06:31','2024-11-04 06:06:31',1,10),('Peony Oil Painting Original Flower Artwork',1,5.99,NULL,'2024-11-04 06:17:51','2024-11-04 06:17:51',1,11),('Peony Oil Painting Original Flower Artwork',1,5.99,NULL,'2024-11-04 06:18:28','2024-11-04 06:18:28',1,12),('Peony Oil Painting Original Flower Artwork',1,5.99,NULL,'2024-11-04 06:24:22','2024-11-04 06:24:22',1,13),('Peony Oil Painting Original Flower Artwork',1,5.99,NULL,'2024-11-04 12:40:00','2024-11-04 12:40:00',1,20),('Sunflowers Oil Painting Panel Original Floral Art Flower Artwork Hand Painted',2,10.99,NULL,'2024-11-04 05:43:43','2024-11-04 05:43:43',2,8),('Sunflowers Oil Painting Panel Original Floral Art Flower Artwork Hand Painted',2,10.99,NULL,'2024-11-04 05:56:33','2024-11-04 05:56:33',2,9),('Sunflowers Oil Painting Panel Original Floral Art Flower Artwork Hand Painted',2,10.99,NULL,'2024-11-04 06:06:31','2024-11-04 06:06:31',2,10),('Sunflowers Oil Painting Panel Original Floral Art Flower Artwork Hand Painted',2,10.99,NULL,'2024-11-04 06:17:51','2024-11-04 06:17:51',2,11),('Sunflowers Oil Painting Panel Original Floral Art Flower Artwork Hand Painted',2,10.99,NULL,'2024-11-04 06:18:28','2024-11-04 06:18:28',2,12),('Sunflowers Oil Painting Panel Original Floral Art Flower Artwork Hand Painted',2,10.99,NULL,'2024-11-04 06:24:23','2024-11-04 06:24:23',2,13),('Cartoon Carrot Dog Chew Toy- Bite-Proof Cotton Rope for Teeth Grinding and Cleaning- Fun Pet Toy for Outdoor Training',1,21.00,NULL,'2024-11-04 12:25:59','2024-11-04 12:25:59',3,17),('Cartoon Carrot Dog Chew Toy- Bite-Proof Cotton Rope',1,21.00,NULL,'2024-11-04 12:44:49','2024-11-04 12:44:49',3,28),('Cartoon Carrot Dog Chew Toy- Bite-Proof Cotton Rope',1,21.00,NULL,'2024-11-04 13:17:21','2024-11-04 13:17:21',3,47),(' Ninja Cat T-Shirt, Kids T-Shirt',2,13.50,NULL,'2024-11-04 14:52:04','2024-11-04 14:52:04',4,50),('Night Light for Baby, Toddler and Kids',1,65.00,NULL,'2024-11-04 12:40:00','2024-11-04 12:40:00',45,20),('Custom Kids Gift - Personalized Wooden Domino Puzzle ',1,32.00,NULL,'2024-11-04 12:29:34','2024-11-04 12:29:34',46,19),('Activity Board, Best Gift for Toddler',1,136.00,NULL,'2024-11-04 13:17:21','2024-11-04 13:17:21',49,47),('Calming Cat Bed - Donut Cat Bed - Fluffy Pet Bed',1,44.00,NULL,'2024-11-04 12:40:00','2024-11-04 12:40:00',50,20),('Calming Cat Bed - Donut Cat Bed - Fluffy Pet Bed',1,44.00,NULL,'2024-11-04 13:17:21','2024-11-04 13:17:21',50,47),('Rabbit House Teepee Canvas Small Pet Bed Bunny Tipi Guinea Pig Tee Pee',1,120.00,NULL,'2024-11-04 12:13:23','2024-11-04 12:13:23',51,14),('Rabbit House Teepee Canvas Small Pet Bed Bunny Tipi Guinea Pig Tee Pee',1,120.00,NULL,'2024-11-04 12:21:57','2024-11-04 12:21:57',51,15),('Rabbit House Teepee Canvas Small Pet',1,120.00,NULL,'2024-11-04 12:40:00','2024-11-04 12:40:00',51,20),('Bitsy robot',1,13.00,NULL,'2024-11-04 14:52:04','2024-11-04 14:52:04',55,50);
/*!40000 ALTER TABLE `orders_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description` text,
  `rating` int unsigned NOT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `item_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `item_id` (`item_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `store_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `rating` int unsigned NOT NULL DEFAULT '0',
  `logo_url` varchar(360) DEFAULT NULL,
  `image_url` varchar(360) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `country_id` int unsigned NOT NULL,
  PRIMARY KEY (`store_id`),
  UNIQUE KEY `stores_name_unique` (`name`),
  UNIQUE KEY `stores_user_id_unique` (`user_id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `stores_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (36,'Tamara\'s Store','Upcoming description',5,'https://etsifybucket.s3.amazonaws.com/1730672218477_logo-image.png',NULL,'2024-10-31 16:05:20','2024-11-04 14:20:50',50,42),(48,'CozyMurr','Pets toys and beds',4,'https://etsifybucket.s3.amazonaws.com/1730720801780_il_794xN.6397453190_q63d.jpg',NULL,'2024-11-02 14:33:31','2024-11-04 11:46:42',22,13),(51,'Joyful Crafts','Joyful Crafts offers a delightful selection of handmade treasures that bring happiness and creativity into your life, perfect for gifts or adding a personal touch to your home.',5,'https://etsifybucket.s3.amazonaws.com/1730655453612_images.jpg',NULL,'2024-11-03 16:06:35','2024-11-03 21:36:25',15,16),(53,'The Craft Shop','Lorem ipsum dolor sit amet. Vel molestias perspiciatis non perferendis praesentium ea reiciendis aperiam.',4,'https://etsifybucket.s3.amazonaws.com/1730670602088_pngtree-shopping-mall-logo-image_2235997.jpg',NULL,'2024-11-03 21:49:43','2024-11-03 21:50:02',62,42),(55,'AlexPuzzle','Wooden Personalized Puzzles, Baby Gifts, Toddler Toys',5,'https://etsifybucket.s3.amazonaws.com/1730718973249_puzzle-logo_609277-5566.jpg',NULL,'2024-11-04 11:14:34','2024-11-04 11:20:57',40,42),(56,'R3\'s store','A robot friendly place',0,'https://etsifybucket.s3.amazonaws.com/1730731709207_r3-logo.png',NULL,'2024-11-04 14:48:08','2024-11-04 14:48:29',65,42);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(360) NOT NULL,
  `password` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'anna','Anna Smith','anna@mail.com','$2b$10$Z8sTxNuYfm07Y13p9Da22eDufAtxfc7QNgfOuPB9afc9TgvR7iO/q','2024-10-29 18:31:50','2024-11-04 00:43:40',NULL),(22,'denis','Denis Brown','denis@mail.com','$2b$10$LIl9dQIQctcXCC2BK4Svb.LpoJQk/49XwX1ptI7RZVVSQdAZYcP7O','2024-10-30 01:42:18','2024-10-30 01:42:18',NULL),(40,'alex','Alex Green','alex@mail.com','$2b$10$Ia4sOwH2aZS4nOfO2NO4wuhLeOntFYnq6E6TzjFgGXRnmnvhrRPFy','2024-10-31 03:54:38','2024-10-31 03:54:38',NULL),(48,'hd1','Danny','huangdong@gmail.com','$2b$10$3KviCt0T1X2waYwcMx/y3eCkZ11bJavektNLE9Lz91ackTDwKftX6','2024-10-31 14:54:57','2024-11-04 13:42:28',NULL),(50,'Angel','Tamara Plante','tamara@email.com','$2b$10$W.24gmRcZfdKoJhbBVgGL.VF.Kppq3QoSB3F6ZiUkAMQLxImR/6qK','2024-10-31 15:04:46','2024-10-31 15:04:46',NULL),(56,'hdcola','hd@hdcola.org','hd@hdcola.org','$2b$10$p04uMEbXNXrR.4ViBCOz6.TYlhsqCqlUftvC7YjSBTNGSbxurn9NW','2024-11-01 13:47:00','2024-11-01 13:47:00',NULL),(57,'test','testFull_name','test@mail.com','$2b$10$R8xT/WYAaobI9ZgabKXICuWuh/Bi7ooMsC8te6AkVQKOenG85L3TG','2024-11-01 14:47:25','2024-11-01 14:47:25',NULL),(58,'老房东','房东 老','hdcola@gmail.com','$2b$10$XbZD5bdh58QYQORPPNoQsel.qZGhM5Z4LZQOgj73SOOmOTkNRgf4a','2024-11-02 18:43:51','2024-11-02 18:43:51','https://lh3.googleusercontent.com/a/ACg8ocImPk5cnZmywwf2fm4AHx8_1JrNN8MTcgunCpQN7Xke8cJfb6AY=s96-c'),(60,'testUser','Test User','testuser@email.com','$2b$10$SkiPGHNehkCiQpr88tf1vu3Z0OwawyIOSXfHLZxkLTTptxD0kaJUe','2024-11-03 01:40:39','2024-11-03 01:40:39',NULL),(61,'newUser','New User','new@usermail.com','$2b$10$1tZ3B7/66JJqSXzdVrV.AORfrADndTLmrhG09h8xXwuu11XcltrDu','2024-11-03 02:51:55','2024-11-03 02:51:55',NULL),(62,'Iana Setrakova','Iana Setrakova','ia.setrakova@gmail.com','$2b$10$83.2loRFXcnUgfSj2G0DIexYG9nQvFHgqhyXBw74NUUd1eXLSPoYS','2024-11-03 21:49:00','2024-11-03 21:49:00','https://lh3.googleusercontent.com/a/ACg8ocLEbaBOc8FEOBogUjNlFHAbeckpjCz2Ice6FlmAJBbeLyT_nQ=s96-c'),(65,'angelblue05','angelblue05 undefined','angelblue.dev@gmail.com','$2b$10$o/RWKSMn3YuKALoXoya5Z./ByPTCnfkEFQNReVCx33iuahTvtuF/K','2024-11-04 14:47:37','2024-11-04 14:47:37','https://lh3.googleusercontent.com/a/ACg8ocJpkmtRyB1Yi4WeurywaFohKGy2M04p0dlE4SfJRnIYAKIPhg=s96-c');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-04 11:46:28

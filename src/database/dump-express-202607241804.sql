-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: express
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20260101000001-create-admin-users.js'),('20260101000002-create-categories.js'),('20260101000003-create-posts.js'),('20260101000004-create-contact-requests.js'),('20260101000005-create-tracking-logs.js'),('20260101000006-add-post-marketing-metadata.js'),('20260101000007-create-media-types-and-media.js'),('20260101000008-add-is-deleted.js'),('20260101000009-standardize-timestamps.js'),('20260101000010-rename-users-and-medias.js'),('20260101000011-posts-show-in-header-remove-type.js'),('20260101000012-create-contact-channels.js'),('20260101000013-remove-categories-type.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `order_index` int NOT NULL DEFAULT '0',
  `show_in_header_menu` tinyint(1) NOT NULL DEFAULT '0',
  `show_in_sidebar` tinyint(1) NOT NULL DEFAULT '0',
  `short_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `categories_parent_id` (`parent_id`),
  KEY `categories_is_deleted` (`is_deleted`),
  KEY `categories_show_in_header_menu` (`show_in_header_menu`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Gửi hàng đi nước ngoài','gui-hang-di-nuoc-ngoai',NULL,1,1,1,'Dịch vụ ship hàng, gửi hàng đi nước ngoài giá rẻ Tp.HCM','<p>GLEX chuy&ecirc;n nhận&nbsp;<em><strong>gửi h&agrave;ng đi nước ngo&agrave;i ở tp.HCM</strong></em>. Cung cấp dịch vụ thu mua hộ v&agrave; nhận gửi thực phẩm, kh&ocirc; hải sản, quần &aacute;o, thiết bị điện tử, c&aacute;c loại h&agrave;ng mẫu, h&agrave;ng gửi đi hội nghị triển l&atilde;m, h&agrave;ng gửi bảo h&agrave;nh đi nước ngo&agrave;i, thủ tục th&ocirc;ng quan nhanh ch&oacute;ng.</p>\n<p><a title=\"Gửi h&agrave;ng đi Mỹ\" href=\"https://glexpress.net/gui-hang-di-my\"><img src=\"https://glexpress.net/upload/images/Dich-vu-gui-hang-di-my.png\" alt=\"Dịch vụ gửi h&agrave;ng đi Mỹ tại Tp.HCM\"></a></p>\n<h2>V&igrave; sao Glex lại l&agrave; đối t&aacute;c đ&aacute;ng tin cậy trong dịch vụ gửi h&agrave;ng đi nước ngo&agrave;i</h2>\n<p>Glex c&oacute; hơn 15 năm kinh nghiệm trong lĩnh vực chuyển ph&aacute;t nhanh, vận chuyển h&agrave;ng h&oacute;a đi Nước Ngo&agrave;i với phương ch&acirc;m&nbsp;<strong>Nhanh Ch&oacute;ng - An To&agrave;n - Chất Lượng.</strong></p>\n<h3><em><strong>Khi Qu&yacute; Kh&aacute;ch gửi h&agrave;ng đi nước ngo&agrave;i tại Glex.</strong></em></h3>\n<ul>\n<li>Bảo hiểm h&agrave;ng h&oacute;a - c&oacute; m&atilde; tracking kiểm tra h&agrave;ng.</li>\n<li>Đ&oacute;ng g&oacute;i h&agrave;ng h&oacute;a, đ&oacute;ng th&ugrave;ng carton miễn ph&iacute;.</li>\n<li>Nhận gửi h&agrave;ng thực phẩm đi nước ngo&agrave;i, h&uacute;t ch&acirc;n kh&ocirc;ng, đ&oacute;ng bao b&igrave; miễn ph&iacute;.</li>\n<li>Cung cấp dịch vụ thu mua hộ</li>\n<li>Nhận h&agrave;ng tỉnh gửi đi nước ngo&agrave;i. Qu&yacute; kh&aacute;ch tại tỉnh gửi h&agrave;ng ch&agrave;nh xe hoặc bến xe ch&uacute;ng t&ocirc;i sẽ đến nhận v&agrave; gửi đi nước ngo&agrave;i.</li>\n<li>Nhận h&agrave;ng tận nh&agrave; khu vực TP. HCM</li>\n<li>Giao h&agrave;ng tận tay.</li>\n<li>Thời gian giao h&agrave;ng nhanh ch&oacute;ng 3 đến 5 ng&agrave;y</li>\n</ul>\n<p><strong>Glex lu&ocirc;n đảm bảo an to&agrave;n cho h&agrave;ng h&oacute;a</strong><br><br>Một trong những yếu tố quan trọng khi gửi h&agrave;ng quốc tế l&agrave; sự an to&agrave;n của h&agrave;ng h&oacute;a. C&aacute;c dịch vụ gửi h&agrave;ng tại Glex lu&ocirc;n ch&uacute; trọng đến việc bảo vệ h&agrave;ng h&oacute;a trong qu&aacute; tr&igrave;nh vận chuyển. Từ kh&acirc;u đ&oacute;ng g&oacute;i cho đến vận chuyển, mọi quy tr&igrave;nh đều được thực hiện cẩn thận, đảm bảo h&agrave;ng h&oacute;a kh&ocirc;ng bị hư hại.</p>\n<p><em>Glex h&acirc;n hạnh được phục vụ qu&yacute; Kh&aacute;ch!</em></p>','2026-07-24 03:57:29','2026-07-24 09:09:59',0),(2,'Chuyển phát nhanh','chuyen-phat-nhanh',NULL,2,1,1,NULL,NULL,'2026-07-24 03:57:29','2026-07-24 03:57:29',0),(3,'Cẩm nang','cam-nang',NULL,4,1,1,NULL,NULL,'2026-07-24 03:57:29','2026-07-24 10:35:49',0),(4,'Hỗ trợ','ho-tro',NULL,3,1,0,NULL,NULL,'2026-07-24 03:57:29','2026-07-24 03:57:29',0),(5,'Liên hệ','lien-he',NULL,5,1,0,NULL,'<div class=\"content-tit\">\n<div class=\"btit\">\n<h1>Li&ecirc;n hệ chuyển ph&aacute;t nhanh Glexpress.net</h1>\n</div>\n</div>\n<div class=\"col-md-12 col-sm-12 col-xs-12 contact-left\">\n<h3>Th&ocirc;ng tin li&ecirc;n h&ecirc; C&ocirc;ng Ty Chuyển Ph&aacute;t Nhanh &Aacute;nh S&aacute;ng To&agrave;n Cầu Glexpress.net</h3>\n<br><br><strong>VĂN PH&Ograve;NG CH&Iacute;NH</strong><br>Địa chỉ: Số 5 Nguyễn Văn Vĩnh, Phường 4, Quận T&acirc;n B&igrave;nh, TP. Hồ Ch&iacute; Minh<br>Điện thoại:(028) 6678 1779 - 62581681 - 62581646<br><br>Fax:(028) 6258 1683<br>Di động: 0907277502(ms. Vy)<br>E-mail: vy.pham@glexpress.net<br><br><br><strong>VĂN PH&Ograve;NG TẠI QU&Atilde;NG NG&Atilde;I</strong><br>Địa chỉ: 426/46 Nguyễn C&ocirc;ng Phương, P.Nghĩa Lộ, TP. Quảng Ng&atilde;i<br>Điện thoại: 0984 390 375(Ms. Tuyết)\n<div class=\"mapfiditour\">Glexpress.net tr&ecirc;n Goole Map</div>\n</div>','2026-07-24 03:57:29','2026-07-24 09:53:12',0),(6,'Giới thiệu','gioi-thieu',NULL,0,1,0,NULL,NULL,'2026-07-24 05:01:10','2026-07-24 05:01:10',0),(7,'Gửi hàng đi Mỹ','gui-hang-di-my',1,7,1,0,NULL,NULL,'2026-07-24 07:36:14','2026-07-24 08:14:09',0),(8,'Gửi hàng đi Nhật Bản','gui-hang-di-nhat-ban',1,8,1,0,NULL,NULL,'2026-07-24 07:36:14','2026-07-24 08:14:09',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_channels`
--

DROP TABLE IF EXISTS `contact_channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_channels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` enum('phone','zalo','facebook','email','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'phone',
  `value` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại hoặc URL / email',
  `display_value` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Hiển thị đẹp, vd 0907.277.502',
  `order_index` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contact_channels_channel` (`channel`),
  KEY `contact_channels_is_active` (`is_active`),
  KEY `contact_channels_order_index` (`order_index`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_channels`
--

LOCK TABLES `contact_channels` WRITE;
/*!40000 ALTER TABLE `contact_channels` DISABLE KEYS */;
INSERT INTO `contact_channels` VALUES (1,'Mr. Mạnh','phone','0987654321',NULL,1,1,0,'2026-07-24 07:15:48','2026-07-24 07:15:48'),(2,'Mr. Mạnh','zalo','0375278021',NULL,2,1,0,'2026-07-24 07:16:16','2026-07-24 10:56:17');
/*!40000 ALTER TABLE `contact_channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_requests`
--

DROP TABLE IF EXISTS `contact_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_page` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('new','processing','done','spam') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `assigned_to` int DEFAULT NULL,
  `note_internal` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `contact_requests_status` (`status`),
  KEY `contact_requests_created_at` (`created_at`),
  KEY `contact_requests_is_deleted` (`is_deleted`),
  CONSTRAINT `contact_requests_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_requests`
--

LOCK TABLES `contact_requests` WRITE;
/*!40000 ALTER TABLE `contact_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_types`
--

DROP TABLE IF EXISTS `media_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `media_types_is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_types`
--

LOCK TABLES `media_types` WRITE;
/*!40000 ALTER TABLE `media_types` DISABLE KEYS */;
INSERT INTO `media_types` VALUES (1,'banner','Banner','Ảnh banner trang chủ / landing','2026-07-24 03:57:29','2026-07-24 03:57:29',0),(2,'general','Chung','Ảnh dùng chung','2026-07-24 03:57:29','2026-07-24 03:57:29',0),(3,'thumbnail','Thumbnail','Ảnh thumbnail bài viết','2026-07-24 03:57:29','2026-07-24 03:57:29',0);
/*!40000 ALTER TABLE `media_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medias`
--

DROP TABLE IF EXISTS `medias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `media_type_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storage_key` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int NOT NULL DEFAULT '0',
  `link_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `medias_media_type_id` (`media_type_id`),
  KEY `medias_is_active` (`is_active`),
  KEY `medias_sort_order` (`sort_order`),
  KEY `medias_is_deleted` (`is_deleted`),
  CONSTRAINT `medias_ibfk_1` FOREIGN KEY (`media_type_id`) REFERENCES `media_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `medias_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medias`
--

LOCK TABLES `medias` WRITE;
/*!40000 ALTER TABLE `medias` DISABLE KEYS */;
INSERT INTO `medias` VALUES (3,1,'gui-hang-di-an-do(2).jpg',NULL,'https://glexpress.net/upload/images/gui-hang-di-an-do(2).jpg','external:https://glexpress.net/upload/images/gui-hang-di-an-do(2).jpg','image/jpeg',0,NULL,0,1,1,'2026-07-24 07:50:34','2026-07-24 07:50:34',0),(4,1,'dich-vu-gui-hang-di-nga.jpg',NULL,'https://glexpress.net/upload/images/dich-vu-gui-hang-di-nga.jpg','external:https://glexpress.net/upload/images/dich-vu-gui-hang-di-nga.jpg','image/jpeg',0,NULL,0,1,1,'2026-07-24 07:50:51','2026-07-24 07:50:51',0);
/*!40000 ALTER TABLE `medias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `view_count` int NOT NULL DEFAULT '0',
  `published_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `meta_keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `og_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `og_description` text COLLATE utf8mb4_unicode_ci,
  `og_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_description` text COLLATE utf8mb4_unicode_ci,
  `twitter_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canonical_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `robots_meta` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'index,follow',
  `focus_keyword` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schema_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Article',
  `ads_headline` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ads_description` text COLLATE utf8mb4_unicode_ci,
  `ads_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utm_campaign` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conversion_label` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `posts_category_id` (`category_id`),
  KEY `posts_status` (`status`),
  KEY `posts_published_at` (`published_at`),
  KEY `posts_is_deleted` (`is_deleted`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `posts_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,7,'gui-hang-di-my','Dịch vụ gửi hàng đi Mỹ','Gửi hàng đi Mỹ từ TP.HCM — nhận tận nơi, hỗ trợ thủ tục hải quan, giá cạnh tranh.','<p>Quý khách có người thân, bạn bè hoặc đối tác bên Mỹ cần gửi khô hải sản, thủ công mỹ nghệ, quà biếu hay hàng kinh doanh? <strong>Glexpress</strong> cung cấp dịch vụ gửi hàng đi Mỹ trọn gói từ TP. Hồ Chí Minh.</p><h2>Dịch vụ nổi bật</h2><ul><li>Nhận hàng tận nơi tại TP.HCM và các tỉnh lân cận</li><li>Đóng gói chuyên nghiệp, hỗ trợ thu mua hộ khi cần</li><li>Kết nối DHL, FedEx, UPS và tuyến chuyên biệt</li><li>Tư vấn mặt hàng được phép / hạn chế nhập Mỹ</li><li>Theo dõi vận đơn online, giao tận tay người nhận</li></ul><h2>Loại hàng thường gửi</h2><p>Chứng từ, hồ sơ; thực phẩm khô; quần áo, giày dép; hàng mẫu kinh doanh; hàng cồng kềnh / thiết bị (theo quy định).</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Mỹ giá rẻ TP.HCM | Glexpress','Dịch vụ gửi hàng đi Mỹ uy tín tại TP.HCM. Nhận tận nơi, hỗ trợ thủ tục, giá cạnh tranh. Hotline 0907.277.502.','published',32,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 09:40:36','gửi hàng đi Mỹ, ship Mỹ, chuyển phát Mỹ','Gửi hàng đi Mỹ | Glexpress','Gửi hàng đi Mỹ nhanh – an toàn – giá tốt từ TP.HCM.',NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Mỹ','Article','Gửi hàng đi Mỹ — giá tốt từ TP.HCM','Nhận tận nơi, hỗ trợ thủ tục. Gọi 0907.277.502',NULL,NULL,NULL,0),(2,1,'gui-hang-di-nhat-ban','Gửi hàng đi Nhật Bản','Chuyển phát nhanh đi Nhật Bản từ TP.HCM — an toàn, đúng hạn, hỗ trợ thông quan.','<p><strong>Gửi hàng đi Nhật Bản</strong> với Glexpress: kết nối các hãng chuyển phát quốc tế uy tín, phù hợp quà biếu, thực phẩm khô, chứng từ và hàng mẫu.</p><h2>Vì sao chọn Glexpress?</h2><ul><li>Tư vấn quy cách đóng gói đúng chuẩn tuyến Nhật</li><li>Hỗ trợ khai báo, giảm rủi ro giữ hàng tại hải quan</li><li>Thời gian vận chuyển linh hoạt theo từng dịch vụ</li><li>Báo giá minh bạch, theo dõi vận đơn rõ ràng</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Nhật Bản | Glexpress','Dịch vụ gửi hàng đi Nhật Bản từ TP.HCM. An toàn, đúng hạn. Hotline 0907.277.502.','published',10,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 09:38:41',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Nhật Bản','Article',NULL,NULL,NULL,NULL,NULL,0),(3,1,'gui-hang-di-han-quoc','Dịch vụ gửi hàng đi Hàn Quốc','Ship hàng đi Hàn Quốc giá rẻ qua DHL, UPS, FedEx — nhanh chóng, uy tín tại TP.HCM.','<p>Dịch vụ <strong>gửi hàng đi Hàn Quốc</strong> tại Glex nhanh chóng và uy tín với các hãng chuyển phát quốc tế DHL, UPS, FedEx… Phục vụ khách hàng trên toàn Việt Nam, đặc biệt khu vực TP.HCM.</p><h2>Cam kết dịch vụ</h2><ul><li>Giá cạnh tranh, nhiều lựa chọn thời gian giao</li><li>Hướng dẫn đóng gói tiết kiệm thể tích</li><li>Hỗ trợ thủ tục thông quan theo quy định Hàn Quốc</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Hàn Quốc giá rẻ | Glexpress','Ship hàng đi Hàn Quốc nhanh, uy tín tại TP.HCM. Hotline 0907.277.502.','published',2,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 07:29:49',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Hàn Quốc','Article',NULL,NULL,NULL,NULL,NULL,0),(4,1,'gui-hang-di-dai-loan','Chuyển phát nhanh đi Đài Loan','Gửi hàng đi Đài Loan từ TP.HCM — nhanh, an toàn, hỗ trợ thủ tục trọn gói.','<p>Glexpress nhận <strong>chuyển phát nhanh đi Đài Loan</strong>: chứng từ, quà biếu, hàng mẫu và nhiều mặt hàng khô theo quy định.</p><p>Chúng tôi hỗ trợ nhận hàng tận nơi, đóng gói và theo dõi hành trình đến người nhận.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Đài Loan | Glexpress','Chuyển phát nhanh đi Đài Loan từ TP.HCM. Hotline 0907.277.502.','published',2,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 07:36:53',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Đài Loan','Article',NULL,NULL,NULL,NULL,NULL,0),(5,1,'gui-hang-di-phap','Gửi hàng đi Pháp','Dịch vụ gửi hàng đi Pháp / Châu Âu từ TP.HCM — hỗ trợ thực phẩm khô và quà biếu.','<p><strong>Gửi hàng đi Pháp</strong> cùng Glexpress: tuyến Châu Âu ổn định, tư vấn mặt hàng được phép nhập, đặc biệt nhóm thực phẩm khô và quà biếu.</p><ul><li>Nhận hàng tận nơi tại TP.HCM</li><li>Tư vấn đóng gói &amp; khai báo hải quan</li><li>Giao hàng tận tay tại Pháp</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Pháp | Glexpress','Dịch vụ gửi hàng đi Pháp giá tốt từ TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Pháp','Article',NULL,NULL,NULL,NULL,NULL,0),(6,1,'gui-hang-di-uc','Dịch vụ chuyển phát nhanh đi Úc','Gửi hàng đi Úc (Australia) từ TP.HCM — chứng từ, thực phẩm khô, hàng mẫu, hàng cồng kềnh.','<p>Bạn cần <strong>chuyển phát nhanh đi Úc</strong> cho người thân hoặc gửi hàng mẫu cho đối tác? Glexpress nhận gửi giấy tờ, chứng từ, khô hải sản, quần áo, giày dép và hàng cồng kềnh / máy móc thiết bị (theo quy định).</p><h2>Ưu điểm</h2><ul><li>Giá cạnh tranh từ Tp. Hồ Chí Minh</li><li>Tư vấn thủ tục hải quan với mặt hàng khó vào Úc</li><li>Nhiều lựa chọn thời gian giao hàng</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Chuyển phát nhanh đi Úc | Glexpress','Gửi hàng đi Úc giá rẻ, uy tín tại TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Úc','Article',NULL,NULL,NULL,NULL,NULL,0),(7,1,'gui-hang-di-canada','Dịch vụ gửi hàng đi Canada','Gửi hàng đi Canada uy tín từ TP.HCM — hỗ trợ trọn gói thủ tục và theo dõi vận đơn.','<p><strong>Gửi hàng đi Canada</strong> với Glexpress: dịch vụ chuyên nghiệp, phù hợp quà biếu, hồ sơ và hàng hóa theo quy định nhập Canada.</p><p>Nhận hàng tận nơi, báo giá nhanh, hỗ trợ khách hàng từ 8h–18h mỗi ngày.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Canada uy tín | Glexpress','Dịch vụ gửi hàng đi Canada từ TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Canada','Article',NULL,NULL,NULL,NULL,NULL,0),(8,1,'gui-hang-di-malaysia','Gửi hàng đi Malaysia (Mã Lai) giá rẻ TP.HCM','Gửi hàng đi Malaysia nhanh, an toàn, tiết kiệm — thủ tục trọn gói, nhận tận nơi.','<p><strong>Gửi hàng đi Malaysia</strong> nhanh chóng, an toàn, tiết kiệm chi phí với dịch vụ chuyên nghiệp của Công ty Chuyển phát nhanh Ánh Sáng Toàn Cầu (GLEX).</p><ul><li>Hỗ trợ thủ tục trọn gói</li><li>Nhận hàng tận nơi tại TP.HCM</li><li>Giao hàng tận tay tại Malaysia (Kuala Lumpur và các khu vực phủ sóng)</li></ul><p>Liên hệ <strong>0907.277.502</strong> để nhận báo giá ưu đãi.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Malaysia giá rẻ TP.HCM | Glexpress','Ship Malaysia nhanh, an toàn từ TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Malaysia','Article',NULL,NULL,NULL,NULL,NULL,0),(9,1,'gui-hang-di-new-zealand','Dịch vụ gửi hàng đi New Zealand','Gửi hàng đi New Zealand từ TP.HCM — an toàn, hỗ trợ thủ tục hải quan.','<p>Glexpress cung cấp dịch vụ <strong>gửi hàng đi New Zealand</strong>: quà biếu, chứng từ, hàng mẫu và các mặt hàng được phép nhập theo quy định nghiêm ngặt của NZ.</p><p>Chúng tôi tư vấn trước khi gửi để hạn chế phát sinh chi phí và thời gian giữ hàng.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi New Zealand | Glexpress','Dịch vụ gửi hàng đi New Zealand từ TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi New Zealand','Article',NULL,NULL,NULL,NULL,NULL,0),(10,1,'gui-hang-di-duc','Chuyển phát nhanh đi Đức','Gửi hàng / thực phẩm khô đi Đức từ TP.HCM — đóng gói chuẩn, hỗ trợ thông quan.','<p>Nhận gửi hàng đi Đức, đặc biệt <strong>thực phẩm khô, bánh kẹo, mứt Tết</strong> gửi người thân. GLEX hỗ trợ đóng gói và thủ tục thông quan.</p><p>Hơn 15 năm kinh nghiệm gửi hàng đi nước ngoài từ TP. Hồ Chí Minh.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Đức | Glexpress','Chuyển phát nhanh đi Đức, gửi thực phẩm khô giá tốt. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Đức','Article',NULL,NULL,NULL,NULL,NULL,0),(11,1,'gui-hang-di-anh-quoc','Gửi hàng đi Anh Quốc (UK) giá rẻ','Gửi hàng đi UK từ TP.HCM — thực phẩm, quà biếu, chứng từ, hàng kinh doanh.','<p>Anh Quốc (United Kingdom – UK) có cộng đồng người Việt sinh sống, học tập và làm việc đông. Nhu cầu gửi thực phẩm, quà biếu, chứng từ và hàng kinh doanh luôn tăng mạnh, đặc biệt tại TP. Hồ Chí Minh.</p><p><strong>Glexpress</strong> cung cấp dịch vụ gửi hàng đi UK với nhiều lựa chọn thời gian và mức giá phù hợp.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Anh Quốc UK | Glexpress','Gửi hàng đi UK giá tốt từ TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Anh Quốc','Article',NULL,NULL,NULL,NULL,NULL,0),(12,1,'gui-hang-di-nga','Dịch vụ gửi hàng đi Nga giá rẻ hơn 40%','Chuyên tuyến gửi hàng đi Nga từ TP.HCM — tiết kiệm chi phí, hỗ trợ thủ tục.','<p>Cần gửi hàng đi Nga? Glexpress triển khai <strong>chuyên tuyến từ TP.HCM</strong> với mức giá tối ưu (tiết kiệm đáng kể so với gửi lẻ thông thường).</p><p>Tư vấn mặt hàng phù hợp, đóng gói an toàn và theo dõi vận đơn đến người nhận.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Nga giá rẻ | Glexpress','Chuyên tuyến gửi hàng đi Nga từ TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Nga','Article',NULL,NULL,NULL,NULL,NULL,0),(13,1,'gui-hang-di-thai-lan','Gửi hàng đi Thái Lan siêu tốc, giá rẻ tại TP.HCM','Gửi hàng đi Bangkok, Chiang Mai trong 2–5 ngày — nhận tận nơi tại TP.HCM.','<p>Đối tác gửi hàng đi Thái Lan (Bangkok, Chiang Mai) nhanh chóng khoảng <strong>2–5 ngày</strong>, giá rẻ, nhận hàng tận nơi tại TP.HCM.</p><p>Glexpress — công ty chuyển phát nhanh uy tín lâu năm tại TP. Hồ Chí Minh — đồng hành cùng quý khách trên tuyến Thái Lan.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Thái Lan siêu tốc | Glexpress','Ship Thái Lan 2–5 ngày từ TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Thái Lan','Article',NULL,NULL,NULL,NULL,NULL,0),(14,1,'gui-hang-di-an-do','Dịch vụ gửi hàng đi Ấn Độ bao thủ tục, thuế phí','Gửi hàng đi Ấn Độ tại TP.HCM — bao thủ tục, tiết kiệm đến 35%, nhận tận nhà.','<p>Báo giá và vận chuyển <strong>gửi hàng đi Ấn Độ</strong> tại TP.HCM. Glexpress tự hào là đơn vị chuyên tuyến quốc tế, đặc biệt tuyến Ấn Độ.</p><ul><li>Bao thủ tục – hỗ trợ thuế phí theo thỏa thuận dịch vụ</li><li>Tiết kiệm chi phí lên đến khoảng 35% so với gửi lẻ</li><li>Đóng gói hỗ trợ, nhận hàng tận nhà, giao tận tay</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Ấn Độ bao thủ tục | Glexpress','Gửi hàng đi Ấn Độ tại TP.HCM, hỗ trợ thủ tục. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Ấn Độ','Article',NULL,NULL,NULL,NULL,NULL,0),(15,1,'gui-thuc-pham-di-chau-au','Dịch vụ gửi thực phẩm đi Châu Âu giá rẻ','Nhận gửi thực phẩm khô đi Châu Âu — tư vấn thông quan, đóng gói chuyên nghiệp.','<p>Glex chuyên nhận <strong>gửi hàng thực phẩm đi Châu Âu</strong> giá tốt: đóng gói đúng quy cách và tư vấn thủ tục thông quan cho nhóm thực phẩm.</p><p>Phù hợp gửi người thân tại Đức, Pháp, Hà Lan, Anh và nhiều quốc gia EU khác (theo danh mục được phép).</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi thực phẩm đi Châu Âu | Glexpress','Gửi thực phẩm khô đi Châu Âu giá rẻ từ TP.HCM. Hotline 0907.277.502.','published',2,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 10:25:47',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','gửi thực phẩm đi Châu Âu','Article',NULL,NULL,NULL,NULL,NULL,0),(16,1,'thu-mua-ho-gui-hang-di-my','Dịch vụ thu mua hộ và gửi hàng đi Mỹ','Không có thời gian mua hàng? Glexpress thu mua hộ và gửi đi Mỹ giúp bạn.','<p>Quý khách cần gửi khô hải sản, thủ công mỹ nghệ… sang Mỹ nhưng không có thời gian thu mua và đóng gói? Glexpress cung cấp <strong>dịch vụ thu mua hộ</strong> kèm vận chuyển đi Mỹ.</p><p>Chúng tôi hỗ trợ từ khâu chọn hàng, đóng gói đến giao tận tay người nhận.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Thu mua hộ & gửi hàng đi Mỹ | Glexpress','Thu mua hộ hàng hóa và gửi đi Mỹ từ TP.HCM. Hotline 0907.277.502.','published',4,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 09:17:46',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','thu mua hộ gửi Mỹ','Article',NULL,NULL,NULL,NULL,NULL,0),(17,2,'chuyen-phat-nhanh-quoc-te','Dịch vụ chuyển phát nhanh Quốc tế','Chuyển phát nhanh quốc tế uy tín qua DHL, FedEx, UPS — phủ sóng toàn cầu.','<p><strong>Glexpress</strong> cung cấp dịch vụ chuyển phát nhanh quốc tế với mạng lưới DHL, FedEx, UPS… giúp hàng hóa đến hơn 200 quốc gia và vùng lãnh thổ.</p><h2>Lợi ích</h2><ul><li>Thời gian giao hàng rõ ràng theo từng dịch vụ</li><li>Theo dõi vận đơn realtime</li><li>Hỗ trợ thủ tục xuất nhập khẩu cơ bản</li><li>Nhận hàng tận nơi tại TP.HCM</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Chuyển phát nhanh Quốc tế | Glexpress','Dịch vụ chuyển phát nhanh quốc tế DHL, FedEx, UPS. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','chuyển phát nhanh quốc tế','Article',NULL,NULL,NULL,NULL,NULL,0),(18,2,'chuyen-phat-nhanh-nuoc-ngoai','Chuyển phát nhanh nước ngoài','Giải pháp chuyển phát nước ngoài linh hoạt — giá tốt, hỗ trợ 8h–18h.','<p>Dịch vụ <strong>chuyển phát nhanh nước ngoài</strong> của Glexpress phù hợp cá nhân và doanh nghiệp: gửi quà, hồ sơ, hàng mẫu và hàng hóa thương mại nhỏ.</p><p>Đội ngũ tư vấn giúp chọn tuyến / hãng phù hợp giữa tốc độ và chi phí.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Chuyển phát nhanh nước ngoài | Glexpress','Chuyển phát nước ngoài uy tín tại TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','chuyển phát nhanh nước ngoài','Article',NULL,NULL,NULL,NULL,NULL,0),(19,2,'chuyen-phat-hoa-toc-trong-nuoc','Chuyển phát hỏa tốc trong nước','Giao hàng hỏa tốc nội địa — Quy Nhơn, Quảng Ngãi, Hà Nội và nhiều tuyến khác.','<p>Ngoài tuyến quốc tế, Glexpress hỗ trợ <strong>chuyển phát – hỏa tốc trong nước</strong>, bao gồm các tuyến quen thuộc như Quy Nhơn – Bình Định, Quảng Ngãi, Hà Nội…</p><p>Phù hợp chứng từ gấp, hàng mẫu và hàng hóa cần giao nhanh trong ngày / vài ngày.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Hỏa tốc trong nước | Glexpress','Chuyển phát hỏa tốc nội địa Việt Nam. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','chuyển phát hỏa tốc trong nước','Article',NULL,NULL,NULL,NULL,NULL,0),(20,2,'chuyen-phat-nhanh-dhl','Dịch vụ chuyển phát nhanh DHL giá rẻ','Đại lý chuyển phát DHL — dịch vụ tốt, hỗ trợ tiện ích theo chính sách hãng.','<p>Glexpress là đối tác / đại lý sử dụng mạng lưới <strong>chuyển phát nhanh DHL</strong>. Khi gửi qua chúng tôi, quý khách được hỗ trợ tư vấn dịch vụ phù hợp và tiện ích từ phía công ty.</p><p>Phù hợp hàng hóa cần tốc độ và độ phủ quốc tế cao.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Chuyển phát nhanh DHL giá rẻ | Glexpress','Gửi hàng qua DHL giá tốt tại TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','chuyển phát nhanh DHL','Article',NULL,NULL,NULL,NULL,NULL,0),(21,2,'chuyen-phat-nhanh-ups','Dịch vụ chuyển phát nhanh UPS','Gửi hàng UPS — cam kết thời gian, mạng lưới logistics toàn cầu.','<p><strong>UPS</strong> là tập đoàn logistics hàng đầu thế giới; chuyển phát đúng hạn là một trong những tiêu chí cam kết mỗi ngày.</p><p>Glexpress hỗ trợ gửi hàng qua UPS từ TP.HCM với tư vấn rõ ràng về thời gian và chi phí.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Chuyển phát nhanh UPS | Glexpress','Gửi hàng UPS tại TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','chuyển phát nhanh UPS','Article',NULL,NULL,NULL,NULL,NULL,0),(22,2,'chuyen-phat-nhanh-fedex','Dịch vụ chuyển phát nhanh FedEx','FedEx phủ sóng hàng trăm quốc gia — mạng lưới hàng không và mặt đất mạnh.','<p>Với <strong>FedEx</strong>, bạn có thể gửi hàng đến hàng trăm quốc gia nhờ mạng lưới đường hàng không rộng và dịch vụ mặt đất mạnh tại nhiều khu vực.</p><p>Glexpress hỗ trợ đặt dịch vụ FedEx, nhận hàng và theo dõi vận đơn.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Chuyển phát nhanh FedEx | Glexpress','Gửi hàng FedEx tại TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','chuyển phát nhanh FedEx','Article',NULL,NULL,NULL,NULL,NULL,0),(23,2,'van-chuyen-hang-cong-kenh','Vận chuyển hàng hóa cồng kềnh – nặng ký','Vận chuyển máy móc, thiết bị công nghiệp và hàng quá khổ / nặng ký.','<p>GLEX cung cấp dịch vụ vận chuyển hàng đặc biệt: <strong>nặng ký, cồng kềnh</strong> như thiết bị máy móc phục vụ công nghiệp.</p><p>Tư vấn phương án đóng pallet / kiện gỗ, lựa chọn tuyến phù hợp và kiểm soát chi phí.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Vận chuyển hàng cồng kềnh | Glexpress','Vận chuyển hàng nặng ký, cồng kềnh từ TP.HCM. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','vận chuyển hàng cồng kềnh','Article',NULL,NULL,NULL,NULL,NULL,0),(24,2,'van-chuyen-hang-nguy-hiem','Vận chuyển hàng hóa nguy hiểm (Dangerous Goods)','Logistics hàng nguy hiểm: chất dễ cháy, oxy hóa, độc hại, ăn mòn… theo quy định.','<p>Chúng tôi hỗ trợ logistics cho <strong>hàng nguy hiểm (DG)</strong> như chất khí, chất lỏng/rắn dễ cháy, chất oxy hóa, độc hại, ăn mòn…</p><p>Mọi lô hàng DG cần khai báo đúng và tuân thủ quy định hãng / quốc gia đến. Liên hệ để được tư vấn trước khi gửi.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Vận chuyển hàng nguy hiểm | Glexpress','Hỗ trợ vận chuyển Dangerous Goods. Hotline 0907.277.502.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','vận chuyển hàng nguy hiểm','Article',NULL,NULL,NULL,NULL,NULL,0),(25,3,'cach-dong-hang-gui-di-han-quoc','Cách đóng hàng gửi đi Hàn Quốc vừa tiết kiệm vừa đúng chuẩn','Kinh nghiệm đóng gói gửi Hàn Quốc: tiết kiệm thể tích, đúng quy cách, giảm rủi ro.','<p>Nhiều người gửi hàng đi Hàn Quốc chưa biết cách đóng để <strong>tiết kiệm chi phí</strong> mà vẫn đúng quy cách. Glexpress chia sẻ kinh nghiệm thực tế:</p><ol><li>Loại bỏ khoảng trống thừa, dùng chèn lót phù hợp</li><li>Gom nhóm hàng cùng loại, ghi chú dễ vỡ nếu có</li><li>Chọn thùng carton đúng tải trọng</li><li>Dán keo chắc, ghi nhãn rõ ràng</li></ol><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Cách đóng hàng gửi đi Hàn Quốc | Glexpress','Hướng dẫn đóng gói gửi Hàn Quốc tiết kiệm, đúng chuẩn.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','đóng hàng gửi Hàn Quốc','Article',NULL,NULL,NULL,NULL,NULL,0),(26,3,'kinh-nghiem-gui-hang-di-thai-lan','Kinh nghiệm gửi hàng đi Thái Lan — tiết kiệm, nhanh chóng','Nắm quy trình và quy định để tránh mất hàng, chậm giờ hoặc phát sinh phí.','<p>Gửi hàng đi Thái Lan ngày càng phổ biến nhờ giao thương Việt – Thái phát triển. Tuy gần về địa lý, nếu không nắm quy trình bạn có thể gặp giữ hàng, chậm tiến độ hoặc chi phí cao.</p><h2>Gợi ý nhanh</h2><ul><li>Khai báo đúng tên hàng và giá trị</li><li>Chọn dịch vụ phù hợp (siêu tốc / tiết kiệm)</li><li>Đóng gói chắc chắn trước khi bàn giao</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Kinh nghiệm gửi hàng đi Thái Lan | Glexpress','Mẹo gửi hàng Thái Lan nhanh, rẻ, an toàn từ TP.HCM.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','kinh nghiệm gửi hàng Thái Lan','Article',NULL,NULL,NULL,NULL,NULL,0),(27,3,'quy-cach-dong-hang-gui-di-my','Quy cách đóng hàng gửi đi Mỹ','Đóng gói đúng chuẩn khi gửi Mỹ: an toàn vận chuyển và tối ưu thể tích.','<p>Trong vận chuyển quốc tế, <strong>đóng gói</strong> là khâu then chốt. Với tuyến Mỹ, ngoài an toàn còn cần tối ưu thể tích để giảm cước.</p><ul><li>Thùng đúng kích thước tải trọng</li><li>Chèn lót chống sốc cho hàng dễ vỡ</li><li>Niêm phong chắc, tránh hở cạnh</li><li>Tách riêng chất lỏng (nếu được phép gửi)</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Quy cách đóng hàng gửi đi Mỹ | Glexpress','Hướng dẫn đóng gói gửi Mỹ đúng quy cách, tiết kiệm cước.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','đóng hàng gửi Mỹ','Article',NULL,NULL,NULL,NULL,NULL,0),(28,3,'huong-dan-dong-hang-thung-carton','Hướng dẫn đóng hàng bằng thùng carton','Cách chọn và đóng thùng carton đúng tiêu chuẩn cho chuyển phát nhanh.','<p>Để chuyển phát an toàn, hãy đóng hàng bằng <strong>thùng carton đúng tiêu chuẩn</strong>:</p><ol><li>Chọn thùng mới hoặc còn cứng, không ẩm mốc</li><li>Lót đáy trước khi xếp hàng</li><li>Xếp nặng dưới – nhẹ trên</li><li>Đầy khoảng trống bằng giấy/foam</li><li>Dán chữ H hai mặt, ghi chú hướng đặt nếu cần</li></ol><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Đóng hàng bằng thùng carton | Glexpress','Hướng dẫn đóng thùng carton chuẩn cho chuyển phát nhanh.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','đóng hàng thùng carton','Article',NULL,NULL,NULL,NULL,NULL,0),(29,3,'cach-dong-hang-pallet','Cách đóng hàng pallet đúng quy cách','Đóng pallet cho nông sản, hàng gỗ, máy móc — an toàn khi gửi quốc tế.','<p>Các mặt hàng nông sản (cà phê, tiêu…), mây tre lá, thủ công mỹ nghệ hay thiết bị máy móc thường cần <strong>đóng pallet</strong> để vận chuyển quốc tế an toàn.</p><ul><li>Pallet chắc, kích thước phù hợp container / máy bay</li><li>Quấn stretch film / đai đai chặt</li><li>Chống ẩm, chống xê dịch kiện</li><li>Ghi nhãn và danh mục hàng rõ ràng</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Đóng hàng pallet đúng quy cách | Glexpress','Hướng dẫn đóng pallet gửi hàng quốc tế an toàn.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','đóng hàng pallet','Article',NULL,NULL,NULL,NULL,NULL,0),(30,4,'ho-tro-khach-hang','Hỗ trợ khách hàng 8h–18h hàng ngày','Đội ngũ CSKH Glexpress sẵn sàng tư vấn báo giá, vận đơn và thủ tục.','<p>Glexpress hỗ trợ khách hàng <strong>từ 8h đến 18h hàng ngày</strong>:</p><ul><li>Tư vấn tuyến gửi và báo giá nhanh</li><li>Hướng dẫn chuẩn bị chứng từ</li><li>Tra cứu / hỗ trợ xử lý vận đơn</li></ul><p>Chat / gọi trực tiếp Ms. Vy, Ms. Mai hoặc Ms. Tuyết theo số hotline trên website.</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Hỗ trợ khách hàng | Glexpress','Hỗ trợ 8h–18h: báo giá, vận đơn, thủ tục gửi hàng quốc tế.','published',0,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 14:25:15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','hỗ trợ khách hàng Glexpress','Article',NULL,NULL,NULL,NULL,NULL,0),(31,6,'gioi-thieu','Giới thiệu Công ty chuyển phát nhanh Ánh Sáng Toàn Cầu','GLOBAL LIGHT EXPRESS — hơn 15 năm kinh nghiệm gửi hàng quốc tế từ TP.HCM.','<p><strong>GLOBAL LIGHT EXPRESS (Glexpress)</strong> chuyên vận chuyển hàng hóa đi nước ngoài và hỗ trợ nhập hàng về Việt Nam bằng đường hàng không.</p><p>Chúng tôi nhận vận chuyển nhiều loại hàng đặc thù như mỹ phẩm, thuốc (theo quy định), hàng cồng kềnh / quá khổ… với dịch vụ chất lượng và giá thành cạnh tranh.</p><p>Phục vụ nhu cầu gửi thư từ và hàng hóa tới Trung Quốc, Hong Kong, Singapore, Malaysia, Campuchia, Thái Lan và hàng trăm quốc gia khác.</p><h2>Giá trị mang lại</h2><ul><li>Uy tín &amp; chất lượng</li><li>Giá cả cạnh tranh</li><li>Nhiệt tình &amp; chu đáo</li></ul><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Giới thiệu Glexpress | Chuyển phát Ánh Sáng Toàn Cầu','Giới thiệu công ty chuyển phát nhanh Ánh Sáng Toàn Cầu — Glexpress.net.','published',16,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 09:34:12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'index,follow','giới thiệu Glexpress','Article',NULL,NULL,NULL,NULL,NULL,0),(33,7,'gui-hang-di-my-2','Dịch vụ gửi hàng đi Mỹ 2','Gửi hàng đi Mỹ từ TP.HCM — nhận tận nơi, hỗ trợ thủ tục hải quan, giá cạnh tranh.','<p>Quý khách có người thân, bạn bè hoặc đối tác bên Mỹ cần gửi khô hải sản, thủ công mỹ nghệ, quà biếu hay hàng kinh doanh? <strong>Glexpress</strong> cung cấp dịch vụ gửi hàng đi Mỹ trọn gói từ TP. Hồ Chí Minh.</p><h2>Dịch vụ nổi bật</h2><ul><li>Nhận hàng tận nơi tại TP.HCM và các tỉnh lân cận</li><li>Đóng gói chuyên nghiệp, hỗ trợ thu mua hộ khi cần</li><li>Kết nối DHL, FedEx, UPS và tuyến chuyên biệt</li><li>Tư vấn mặt hàng được phép / hạn chế nhập Mỹ</li><li>Theo dõi vận đơn online, giao tận tay người nhận</li></ul><h2>Loại hàng thường gửi</h2><p>Chứng từ, hồ sơ; thực phẩm khô; quần áo, giày dép; hàng mẫu kinh doanh; hàng cồng kềnh / thiết bị (theo quy định).</p><hr/><p><strong>Liên hệ tư vấn &amp; báo giá:</strong></p><ul><li>Hotline: <a href=\"tel:0907277502\"><strong>0907.277.502</strong></a> (Ms. Vy)</li><li>Zalo / Mobile: <strong>0974.900.547</strong> (Ms. Mai)</li><li>Mobile: <strong>0984.390.375</strong> (Ms. Tuyết)</li><li>Giờ hỗ trợ: <strong>8h–18h</strong> hàng ngày</li><li>VP HCM: Số 5 Nguyễn Văn Vĩnh, P.4, Q.Tân Bình, TP.HCM — (028) 6678 1779</li></ul>',NULL,'Gửi hàng đi Mỹ giá rẻ TP.HCM | Glexpress','Dịch vụ gửi hàng đi Mỹ uy tín tại TP.HCM. Nhận tận nơi, hỗ trợ thủ tục, giá cạnh tranh. Hotline 0907.277.502.','published',36,'2026-07-24 14:25:15',1,1,'2026-07-24 14:25:15','2026-07-24 09:51:02','gửi hàng đi Mỹ, ship Mỹ, chuyển phát Mỹ','Gửi hàng đi Mỹ | Glexpress','Gửi hàng đi Mỹ nhanh – an toàn – giá tốt từ TP.HCM.',NULL,NULL,NULL,NULL,NULL,'index,follow','gửi hàng đi Mỹ','Article','Gửi hàng đi Mỹ — giá tốt từ TP.HCM','Nhận tận nơi, hỗ trợ thủ tục. Gọi 0907.277.502',NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracking_logs`
--

DROP TABLE IF EXISTS `tracking_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tracking_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tracking_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `carrier` enum('DHL','FEDEX','UPS') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_result` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tracking_logs_tracking_number` (`tracking_number`),
  KEY `tracking_logs_carrier` (`carrier`),
  KEY `tracking_logs_created_at` (`created_at`),
  KEY `tracking_logs_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracking_logs`
--

LOCK TABLES `tracking_logs` WRITE;
/*!40000 ALTER TABLE `tracking_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `tracking_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','manager') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manager',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `users_is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$TY4PM7RGV7/wUMeTWZTCi.cZ7mrvE7Z25.p0/ei.l9pd5HKZb4sD2','System Admin','admin','2026-07-24 03:57:29','2026-07-24 03:57:29',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'express'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 18:04:10

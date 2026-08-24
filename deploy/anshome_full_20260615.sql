-- MySQL dump 10.13  Distrib 9.6.0, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: anshome
-- ------------------------------------------------------
-- Server version	9.6.0

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
-- Table structure for table `agencies`
--

DROP TABLE IF EXISTS `agencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agencies` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_media_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `verification_status` enum('unverified','pending','verified','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unverified',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agencies_slug_key` (`slug`),
  KEY `agencies_logo_media_id_fkey` (`logo_media_id`),
  CONSTRAINT `agencies_logo_media_id_fkey` FOREIGN KEY (`logo_media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencies`
--

/*!40000 ALTER TABLE `agencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `agencies` ENABLE KEYS */;

--
-- Table structure for table `agency_members`
--

DROP TABLE IF EXISTS `agency_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agency_members` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agency_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `joined_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `agency_members_agency_id_user_id_key` (`agency_id`,`user_id`),
  KEY `agency_members_user_id_idx` (`user_id`),
  CONSTRAINT `agency_members_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `agency_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency_members`
--

/*!40000 ALTER TABLE `agency_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `agency_members` ENABLE KEYS */;

--
-- Table structure for table `article_categories`
--

DROP TABLE IF EXISTS `article_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_categories` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `seo_title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `article_categories_slug_key` (`slug`),
  KEY `article_categories_parent_id_fkey` (`parent_id`),
  CONSTRAINT `article_categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `article_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_categories`
--

/*!40000 ALTER TABLE `article_categories` DISABLE KEYS */;
INSERT INTO `article_categories` VALUES ('cmpjab2ov0018d8pn70ir5hdz',NULL,'Tin tuc','tin-tuc','Market news and real-estate updates.',NULL,NULL,'2026-05-24 04:35:38.719','2026-06-02 17:55:41.880'),('cmpjab2ow0019d8pneisv0vbb',NULL,'Wiki BDS','wiki','Evergreen real-estate guides.',NULL,NULL,'2026-05-24 04:35:38.720','2026-06-02 17:55:41.881'),('cmpjab2oy001ad8pn2ywhul21',NULL,'Mua BDS','mua-bat-dong-san','Buying guides.',NULL,NULL,'2026-05-24 04:35:38.722','2026-06-02 17:55:41.886'),('cmpjab2p1001bd8pnuk7z8hr0',NULL,'Ban BDS','ban-bat-dong-san','Selling guides.',NULL,NULL,'2026-05-24 04:35:38.725','2026-06-02 17:55:41.887'),('cmpjab2p2001cd8pndbmhke4b',NULL,'Thue BDS','thue-bat-dong-san','Renting guides.',NULL,NULL,'2026-05-24 04:35:38.726','2026-06-02 17:55:41.888'),('cmpjab2p3001dd8pnv9ikk5bq',NULL,'Tai chinh BDS','tai-chinh-bat-dong-san','Finance and mortgage topics.',NULL,NULL,'2026-05-24 04:35:38.727','2026-06-02 17:55:41.890'),('cmpjab2p4001ed8pnrlymp8f4',NULL,'Quy hoach - Phap ly','quy-hoach-phap-ly','Planning and legal topics.',NULL,NULL,'2026-05-24 04:35:38.728','2026-06-02 17:55:41.891'),('cmpjab2p5001fd8pn6e5gvyvo',NULL,'Noi - Ngoai that','noi-ngoai-that','Interior and exterior topics.',NULL,NULL,'2026-05-24 04:35:38.729','2026-06-02 17:55:41.892'),('cmpjab2p6001gd8pn02wm78jw',NULL,'Bao cao thi truong','bao-cao-thi-truong','Market reports.',NULL,NULL,'2026-05-24 04:35:38.730','2026-06-02 17:55:41.893'),('cmpjab2p7001hd8pn1ln785jj',NULL,'Goc nhin chuyen gia','goc-nhin-chuyen-gia','Expert views.',NULL,NULL,'2026-05-24 04:35:38.731','2026-06-02 17:55:41.894');
/*!40000 ALTER TABLE `article_categories` ENABLE KEYS */;

--
-- Table structure for table `article_tag_links`
--

DROP TABLE IF EXISTS `article_tag_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_tag_links` (
  `article_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`article_id`,`tag_id`),
  KEY `article_tag_links_tag_id_fkey` (`tag_id`),
  CONSTRAINT `article_tag_links_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_tag_links_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `article_tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_tag_links`
--

/*!40000 ALTER TABLE `article_tag_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_tag_links` ENABLE KEYS */;

--
-- Table structure for table `article_tags`
--

DROP TABLE IF EXISTS `article_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_tags` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `article_tags_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_tags`
--

/*!40000 ALTER TABLE `article_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_tags` ENABLE KEYS */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_media_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','scheduled','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `seo_title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text COLLATE utf8mb4_unicode_ci,
  `canonical_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noindex` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_slug_key` (`slug`),
  KEY `articles_status_published_at_idx` (`status`,`published_at`),
  KEY `articles_category_id_idx` (`category_id`),
  KEY `articles_author_user_id_fkey` (`author_user_id`),
  KEY `articles_cover_media_id_fkey` (`cover_media_id`),
  CONSTRAINT `articles_author_user_id_fkey` FOREIGN KEY (`author_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `articles_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `article_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `articles_cover_media_id_fkey` FOREIGN KEY (`cover_media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES ('cmpwxum6l0001n1pnrrgtjg6h',NULL,'cmpjab2ov0018d8pn70ir5hdz','Vietnam Land mở rộng hợp tác phát triển đại đô thị phía Nam TP.HCM','vietnam-land-mo-rong-hop-tac-phat-trien-dai-do-thi-phia-nam-tphcm','Các chủ đầu tư tiếp tục tăng tốc hợp tác chiến lược tại những khu đô thị quy mô lớn, nơi hạ tầng và tiện ích đang định hình lại nhu cầu an cư.','Thị trường bất động sản phía Nam ghi nhận xu hướng hợp tác giữa các đơn vị phát triển dự án, môi giới và vận hành nhằm tăng tốc bán hàng, hoàn thiện trải nghiệm khách mua và nâng chất lượng dịch vụ sau bàn giao.','cmpwxum6i0000n1pn2ozazcoi','published','Vietnam Land mở rộng hợp tác phát triển đại đô thị phía Nam TP.HCM','Các chủ đầu tư tiếp tục tăng tốc hợp tác chiến lược tại những khu đô thị quy mô lớn, nơi hạ tầng và tiện ích đang định hình lại nhu cầu an cư.',NULL,0,'2026-06-02 17:55:41.899','2026-06-02 17:55:41.901','2026-06-02 17:55:41.901'),('cmpwxum6p0003n1pnqqj6dy2i',NULL,'cmpjab2ov0018d8pn70ir5hdz','Giới nhà giàu Hà Nội săn tìm căn hộ diện tích lớn ở lõi nội đô','gioi-nha-giau-ha-noi-san-tim-can-ho-dien-tich-lon-o-loi-noi-do','Những căn hộ diện tích lớn, vị trí trung tâm và pháp lý rõ ràng tiếp tục giữ sức hút với nhóm khách mua ở thật lẫn tích sản dài hạn.','Nguồn cung căn hộ diện tích lớn tại lõi đô thị không nhiều, trong khi nhu cầu nâng cấp không gian sống của nhóm khách hàng có tài chính tốt vẫn ổn định. Điều này khiến phân khúc cao cấp có vị trí đẹp duy trì mặt bằng quan tâm cao.','cmpwxum6n0002n1pn15jmb1du','published','Giới nhà giàu Hà Nội săn tìm căn hộ diện tích lớn ở lõi nội đô','Những căn hộ diện tích lớn, vị trí trung tâm và pháp lý rõ ràng tiếp tục giữ sức hút với nhóm khách mua ở thật lẫn tích sản dài hạn.',NULL,0,'2026-06-02 15:55:41.904','2026-06-02 17:55:41.905','2026-06-02 17:55:41.905'),('cmpwxum6r0005n1pn0pwez8j4',NULL,'cmpjab2ov0018d8pn70ir5hdz','Hạ tầng cửa ngõ phía Đông mở thêm cơ hội đầu tư chu kỳ mới','ha-tang-cua-ngo-phia-dong-mo-them-co-hoi-dau-tu-chu-ky-moi','Các tuyến kết nối liên vùng giúp thị trường phía Đông được quan tâm hơn, đặc biệt ở nhóm sản phẩm có thể khai thác cho thuê hoặc tích sản.','Khi hạ tầng giao thông được cải thiện, biên độ di chuyển giữa trung tâm và các đô thị vệ tinh rút ngắn đáng kể. Nhà đầu tư bắt đầu chọn lọc kỹ hơn, ưu tiên dự án có pháp lý, tiện ích và khả năng vận hành thực tế.','cmpwxum6q0004n1pnn2gctfaa','published','Hạ tầng cửa ngõ phía Đông mở thêm cơ hội đầu tư chu kỳ mới','Các tuyến kết nối liên vùng giúp thị trường phía Đông được quan tâm hơn, đặc biệt ở nhóm sản phẩm có thể khai thác cho thuê hoặc tích sản.',NULL,0,'2026-06-02 13:55:41.907','2026-06-02 17:55:41.907','2026-06-02 17:55:41.907');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `before_json` json DEFAULT NULL,
  `after_json` json DEFAULT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_entity_type_entity_id_idx` (`entity_type`,`entity_id`),
  KEY `audit_logs_actor_user_id_idx` (`actor_user_id`),
  CONSTRAINT `audit_logs_actor_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES ('cmpjarlb800054jpn98g0ked2','cmpjaiv1q0000ukpnnzzebhyk','category','cmpjarlax00044jpn05l53o5t','category.create',NULL,'{\"id\": \"cmpjarlax00044jpn05l53o5t\", \"code\": \"test_category_crud\", \"name\": \"Test Category CRUD\", \"slug\": \"test-category-crud\", \"isActive\": true, \"parentId\": null, \"createdAt\": \"2026-05-24T04:48:29.337Z\", \"sortOrder\": 999, \"updatedAt\": \"2026-05-24T04:48:29.337Z\", \"transactionType\": \"sale\"}','127.0.0.1','curl/8.7.1','2026-05-24 04:48:29.348'),('cmpjarqde00074jpng4hb8gyb','cmpjaiv1q0000ukpnnzzebhyk','location','cmpjarqda00064jpnk7m461w5','location.create',NULL,'{\"id\": \"cmpjarqda00064jpnk7m461w5\", \"code\": \"TPC\", \"name\": \"Test Province CRUD\", \"slug\": \"test-province-crud\", \"type\": \"province\", \"newName\": null, \"oldName\": null, \"fullName\": \"Test Province CRUD\", \"isActive\": true, \"latitude\": null, \"parentId\": null, \"createdAt\": \"2026-05-24T04:48:35.902Z\", \"longitude\": null, \"updatedAt\": \"2026-05-24T04:48:35.902Z\"}','127.0.0.1','curl/8.7.1','2026-05-24 04:48:35.906'),('cmpjas4d400084jpn75jv3i5j','cmpjaiv1q0000ukpnnzzebhyk','category','cmpjarlax00044jpn05l53o5t','category.update','{\"id\": \"cmpjarlax00044jpn05l53o5t\", \"code\": \"test_category_crud\", \"name\": \"Test Category CRUD\", \"slug\": \"test-category-crud\", \"isActive\": true, \"parentId\": null, \"createdAt\": \"2026-05-24T04:48:29.337Z\", \"sortOrder\": 999, \"updatedAt\": \"2026-05-24T04:48:29.337Z\", \"transactionType\": \"sale\"}','{\"id\": \"cmpjarlax00044jpn05l53o5t\", \"code\": \"test_category_crud\", \"name\": \"Test Category CRUD Updated\", \"slug\": \"test-category-crud\", \"isActive\": true, \"parentId\": null, \"createdAt\": \"2026-05-24T04:48:29.337Z\", \"sortOrder\": 1000, \"updatedAt\": \"2026-05-24T04:48:54.034Z\", \"transactionType\": \"sale\"}','127.0.0.1','curl/8.7.1','2026-05-24 04:48:54.040'),('cmpjasazt00094jpnb2t77fii','cmpjaiv1q0000ukpnnzzebhyk','location','cmpjarqda00064jpnk7m461w5','location.update','{\"id\": \"cmpjarqda00064jpnk7m461w5\", \"code\": \"TPC\", \"name\": \"Test Province CRUD\", \"slug\": \"test-province-crud\", \"type\": \"province\", \"newName\": null, \"oldName\": null, \"fullName\": \"Test Province CRUD\", \"isActive\": true, \"latitude\": null, \"parentId\": null, \"createdAt\": \"2026-05-24T04:48:35.902Z\", \"longitude\": null, \"updatedAt\": \"2026-05-24T04:48:35.902Z\"}','{\"id\": \"cmpjarqda00064jpnk7m461w5\", \"code\": \"TPC\", \"name\": \"Test Province CRUD Updated\", \"slug\": \"test-province-crud\", \"type\": \"province\", \"newName\": null, \"oldName\": null, \"fullName\": \"Test Province CRUD Updated\", \"isActive\": true, \"latitude\": null, \"parentId\": null, \"createdAt\": \"2026-05-24T04:48:35.902Z\", \"longitude\": null, \"updatedAt\": \"2026-05-24T04:49:02.625Z\"}','127.0.0.1','curl/8.7.1','2026-05-24 04:49:02.633'),('cmpjbbsqi000c4jpn02jgg6d1','cmpjaiv1q0000ukpnnzzebhyk','listing','cmpjbbsqb000b4jpn0grgor43','listing.create_draft',NULL,'{\"id\": \"cmpjbbsqb000b4jpn0grgor43\", \"area\": \"72\", \"slug\": \"can-ho-test-foundation-quan-1\", \"price\": \"3500000000\", \"title\": \"Can ho test foundation Quan 1\", \"status\": \"draft\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJBBSQ70498F6\", \"streetId\": null, \"createdAt\": \"2026-05-24T05:04:12.083Z\", \"expiredAt\": null, \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T05:04:12.083Z\", \"attributes\": {\"floors\": 12, \"bedrooms\": 2, \"landArea\": null, \"bathrooms\": 2, \"direction\": null, \"listingId\": \"cmpjbbsqb000b4jpn0grgor43\", \"roadWidth\": null, \"usableArea\": null, \"legalStatus\": \"So do/So hong\", \"frontageWidth\": null, \"handoverStatus\": null, \"interiorStatus\": null, \"balconyDirection\": null}, \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test cho luong listing CRUD foundation.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"48611111.11\", \"publishedAt\": null, \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"none\"}','127.0.0.1','curl/8.7.1','2026-05-24 05:04:12.090'),('cmpjbcg37000e4jpnotau7dcu','cmpjaiv1q0000ukpnnzzebhyk','listing','cmpjbbsqb000b4jpn0grgor43','listing.submit_review','{\"id\": \"cmpjbbsqb000b4jpn0grgor43\", \"area\": \"72\", \"slug\": \"can-ho-test-foundation-quan-1\", \"price\": \"3500000000\", \"title\": \"Can ho test foundation Quan 1\", \"status\": \"draft\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJBBSQ70498F6\", \"streetId\": null, \"createdAt\": \"2026-05-24T05:04:12.083Z\", \"expiredAt\": null, \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T05:04:12.083Z\", \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test cho luong listing CRUD foundation.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"48611111.11\", \"publishedAt\": null, \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"none\"}','{\"id\": \"cmpjbbsqb000b4jpn0grgor43\", \"area\": \"72\", \"slug\": \"can-ho-test-foundation-quan-1\", \"price\": \"3500000000\", \"title\": \"Can ho test foundation Quan 1\", \"status\": \"pending_review\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJBBSQ70498F6\", \"streetId\": null, \"createdAt\": \"2026-05-24T05:04:12.083Z\", \"expiredAt\": null, \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T05:04:42.344Z\", \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test cho luong listing CRUD foundation.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"48611111.11\", \"publishedAt\": null, \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"pending\"}','127.0.0.1','curl/8.7.1','2026-05-24 05:04:42.355'),('cmpjbczaf000g4jpn97emsgms','cmpjaiv1q0000ukpnnzzebhyk','listing','cmpjbbsqb000b4jpn0grgor43','listing.approve','{\"id\": \"cmpjbbsqb000b4jpn0grgor43\", \"area\": \"72\", \"slug\": \"can-ho-test-foundation-quan-1\", \"price\": \"3500000000\", \"title\": \"Can ho test foundation Quan 1\", \"status\": \"pending_review\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJBBSQ70498F6\", \"streetId\": null, \"createdAt\": \"2026-05-24T05:04:12.083Z\", \"expiredAt\": null, \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T05:04:42.344Z\", \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test cho luong listing CRUD foundation.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"48611111.11\", \"publishedAt\": null, \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"pending\"}','{\"id\": \"cmpjbbsqb000b4jpn0grgor43\", \"area\": \"72\", \"slug\": \"can-ho-test-foundation-quan-1\", \"price\": \"3500000000\", \"title\": \"Can ho test foundation Quan 1\", \"status\": \"published\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJBBSQ70498F6\", \"streetId\": null, \"createdAt\": \"2026-05-24T05:04:12.083Z\", \"expiredAt\": \"2026-07-23T05:05:07.228Z\", \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T05:05:07.230Z\", \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test cho luong listing CRUD foundation.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"48611111.11\", \"publishedAt\": \"2026-05-24T05:05:07.228Z\", \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"approved\"}','127.0.0.1','curl/8.7.1','2026-05-24 05:05:07.239'),('cmpjk6fp6000n4jpn1v3zgne6','cmpjaiv1q0000ukpnnzzebhyk','lead','cmpjk5wao000i4jpn249zoqc6','lead.update_status','{\"id\": \"cmpjk5wao000i4jpn249zoqc6\", \"name\": \"Lead Smoke Test\", \"email\": \"lead-smoke@example.com\", \"phone\": \"0912345678\", \"status\": \"new\", \"message\": \"Toi quan tam tin dang nay.\", \"sourceId\": \"cmpjbbsqb000b4jpn0grgor43\", \"createdAt\": \"2026-05-24T09:11:33.312Z\", \"listingId\": \"cmpjbbsqb000b4jpn0grgor43\", \"projectId\": null, \"updatedAt\": \"2026-05-24T09:11:33.312Z\", \"utmMedium\": null, \"utmSource\": null, \"sourceType\": \"listing\", \"utmCampaign\": null, \"senderUserId\": null, \"recipientUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\"}','{\"id\": \"cmpjk5wao000i4jpn249zoqc6\", \"name\": \"Lead Smoke Test\", \"email\": \"lead-smoke@example.com\", \"phone\": \"0912345678\", \"status\": \"contacted\", \"message\": \"Toi quan tam tin dang nay.\", \"sourceId\": \"cmpjbbsqb000b4jpn0grgor43\", \"createdAt\": \"2026-05-24T09:11:33.312Z\", \"listingId\": \"cmpjbbsqb000b4jpn0grgor43\", \"projectId\": null, \"updatedAt\": \"2026-05-24T09:11:58.452Z\", \"utmMedium\": null, \"utmSource\": null, \"sourceType\": \"listing\", \"utmCampaign\": null, \"senderUserId\": null, \"recipientUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\"}','127.0.0.1','curl/8.7.1','2026-05-24 09:11:58.458'),('cmpjkic92000r4jpnhb54osme','cmpjaiv1q0000ukpnnzzebhyk','listing','cmpjkic8x000q4jpns909tzjq','listing.create_draft',NULL,'{\"id\": \"cmpjkic8x000q4jpns909tzjq\", \"area\": \"85\", \"slug\": \"media-smoke-listing\", \"price\": \"4200000000\", \"title\": \"Media Smoke Listing\", \"status\": \"draft\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJKIC8T362A26\", \"streetId\": null, \"createdAt\": \"2026-05-24T09:21:13.857Z\", \"expiredAt\": null, \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T09:21:13.857Z\", \"attributes\": {\"floors\": null, \"bedrooms\": 3, \"landArea\": null, \"bathrooms\": 2, \"direction\": null, \"listingId\": \"cmpjkic8x000q4jpns909tzjq\", \"roadWidth\": null, \"usableArea\": null, \"legalStatus\": \"So do/So hong\", \"frontageWidth\": null, \"handoverStatus\": null, \"interiorStatus\": null, \"balconyDirection\": null}, \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test media URL cho listing draft.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"49411764.71\", \"publishedAt\": null, \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"none\"}','127.0.0.1','curl/8.7.1','2026-05-24 09:21:13.862'),('cmpjkirhx000u4jpna2cao0rs','cmpjaiv1q0000ukpnnzzebhyk','listing_media','cmpjkirhs000t4jpnakkmg26m','listing_media.add',NULL,'{\"id\": \"cmpjkirhs000t4jpnakkmg26m\", \"type\": \"image\", \"media\": {\"id\": \"cmpjkirhq000s4jpne156qpb9\", \"width\": null, \"height\": null, \"status\": \"pending\", \"checksum\": null, \"mimeType\": \"image/jpeg\", \"createdAt\": \"2026-05-24T09:21:33.614Z\", \"publicUrl\": \"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop\", \"sizeBytes\": 0, \"storageKey\": \"remote/cmpjkic8x000q4jpns909tzjq/525baa454fdf1dd4\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\"}, \"caption\": \"Living room smoke test\", \"mediaId\": \"cmpjkirhq000s4jpne156qpb9\", \"listingId\": \"cmpjkic8x000q4jpns909tzjq\", \"sortOrder\": 0, \"moderationStatus\": \"pending\"}','127.0.0.1','curl/8.7.1','2026-05-24 09:21:33.621'),('cmpjkj19a000w4jpnwrxg0rr5','cmpjaiv1q0000ukpnnzzebhyk','listing','cmpjkic8x000q4jpns909tzjq','listing.submit_review','{\"id\": \"cmpjkic8x000q4jpns909tzjq\", \"area\": \"85\", \"slug\": \"media-smoke-listing\", \"price\": \"4200000000\", \"title\": \"Media Smoke Listing\", \"status\": \"draft\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJKIC8T362A26\", \"streetId\": null, \"createdAt\": \"2026-05-24T09:21:13.857Z\", \"expiredAt\": null, \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T09:21:13.857Z\", \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test media URL cho listing draft.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"49411764.71\", \"publishedAt\": null, \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"none\"}','{\"id\": \"cmpjkic8x000q4jpns909tzjq\", \"area\": \"85\", \"slug\": \"media-smoke-listing\", \"price\": \"4200000000\", \"title\": \"Media Smoke Listing\", \"status\": \"pending_review\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJKIC8T362A26\", \"streetId\": null, \"createdAt\": \"2026-05-24T09:21:13.857Z\", \"expiredAt\": null, \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T09:21:46.263Z\", \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test media URL cho listing draft.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"49411764.71\", \"publishedAt\": null, \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"pending\"}','127.0.0.1','curl/8.7.1','2026-05-24 09:21:46.270'),('cmpjkji2g000y4jpnf76wjwt0','cmpjaiv1q0000ukpnnzzebhyk','listing','cmpjkic8x000q4jpns909tzjq','listing.approve','{\"id\": \"cmpjkic8x000q4jpns909tzjq\", \"area\": \"85\", \"slug\": \"media-smoke-listing\", \"price\": \"4200000000\", \"title\": \"Media Smoke Listing\", \"status\": \"pending_review\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJKIC8T362A26\", \"streetId\": null, \"createdAt\": \"2026-05-24T09:21:13.857Z\", \"expiredAt\": null, \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T09:21:46.263Z\", \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test media URL cho listing draft.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"49411764.71\", \"publishedAt\": null, \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"pending\"}','{\"id\": \"cmpjkic8x000q4jpns909tzjq\", \"area\": \"85\", \"slug\": \"media-smoke-listing\", \"price\": \"4200000000\", \"title\": \"Media Smoke Listing\", \"status\": \"published\", \"wardId\": null, \"agencyId\": null, \"latitude\": null, \"publicId\": \"ANMPJKIC8T362A26\", \"streetId\": null, \"createdAt\": \"2026-05-24T09:21:13.857Z\", \"expiredAt\": \"2026-07-23T09:22:08.043Z\", \"longitude\": null, \"priceUnit\": \"VND\", \"projectId\": null, \"updatedAt\": \"2026-05-24T09:22:08.045Z\", \"categoryId\": \"cmpjab2mr0009d8pnrqzi7tmw\", \"districtId\": \"cmpjab2os0016d8pn36tkuhjl\", \"isFeatured\": false, \"isVerified\": false, \"provinceId\": \"cmpjab2on0013d8pnbjtph1x2\", \"addressText\": \"Quan 1, TP HCM\", \"contactName\": \"Anshome Admin\", \"description\": \"Tin test media URL cho listing draft.\", \"ownerUserId\": \"cmpjaiv1q0000ukpnnzzebhyk\", \"pricePerSqm\": \"49411764.71\", \"publishedAt\": \"2026-05-24T09:22:08.043Z\", \"contactPhone\": \"0900000000\", \"transactionType\": \"sale\", \"moderationStatus\": \"approved\"}','127.0.0.1','curl/8.7.1','2026-05-24 09:22:08.056'),('cmpv5lnw10003sapnvphtx7ob','cmpjaiv1q0000ukpnnzzebhyk','location','cmpjab2on0013d8pnbjtph1x2','location.update','{\"id\": \"cmpjab2on0013d8pnbjtph1x2\", \"code\": null, \"name\": \"TP. Ho Chi Minh\", \"slug\": \"tp-ho-chi-minh\", \"type\": \"province\", \"newName\": null, \"oldName\": null, \"fullName\": \"Thanh pho Ho Chi Minh\", \"isActive\": true, \"latitude\": null, \"parentId\": \"cmpjab2oh0011d8pnucdnrsmq\", \"createdAt\": \"2026-05-24T04:35:38.711Z\", \"longitude\": null, \"updatedAt\": \"2026-06-01T11:26:38.608Z\"}','{\"id\": \"cmpjab2on0013d8pnbjtph1x2\", \"code\": null, \"name\": \"TP. Hồ Chí Minh\", \"slug\": \"tp-ho-chi-minh\", \"type\": \"province\", \"newName\": null, \"oldName\": null, \"fullName\": \"Thành Phố Hồ Chí Minh\", \"isActive\": true, \"latitude\": null, \"parentId\": \"cmpjab2oh0011d8pnucdnrsmq\", \"createdAt\": \"2026-05-24T04:35:38.711Z\", \"longitude\": null, \"updatedAt\": \"2026-06-01T11:57:08.772Z\"}','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-01 11:57:08.785'),('cmpv5mqb50005sapnlbersvxj','cmpjaiv1q0000ukpnnzzebhyk','location','cmpjab2on0013d8pnbjtph1x2','location.update','{\"id\": \"cmpjab2on0013d8pnbjtph1x2\", \"code\": null, \"name\": \"TP. Hồ Chí Minh\", \"slug\": \"tp-ho-chi-minh\", \"type\": \"province\", \"newName\": null, \"oldName\": null, \"fullName\": \"Thành Phố Hồ Chí Minh\", \"isActive\": true, \"latitude\": null, \"parentId\": \"cmpjab2oh0011d8pnucdnrsmq\", \"createdAt\": \"2026-05-24T04:35:38.711Z\", \"longitude\": null, \"updatedAt\": \"2026-06-01T11:57:08.772Z\"}','{\"id\": \"cmpjab2on0013d8pnbjtph1x2\", \"code\": null, \"name\": \"TP. Hồ Chí Minh\", \"slug\": \"tp-ho-chi-minh\", \"type\": \"province\", \"newName\": null, \"oldName\": null, \"fullName\": \"Thành Phố Hồ Chí Minh\", \"isActive\": true, \"latitude\": null, \"parentId\": \"cmpjab2oh0011d8pnucdnrsmq\", \"createdAt\": \"2026-05-24T04:35:38.711Z\", \"longitude\": null, \"updatedAt\": \"2026-06-01T11:57:58.570Z\"}','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-01 11:57:58.577'),('cmpv5n8gk0006sapn6d6ph9dw','cmpjaiv1q0000ukpnnzzebhyk','location','cmpjab2os0016d8pn36tkuhjl','location.update','{\"id\": \"cmpjab2os0016d8pn36tkuhjl\", \"code\": null, \"name\": \"Quan 1\", \"slug\": \"quan-1\", \"type\": \"district\", \"newName\": null, \"oldName\": null, \"fullName\": \"Quan 1, TP. Ho Chi Minh\", \"isActive\": true, \"latitude\": null, \"parentId\": \"cmpjab2on0013d8pnbjtph1x2\", \"createdAt\": \"2026-05-24T04:35:38.716Z\", \"longitude\": null, \"updatedAt\": \"2026-06-01T11:26:38.625Z\"}','{\"id\": \"cmpjab2os0016d8pn36tkuhjl\", \"code\": null, \"name\": \"Quận\", \"slug\": \"quan-1\", \"type\": \"district\", \"newName\": null, \"oldName\": null, \"fullName\": \"Quận 1, TP. Hồ Chí Minh\", \"isActive\": true, \"latitude\": null, \"parentId\": \"cmpjab2on0013d8pnbjtph1x2\", \"createdAt\": \"2026-05-24T04:35:38.716Z\", \"longitude\": null, \"updatedAt\": \"2026-06-01T11:58:22.090Z\"}','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-01 11:58:22.100');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_type` enum('sale','rent','both') COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_code_key` (`code`),
  UNIQUE KEY `categories_slug_key` (`slug`),
  KEY `categories_transaction_type_is_active_idx` (`transaction_type`,`is_active`),
  KEY `categories_parent_id_fkey` (`parent_id`),
  CONSTRAINT `categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('cmpjab2mr0009d8pnrqzi7tmw',NULL,'sale','sale_apartment','Ban can ho chung cu','ban-can-ho-chung-cu',1,10,'2026-05-24 04:35:38.643','2026-06-02 17:55:41.771'),('cmpjab2mt000ad8pnsy37hzfg',NULL,'sale','sale_serviced_apartment','Ban chung cu mini, can ho dich vu','ban-chung-cu-mini-can-ho-dich-vu',1,20,'2026-05-24 04:35:38.645','2026-06-02 17:55:41.773'),('cmpjab2mv000bd8pnky20929d',NULL,'sale','sale_house','Ban nha rieng','ban-nha-rieng',1,30,'2026-05-24 04:35:38.647','2026-06-02 17:55:41.776'),('cmpjab2mx000cd8pnv7q7yd46',NULL,'sale','sale_villa','Ban nha biet thu, lien ke','ban-nha-biet-thu-lien-ke',1,40,'2026-05-24 04:35:38.649','2026-06-02 17:55:41.778'),('cmpjab2n0000dd8pnaa8rb941',NULL,'sale','sale_street_house','Ban nha mat pho','ban-nha-mat-pho',1,50,'2026-05-24 04:35:38.652','2026-06-02 17:55:41.781'),('cmpjab2n7000ed8pnf8wwpn4q',NULL,'sale','sale_shophouse','Ban shophouse, nha pho thuong mai','ban-shophouse-nha-pho-thuong-mai',1,60,'2026-05-24 04:35:38.659','2026-06-02 17:55:41.783'),('cmpjab2n9000fd8pn4i7jmxpa',NULL,'sale','sale_project_land','Ban dat nen du an','ban-dat-nen-du-an',1,70,'2026-05-24 04:35:38.661','2026-06-02 17:55:41.787'),('cmpjab2nc000gd8pneaqrtm24',NULL,'sale','sale_land','Ban dat','ban-dat',1,80,'2026-05-24 04:35:38.664','2026-06-02 17:55:41.789'),('cmpjab2ng000hd8pntro7ooz7',NULL,'sale','sale_farm_resort','Ban trang trai, khu nghi duong','ban-trang-trai-khu-nghi-duong',1,90,'2026-05-24 04:35:38.668','2026-06-02 17:55:41.792'),('cmpjab2ni000id8pn2fdrlz72',NULL,'sale','sale_condotel','Ban condotel','ban-condotel',1,100,'2026-05-24 04:35:38.670','2026-06-02 17:55:41.794'),('cmpjab2nj000jd8pncxhk6aej',NULL,'sale','sale_warehouse','Ban kho, nha xuong','ban-kho-nha-xuong',1,110,'2026-05-24 04:35:38.671','2026-06-02 17:55:41.797'),('cmpjab2nm000kd8pnf0oz1l8d',NULL,'sale','sale_other','Ban loai bat dong san khac','ban-bat-dong-san-khac',1,120,'2026-05-24 04:35:38.674','2026-06-02 17:55:41.798'),('cmpjab2no000ld8pn6lgnsnmn',NULL,'rent','rent_apartment','Cho thue can ho chung cu','cho-thue-can-ho-chung-cu',1,10,'2026-05-24 04:35:38.676','2026-06-02 17:55:41.801'),('cmpjab2nq000md8pnw4opeo79',NULL,'rent','rent_serviced_apartment','Cho thue chung cu mini, can ho dich vu','cho-thue-chung-cu-mini-can-ho-dich-vu',1,20,'2026-05-24 04:35:38.678','2026-06-02 17:55:41.803'),('cmpjab2ns000nd8pnc7psclhw',NULL,'rent','rent_house','Cho thue nha rieng','cho-thue-nha-rieng',1,30,'2026-05-24 04:35:38.680','2026-06-02 17:55:41.805'),('cmpjab2nw000od8pnngf5r97e',NULL,'rent','rent_villa','Cho thue nha biet thu, lien ke','cho-thue-nha-biet-thu-lien-ke',1,40,'2026-05-24 04:35:38.684','2026-06-02 17:55:41.807'),('cmpjab2ny000pd8pnnmixmfw6',NULL,'rent','rent_street_house','Cho thue nha mat pho','cho-thue-nha-mat-pho',1,50,'2026-05-24 04:35:38.686','2026-06-02 17:55:41.809'),('cmpjab2nz000qd8pnb5txt859',NULL,'rent','rent_room','Cho thue nha tro, phong tro','cho-thue-nha-tro-phong-tro',1,60,'2026-05-24 04:35:38.687','2026-06-02 17:55:41.811'),('cmpjab2o1000rd8pnhhofetva',NULL,'rent','rent_shophouse','Cho thue shophouse, nha pho thuong mai','cho-thue-shophouse-nha-pho-thuong-mai',1,70,'2026-05-24 04:35:38.689','2026-06-02 17:55:41.813'),('cmpjab2o2000sd8pnnpmtf47p',NULL,'rent','rent_office','Cho thue van phong','cho-thue-van-phong',1,80,'2026-05-24 04:35:38.691','2026-06-02 17:55:41.814'),('cmpjab2o4000td8pnw6kine78',NULL,'rent','rent_shop','Cho thue, sang nhuong cua hang, ki ot','cho-thue-cua-hang-ki-ot',1,90,'2026-05-24 04:35:38.692','2026-06-02 17:55:41.816'),('cmpjab2o5000ud8pnsi0hetdv',NULL,'rent','rent_warehouse_land','Cho thue kho, nha xuong, dat','cho-thue-kho-nha-xuong-dat',1,100,'2026-05-24 04:35:38.693','2026-06-02 17:55:41.818'),('cmpjab2o6000vd8pntv2009g3',NULL,'rent','rent_other','Cho thue loai bat dong san khac','cho-thue-bat-dong-san-khac',1,110,'2026-05-24 04:35:38.694','2026-06-02 17:55:41.819'),('cmpjab2o9000wd8pnjsnmc098',NULL,'both','project_apartment','Du an can ho chung cu','du-an-can-ho-chung-cu',1,210,'2026-05-24 04:35:38.697','2026-06-02 17:55:41.822'),('cmpjab2oa000xd8pnnfhw4cgh',NULL,'both','project_office','Du an cao oc van phong','du-an-cao-oc-van-phong',1,220,'2026-05-24 04:35:38.698','2026-06-02 17:55:41.823'),('cmpjab2ob000yd8pn1bxxu8n9',NULL,'both','project_urban_area','Du an khu do thi moi','du-an-khu-do-thi-moi',1,230,'2026-05-24 04:35:38.699','2026-06-02 17:55:41.824'),('cmpjab2oc000zd8pn9hmykbds',NULL,'both','project_social_housing','Du an nha o xa hoi','du-an-nha-o-xa-hoi',1,240,'2026-05-24 04:35:38.700','2026-06-02 17:55:41.826'),('cmpjab2od0010d8pn67d4irde',NULL,'both','project_industrial','Du an khu cong nghiep','du-an-khu-cong-nghiep',1,250,'2026-05-24 04:35:38.701','2026-06-02 17:55:41.827'),('cmpjarlax00044jpn05l53o5t',NULL,'sale','test_category_crud','Test Category CRUD Updated','test-category-crud',1,1000,'2026-05-24 04:48:29.337','2026-05-24 04:48:54.034');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

--
-- Table structure for table `developers`
--

DROP TABLE IF EXISTS `developers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `developers` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `logo_media_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_status` enum('unverified','pending','verified','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unverified',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `developers_slug_key` (`slug`),
  KEY `developers_logo_media_id_fkey` (`logo_media_id`),
  CONSTRAINT `developers_logo_media_id_fkey` FOREIGN KEY (`logo_media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `developers`
--

/*!40000 ALTER TABLE `developers` DISABLE KEYS */;
/*!40000 ALTER TABLE `developers` ENABLE KEYS */;

--
-- Table structure for table `domain_events`
--

DROP TABLE IF EXISTS `domain_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domain_events` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload_json` json NOT NULL,
  `status` enum('pending','processing','processed','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `processed_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `domain_events_status_created_at_idx` (`status`,`created_at`),
  KEY `domain_events_entity_type_entity_id_idx` (`entity_type`,`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_events`
--

/*!40000 ALTER TABLE `domain_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `domain_events` ENABLE KEYS */;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_id`,`listing_id`),
  KEY `favorites_listing_id_fkey` (`listing_id`),
  CONSTRAINT `favorites_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;

--
-- Table structure for table `lead_events`
--

DROP TABLE IF EXISTS `lead_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_events` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lead_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `lead_events_lead_id_idx` (`lead_id`),
  KEY `lead_events_actor_user_id_fkey` (`actor_user_id`),
  CONSTRAINT `lead_events_actor_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_events_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_events`
--

/*!40000 ALTER TABLE `lead_events` DISABLE KEYS */;
INSERT INTO `lead_events` VALUES ('cmpjk5waw000j4jpnc12ihg32','cmpjk5wao000i4jpn249zoqc6',NULL,'lead.created','Toi quan tam tin dang nay.','2026-05-24 09:11:33.320'),('cmpjk6fp2000m4jpndq7fsa96','cmpjk5wao000i4jpn249zoqc6','cmpjaiv1q0000ukpnnzzebhyk','lead.status_updated','new -> contacted: Called from smoke test','2026-05-24 09:11:58.454');
/*!40000 ALTER TABLE `lead_events` ENABLE KEYS */;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leads` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sender_user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('new','contacted','qualified','won','lost','spam') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `utm_source` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utm_medium` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utm_campaign` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leads_source_type_source_id_idx` (`source_type`,`source_id`),
  KEY `leads_recipient_user_id_status_idx` (`recipient_user_id`,`status`),
  KEY `leads_listing_id_idx` (`listing_id`),
  KEY `leads_project_id_fkey` (`project_id`),
  KEY `leads_sender_user_id_fkey` (`sender_user_id`),
  CONSTRAINT `leads_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leads_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leads_recipient_user_id_fkey` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leads_sender_user_id_fkey` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES ('cmpjk5wao000i4jpn249zoqc6','listing','cmpjbbsqb000b4jpn0grgor43','cmpjbbsqb000b4jpn0grgor43',NULL,'cmpjaiv1q0000ukpnnzzebhyk',NULL,'Lead Smoke Test','0912345678','lead-smoke@example.com','Toi quan tam tin dang nay.','contacted',NULL,NULL,NULL,'2026-05-24 09:11:33.312','2026-05-24 09:11:58.452');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;

--
-- Table structure for table `listing_attributes`
--

DROP TABLE IF EXISTS `listing_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_attributes` (
  `listing_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `floors` int DEFAULT NULL,
  `frontage_width` decimal(8,2) DEFAULT NULL,
  `road_width` decimal(8,2) DEFAULT NULL,
  `direction` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balcony_direction` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legal_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interior_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handover_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usable_area` decimal(12,2) DEFAULT NULL,
  `land_area` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`listing_id`),
  CONSTRAINT `listing_attributes_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_attributes`
--

/*!40000 ALTER TABLE `listing_attributes` DISABLE KEYS */;
INSERT INTO `listing_attributes` VALUES ('cmpjbbsqb000b4jpn0grgor43',2,2,12,NULL,NULL,NULL,NULL,'So do/So hong',NULL,NULL,NULL,NULL),('cmpjkic8x000q4jpns909tzjq',3,2,NULL,NULL,NULL,NULL,NULL,'So do/So hong',NULL,NULL,NULL,NULL),('cmpv5tx430000ejpngn6grjtt',3,2,NULL,NULL,NULL,NULL,NULL,'Sổ hồng riêng','Cơ bản',NULL,108.50,NULL),('cmpv5tx4n0003ejpnsjmdv2ig',1,1,NULL,NULL,NULL,NULL,NULL,'Sổ hồng riêng','Cơ bản',NULL,27.00,NULL),('cmpv5tx4x0006ejpnf9dfgfvm',3,2,NULL,NULL,NULL,NULL,NULL,'Sổ hồng riêng','Cơ bản',NULL,95.00,NULL),('cmpv5tx570009ejpnq3t9qg2t',3,2,NULL,NULL,NULL,NULL,NULL,'Sổ hồng riêng','Cơ bản',NULL,96.00,NULL),('cmpv5tx5m000cejpn1u76tjby',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sổ hồng riêng','Cơ bản',NULL,69.50,NULL),('cmpv5tx5x000fejpnp8yqapom',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'Đầy đủ nội thất',NULL,45.00,NULL),('cmpv5tx6a000iejpnmp7nl4ha',3,3,NULL,NULL,NULL,NULL,NULL,'Sổ hồng riêng','Cơ bản',NULL,57.00,NULL),('cmpv5tx6j000lejpn31snk8tn',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'Đầy đủ nội thất',NULL,12.00,NULL),('cmpvjd80v0002lqpnox3wv119',4,4,NULL,NULL,NULL,NULL,NULL,'Sổ hồng lâu dài','Bàn giao thô',NULL,NULL,180.00),('cmpvjd8130005lqpng8z8u8w1',3,4,NULL,NULL,NULL,NULL,NULL,'Hợp đồng mua bán','Bàn giao thô',NULL,NULL,120.00),('cmpvjd81a0008lqpn2n11cp87',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Hợp đồng mua bán','Đất nền',NULL,NULL,200.00),('cmpvjd81f000blqpnuysqrq1b',4,3,NULL,NULL,NULL,NULL,NULL,'Sổ hồng lâu dài','Hoàn thiện cơ bản',NULL,NULL,150.00);
/*!40000 ALTER TABLE `listing_attributes` ENABLE KEYS */;

--
-- Table structure for table `listing_media`
--

DROP TABLE IF EXISTS `listing_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_media` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('image','video','floor_plan','document') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `caption` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moderation_status` enum('pending','approved','rejected','deleted') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `listing_media_listing_id_media_id_key` (`listing_id`,`media_id`),
  KEY `listing_media_media_id_idx` (`media_id`),
  CONSTRAINT `listing_media_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `listing_media_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_media`
--

/*!40000 ALTER TABLE `listing_media` DISABLE KEYS */;
INSERT INTO `listing_media` VALUES ('cmpjkirhs000t4jpnakkmg26m','cmpjkic8x000q4jpns909tzjq','cmpjkirhq000s4jpne156qpb9','image',0,'Living room smoke test','approved'),('cmpv5tx4i0002ejpni6bas2so','cmpv5tx430000ejpngn6grjtt','cmpv5tx4f0001ejpn7fa820d8','image',0,'|Pháp lý-Chứng chỉ môi giới| Hiếm căn rộng, tòa C3 view Big C! Cắt lỗ sâu','approved'),('cmpv5tx4s0005ejpncqbhinvk','cmpv5tx4n0003ejpnsjmdv2ig','cmpv5tx4r0004ejpn98wu18pa','image',0,'Chỉ 2 tỷ sở hữu Lavida 1PN căn hộ nhỏ gọn, dễ cho thuê, dễ thanh khoản','approved'),('cmpv5tx530008ejpnpop1850z','cmpv5tx4x0006ejpnf9dfgfvm','cmpv5tx510007ejpngfod2i0h','image',0,'HOT. Bán căn 3 ngủ 2wc, 95m2 đủ đồ tại Mipec Rubik 360 - Xuân Thủy','approved'),('cmpv5tx5h000bejpntxhe6oa5','cmpv5tx570009ejpnq3t9qg2t','cmpv5tx5e000aejpnk762p2rm','image',0,'HOT. Bán chung cư Golden Park - Cầu Giấy. Dt 96m2, 3 ngủ 2wc, đủ đồ','approved'),('cmpv5tx5r000eejpnkkzhogi8','cmpv5tx5m000cejpn1u76tjby','cmpv5tx5q000dejpn19k5hdta','image',0,'Bán đất chợ Bình Khánh Quận 2 - khu 1.8ha Bình Khánh ngay ga Metro','approved'),('cmpv5tx66000hejpnmlmsx17u','cmpv5tx5x000fejpnp8yqapom','cmpv5tx64000gejpnv6iry4c7','image',0,'Cho thuê căn hộ bancon full NT gần SECC, Phú Mỹ Hưng, Vivo City','approved'),('cmpv5tx6g000kejpnyouxpyy5','cmpv5tx6a000iejpnmp7nl4ha','cmpv5tx6e000jejpn376zywm4','image',0,'105Tr/m2 - NHÀ HẺM ÔTÔ- NGAY CHỢ GÒ VẤP- MẶT TIỀN RỘNG','approved'),('cmpv5tx6o000nejpnfb7jtnct','cmpv5tx6j000lejpn31snk8tn','cmpv5tx6n000mejpng09ph4cc','image',0,'Cho thuê phòng Q3. Full nội thất cửa sổ 2tr6','approved'),('cmpvjd8110004lqpnvdg8ftja','cmpvjd80v0002lqpnox3wv119','cmpvjd80z0003lqpnwzetp879','image',0,'Bán biệt thự song lập The Royal Five Star Eco City, khu thấp tầng ven công viên','approved'),('cmpvjd8160007lqpn2u2gs681','cmpvjd8130005lqpng8z8u8w1','cmpvjd8150006lqpnzzwbqpi1','image',0,'Chuyển nhượng shophouse The Royal Five Star Eco City mặt trục thương mại','approved'),('cmpvjd81d000alqpn639sy093','cmpvjd81a0008lqpn2n11cp87','cmpvjd81c0009lqpniyqooy9q','image',0,'Bán nền biệt thự The Royal Five Star Eco City, diện tích 200m2, đường nội khu rộng','approved'),('cmpvjd81i000dlqpnwzmmoml1','cmpvjd81f000blqpnuysqrq1b','cmpvjd81h000clqpny6mbpwv5','image',0,'Bán nhà phố vườn The Royal Five Star Eco City, gần tiện ích trung tâm','approved');
/*!40000 ALTER TABLE `listing_media` ENABLE KEYS */;

--
-- Table structure for table `listing_moderation_events`
--

DROP TABLE IF EXISTS `listing_moderation_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_moderation_events` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `before_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `listing_moderation_events_listing_id_idx` (`listing_id`),
  KEY `listing_moderation_events_actor_user_id_idx` (`actor_user_id`),
  CONSTRAINT `listing_moderation_events_actor_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `listing_moderation_events_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_moderation_events`
--

/*!40000 ALTER TABLE `listing_moderation_events` DISABLE KEYS */;
INSERT INTO `listing_moderation_events` VALUES ('cmpjbcg30000d4jpnfiiuqknl','cmpjbbsqb000b4jpn0grgor43','cmpjaiv1q0000ukpnnzzebhyk','submit',NULL,'Ready for admin review','draft','pending_review','2026-05-24 05:04:42.348'),('cmpjbcza9000f4jpn50k3obme','cmpjbbsqb000b4jpn0grgor43','cmpjaiv1q0000ukpnnzzebhyk','approve',NULL,'Approved in foundation smoke test','pending_review','published','2026-05-24 05:05:07.233'),('cmpjkj195000v4jpn8z7oxd12','cmpjkic8x000q4jpns909tzjq','cmpjaiv1q0000ukpnnzzebhyk','submit',NULL,'Media smoke ready','draft','pending_review','2026-05-24 09:21:46.265'),('cmpjkji2b000x4jpnv7438h8r','cmpjkic8x000q4jpns909tzjq','cmpjaiv1q0000ukpnnzzebhyk','approve',NULL,'Approved media smoke','pending_review','published','2026-05-24 09:22:08.051');
/*!40000 ALTER TABLE `listing_moderation_events` ENABLE KEYS */;

--
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agency_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_type` enum('sale','rent') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('draft','submitted','pending_review','published','rejected','hidden','expired','deleted') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `moderation_status` enum('none','pending','approved','rejected','flagged') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `price` decimal(18,2) DEFAULT NULL,
  `price_unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` decimal(12,2) DEFAULT NULL,
  `price_per_sqm` decimal(18,2) DEFAULT NULL,
  `province_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_text` text COLLATE utf8mb4_unicode_ci,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `contact_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` datetime(3) DEFAULT NULL,
  `expired_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `listings_public_id_key` (`public_id`),
  KEY `listings_status_transaction_type_category_id_idx` (`status`,`transaction_type`,`category_id`),
  KEY `listings_province_id_district_id_ward_id_idx` (`province_id`,`district_id`,`ward_id`),
  KEY `listings_price_idx` (`price`),
  KEY `listings_area_idx` (`area`),
  KEY `listings_price_per_sqm_idx` (`price_per_sqm`),
  KEY `listings_published_at_idx` (`published_at`),
  KEY `listings_is_verified_idx` (`is_verified`),
  KEY `listings_owner_user_id_fkey` (`owner_user_id`),
  KEY `listings_agency_id_fkey` (`agency_id`),
  KEY `listings_project_id_fkey` (`project_id`),
  KEY `listings_category_id_fkey` (`category_id`),
  KEY `listings_district_id_fkey` (`district_id`),
  KEY `listings_ward_id_fkey` (`ward_id`),
  KEY `listings_street_id_fkey` (`street_id`),
  CONSTRAINT `listings_agency_id_fkey` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `listings_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `listings_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `listings_owner_user_id_fkey` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `listings_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `listings_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `listings_street_id_fkey` FOREIGN KEY (`street_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `listings_ward_id_fkey` FOREIGN KEY (`ward_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES ('cmpjbbsqb000b4jpn0grgor43','ANMPJBBSQ70498F6','cmpjaiv1q0000ukpnnzzebhyk',NULL,NULL,'sale','cmpjab2mr0009d8pnrqzi7tmw','Can ho test foundation Quan 1','can-ho-test-foundation-quan-1','Tin test cho luong listing CRUD foundation.','published','approved',3500000000.00,'VND',72.00,48611111.11,'cmpjab2on0013d8pnbjtph1x2','cmpjab2os0016d8pn36tkuhjl',NULL,NULL,'Quan 1, TP HCM',NULL,NULL,'Anshome Admin','0900000000',0,0,'2026-05-24 05:05:07.228','2026-07-23 05:05:07.228','2026-05-24 05:04:12.083','2026-05-24 05:05:07.230'),('cmpjkic8x000q4jpns909tzjq','ANMPJKIC8T362A26','cmpjaiv1q0000ukpnnzzebhyk',NULL,NULL,'sale','cmpjab2mr0009d8pnrqzi7tmw','Media Smoke Listing','media-smoke-listing','Tin test media URL cho listing draft.','published','approved',4200000000.00,'VND',85.00,49411764.71,'cmpjab2on0013d8pnbjtph1x2','cmpjab2os0016d8pn36tkuhjl',NULL,NULL,'Quan 1, TP HCM',NULL,NULL,'Anshome Admin','0900000000',0,0,'2026-05-24 09:22:08.043','2026-07-23 09:22:08.043','2026-05-24 09:21:13.857','2026-05-24 09:22:08.045'),('cmpv5tx430000ejpngn6grjtt','ANHOMESEED001','cmpjae4la00004jpn25bqskh1',NULL,NULL,'sale','cmpjab2mr0009d8pnrqzi7tmw','|Pháp lý-Chứng chỉ môi giới| Hiếm căn rộng, tòa C3 view Big C! Cắt lỗ sâu','phap-ly-chung-chi-moi-gioi-hiem-can-rong-toa-c3-view-big-c-cat-lo-sau','Căn hộ rộng, pháp lý rõ ràng, view thoáng, phù hợp gia đình cần không gian sống trung tâm Cầu Giấy.','published','approved',13700000000.00,'VND',108.50,126267281.11,'cmpjab2ol0012d8pnlc6nae8o','cmpjab2oq0015d8pnj4yeb1yc',NULL,NULL,'Cầu Giấy, Hà Nội',NULL,NULL,'Anshome Admin','0900000001',1,1,'2026-06-01 12:03:33.974','2026-07-31 12:03:33.974','2026-06-01 12:03:33.987','2026-06-01 12:03:33.987'),('cmpv5tx4n0003ejpnsjmdv2ig','ANHOMESEED002','cmpjae4la00004jpn25bqskh1',NULL,NULL,'sale','cmpjab2mr0009d8pnrqzi7tmw','Chỉ 2 tỷ sở hữu Lavida 1PN căn hộ nhỏ gọn, dễ cho thuê, dễ thanh khoản','chi-2-ty-so-huu-lavida-1pn-can-ho-nho-gon-de-cho-thue-de-thanh-khoan','Căn hộ 1 phòng ngủ thiết kế gọn, dễ khai thác cho thuê và phù hợp khách mua đầu tư dòng tiền.','published','approved',2000000000.00,'VND',27.00,74074074.07,'cmpjab2on0013d8pnbjtph1x2','cmpjab2os0016d8pn36tkuhjl',NULL,NULL,'Quận 7, Hồ Chí Minh',NULL,NULL,'Anshome Admin','0900000002',1,1,'2026-06-01 12:02:34.005','2026-07-31 12:02:34.005','2026-06-01 12:03:34.007','2026-06-01 12:03:34.007'),('cmpv5tx4x0006ejpnf9dfgfvm','ANHOMESEED003','cmpjae4la00004jpn25bqskh1',NULL,NULL,'sale','cmpjab2mr0009d8pnrqzi7tmw','HOT. Bán căn 3 ngủ 2wc, 95m2 đủ đồ tại Mipec Rubik 360 - Xuân Thủy','hot-ban-can-3-ngu-2wc-95m2-du-do-tai-mipec-rubik-360-xuan-thuy','Căn hộ 3 phòng ngủ tại Mipec Rubik 360, nội thất đầy đủ, sẵn ở, tiện ích đồng bộ.','published','approved',12500000000.00,'VND',95.00,131578947.37,'cmpjab2ol0012d8pnlc6nae8o','cmpjab2oq0015d8pnj4yeb1yc',NULL,NULL,'Mipec Rubik 360, Xuân Thủy, Cầu Giấy, Hà Nội',NULL,NULL,'Anshome Admin','0900000003',1,1,'2026-06-01 12:01:34.015','2026-07-31 12:01:34.015','2026-06-01 12:03:34.017','2026-06-01 12:03:34.017'),('cmpv5tx570009ejpnq3t9qg2t','ANHOMESEED004','cmpjae4la00004jpn25bqskh1',NULL,NULL,'sale','cmpjab2mr0009d8pnrqzi7tmw','HOT. Bán chung cư Golden Park - Cầu Giấy. Dt 96m2, 3 ngủ 2wc, đủ đồ','hot-ban-chung-cu-golden-park-cau-giay-dt-96m2-3-ngu-2wc-du-do','Căn hộ Golden Park vị trí thuận tiện, diện tích 96m2, thiết kế 3 ngủ 2 vệ sinh, bàn giao đủ đồ.','published','approved',9850000000.00,'VND',96.00,102604166.67,'cmpjab2ol0012d8pnlc6nae8o','cmpjab2oq0015d8pnj4yeb1yc',NULL,NULL,'Golden Park, Cầu Giấy, Hà Nội',NULL,NULL,'Anshome Admin','0900000004',1,1,'2026-06-01 12:00:34.025','2026-07-31 12:00:34.025','2026-06-01 12:03:34.027','2026-06-01 12:03:34.027'),('cmpv5tx5m000cejpn1u76tjby','ANHOMESEED005','cmpjae4la00004jpn25bqskh1',NULL,NULL,'sale','cmpjab2nc000gd8pneaqrtm24','Bán đất chợ Bình Khánh Quận 2 - khu 1.8ha Bình Khánh ngay ga Metro','ban-dat-cho-binh-khanh-quan-2-khu-1-8ha-binh-khanh-ngay-ga-metro','Lô đất khu dân cư Bình Khánh, kết nối nhanh trung tâm, phù hợp xây nhà ở hoặc giữ tài sản dài hạn.','published','approved',19110000000.00,'VND',69.50,274964028.78,'cmpjab2on0013d8pnbjtph1x2','cmpjab2os0016d8pn36tkuhjl',NULL,NULL,'Bình Khánh, Quận 2, Hồ Chí Minh',NULL,NULL,'Anshome Admin','0900000005',1,0,'2026-06-01 11:59:34.040','2026-07-31 11:59:34.040','2026-06-01 12:03:34.042','2026-06-01 12:03:34.042'),('cmpv5tx5x000fejpnp8yqapom','ANHOMESEED006','cmpjae4la00004jpn25bqskh1',NULL,NULL,'rent','cmpjab2no000ld8pn6lgnsnmn','Cho thuê căn hộ bancon full NT gần SECC, Phú Mỹ Hưng, Vivo City','cho-thue-can-ho-bancon-full-nt-gan-secc-phu-my-hung-vivo-city','Căn hộ cho thuê đầy đủ nội thất, có ban công thoáng, gần SECC và khu tiện ích Phú Mỹ Hưng.','published','approved',4800000.00,'VND/tháng',45.00,106666.67,'cmpjab2on0013d8pnbjtph1x2','cmpjab2os0016d8pn36tkuhjl',NULL,NULL,'Quận 7, Hồ Chí Minh',NULL,NULL,'Anshome Admin','0900000006',1,0,'2026-06-01 11:58:34.049','2026-07-31 11:58:34.049','2026-06-01 12:03:34.053','2026-06-01 12:03:34.053'),('cmpv5tx6a000iejpnmp7nl4ha','ANHOMESEED007','cmpjae4la00004jpn25bqskh1',NULL,NULL,'sale','cmpjab2mv000bd8pnky20929d','105Tr/m2 - NHÀ HẺM ÔTÔ- NGAY CHỢ GÒ VẤP- MẶT TIỀN RỘNG','105tr-m2-nha-hem-oto-ngay-cho-go-vap-mat-tien-rong','Nhà hẻm ô tô, khu dân cư hiện hữu, mặt tiền rộng, gần chợ và trục giao thông chính Gò Vấp.','published','approved',5990000000.00,'VND',57.00,105087719.30,'cmpjab2on0013d8pnbjtph1x2','cmpjab2os0016d8pn36tkuhjl',NULL,NULL,'Gò Vấp, Hồ Chí Minh',NULL,NULL,'Anshome Admin','0900000007',1,0,'2026-06-01 11:57:34.063','2026-07-31 11:57:34.063','2026-06-01 12:03:34.066','2026-06-01 12:03:34.066'),('cmpv5tx6j000lejpn31snk8tn','ANHOMESEED008','cmpjae4la00004jpn25bqskh1',NULL,NULL,'rent','cmpjab2nz000qd8pnb5txt859','Cho thuê phòng Q3. Full nội thất cửa sổ 2tr6','cho-thue-phong-q3-full-noi-that-cua-so-2tr6','Phòng cho thuê đầy đủ nội thất, có cửa sổ, phù hợp sinh viên và người đi làm cần vị trí trung tâm.','published','approved',2600000.00,'VND/tháng',12.00,216666.67,'cmpjab2on0013d8pnbjtph1x2','cmpjab2os0016d8pn36tkuhjl',NULL,NULL,'Quận 3, Hồ Chí Minh',NULL,NULL,'Anshome Admin','0900000008',1,0,'2026-06-01 11:56:34.074','2026-07-31 11:56:34.074','2026-06-01 12:03:34.075','2026-06-01 12:03:34.075'),('cmpvjd80v0002lqpnox3wv119','ANROYAL001','cmpvjd80q0000lqpn7cp9n7ou',NULL,'cmpvilo3400026upnd4znuedt','sale','cmpjab2mx000cd8pnv7q7yd46','Bán biệt thự song lập The Royal Five Star Eco City, khu thấp tầng ven công viên','ban-biet-thu-song-lap-the-royal-five-star-eco-city-khu-thap-tang-ven-cong-vien','Biệt thự song lập tại The Royal Five Star Eco City, vị trí nội khu yên tĩnh, phù hợp gia đình cần không gian sống xanh và kết nối nhanh về TP.HCM.','published','approved',13700000000.00,'VND',180.00,76111111.00,'cmpvilo2p00006upn8kd58ixz','cmpvilo2y00016upnslswo7yo',NULL,NULL,'The Royal Five Star Eco City, Can Giuoc, Long An',NULL,NULL,'Anshome Project Agent','0909000000',1,1,'2026-06-02 16:55:42.002','2026-08-31 17:55:42.002','2026-06-01 18:22:29.599','2026-06-02 17:55:42.004'),('cmpvjd8130005lqpng8z8u8w1','ANROYAL002','cmpvjd80q0000lqpn7cp9n7ou',NULL,'cmpvilo3400026upnd4znuedt','sale','cmpjab2n7000ed8pnf8wwpn4q','Chuyển nhượng shophouse The Royal Five Star Eco City mặt trục thương mại','chuyen-nhuong-shophouse-the-royal-five-star-eco-city-mat-truc-thuong-mai','Shophouse mặt trục thương mại dự án The Royal Five Star Eco City, phù hợp khai thác kinh doanh hoặc giữ tài sản dài hạn.','published','approved',19800000000.00,'VND',120.00,165000000.00,'cmpvilo2p00006upn8kd58ixz','cmpvilo2y00016upnslswo7yo',NULL,NULL,'The Royal Five Star Eco City, Can Giuoc, Long An',NULL,NULL,'Anshome Project Agent','0909000000',1,1,'2026-06-02 15:55:42.010','2026-08-31 17:55:42.010','2026-06-01 18:22:29.607','2026-06-02 17:55:42.011'),('cmpvjd81a0008lqpn2n11cp87','ANROYAL003','cmpvjd80q0000lqpn7cp9n7ou',NULL,'cmpvilo3400026upnd4znuedt','sale','cmpjab2n9000fd8pn4i7jmxpa','Bán nền biệt thự The Royal Five Star Eco City, diện tích 200m2, đường nội khu rộng','ban-nen-biet-thu-the-royal-five-star-eco-city-dien-tich-200m2-duong-noi-khu-rong','Nền biệt thự trong khu đô thị sinh thái The Royal Five Star Eco City, pháp lý rõ ràng, hạ tầng nội khu đang hoàn thiện.','published','approved',9200000000.00,'VND',200.00,46000000.00,'cmpvilo2p00006upn8kd58ixz','cmpvilo2y00016upnslswo7yo',NULL,NULL,'The Royal Five Star Eco City, Can Giuoc, Long An',NULL,NULL,'Anshome Project Agent','0909000000',1,0,'2026-06-02 14:55:42.015','2026-08-31 17:55:42.015','2026-06-01 18:22:29.614','2026-06-02 17:55:42.017'),('cmpvjd81f000blqpnuysqrq1b','ANROYAL004','cmpvjd80q0000lqpn7cp9n7ou',NULL,'cmpvilo3400026upnd4znuedt','sale','cmpjab2mx000cd8pnv7q7yd46','Bán nhà phố vườn The Royal Five Star Eco City, gần tiện ích trung tâm','ban-nha-pho-vuon-the-royal-five-star-eco-city-gan-tien-ich-trung-tam','Nhà phố vườn thuộc phân khu thấp tầng The Royal Five Star Eco City, thiết kế tối ưu cho ở thật, gần công viên và cụm tiện ích trung tâm.','published','approved',11200000000.00,'VND',150.00,74666667.00,'cmpvilo2p00006upn8kd58ixz','cmpvilo2y00016upnslswo7yo',NULL,NULL,'The Royal Five Star Eco City, Can Giuoc, Long An',NULL,NULL,'Anshome Project Agent','0909000000',1,0,'2026-06-02 13:55:42.020','2026-08-31 17:55:42.020','2026-06-01 18:22:29.619','2026-06-02 17:55:42.022');
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('country','province','district','ward','street') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `locations_type_slug_key` (`type`,`slug`),
  KEY `locations_parent_id_type_idx` (`parent_id`,`type`),
  CONSTRAINT `locations_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES ('cmpjab2oh0011d8pnucdnrsmq',NULL,'country','Viet Nam','viet-nam','Viet Nam',NULL,NULL,'VN',NULL,NULL,1,'2026-05-24 04:35:38.705','2026-06-02 17:55:41.830'),('cmpjab2ol0012d8pnlc6nae8o','cmpjab2oh0011d8pnucdnrsmq','province','Ha Noi','ha-noi','Thanh pho Ha Noi',NULL,NULL,NULL,NULL,NULL,1,'2026-05-24 04:35:38.709','2026-06-02 17:55:41.835'),('cmpjab2on0013d8pnbjtph1x2','cmpjab2oh0011d8pnucdnrsmq','province','TP. Ho Chi Minh','tp-ho-chi-minh','Thanh pho Ho Chi Minh',NULL,NULL,NULL,NULL,NULL,1,'2026-05-24 04:35:38.711','2026-06-02 17:55:41.838'),('cmpjab2oo0014d8pnl4ad65d3','cmpjab2oh0011d8pnucdnrsmq','province','Da Nang','da-nang','Thanh pho Da Nang',NULL,NULL,NULL,NULL,NULL,1,'2026-05-24 04:35:38.712','2026-06-02 17:55:41.842'),('cmpjab2oq0015d8pnj4yeb1yc','cmpjab2ol0012d8pnlc6nae8o','district','Cau Giay','cau-giay','Quan Cau Giay, Ha Noi',NULL,NULL,NULL,NULL,NULL,1,'2026-05-24 04:35:38.714','2026-06-02 17:55:41.861'),('cmpjab2os0016d8pn36tkuhjl','cmpjab2on0013d8pnbjtph1x2','district','Quan 1','quan-1','Quan 1, TP. Ho Chi Minh',NULL,NULL,NULL,NULL,NULL,1,'2026-05-24 04:35:38.716','2026-06-02 17:55:41.865'),('cmpjab2ot0017d8pnwkqpgvaa','cmpjab2oo0014d8pnl4ad65d3','district','Ngu Hanh Son','ngu-hanh-son','Quan Ngu Hanh Son, Da Nang',NULL,NULL,NULL,NULL,NULL,1,'2026-05-24 04:35:38.717','2026-06-02 17:55:41.877'),('cmpjarqda00064jpnk7m461w5',NULL,'province','Test Province CRUD Updated','test-province-crud','Test Province CRUD Updated',NULL,NULL,'TPC',NULL,NULL,1,'2026-05-24 04:48:35.902','2026-05-24 04:49:02.625'),('cmpvilo2p00006upn8kd58ixz','cmpjab2oh0011d8pnucdnrsmq','province','Long An','long-an','Long An',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 18:01:04.033','2026-06-02 17:55:41.854'),('cmpvilo2y00016upnslswo7yo','cmpvilo2p00006upn8kd58ixz','district','Can Giuoc','can-giuoc','Can Giuoc, Long An',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 18:01:04.042','2026-06-02 17:55:41.873'),('cmpvilo4s00116upnu5sf1zlk','cmpjab2on0013d8pnbjtph1x2','district','Quan 7','quan-7','Quan 7, TP. Ho Chi Minh',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 18:01:04.108','2026-06-02 17:55:41.868'),('cmpvilo5g001n6upnw1y959tt','cmpjab2oh0011d8pnucdnrsmq','province','Phu Yen','phu-yen','Phu Yen',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 18:01:04.132','2026-06-02 17:55:41.857'),('cmpvilo5h001o6upnp85kon5a','cmpvilo5g001n6upnw1y959tt','district','Tuy Hoa','tuy-hoa','Tuy Hoa, Phu Yen',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 18:01:04.133','2026-06-02 17:55:41.875'),('cmpvilo5x00206upnsqnvzz2a','cmpjab2on0013d8pnbjtph1x2','district','Thu Duc','thu-duc','Thu Duc, TP. Ho Chi Minh',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 18:01:04.149','2026-06-02 17:55:41.871'),('cmpwxovcd0000vjpnpvt5wmyj','cmpjab2oh0011d8pnucdnrsmq','province','Binh Duong','binh-duong','Binh Duong',NULL,NULL,NULL,NULL,NULL,1,'2026-06-02 17:51:13.837','2026-06-02 17:55:41.846'),('cmpwxovcf0001vjpn8pso0mpu','cmpjab2oh0011d8pnucdnrsmq','province','Dong Nai','dong-nai','Dong Nai',NULL,NULL,NULL,NULL,NULL,1,'2026-06-02 17:51:13.839','2026-06-02 17:55:41.849');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storage_key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_bytes` int NOT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `checksum` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected','deleted') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_storage_key_key` (`storage_key`),
  KEY `media_owner_user_id_idx` (`owner_user_id`),
  CONSTRAINT `media_owner_user_id_fkey` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES ('cmpjkirhq000s4jpne156qpb9','cmpjaiv1q0000ukpnnzzebhyk','remote/cmpjkic8x000q4jpns909tzjq/525baa454fdf1dd4','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop','image/jpeg',0,NULL,NULL,NULL,'approved','2026-05-24 09:21:33.614'),('cmpv5tx4f0001ejpn7fa820d8','cmpjae4la00004jpn25bqskh1','seed/home-listings/ANHOMESEED001.jpg','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=82','image/jpeg',500000,1200,675,NULL,'approved','2026-06-01 12:03:33.999'),('cmpv5tx4r0004ejpn98wu18pa','cmpjae4la00004jpn25bqskh1','seed/home-listings/ANHOMESEED002.jpg','https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=82','image/jpeg',500000,1200,675,NULL,'approved','2026-06-01 12:03:34.011'),('cmpv5tx510007ejpngfod2i0h','cmpjae4la00004jpn25bqskh1','seed/home-listings/ANHOMESEED003.jpg','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=82','image/jpeg',500000,1200,675,NULL,'approved','2026-06-01 12:03:34.021'),('cmpv5tx5e000aejpnk762p2rm','cmpjae4la00004jpn25bqskh1','seed/home-listings/ANHOMESEED004.jpg','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=82','image/jpeg',500000,1200,675,NULL,'approved','2026-06-01 12:03:34.034'),('cmpv5tx5q000dejpn19k5hdta','cmpjae4la00004jpn25bqskh1','seed/home-listings/ANHOMESEED005.jpg','https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=82','image/jpeg',500000,1200,675,NULL,'approved','2026-06-01 12:03:34.046'),('cmpv5tx64000gejpnv6iry4c7','cmpjae4la00004jpn25bqskh1','seed/home-listings/ANHOMESEED006.jpg','https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=82','image/jpeg',500000,1200,675,NULL,'approved','2026-06-01 12:03:34.060'),('cmpv5tx6e000jejpn376zywm4','cmpjae4la00004jpn25bqskh1','seed/home-listings/ANHOMESEED007.jpg','https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=1200&q=82','image/jpeg',500000,1200,675,NULL,'approved','2026-06-01 12:03:34.070'),('cmpv5tx6n000mejpng09ph4cc','cmpjae4la00004jpn25bqskh1','seed/home-listings/ANHOMESEED008.jpg','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=82','image/jpeg',500000,1200,675,NULL,'approved','2026-06-01 12:03:34.079'),('cmpvilo3800036upnpwa11ynp',NULL,'seed/featured-projects/the-royal-five-star-eco-city.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.052'),('cmpvilo3f00056upnj31lo7z4',NULL,'seed/featured-projects/the-royal-five-star-eco-city-1.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.059'),('cmpvilo3i00076upngsg09fi4',NULL,'seed/featured-projects/the-royal-five-star-eco-city-2.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.062'),('cmpvilo3l00096upncc8u8ad4',NULL,'seed/featured-projects/the-royal-five-star-eco-city-3.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.065'),('cmpvilo3n000b6upnv9qmrgu4',NULL,'seed/featured-projects/the-royal-five-star-eco-city-4.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.067'),('cmpvilo3q000d6upnpi2pb3l6',NULL,'seed/featured-projects/the-royal-five-star-eco-city-5.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.070'),('cmpvilo3s000f6upn76n87p1r',NULL,'seed/featured-projects/the-royal-five-star-eco-city-6.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.072'),('cmpvilo3v000h6upnmy2vxuhq',NULL,'seed/featured-projects/the-royal-five-star-eco-city-7.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.075'),('cmpvilo3y000j6upnkbbl0jaj',NULL,'seed/featured-projects/the-royal-five-star-eco-city-8.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.078'),('cmpvilo41000l6upnucn5253t',NULL,'seed/featured-projects/the-royal-five-star-eco-city-9.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.081'),('cmpvilo43000n6upn2y1yzc2b',NULL,'seed/featured-projects/the-royal-five-star-eco-city-10.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.083'),('cmpvilo45000p6upnbtfx6j88',NULL,'seed/featured-projects/the-royal-five-star-eco-city-11.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.085'),('cmpvilo47000r6upn4lx4dw52',NULL,'seed/featured-projects/the-royal-five-star-eco-city-12.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.087'),('cmpvilo4a000t6upnbn4zeuu6',NULL,'seed/featured-projects/the-royal-five-star-eco-city-13.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.090'),('cmpvilo4c000v6upn554s97gs',NULL,'seed/featured-projects/the-royal-five-star-eco-city-14.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.092'),('cmpvilo4g000x6upnnvt1u32n',NULL,'seed/featured-projects/the-royal-five-star-eco-city-15.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.096'),('cmpvilo4k000z6upnwavdj8s9',NULL,'seed/featured-projects/the-royal-five-star-eco-city-16.jpg','https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.100'),('cmpvilo4w00136upn8064fiku',NULL,'seed/featured-projects/the-peak-garden.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.112'),('cmpvilo4y00156upn9x8lj7qp',NULL,'seed/featured-projects/the-peak-garden-1.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.114'),('cmpvilo5000176upnqswyp9c4',NULL,'seed/featured-projects/the-peak-garden-2.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.116'),('cmpvilo5200196upn88uv0x1b',NULL,'seed/featured-projects/the-peak-garden-3.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.118'),('cmpvilo54001b6upnpoh2aaqe',NULL,'seed/featured-projects/the-peak-garden-4.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.120'),('cmpvilo57001d6upnerabh32f',NULL,'seed/featured-projects/the-peak-garden-5.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.123'),('cmpvilo59001f6upnv5qfy6sx',NULL,'seed/featured-projects/the-peak-garden-6.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.125'),('cmpvilo5b001h6upnlk80eq4x',NULL,'seed/featured-projects/the-peak-garden-7.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.127'),('cmpvilo5c001j6upnsx0huqd6',NULL,'seed/featured-projects/the-peak-garden-8.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.128'),('cmpvilo5e001l6upnz0n6669u',NULL,'seed/featured-projects/the-peak-garden-9.jpg','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.130'),('cmpvilo5k001q6upnug9d5nuh',NULL,'seed/featured-projects/cloud-icon-l-avenir.jpg','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.136'),('cmpvilo5m001s6upngohfiul7',NULL,'seed/featured-projects/cloud-icon-l-avenir-1.jpg','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.138'),('cmpvilo5o001u6upn4sug7iws',NULL,'seed/featured-projects/cloud-icon-l-avenir-2.jpg','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.140'),('cmpvilo5q001w6upnmezxj8vi',NULL,'seed/featured-projects/cloud-icon-l-avenir-3.jpg','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.142'),('cmpvilo5s001y6upnlz6qho99',NULL,'seed/featured-projects/cloud-icon-l-avenir-4.jpg','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.144'),('cmpvilo6000226upn34or1xib',NULL,'seed/featured-projects/prosper-pho-dong.jpg','https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.152'),('cmpvilo6200246upnq1a5wgd4',NULL,'seed/featured-projects/prosper-pho-dong-1.jpg','https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.154'),('cmpvilo6400266upnbgthz27s',NULL,'seed/featured-projects/prosper-pho-dong-2.jpg','https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.156'),('cmpvilo6600286upn2ptx4gw3',NULL,'seed/featured-projects/prosper-pho-dong-3.jpg','https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.158'),('cmpvilo68002a6upnr75js7ev',NULL,'seed/featured-projects/prosper-pho-dong-4.jpg','https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.160'),('cmpvilo6a002c6upnwjnf3ft1',NULL,'seed/featured-projects/prosper-pho-dong-5.jpg','https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.162'),('cmpvilo6b002e6upnogcwzdnr',NULL,'seed/featured-projects/prosper-pho-dong-6.jpg','https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.163'),('cmpvilo6d002g6upnmk8f7hnm',NULL,'seed/featured-projects/prosper-pho-dong-7.jpg','https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-01 18:01:04.165'),('cmpvjd80z0003lqpnwzetp879','cmpvjd80q0000lqpn7cp9n7ou','seed/project-listings/ANROYAL001.jpg','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,800,NULL,'approved','2026-06-01 18:22:29.603'),('cmpvjd8150006lqpnzzwbqpi1','cmpvjd80q0000lqpn7cp9n7ou','seed/project-listings/ANROYAL002.jpg','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,800,NULL,'approved','2026-06-01 18:22:29.609'),('cmpvjd81c0009lqpniyqooy9q','cmpvjd80q0000lqpn7cp9n7ou','seed/project-listings/ANROYAL003.jpg','https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,800,NULL,'approved','2026-06-01 18:22:29.616'),('cmpvjd81h000clqpny6mbpwv5','cmpvjd80q0000lqpn7cp9n7ou','seed/project-listings/ANROYAL004.jpg','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,800,NULL,'approved','2026-06-01 18:22:29.621'),('cmpwxum6i0000n1pn2ozazcoi',NULL,'seed/news/vietnam-land-mo-rong-hop-tac-phat-trien-dai-do-thi-phia-nam-tphcm.jpg','https://images.unsplash.com/photo-1560523159-4a9692d222f9?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-02 17:55:41.898'),('cmpwxum6n0002n1pn15jmb1du',NULL,'seed/news/gioi-nha-giau-ha-noi-san-tim-can-ho-dien-tich-lon-o-loi-noi-do.jpg','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-02 17:55:41.903'),('cmpwxum6q0004n1pnn2gctfaa',NULL,'seed/news/ha-tang-cua-ngo-phia-dong-mo-them-co-hoi-dau-tu-chu-ky-moi.jpg','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=82','image/jpeg',600000,1200,675,NULL,'approved','2026-06-02 17:55:41.906');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` enum('in_app','email','sms','zalo','push') COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload_json` json NOT NULL,
  `status` enum('pending','sent','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `scheduled_at` datetime(3) DEFAULT NULL,
  `sent_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_status_idx` (`user_id`,`status`),
  KEY `notifications_scheduled_at_idx` (`scheduled_at`),
  CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('cmpjk5way000k4jpnbz2fa1y7','cmpjaiv1q0000ukpnnzzebhyk','in_app','lead.new','{\"leadId\": \"cmpjk5wao000i4jpn249zoqc6\", \"publicId\": \"ANMPJBBSQ70498F6\", \"listingId\": \"cmpjbbsqb000b4jpn0grgor43\", \"senderName\": \"Lead Smoke Test\", \"listingTitle\": \"Can ho test foundation Quan 1\"}','pending',NULL,NULL,'2026-05-24 09:11:33.322');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_media_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `license_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_status` enum('unverified','pending','verified','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unverified',
  `public_slug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `profiles_public_slug_key` (`public_slug`),
  KEY `profiles_avatar_media_id_fkey` (`avatar_media_id`),
  CONSTRAINT `profiles_avatar_media_id_fkey` FOREIGN KEY (`avatar_media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES ('cmpjae4la00004jpn25bqskh1','Dev User',NULL,NULL,NULL,NULL,'unverified',NULL,'2026-05-24 04:38:01.150','2026-05-24 04:38:01.150'),('cmpjaiv1q0000ukpnnzzebhyk','Anshome Admin',NULL,NULL,NULL,NULL,'unverified',NULL,'2026-05-24 04:41:42.062','2026-06-02 17:55:42.087'),('cmpk6zciz00058cpnbqlsuxpg','Quang Doanh',NULL,NULL,NULL,NULL,'unverified',NULL,'2026-05-24 19:50:18.923','2026-05-24 19:50:18.923'),('cmpvjd80q0000lqpn7cp9n7ou','Anshome Project Agent',NULL,NULL,NULL,NULL,'unverified',NULL,'2026-06-01 18:22:29.594','2026-06-02 17:55:41.997');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;

--
-- Table structure for table `project_media`
--

DROP TABLE IF EXISTS `project_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_media` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('image','video','floor_plan','document') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_media_project_id_media_id_key` (`project_id`,`media_id`),
  KEY `project_media_media_id_idx` (`media_id`),
  CONSTRAINT `project_media_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_media_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_media`
--

/*!40000 ALTER TABLE `project_media` DISABLE KEYS */;
INSERT INTO `project_media` VALUES ('cmpvilo3b00046upn8qwsbl5i','cmpvilo3400026upnd4znuedt','cmpvilo3800036upnpwa11ynp','image',0),('cmpvilo3g00066upnbmlflz7c','cmpvilo3400026upnd4znuedt','cmpvilo3f00056upnj31lo7z4','image',1),('cmpvilo3j00086upnw9mcl7fj','cmpvilo3400026upnd4znuedt','cmpvilo3i00076upngsg09fi4','image',2),('cmpvilo3m000a6upn4hku09cw','cmpvilo3400026upnd4znuedt','cmpvilo3l00096upncc8u8ad4','image',3),('cmpvilo3o000c6upn5lht02lw','cmpvilo3400026upnd4znuedt','cmpvilo3n000b6upnv9qmrgu4','image',4),('cmpvilo3r000e6upntv35j7qj','cmpvilo3400026upnd4znuedt','cmpvilo3q000d6upnpi2pb3l6','image',5),('cmpvilo3u000g6upn66kf2a5c','cmpvilo3400026upnd4znuedt','cmpvilo3s000f6upn76n87p1r','image',6),('cmpvilo3x000i6upnn3ymqb6l','cmpvilo3400026upnd4znuedt','cmpvilo3v000h6upnmy2vxuhq','image',7),('cmpvilo3z000k6upnvck5qfv0','cmpvilo3400026upnd4znuedt','cmpvilo3y000j6upnkbbl0jaj','image',8),('cmpvilo42000m6upn0ny37ije','cmpvilo3400026upnd4znuedt','cmpvilo41000l6upnucn5253t','image',9),('cmpvilo44000o6upnqsn0fxq1','cmpvilo3400026upnd4znuedt','cmpvilo43000n6upn2y1yzc2b','image',10),('cmpvilo46000q6upnalp3skkq','cmpvilo3400026upnd4znuedt','cmpvilo45000p6upnbtfx6j88','image',11),('cmpvilo49000s6upn7is8li4c','cmpvilo3400026upnd4znuedt','cmpvilo47000r6upn4lx4dw52','image',12),('cmpvilo4b000u6upnezofa3ml','cmpvilo3400026upnd4znuedt','cmpvilo4a000t6upnbn4zeuu6','image',13),('cmpvilo4e000w6upnxug0sqkv','cmpvilo3400026upnd4znuedt','cmpvilo4c000v6upn554s97gs','image',14),('cmpvilo4i000y6upnbi179qtz','cmpvilo3400026upnd4znuedt','cmpvilo4g000x6upnnvt1u32n','image',15),('cmpvilo4m00106upndlbonv7o','cmpvilo3400026upnd4znuedt','cmpvilo4k000z6upnwavdj8s9','image',16),('cmpvilo4x00146upng6upoyc1','cmpvilo4u00126upnpid0pkp6','cmpvilo4w00136upn8064fiku','image',0),('cmpvilo4z00166upnqxhsksbe','cmpvilo4u00126upnpid0pkp6','cmpvilo4y00156upn9x8lj7qp','image',1),('cmpvilo5100186upnzlr2tuep','cmpvilo4u00126upnpid0pkp6','cmpvilo5000176upnqswyp9c4','image',2),('cmpvilo53001a6upn7czkgdlt','cmpvilo4u00126upnpid0pkp6','cmpvilo5200196upn88uv0x1b','image',3),('cmpvilo55001c6upn41jy5ogv','cmpvilo4u00126upnpid0pkp6','cmpvilo54001b6upnpoh2aaqe','image',4),('cmpvilo58001e6upnlcw569vw','cmpvilo4u00126upnpid0pkp6','cmpvilo57001d6upnerabh32f','image',5),('cmpvilo5a001g6upnv830wg7z','cmpvilo4u00126upnpid0pkp6','cmpvilo59001f6upnv5qfy6sx','image',6),('cmpvilo5c001i6upn4ygu85wb','cmpvilo4u00126upnpid0pkp6','cmpvilo5b001h6upnlk80eq4x','image',7),('cmpvilo5d001k6upng3dk7gp5','cmpvilo4u00126upnpid0pkp6','cmpvilo5c001j6upnsx0huqd6','image',8),('cmpvilo5f001m6upn28hy2ute','cmpvilo4u00126upnpid0pkp6','cmpvilo5e001l6upnz0n6669u','image',9),('cmpvilo5l001r6upncdhtjl2n','cmpvilo5j001p6upnaum84c0b','cmpvilo5k001q6upnug9d5nuh','image',0),('cmpvilo5n001t6upnktpedlow','cmpvilo5j001p6upnaum84c0b','cmpvilo5m001s6upngohfiul7','image',1),('cmpvilo5p001v6upngymlz8kv','cmpvilo5j001p6upnaum84c0b','cmpvilo5o001u6upn4sug7iws','image',2),('cmpvilo5r001x6upnp870b99o','cmpvilo5j001p6upnaum84c0b','cmpvilo5q001w6upnmezxj8vi','image',3),('cmpvilo5t001z6upnz3yrtzh6','cmpvilo5j001p6upnaum84c0b','cmpvilo5s001y6upnlz6qho99','image',4),('cmpvilo6100236upntcztmvel','cmpvilo5z00216upn7kg8o1xl','cmpvilo6000226upn34or1xib','image',0),('cmpvilo6300256upngghj65re','cmpvilo5z00216upn7kg8o1xl','cmpvilo6200246upnq1a5wgd4','image',1),('cmpvilo6500276upnxkcclfid','cmpvilo5z00216upn7kg8o1xl','cmpvilo6400266upnbgthz27s','image',2),('cmpvilo6700296upncg0pxwh1','cmpvilo5z00216upn7kg8o1xl','cmpvilo6600286upn2ptx4gw3','image',3),('cmpvilo69002b6upn3j0ft3sw','cmpvilo5z00216upn7kg8o1xl','cmpvilo68002a6upnr75js7ev','image',4),('cmpvilo6a002d6upnopivv52g','cmpvilo5z00216upn7kg8o1xl','cmpvilo6a002c6upnwjnf3ft1','image',5),('cmpvilo6c002f6upn8w5u4kzm','cmpvilo5z00216upn7kg8o1xl','cmpvilo6b002e6upnogcwzdnr','image',6),('cmpvilo6d002h6upnzndu6e04','cmpvilo5z00216upn7kg8o1xl','cmpvilo6d002g6upnmk8f7hnm','image',7);
/*!40000 ALTER TABLE `project_media` ENABLE KEYS */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `developer_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('planning','upcoming','selling','handed_over','paused','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'upcoming',
  `category_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_text` text COLLATE utf8mb4_unicode_ci,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `land_area` decimal(14,2) DEFAULT NULL,
  `total_units` int DEFAULT NULL,
  `price_min` decimal(18,2) DEFAULT NULL,
  `price_max` decimal(18,2) DEFAULT NULL,
  `price_unit` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legal_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_slug_key` (`slug`),
  KEY `projects_status_idx` (`status`),
  KEY `projects_province_id_district_id_idx` (`province_id`,`district_id`),
  KEY `projects_developer_id_fkey` (`developer_id`),
  KEY `projects_category_id_fkey` (`category_id`),
  KEY `projects_district_id_fkey` (`district_id`),
  KEY `projects_ward_id_fkey` (`ward_id`),
  KEY `projects_street_id_fkey` (`street_id`),
  CONSTRAINT `projects_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `projects_developer_id_fkey` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `projects_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `projects_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `projects_street_id_fkey` FOREIGN KEY (`street_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `projects_ward_id_fkey` FOREIGN KEY (`ward_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('cmpvilo3400026upnd4znuedt',NULL,'The Royal - Five Star Eco City','the-royal-five-star-eco-city','Khu do thi sinh thai quy mo lon tai cua ngo phia Nam TP.HCM, phat trien theo mo hinh do thi xanh tich hop tien ich.','selling','cmpjab2o9000wd8pnjsnmc098','cmpvilo2p00006upn8kd58ixz','cmpvilo2y00016upnslswo7yo',NULL,NULL,'Can Giuoc, Long An',NULL,NULL,395000.00,NULL,NULL,NULL,'VND/m2','Dang mo ban','2026-06-02 17:55:41.908','2026-06-01 18:01:04.048','2026-06-02 17:55:41.910'),('cmpvilo4u00126upnpid0pkp6',NULL,'The Peak Garden','the-peak-garden','Du an can ho cao tang tai khu Nam Sai Gon, ket noi nhanh Phu My Hung, Quan 7 va cac tien ich thuong mai.','selling','cmpjab2o9000wd8pnjsnmc098','cmpjab2on0013d8pnbjtph1x2','cmpvilo4s00116upnu5sf1zlk',NULL,NULL,'Quan 7, Ho Chi Minh',NULL,NULL,52600.00,NULL,75000000.00,75000000.00,'VND/m2','Dang mo ban','2026-06-02 17:54:41.947','2026-06-01 18:01:04.110','2026-06-02 17:55:41.949'),('cmpvilo5j001p6upnaum84c0b',NULL,'Cloud Icon L\' Avenir','cloud-icon-l-avenir','To hop can ho ven bien tai Tuy Hoa, dinh vi dong san pham nghi duong do thi voi tam nhin huong bien.','planning','cmpjab2o9000wd8pnjsnmc098','cmpvilo5g001n6upnw1y959tt','cmpvilo5h001o6upnp85kon5a',NULL,NULL,'Tuy Hoa, Phu Yen',NULL,NULL,NULL,NULL,NULL,NULL,'VND/m2','Dang cap nhat','2026-06-02 17:53:41.967','2026-06-01 18:01:04.135','2026-06-02 17:55:41.968'),('cmpvilo5z00216upn7kg8o1xl',NULL,'Prosper Pho Dong','prosper-pho-dong','Du an can ho tai khu Dong TP.HCM, phu hop nhu cau o thuc voi muc gia vua tam va tien ich noi khu day du.','selling','cmpjab2o9000wd8pnjsnmc098','cmpjab2on0013d8pnbjtph1x2','cmpvilo5x00206upnsqnvzz2a',NULL,NULL,'Thu Duc, Ho Chi Minh',NULL,NULL,5951.40,NULL,51000000.00,51000000.00,'VND/m2','Dang mo ban','2026-06-02 17:52:41.976','2026-06-01 18:01:04.151','2026-06-02 17:55:41.978');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` enum('seeker','owner','agent','agency_admin','developer','moderator','editor','ops','super_admin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('cmpjab2lh0000d8pnef69qb44','seeker','Seeker','Browse, save listings, and submit leads.','2026-05-24 04:35:38.597','2026-06-02 17:55:41.743'),('cmpjab2lo0001d8pn8wa7yje2','owner','Owner','Post and manage own property listings.','2026-05-24 04:35:38.604','2026-06-02 17:55:41.751'),('cmpjab2lt0002d8pnr516u5gn','agent','Agent','Manage professional listing inventory and leads.','2026-05-24 04:35:38.609','2026-06-02 17:55:41.754'),('cmpjab2lw0003d8pn78dfzakb','agency_admin','Agency Admin','Manage agency members, listings, and package usage.','2026-05-24 04:35:38.612','2026-06-02 17:55:41.757'),('cmpjab2lz0004d8pn0jybazuu','developer','Developer','Manage project and developer profile data.','2026-05-24 04:35:38.615','2026-06-02 17:55:41.760'),('cmpjab2m20005d8pne6le5388','moderator','Moderator','Review, approve, reject, hide, and flag listings.','2026-05-24 04:35:38.618','2026-06-02 17:55:41.762'),('cmpjab2mg0006d8pn0fi8m4jk','editor','Editor','Manage CMS articles, categories, and SEO metadata.','2026-05-24 04:35:38.632','2026-06-02 17:55:41.764'),('cmpjab2mk0007d8pnvk1yxqzw','ops','Operations','Manage packages, orders, support, and operational reports.','2026-05-24 04:35:38.636','2026-06-02 17:55:41.766'),('cmpjab2mn0008d8pn6hi4v7zt','super_admin','Super Admin','Full system access and role management.','2026-05-24 04:35:38.639','2026-06-02 17:55:41.768');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

--
-- Table structure for table `saved_searches`
--

DROP TABLE IF EXISTS `saved_searches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_searches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `query_json` json NOT NULL,
  `frequency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'daily',
  `last_sent_at` datetime(3) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `saved_searches_user_id_is_active_idx` (`user_id`,`is_active`),
  CONSTRAINT `saved_searches_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_searches`
--

/*!40000 ALTER TABLE `saved_searches` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_searches` ENABLE KEYS */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `last_seen_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `revoked_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_token_hash_key` (`token_hash`),
  KEY `sessions_user_id_idx` (`user_id`),
  KEY `sessions_expires_at_idx` (`expires_at`),
  CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('cmpjae4lo00024jpnetx3znzd','cmpjae4la00004jpn25bqskh1','2281ca8253088437d6a4fcb24d929cbed27b98620bf2ce752c58c7d9f9e30bac','127.0.0.1','curl/8.7.1','2026-05-24 04:38:01.164','2026-06-23 04:38:01.162','2026-05-24 04:38:01.164','2026-05-24 04:38:01.414'),('cmpjajen000034jpnatmwsqm8','cmpjaiv1q0000ukpnnzzebhyk','206ae04c4a1806197ee925c48caf83a5f3efdd1f5b2be567591f8f14e1c43582','127.0.0.1','curl/8.7.1','2026-05-24 04:42:07.452','2026-06-23 04:42:07.451','2026-05-24 04:42:07.452',NULL),('cmpjbak28000a4jpnkblzyot1','cmpjaiv1q0000ukpnnzzebhyk','9f18684d530cadab227705e5588d45fe305d5fd04be13a1e3b9ae39596ee5c2d','127.0.0.1','curl/8.7.1','2026-05-24 05:03:14.192','2026-06-23 05:03:14.191','2026-05-24 05:03:14.192',NULL),('cmpjjs23y000h4jpnt0kwiyw0','cmpjaiv1q0000ukpnnzzebhyk','68eb6ada21faca86d08360272847459a30d827b06e2eed2de4149ab410de8668','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 09:00:47.662','2026-06-23 09:00:47.661','2026-05-24 09:00:47.662','2026-05-24 09:01:24.111'),('cmpjk6592000l4jpn77ogia8f','cmpjaiv1q0000ukpnnzzebhyk','8f46035d01dc32352d84f6cfeebaa7658148f21087f3a1b1a1f97b94fe65872b','127.0.0.1','curl/8.7.1','2026-05-24 09:11:44.918','2026-06-23 09:11:44.913','2026-05-24 09:11:44.918',NULL),('cmpjk6sqi000o4jpnpvbkxt3t','cmpjaiv1q0000ukpnnzzebhyk','b28b9c69087c88ad5bcf5a330c06c959cacb1c4be90a39ebc9b966f2935ec50d','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 09:12:15.354','2026-06-23 09:12:15.353','2026-05-24 09:12:15.354','2026-05-24 09:14:08.103'),('cmpjkhzuw000p4jpnj26a612e','cmpjaiv1q0000ukpnnzzebhyk','7585f393fc438fa0fdde432f1055ec81142f2ad400245e1d30fd85a4610b190d','127.0.0.1','curl/8.7.1','2026-05-24 09:20:57.800','2026-06-23 09:20:57.798','2026-05-24 09:20:57.800',NULL),('cmpjlgnea000z4jpnc23mcuos','cmpjaiv1q0000ukpnnzzebhyk','33b0bea39b94a1a36ed11d4877f4d37119798bea86f87dc7e78d7e32448e8fb4','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 09:47:54.610','2026-06-23 09:47:54.609','2026-05-24 09:47:54.610','2026-05-24 10:47:46.295'),('cmpjnun9v00104jpnz8ws0zci','cmpjaiv1q0000ukpnnzzebhyk','268ca2636d238c8d408e3a71a6a3cbc53b2578c197bec220d9d9ae6f914e02c7','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 10:54:46.867','2026-06-23 10:54:46.866','2026-05-24 10:54:46.867','2026-05-24 10:54:51.178'),('cmpjoot9s00114jpnqmq41s2g','cmpjaiv1q0000ukpnnzzebhyk','e65d34c28b7e596f5610fd87b49c772ae26869b571dbac65dff18629f316b54d','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 11:18:14.320','2026-06-23 11:18:14.319','2026-05-24 11:18:14.320','2026-05-24 19:33:57.017'),('cmpk6en9u00008cpn0ra79auk','cmpjaiv1q0000ukpnnzzebhyk','6e9e76de19651d5b3c8aaa5c451f16e76b10b5bea9ccf758f4e1de929664368c','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 19:34:13.074','2026-06-23 19:34:13.071','2026-05-24 19:34:13.074','2026-05-24 19:35:03.309'),('cmpk6g09000018cpn2xz79fvs','cmpjaiv1q0000ukpnnzzebhyk','3307354026afd65bb89b6065d96b6e55827c63a519b4ee6e2fac62d9469e48a0','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 19:35:16.548','2026-06-23 19:35:16.547','2026-05-24 19:35:16.548','2026-05-24 19:43:19.224'),('cmpk6qigq00028cpng81876qg','cmpjaiv1q0000ukpnnzzebhyk','e7a945c66642ee35c92fa9ce6e1f356312a7d393e317eeee94fcb78913865ebc','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 19:43:26.714','2026-06-23 19:43:26.713','2026-05-24 19:43:26.714','2026-05-24 19:48:55.787'),('cmpk6xpt600038cpnhvdd4avh','cmpjaiv1q0000ukpnnzzebhyk','20fa9015e15529830e458fe2dd337146526930e3632809b8d4d8f718af45ae3d','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 19:49:02.826','2026-06-23 19:49:02.825','2026-05-24 19:49:02.826','2026-05-24 19:49:05.617'),('cmpk6xx8i00048cpnoj66eqw4','cmpjaiv1q0000ukpnnzzebhyk','a7551039e1baaef116bb238489bd88786ba51189baeb7849a35943af261f056b','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 19:49:12.450','2026-06-23 19:49:12.449','2026-05-24 19:49:12.450','2026-05-24 19:49:28.902'),('cmpk6zcj500078cpnzft9rt3l','cmpk6zciz00058cpnbqlsuxpg','fee2902ba23eea9a724269392c638e480ff0128f8ad8127cb6e741c25ec2e64a','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 19:50:18.929','2026-06-23 19:50:18.929','2026-05-24 19:50:18.929','2026-05-24 19:50:32.984'),('cmpk702b800088cpnw80m35eo','cmpk6zciz00058cpnbqlsuxpg','03e9c9a0d25c96f1052c075b244429bbf6e7e4125f9e2c6538dd2fc44c3a5d4f','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 19:50:52.340','2026-06-23 19:50:52.339','2026-05-24 19:50:52.340','2026-05-24 19:50:56.107'),('cmpk709oj00098cpn4pmt7s85','cmpjaiv1q0000ukpnnzzebhyk','da2faaac697358016ed4fed1f4f860c40558d0f03481bbf8e425fd83ce99e1d9','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-24 19:51:01.891','2026-06-23 19:51:01.890','2026-05-24 19:51:01.891','2026-05-24 20:09:58.333'),('cmpv4ib8i0000sapnm200exve','cmpjaiv1q0000ukpnnzzebhyk','637fc180df87fadcb65a9910b1801b840814451d7bfc3281558f565bef649cd8','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-01 11:26:32.802','2026-07-01 11:26:32.799','2026-06-01 11:26:32.802','2026-06-01 11:26:38.054'),('cmpv4ipv40001sapnoclof5g9','cmpjaiv1q0000ukpnnzzebhyk','220750c7b176a748a52840e0fe836a6387829ba9696c99403463be51f301b199','127.0.0.1','curl/8.7.1','2026-06-01 11:26:51.760','2026-07-01 11:26:51.759','2026-06-01 11:26:51.760',NULL),('cmpv5kjjy0002sapnzuesesrh','cmpjaiv1q0000ukpnnzzebhyk','8353063bd04df810a84dd24d4d77ca12fdf8cd4f89bb0cf0b7f4181b3427507f','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-01 11:56:16.510','2026-07-01 11:56:16.510','2026-06-01 11:56:16.510','2026-06-01 11:57:11.329'),('cmpv5m3dl0004sapn41u891x0','cmpjaiv1q0000ukpnnzzebhyk','9ebc5cb9cc2d8f34534ea3b267d670142482653600916c8f2dcba4d35887b539','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-01 11:57:28.857','2026-07-01 11:57:28.856','2026-06-01 11:57:28.857','2026-06-01 12:39:07.834'),('cmpv73p9m0007sapnkgg3lpn7','cmpjaiv1q0000ukpnnzzebhyk','cc189991eb6e6321c9eef5cca9cc03db61210946f0608c5b38e2db8c4354b20d','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-01 12:39:09.994','2026-07-01 12:39:09.993','2026-06-01 12:39:09.994',NULL);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scope_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_user_id_role_id_scope_type_scope_id_key` (`user_id`,`role_id`,`scope_type`,`scope_id`),
  KEY `user_roles_role_id_idx` (`role_id`),
  CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('cmpjae4le00014jpno46i0cka','cmpjae4la00004jpn25bqskh1','cmpjab2lo0001d8pn8wa7yje2',NULL,NULL,'2026-05-24 04:38:01.150'),('cmpjaiv1t0001ukpndiea6wyw','cmpjaiv1q0000ukpnnzzebhyk','cmpjab2mn0008d8pn6hi4v7zt','','','2026-05-24 04:41:42.065'),('cmpk6zcj000068cpnv3b722xq','cmpk6zciz00058cpnbqlsuxpg','cmpjab2lt0002d8pnr516u5gn',NULL,NULL,'2026-05-24 19:50:18.923'),('cmpvjd80s0001lqpnubazjui8','cmpvjd80q0000lqpn7cp9n7ou','cmpjab2lt0002d8pnr516u5gn','','','2026-06-01 18:22:29.596');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','suspended','deleted') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `email_verified_at` datetime(3) DEFAULT NULL,
  `phone_verified_at` datetime(3) DEFAULT NULL,
  `last_login_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_phone_key` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cmpjae4la00004jpn25bqskh1','dev@example.com',NULL,'scrypt:8abcae6271c94e4061f38eba80e14360:3cf3197587a516963b498e29f4599cf541e2f95d2ffd6a294485094cdff3c3cb5f1b7aba99c27f7e127b1323034fc225c3ac48c8b7b1da82dfdf3c1b65fa5bb9','active',NULL,NULL,NULL,'2026-05-24 04:38:01.150','2026-05-24 04:38:01.150'),('cmpjaiv1q0000ukpnnzzebhyk','admin@anshome.local',NULL,'scrypt:fdf1d271858639d874e4a9f4614b5046:7fc19ab417638a6201cb5e26a88f03a6d51365aaec6b574762c86ad79ea54e16941a0660fa554c9485e59685d400f60f08b1f5bca68662a7eab3330828668c3d','active',NULL,NULL,'2026-06-01 12:39:09.985','2026-05-24 04:41:42.062','2026-06-02 17:55:42.087'),('cmpk6zciz00058cpnbqlsuxpg','haquangdoanh@gmail.com','0818666456','scrypt:b3cd02f7cc8982255fac968bbbe09fd2:e332d13274180552960917f5eca92711a0dd417653f1c954f70fddaab4c8375e3c766580caef4caf11d3ac6573b6bf60e041abf817ff11bdfee8c4d2812f7d92','active',NULL,NULL,'2026-05-24 19:50:52.333','2026-05-24 19:50:18.923','2026-05-24 19:50:52.335'),('cmpvjd80q0000lqpn7cp9n7ou','seed.agent@anshome.local',NULL,NULL,'active',NULL,NULL,NULL,'2026-06-01 18:22:29.594','2026-06-02 17:55:41.997');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-15 16:19:20

CREATE DATABASE  IF NOT EXISTS `wellness_clinic` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `wellness_clinic`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: wellness_clinic
-- ------------------------------------------------------
-- Server version	9.2.0

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

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `practitioner_id` int DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_type` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `patient_id_idx` (`patient_id`),
  KEY `practioner_id_idx` (`practitioner_id`),
  CONSTRAINT `patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `practitioner_id` FOREIGN KEY (`practitioner_id`) REFERENCES `practitioners` (`practitioner_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,2,2,'2025-03-04','Consultation','Scheduled'),(2,1,3,'2025-03-03','Consultation','Cancelled'),(3,3,1,'2025-03-01','Consultation','Completed');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billing`
--

DROP TABLE IF EXISTS `billing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billing` (
  `billing_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `appointment_id` int DEFAULT NULL,
  `prescription_id` int DEFAULT NULL,
  `total_amount` decimal(10,0) NOT NULL,
  `amount_due` decimal(10,0) NOT NULL,
  `balance_due` decimal(10,0) NOT NULL,
  `payment_method` varchar(45) NOT NULL,
  `billing_date` date DEFAULT NULL,
  PRIMARY KEY (`billing_id`),
  KEY `patientsid_idx` (`patient_id`),
  KEY `appointmentid_idx` (`appointment_id`),
  KEY `prescriptionid_idx` (`prescription_id`),
  CONSTRAINT `billing_appointment_id` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `billing_patients_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `billing_prescription_id` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`prescriptions_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billing`
--

LOCK TABLES `billing` WRITE;
/*!40000 ALTER TABLE `billing` DISABLE KEYS */;
INSERT INTO `billing` VALUES (1,3,3,3,90,179,9,'Credit Card','2025-03-03'),(2,1,2,3,90,179,9,'Credit Card','2025-03-03'),(3,2,1,3,90,179,9,'Credit Card','2025-03-03');
/*!40000 ALTER TABLE `billing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_schedules`
--

DROP TABLE IF EXISTS `daily_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_schedules` (
  `practitioner_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `appointment_id` int DEFAULT NULL,
  `appointment_time` date NOT NULL,
  `patient_details` longtext NOT NULL,
  `updated_by` varchar(45) NOT NULL,
  `update_time` date NOT NULL,
  KEY `practitioner_id_idx` (`practitioner_id`),
  KEY `appointmentsid_idx` (`appointment_id`),
  KEY `patientid_idx` (`patient_id`),
  CONSTRAINT `scheduled_appointments_id` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scheduled_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scheduled_practitioner_id` FOREIGN KEY (`practitioner_id`) REFERENCES `practitioners` (`practitioner_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_schedules`
--

LOCK TABLES `daily_schedules` WRITE;
/*!40000 ALTER TABLE `daily_schedules` DISABLE KEYS */;
INSERT INTO `daily_schedules` VALUES (1,1,1,'2025-05-03','Point second account must.','5','2025-03-01'),(2,2,3,'2025-02-03','Maybe sea situation art reduce so require.','6','2025-06-03'),(3,3,2,'2025-01-03','Sense start improve anyone special far class.','7','2025-06-03');
/*!40000 ALTER TABLE `daily_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliveries` (
  `deliveries_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `delivery_date` date NOT NULL,
  `practitioner_id` int DEFAULT NULL,
  `details` longtext NOT NULL,
  PRIMARY KEY (`deliveries_id`),
  KEY `patientsid3_idx` (`patient_id`),
  KEY `practiotioner_id2_idx` (`practitioner_id`),
  CONSTRAINT `delivery_patients_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `delivery_practitioner_id` FOREIGN KEY (`practitioner_id`) REFERENCES `practitioners` (`practitioner_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

LOCK TABLES `deliveries` WRITE;
/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
INSERT INTO `deliveries` VALUES (1,1,'2025-03-04',1,'People score cold newspaper many movement card.'),(2,2,'2025-03-05',2,'May kitchen cost better enter anything magazine able.'),(3,3,'2025-03-03',3,'Between left phone tell our eye quality economy.');
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance_statements`
--

DROP TABLE IF EXISTS `insurance_statements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance_statements` (
  `statement_id` int NOT NULL AUTO_INCREMENT,
  `practitioners_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `appointment_type` varchar(45) NOT NULL,
  `procedures` varchar(45) NOT NULL,
  `diagnosis` longtext NOT NULL,
  `billing_id` int DEFAULT NULL,
  `total_amount` decimal(10,0) NOT NULL,
  PRIMARY KEY (`statement_id`),
  KEY `practitioners_id_idx` (`practitioners_id`),
  KEY `patientid4_idx` (`patient_id`),
  KEY `billing_id_idx` (`billing_id`),
  CONSTRAINT `insurance_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `insurance_practitioner_id` FOREIGN KEY (`practitioners_id`) REFERENCES `practitioners` (`practitioner_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `insurancestate_billing_id` FOREIGN KEY (`billing_id`) REFERENCES `billing` (`billing_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance_statements`
--

LOCK TABLES `insurance_statements` WRITE;
/*!40000 ALTER TABLE `insurance_statements` DISABLE KEYS */;
INSERT INTO `insurance_statements` VALUES (1,3,2,'Checkup','MRI','Far measure goal radio impact wrong.',1,105),(2,1,1,'Therapy','MRI','Generation concern herself group.',3,928),(3,2,3,'Therapy','MRI','Huge enter fight vote girl value.',2,873);
/*!40000 ALTER TABLE `insurance_statements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_tests`
--

DROP TABLE IF EXISTS `lab_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_tests` (
  `test_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `test_date` date NOT NULL,
  `test_type` varchar(45) NOT NULL,
  `details` longtext NOT NULL,
  PRIMARY KEY (`test_id`),
  KEY `patientsid_idx` (`patient_id`),
  CONSTRAINT `lab_test_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_tests`
--

LOCK TABLES `lab_tests` WRITE;
/*!40000 ALTER TABLE `lab_tests` DISABLE KEYS */;
INSERT INTO `lab_tests` VALUES (1,1,'2025-03-05','CT Scan','Pick must industry which.'),(2,2,'2025-03-06','MRI','Today account score scientist money medical.'),(3,3,'2025-03-01','MRI','Believe however to someone fact house.');
/*!40000 ALTER TABLE `lab_tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthly_reports`
--

DROP TABLE IF EXISTS `monthly_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `month` date DEFAULT NULL,
  `total_patients_visits` int NOT NULL,
  `total_surgeries` int NOT NULL,
  `total_deliveries` int NOT NULL,
  `total_lab_tests` int NOT NULL,
  `total_perscriptions` int NOT NULL,
  `avg_visit_duration` decimal(10,0) NOT NULL,
  PRIMARY KEY (`report_id`,`total_patients_visits`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_reports`
--

LOCK TABLES `monthly_reports` WRITE;
/*!40000 ALTER TABLE `monthly_reports` DISABLE KEYS */;
INSERT INTO `monthly_reports` VALUES (1,'2025-07-01',217,37,24,78,200,24),(2,'2025-06-01',160,16,29,126,144,33),(3,'2025-01-26',110,24,24,119,251,28);
/*!40000 ALTER TABLE `monthly_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `non_practitioners`
--

DROP TABLE IF EXISTS `non_practitioners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `non_practitioners` (
  `admin_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `job_title` varchar(45) NOT NULL,
  `department` varchar(45) NOT NULL,
  `work_type` varchar(45) NOT NULL,
  PRIMARY KEY (`admin_id`),
  KEY `staffid3_idx` (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `non_practitioners`
--

LOCK TABLES `non_practitioners` WRITE;
/*!40000 ALTER TABLE `non_practitioners` DISABLE KEYS */;
INSERT INTO `non_practitioners` VALUES (1,11,'Receptionist','Administration','Full-Time'),(2,12,'HR Manager','Finance','Full-Time'),(3,13,'HR Manager','HR','Full-Time');
/*!40000 ALTER TABLE `non_practitioners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(45) NOT NULL,
  `phone_num` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `insurance_provider` varchar(45) NOT NULL,
  `insurance_num` varchar(45) NOT NULL,
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'Richard','Stewart','1953-08-17','Male','(168)441-0533x605','kelseyhicks@hotmail.com','14288 Karen Groves Apt. 752\nKathleenberg, PA','Rowe-Murray','INS16519'),(2,'Bruce','Kim','1953-01-06','Male','6761937819','lauracarter@yahoo.com','812 Sheila Station Apt. 380\nHufffurt, IA','Wright, Mclaughlin and Gonzalez','INS87063'),(3,'Antonio','Davis','1955-02-21','Female','401.453.4507','donna48@taylor-oconnor.com','1079 Pamela Wells Suite 788\nThomasshire, RI','Wang, Walker and Savage','INS79918');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practitioners`
--

DROP TABLE IF EXISTS `practitioners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practitioners` (
  `practitioner_id` int NOT NULL AUTO_INCREMENT,
  `staff_id` int DEFAULT NULL,
  `specialization` varchar(45) NOT NULL,
  PRIMARY KEY (`practitioner_id`),
  KEY `staff_id_idx` (`staff_id`),
  CONSTRAINT `practitioner_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practitioners`
--

LOCK TABLES `practitioners` WRITE;
/*!40000 ALTER TABLE `practitioners` DISABLE KEYS */;
INSERT INTO `practitioners` VALUES (1,1,'Cardiologist'),(2,2,'Dermatologist'),(3,3,'Cardiologist');
/*!40000 ALTER TABLE `practitioners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `prescriptions_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `prescription_name` varchar(45) NOT NULL,
  `prescription_instruction` longtext NOT NULL,
  `prescription_usage` longtext NOT NULL,
  `prescription_refill` int NOT NULL,
  PRIMARY KEY (`prescriptions_id`),
  KEY `patient_id_idx` (`patient_id`),
  CONSTRAINT `prescriptions_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES (1,2,'True','Rest study structure research official over.','Oral',1),(2,1,'Who','Treatment agency store collection cut chance.','Oral',0),(3,1,'Learn','Several base institution human husband.','Oral',1);
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recovery_logs`
--

DROP TABLE IF EXISTS `recovery_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recovery_logs` (
  `recovery_log_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `addmission_time` date NOT NULL,
  `discharge_time` date NOT NULL,
  `practitioner_id` int DEFAULT NULL,
  `observations` longtext NOT NULL,
  PRIMARY KEY (`recovery_log_id`),
  KEY `patientid3_idx` (`patient_id`),
  KEY `practionionerid_idx` (`practitioner_id`),
  CONSTRAINT `recoverylog_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recoverylog_practionioner_id` FOREIGN KEY (`practitioner_id`) REFERENCES `practitioners` (`practitioner_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recovery_logs`
--

LOCK TABLES `recovery_logs` WRITE;
/*!40000 ALTER TABLE `recovery_logs` DISABLE KEYS */;
INSERT INTO `recovery_logs` VALUES (1,1,'2025-03-04','2025-03-06',1,'Study society thought father issue tonight.'),(2,2,'2025-03-04','2025-03-03',2,'Both plant foot window debate opportunity.'),(3,3,'2025-03-05','2025-03-01',3,'Any very either him.');
/*!40000 ALTER TABLE `recovery_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  `phone_num` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Larry','Sanchez','Administrator','(259)048-3332','espinozahunter@yahoo.com'),(2,'Kevin','Myers','Administrator','+1-260-794-5453x01228','rberger@gmail.com'),(3,'Robert','Malone','Doctor','916.109.9993x3194','chickman@hines.biz');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_schedules`
--

DROP TABLE IF EXISTS `weekly_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_schedules` (
  `week_id` int NOT NULL,
  `month` date DEFAULT NULL,
  `practitioner_id` int DEFAULT NULL,
  `emergency_on_call_num` varchar(45) NOT NULL,
  PRIMARY KEY (`week_id`),
  KEY `practitioner_id2_idx` (`practitioner_id`),
  CONSTRAINT `weekly_scheduled_practitioner_id` FOREIGN KEY (`practitioner_id`) REFERENCES `practitioners` (`practitioner_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_schedules`
--

LOCK TABLES `weekly_schedules` WRITE;
/*!40000 ALTER TABLE `weekly_schedules` DISABLE KEYS */;
INSERT INTO `weekly_schedules` VALUES (1,'2025-03-01',1,'-1334'),(2,'2025-02-01',2,'108.914.1357x998'),(3,'2025-03-03',3,'001-730-826-4277x7692');
/*!40000 ALTER TABLE `weekly_schedules` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-28 23:58:36

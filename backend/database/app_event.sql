-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 14, 2024 at 07:51 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app_event`
--

-- --------------------------------------------------------

--
-- Table structure for table `custom_fields`
--

CREATE TABLE `custom_fields` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `field_name` varchar(255) DEFAULT NULL,
  `field_value` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `custom_fields`
--

INSERT INTO `custom_fields` (`id`, `event_id`, `field_name`, `field_value`, `created_at`) VALUES
(56, 22, 'Jersey', 'Number 24', '2024-06-08 15:29:58'),
(57, 22, 'Jersey', 'Number 8', '2024-06-08 15:29:58'),
(60, 21, 'Laptop', 'Required', '2024-06-09 08:54:32'),
(61, 23, 'ballons', '150', '2024-06-14 07:44:36');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `image` text,
  `description` text CHARACTER SET utf8mb4 NOT NULL,
  `size` int(11) DEFAULT NULL,
  `type` enum('wedding','birthday','baby shower','funeral','concert','custom','tribute') NOT NULL DEFAULT 'custom',
  `time` timestamp NULL DEFAULT NULL,
  `place` varchar(40) NOT NULL,
  `model_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `image`, `description`, `size`, `type`, `time`, `place`, `model_id`, `user_id`, `group_id`, `created_at`, `deleted_at`) VALUES
(21, 'Hackathon', 'https://t3.ftcdn.net/jpg/03/01/13/20/360_F_301132090_LKoSp3l3cXlCo78zaAe2M9LI2z5yznvB.jpg', 'Uh oh Stinky!', 69, 'custom', '2024-06-28 10:33:00', 'CODA_', NULL, 11, 26, '2024-05-29 14:10:23', '2024-05-29 14:10:23'),
(22, 'Kobe Bryant Tribute', 'https://www.hollywoodreporter.com/wp-content/uploads/2020/02/gettyimages-1197867457-h_2020.jpg?w=1296', '🕊️ He was the best 🕊️', 10, 'tribute', '2025-01-26 13:00:00', 'Los Angeles', 2, 11, 27, '2024-06-01 11:59:11', '2024-06-01 11:59:11'),
(23, 'Event Sarah', NULL, 'Let\'s do some sport!', 17, 'custom', '2024-06-28 10:00:00', 'Palais des Sports', NULL, 27, 28, '2024-06-14 07:43:42', '2024-06-14 07:43:42');

-- --------------------------------------------------------

--
-- Table structure for table `event_resources`
--

CREATE TABLE `event_resources` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` enum('available','unavailable') NOT NULL DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `event_resources`
--

INSERT INTO `event_resources` (`id`, `event_id`, `resource_id`, `quantity`, `status`) VALUES
(4, 21, 4, 1, 'available'),
(5, 22, 5, 3, 'available'),
(6, 23, 6, 80, 'available');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `event_id`, `name`) VALUES
(26, 21, 'Hackathon Coda_'),
(27, 22, 'Kobe Bryant Tribute'),
(28, 23, 'sarahevent');

-- --------------------------------------------------------

--
-- Table structure for table `group_users`
--

CREATE TABLE `group_users` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('registered','confirmed','canceled') NOT NULL DEFAULT 'registered',
  `registered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `canceled_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `group_users`
--

INSERT INTO `group_users` (`id`, `group_id`, `user_id`, `status`, `registered_at`, `confirmed_at`, `canceled_at`) VALUES
(146, 26, 11, 'confirmed', '2024-05-29 14:10:23', NULL, NULL),
(167, 27, 11, 'confirmed', '2024-06-01 11:59:11', NULL, NULL),
(225, 27, 4, 'registered', '2024-06-08 15:29:58', NULL, NULL),
(226, 27, 15, 'registered', '2024-06-08 15:29:58', NULL, NULL),
(228, 27, 17, 'confirmed', '2024-06-08 15:29:58', NULL, NULL),
(231, 26, 4, 'registered', '2024-06-09 08:54:32', NULL, NULL),
(232, 26, 15, 'confirmed', '2024-06-09 08:54:32', NULL, NULL),
(235, 28, 27, 'confirmed', '2024-06-14 07:43:42', NULL, NULL),
(236, 28, 4, 'registered', '2024-06-14 07:44:36', NULL, NULL),
(237, 28, 11, 'confirmed', '2024-06-14 07:44:36', '2024-06-14 07:46:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `models`
--

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `image` text,
  `size` int(11) NOT NULL,
  `type` enum('wedding','birthday','baby shower','funeral','concert','tribute') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `models`
--

INSERT INTO `models` (`id`, `image`, `size`, `type`) VALUES
(1, 'https://i.insider.com/61a7a6e10ed48c0019e537e8?width=1300&format=jpeg&auto=webp', 500, 'wedding'),
(2, NULL, 200, 'tribute'),
(3, 'https://thumbs.dreamstime.com/b/colorful-happy-birthday-cupcakes-candles-spelling-148323072.jpg', 30, 'birthday');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('room','equipment','other') NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `name`, `type`, `cost`, `updated_at`) VALUES
(3, '8999', 'other', '90.00', '2024-06-11 09:17:24'),
(4, 'Test', 'other', '90.00', '2024-06-13 07:30:06'),
(5, 'Test', 'equipment', '1000.00', '2024-06-13 07:48:22'),
(6, 'Ballons', 'equipment', '3.00', '2024-06-14 07:45:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `session_id` varchar(50) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `session_id`, `joined_at`) VALUES
(4, 'Benoît', 'Parmentier', 'benoit.parmentier45@gmail.com', '$2y$10$aPm6WDTEK/fM8p9UMDbZ2ef9d52LkMVlijKJdPuvyo6Y2fJ00k0se', 'q61oft4qha4o5elgrrhg5lp3i4', '2024-05-14 06:48:27'),
(11, 'Raphaël', 'Raclot', 'raclot.raphael@gmail.com', '$2y$10$CqndxNvxgclUVyRuTNls0uJ6YocBg68uFr8OljwFVgIG6VXe8LvMu', 'q61oft4qha4o5elgrrhg5lp3i6', '2024-05-14 12:58:21'),
(15, 'Eloi', 'Hariot', 'eloi.hariot@protonmail.com', '$2y$10$YF/gKxAb3Z5qC5Vloo5OlOq7zUsrGYgAWqQFt2T2nHY5s5h0YHkXq', '95eth2dq2ogm9r9bqimcbah3mb', '2024-05-17 12:16:32'),
(17, 'Nathan', 'Beauclair', 'wa@wa.com', '$2y$10$1wRmOVqq1IaxrIy0Pv4w4.XNCGytFykUP8dnLA2SsZUQjldNCVmCe', '9mi0lhv6t42u38iar4m9hp7171', '2024-05-27 12:33:33'),
(27, 'Sarah', 'Leconte', 'sarah.leconte@coda-student.school', '$2y$10$k73tnx981SpZMbEPToYkYOZsReA4Wp79mLPHZ.2rNd0o2pjSLy1Sa', 'j8o4o63jphr6dijq4dgp67b5dl', '2024-06-14 07:41:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `custom_fields`
--
ALTER TABLE `custom_fields`
  ADD PRIMARY KEY (`id`),
  ADD KEY `custom_fields_ibfk_1` (`event_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_event_event_model_id_foreign` (`model_id`),
  ADD KEY `app_event_event_group_id_foreign` (`group_id`),
  ADD KEY `app_event_event_user_id_foreign` (`user_id`);

--
-- Indexes for table `event_resources`
--
ALTER TABLE `event_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_resources_ibfk_1` (`event_id`),
  ADD KEY `event_resources_ibfk_2` (`resource_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_event_group_event_id_foreign` (`event_id`);

--
-- Indexes for table `group_users`
--
ALTER TABLE `group_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_event_group_user_group_id_foreign` (`group_id`),
  ADD KEY `app_event_group_user_user_id_foreign` (`user_id`);

--
-- Indexes for table `models`
--
ALTER TABLE `models`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `session_id` (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `custom_fields`
--
ALTER TABLE `custom_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `event_resources`
--
ALTER TABLE `event_resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `group_users`
--
ALTER TABLE `group_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=238;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `custom_fields`
--
ALTER TABLE `custom_fields`
  ADD CONSTRAINT `custom_fields_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `app_event_event_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `app_event_event_model_id_foreign` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`),
  ADD CONSTRAINT `app_event_event_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `event_resources`
--
ALTER TABLE `event_resources`
  ADD CONSTRAINT `event_resources_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_resources_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `app_event_group_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `group_users`
--
ALTER TABLE `group_users`
  ADD CONSTRAINT `app_event_group_user_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `app_event_group_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

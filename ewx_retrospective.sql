-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 20, 2021 at 01:10 AM
-- Server version: 5.7.33-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ewx_retrospective`
--

-- --------------------------------------------------------

--
-- Table structure for table `accomplished_tasks`
--

CREATE TABLE `accomplished_tasks` (
  `retro_id` int(11) NOT NULL,
  `task_name` text NOT NULL,
  `self_rating` int(11) NOT NULL,
  `team` text NOT NULL,
  `hours_taken` int(11) NOT NULL,
  `completion_date` date NOT NULL,
  `feedback` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accomplished_tasks`
--

INSERT INTO `accomplished_tasks` (`retro_id`, `task_name`, `self_rating`, `team`, `hours_taken`, `completion_date`, `feedback`) VALUES
(2, 'Task-1', 4, 'Vishal Sadhnani,Nikhil Agarwal', 8, '2021-07-04', 'Good'),
(2, 'Task-2', 6, 'Nikhil Agarwal', 6, '2021-07-06', 'Very good'),
(3, 'Task-1', 3, 'Nikhil Agarwal', 4, '2021-06-24', 'Amazing experience');

-- --------------------------------------------------------

--
-- Table structure for table `colleagues_feedback`
--

CREATE TABLE `colleagues_feedback` (
  `retro_id` int(11) NOT NULL,
  `colleague_name` text NOT NULL,
  `dependable` int(11) NOT NULL,
  `collaborative` int(11) NOT NULL,
  `trustworthy` int(11) NOT NULL,
  `punctual` int(11) NOT NULL,
  `pragmatic` int(11) NOT NULL,
  `courteous` int(11) NOT NULL,
  `rating` decimal(3,2) GENERATED ALWAYS AS ((((((`dependable` + `collaborative`) + `trustworthy`) * 0.20) + ((`punctual` + `pragmatic`) * 0.15)) + (`courteous` * 0.10))) STORED,
  `suggestions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `colleagues_feedback`
--

INSERT INTO `colleagues_feedback` (`retro_id`, `colleague_name`, `dependable`, `collaborative`, `trustworthy`, `punctual`, `pragmatic`, `courteous`, `suggestions`) VALUES
(2, 'Vishal Sadhnani', 5, 4, 3, 2, 1, 5, 'Be nice'),
(2, 'Anurag Desai', 5, 5, 1, 4, 3, 2, 'Be active'),
(3, 'Nikhil Agarwal', 1, 5, 5, 4, 3, 5, 'Already awesome');

-- --------------------------------------------------------

--
-- Table structure for table `defaulted_tasks`
--

CREATE TABLE `defaulted_tasks` (
  `retro_id` int(11) NOT NULL,
  `task_name` text NOT NULL,
  `self_rating` int(11) NOT NULL,
  `team` text NOT NULL,
  `hours_given` int(11) NOT NULL,
  `reason` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `defaulted_tasks`
--

INSERT INTO `defaulted_tasks` (`retro_id`, `task_name`, `self_rating`, `team`, `hours_given`, `reason`) VALUES
(2, 'DTask-1', 6, 'Vishal Sadhnani,Nikhil Agarwal', 5, 'Busy'),
(2, 'DTask-2', 7, 'Vishal Sadhnani', 6, 'Very busy');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `emp_id` varchar(255) NOT NULL,
  `name` text NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` varchar(255) NOT NULL,
  `joining_date` date NOT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`emp_id`, `name`, `password`, `user_type`, `joining_date`, `end_date`) VALUES
('1111', 'Vivek Shukla', 'Vivek@kla', 'Intern', '2021-08-02', NULL),
('1234', 'Vishal Sadhnani', 'Vishal@nani', 'Intern', '2021-06-22', '2021-08-04'),
('1235', 'Anurag Desai', 'Anurag@sai', 'Employee', '2020-06-20', '2021-08-05'),
('1236', 'Dheeraj Sharma', 'Dheeraj@rma', 'Intern', '2021-07-13', '2021-07-23'),
('1237', 'Nikhil Agarwal', 'Nikhil@127', 'Intern', '2021-06-22', NULL),
('1238', 'Arjun Vihari', 'Arjun@ari', 'Short-Term Intern', '2021-07-13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `my_overall_performance`
--

CREATE TABLE `my_overall_performance` (
  `retro_id` int(11) NOT NULL,
  `overall_performance` text NOT NULL,
  `improved_skills` text NOT NULL,
  `hindrances` text NOT NULL,
  `opportunities` text NOT NULL,
  `uncertainties` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `my_overall_performance`
--

INSERT INTO `my_overall_performance` (`retro_id`, `overall_performance`, `improved_skills`, `hindrances`, `opportunities`, `uncertainties`) VALUES
(1, 'Satisfactory', 'Hugo', 'Time', 'Learning', 'College'),
(2, 'Very Satisfactory', 'Skill-1', 'Hindrance-1', 'Opportunity-1', 'uncertainty-1'),
(3, 'Very Satisfactory', 'Hugo', 'None', 'Many', 'Some');

-- --------------------------------------------------------

--
-- Table structure for table `retrospectives`
--

CREATE TABLE `retrospectives` (
  `retro_id` int(255) NOT NULL,
  `emp_id` varchar(255) NOT NULL,
  `month_year` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `retrospectives`
--

INSERT INTO `retrospectives` (`retro_id`, `emp_id`, `month_year`) VALUES
(1, '1237', '2021-06'),
(2, '1237', '2021-07'),
(3, '1234', '2021-06');

-- --------------------------------------------------------

--
-- Table structure for table `workplace_feedback`
--

CREATE TABLE `workplace_feedback` (
  `retro_id` int(11) NOT NULL,
  `issue` text NOT NULL,
  `suggestions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `workplace_feedback`
--

INSERT INTO `workplace_feedback` (`retro_id`, `issue`, `suggestions`) VALUES
(2, 'Issue-1', 'Solve it');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accomplished_tasks`
--
ALTER TABLE `accomplished_tasks`
  ADD KEY `retro_id` (`retro_id`);

--
-- Indexes for table `colleagues_feedback`
--
ALTER TABLE `colleagues_feedback`
  ADD KEY `retro_id` (`retro_id`);

--
-- Indexes for table `defaulted_tasks`
--
ALTER TABLE `defaulted_tasks`
  ADD KEY `retro_id` (`retro_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indexes for table `my_overall_performance`
--
ALTER TABLE `my_overall_performance`
  ADD KEY `retro_id` (`retro_id`);

--
-- Indexes for table `retrospectives`
--
ALTER TABLE `retrospectives`
  ADD PRIMARY KEY (`retro_id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- Indexes for table `workplace_feedback`
--
ALTER TABLE `workplace_feedback`
  ADD KEY `retro_id` (`retro_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `retrospectives`
--
ALTER TABLE `retrospectives`
  MODIFY `retro_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `accomplished_tasks`
--
ALTER TABLE `accomplished_tasks`
  ADD CONSTRAINT `accomplished_tasks_ibfk_1` FOREIGN KEY (`retro_id`) REFERENCES `retrospectives` (`retro_id`);

--
-- Constraints for table `colleagues_feedback`
--
ALTER TABLE `colleagues_feedback`
  ADD CONSTRAINT `colleagues_feedback_ibfk_1` FOREIGN KEY (`retro_id`) REFERENCES `retrospectives` (`retro_id`);

--
-- Constraints for table `defaulted_tasks`
--
ALTER TABLE `defaulted_tasks`
  ADD CONSTRAINT `defaulted_tasks_ibfk_1` FOREIGN KEY (`retro_id`) REFERENCES `retrospectives` (`retro_id`);

--
-- Constraints for table `my_overall_performance`
--
ALTER TABLE `my_overall_performance`
  ADD CONSTRAINT `my_overall_performance_ibfk_1` FOREIGN KEY (`retro_id`) REFERENCES `retrospectives` (`retro_id`);

--
-- Constraints for table `retrospectives`
--
ALTER TABLE `retrospectives`
  ADD CONSTRAINT `retrospectives_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`);

--
-- Constraints for table `workplace_feedback`
--
ALTER TABLE `workplace_feedback`
  ADD CONSTRAINT `workplace_feedback_ibfk_1` FOREIGN KEY (`retro_id`) REFERENCES `retrospectives` (`retro_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

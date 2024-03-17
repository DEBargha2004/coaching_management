-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Batch` (
	`batch_id` varchar(191) NOT NULL,
	`batch_name` varchar(191) NOT NULL,
	`medium` varchar(191),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Batch_batch_id` PRIMARY KEY(`batch_id`)
);
--> statement-breakpoint
CREATE TABLE `BatchStudents` (
	`batch_id` varchar(191) NOT NULL,
	`student_id` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `BatchStudents_batch_id_student_id` PRIMARY KEY(`batch_id`,`student_id`)
);
--> statement-breakpoint
CREATE TABLE `BatchSubjects` (
	`subject_id` varchar(191) NOT NULL,
	`batch_id` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `BatchSubjects_batch_id_subject_id` PRIMARY KEY(`batch_id`,`subject_id`)
);
--> statement-breakpoint
CREATE TABLE `BatchTeachers` (
	`batch_id` varchar(191) NOT NULL,
	`teacher_id` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `BatchTeachers_batch_id_teacher_id` PRIMARY KEY(`batch_id`,`teacher_id`)
);
--> statement-breakpoint
CREATE TABLE `BatchTimings` (
	`timing_id` varchar(191) NOT NULL,
	`batch_id` varchar(191) NOT NULL,
	`start_time` datetime(3) NOT NULL,
	`end_time` datetime(3) NOT NULL,
	`day` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `BatchTimings_timing_id` PRIMARY KEY(`timing_id`)
);
--> statement-breakpoint
CREATE TABLE `BatchTopicStatus` (
	`batch_id` varchar(191) NOT NULL,
	`topic_id` varchar(191) NOT NULL,
	`status` enum('Complete','Pending','Incomplete') NOT NULL,
	`start_date` datetime(3) NOT NULL,
	`end_date` datetime(3) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `BatchTopicStatus_batch_id_topic_id` PRIMARY KEY(`batch_id`,`topic_id`)
);
--> statement-breakpoint
CREATE TABLE `Payments` (
	`payment_id` varchar(191) NOT NULL,
	`paymentExchange` enum('Received','Sent') NOT NULL,
	`mode` enum('Cash','Online') NOT NULL,
	`amount` int NOT NULL,
	`member` enum('Student','Teacher') NOT NULL,
	`member_id` varchar(191) NOT NULL,
	`paymentDate` datetime(3) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Payments_payment_id` PRIMARY KEY(`payment_id`)
);
--> statement-breakpoint
CREATE TABLE `Student` (
	`student_id` varchar(191) NOT NULL,
	`first_name` varchar(191) NOT NULL,
	`last_name` varchar(191) NOT NULL,
	`dob` datetime(3) NOT NULL,
	`email` varchar(191),
	`phone_number` varchar(191) NOT NULL,
	`address` varchar(191),
	`sex` varchar(191) NOT NULL,
	`primary_language` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Student_student_id` PRIMARY KEY(`student_id`),
	CONSTRAINT `Student_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `StudentStayDuration` (
	`stay_id` varchar(191) NOT NULL,
	`student_id` varchar(191) NOT NULL,
	`batch_id` varchar(191) NOT NULL,
	`joining_date` datetime(3) NOT NULL,
	`leaving_date` datetime(3),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `StudentStayDuration_stay_id` PRIMARY KEY(`stay_id`)
);
--> statement-breakpoint
CREATE TABLE `Subject` (
	`subject_id` varchar(191) NOT NULL,
	`subject_name` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Subject_subject_id` PRIMARY KEY(`subject_id`)
);
--> statement-breakpoint
CREATE TABLE `SubjectTeachers` (
	`subject_id` varchar(191) NOT NULL,
	`teacher_id` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `SubjectTeachers_subject_id_teacher_id` PRIMARY KEY(`subject_id`,`teacher_id`)
);
--> statement-breakpoint
CREATE TABLE `Syllabus` (
	`syllabus_id` varchar(191) NOT NULL,
	`subject_id` varchar(191) NOT NULL,
	`syllabus_name` varchar(191) NOT NULL,
	`class` varchar(191) NOT NULL,
	`board` enum('CBSE','ICSE','TBSE','Other') NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Syllabus_syllabus_id` PRIMARY KEY(`syllabus_id`)
);
--> statement-breakpoint
CREATE TABLE `SyllabusTopic` (
	`syllabus_id` varchar(191) NOT NULL,
	`topic_id` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `SyllabusTopic_syllabus_id_topic_id` PRIMARY KEY(`syllabus_id`,`topic_id`)
);
--> statement-breakpoint
CREATE TABLE `Teacher` (
	`teacher_id` varchar(191) NOT NULL,
	`first_name` varchar(191) NOT NULL,
	`last_name` varchar(191) NOT NULL,
	`dob` datetime(3) NOT NULL,
	`email` varchar(191),
	`phone_number` varchar(191) NOT NULL,
	`address` varchar(191),
	`sex` varchar(191) NOT NULL,
	`primary_language` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`salary` double NOT NULL,
	CONSTRAINT `Teacher_teacher_id` PRIMARY KEY(`teacher_id`),
	CONSTRAINT `Teacher_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `TeacherStayDuration` (
	`stay_id` varchar(191) NOT NULL,
	`teacher_id` varchar(191) NOT NULL,
	`joining_date` datetime(3) NOT NULL,
	`leaving_date` datetime(3),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `TeacherStayDuration_stay_id` PRIMARY KEY(`stay_id`)
);
--> statement-breakpoint
CREATE TABLE `Topic` (
	`topic_id` varchar(191) NOT NULL,
	`syllabus_id` varchar(191) NOT NULL,
	`topic_name` varchar(191) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Topic_topic_id` PRIMARY KEY(`topic_id`)
);
--> statement-breakpoint
ALTER TABLE `BatchStudents` ADD CONSTRAINT `BatchStudents_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `BatchStudents` ADD CONSTRAINT `BatchStudents_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`student_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `BatchSubjects` ADD CONSTRAINT `BatchSubjects_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `BatchSubjects` ADD CONSTRAINT `BatchSubjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `BatchTeachers` ADD CONSTRAINT `BatchTeachers_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `BatchTeachers` ADD CONSTRAINT `BatchTeachers_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`teacher_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `BatchTimings` ADD CONSTRAINT `BatchTimings_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `BatchTopicStatus` ADD CONSTRAINT `BatchTopicStatus_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `BatchTopicStatus` ADD CONSTRAINT `BatchTopicStatus_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `Topic`(`topic_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `StudentStayDuration` ADD CONSTRAINT `StudentStayDuration_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `StudentStayDuration` ADD CONSTRAINT `StudentStayDuration_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`student_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SubjectTeachers` ADD CONSTRAINT `SubjectTeachers_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SubjectTeachers` ADD CONSTRAINT `SubjectTeachers_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`teacher_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SyllabusTopic` ADD CONSTRAINT `SyllabusTopic_syllabus_id_fkey` FOREIGN KEY (`syllabus_id`) REFERENCES `Syllabus`(`syllabus_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SyllabusTopic` ADD CONSTRAINT `SyllabusTopic_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `Topic`(`topic_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `TeacherStayDuration` ADD CONSTRAINT `TeacherStayDuration_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`teacher_id`) ON DELETE restrict ON UPDATE cascade;
*/
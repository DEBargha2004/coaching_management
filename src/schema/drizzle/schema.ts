import {
  mysqlTable,
  primaryKey,
  varchar,
  datetime,
  mysqlEnum,
  int,
  unique,
  double,
  time,
  boolean,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const batch = mysqlTable(
  "Batch",
  {
    batchId: varchar("batch_id", { length: 191 }).notNull(),
    batchName: varchar("batch_name", { length: 191 }).notNull(),
    description: varchar("description", { length: 191 }),
    medium: varchar("medium", { length: 191 }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    trashed: boolean("trashed").notNull().default(false),
    groupId: varchar("group_id", { length: 191 })
      .notNull()
      .references(() => group.groupId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      batchBatchId: primaryKey({
        columns: [table.batchId],
        name: "Batch_batch_id",
      }),
    };
  }
);

export const batchStudents = mysqlTable(
  "BatchStudents",
  {
    batchId: varchar("batch_id", { length: 191 })
      .notNull()
      .references(() => batch.batchId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    studentId: varchar("student_id", { length: 191 })
      .notNull()
      .references(() => student.studentId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      batchStudentsBatchIdStudentId: primaryKey({
        columns: [table.batchId, table.studentId],
        name: "BatchStudents_batch_id_student_id",
      }),
    };
  }
);

export const batchSubjects = mysqlTable(
  "BatchSubjects",
  {
    subjectId: varchar("subject_id", { length: 191 })
      .notNull()
      .references(() => subject.subjectId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    batchId: varchar("batch_id", { length: 191 })
      .notNull()
      .references(() => batch.batchId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      batchSubjectsBatchIdSubjectId: primaryKey({
        columns: [table.batchId, table.subjectId],
        name: "BatchSubjects_batch_id_subject_id",
      }),
    };
  }
);

export const batchTeachers = mysqlTable(
  "BatchTeachers",
  {
    batchId: varchar("batch_id", { length: 191 })
      .notNull()
      .references(() => batch.batchId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    teacherId: varchar("teacher_id", { length: 191 })
      .notNull()
      .references(() => teacher.teacherId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      batchTeachersBatchIdTeacherId: primaryKey({
        columns: [table.batchId, table.teacherId],
        name: "BatchTeachers_batch_id_teacher_id",
      }),
    };
  }
);

export const batchTimings = mysqlTable(
  "BatchTimings",
  {
    timingId: varchar("timing_id", { length: 191 }).notNull(),
    batchId: varchar("batch_id", { length: 191 })
      .notNull()
      .references(() => batch.batchId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    teacherId: varchar("teacher_id", { length: 191 })
      .notNull()
      .references(() => batchTeachers.teacherId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    subjectId: varchar("subject_id", { length: 191 })
      .notNull()
      .references(() => batchSubjects.subjectId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    dayIndex: int("day_index").notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      batchTimingsTimingId: primaryKey({
        columns: [table.timingId],
        name: "BatchTimings_timing_id",
      }),
    };
  }
);

export const books = mysqlTable(
  "Books",
  {
    bookId: varchar("book_id", { length: 191 }).notNull(),
    title: varchar("title", { length: 191 }).notNull(),
    groupId: varchar("group", { length: 50 })
      .notNull()
      .references(() => group.groupId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    description: varchar("description", { length: 191 }),
    subjectId: varchar("subject_id", { length: 191 })
      .notNull()
      .references(() => subject.subjectId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    trashed: boolean("trashed").notNull().default(false),
  },
  (table) => ({
    booksBookId: primaryKey({
      columns: [table.bookId],
      name: "Books_book_id",
    }),
  })
);

export const batchTopicStatus = mysqlTable(
  "BatchTopicStatus",
  {
    batchId: varchar("batch_id", { length: 191 })
      .notNull()
      .references(() => batch.batchId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    topicId: varchar("topic_id", { length: 191 })
      .notNull()
      .references(() => topic.topicId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    status: mysqlEnum("status", [
      "Complete",
      "Pending",
      "Incomplete",
    ]).notNull(),
    startDate: datetime("start_date", { mode: "string", fsp: 3 }).notNull(),
    endDate: datetime("end_date", { mode: "string", fsp: 3 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      batchTopicStatusBatchIdTopicId: primaryKey({
        columns: [table.batchId, table.topicId],
        name: "BatchTopicStatus_batch_id_topic_id",
      }),
    };
  }
);

export const group = mysqlTable(
  "Group",
  {
    groupId: varchar("group_id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull().unique(),
    description: varchar("description", { length: 191 }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    trashed: boolean("trashed").notNull().default(false),
  },
  (table) => {
    return {
      groupGroupId: primaryKey({
        columns: [table.groupId],
        name: "Group_group_id",
      }),
    };
  }
);

export const parent = mysqlTable(
  "Parent",
  {
    parentId: varchar("parent_id", { length: 191 }),
    studentId: varchar("student_id", { length: 191 })
      .notNull()
      .references(() => student.studentId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    firstName: varchar("first_name", { length: 191 }).notNull(),
    lastName: varchar("last_name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }),
    phoneNumber: varchar("phone_number", { length: 191 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 }),
    relation: varchar("relation", { length: 20 }).notNull(),
  },
  (table) => {
    return {
      parentParentId: primaryKey({
        columns: [table.parentId],
        name: "Parent_parent_id",
      }),
    };
  }
);

export const payments = mysqlTable(
  "Payments",
  {
    paymentId: varchar("payment_id", { length: 191 }).notNull(),
    paymentExchange: mysqlEnum("paymentExchange", [
      "Received",
      "Sent",
    ]).notNull(),
    mode: mysqlEnum("mode", ["Cash", "Online"]).notNull(),
    amount: int("amount").notNull(),
    member: mysqlEnum("member", ["Student", "Teacher"]).notNull(),
    memberId: varchar("member_id", { length: 191 }).notNull(),
    month: int("month").notNull(),
    paymentDate: datetime("paymentDate", { mode: "string", fsp: 3 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      paymentsPaymentId: primaryKey({
        columns: [table.paymentId],
        name: "Payments_payment_id",
      }),
    };
  }
);

export const teachersQualification = mysqlTable(
  "TeachersQualification",
  {
    qualificationId: varchar("qualification_id", { length: 191 }).notNull(),
    courseType: varchar("course_type", { length: 10 }).notNull(),
    courseName: varchar("course_name", { length: 80 }).notNull(),
    major: varchar("major", { length: 50 }),
    teacherId: varchar("teacher_id", { length: 191 })
      .notNull()
      .references(() => teacher.teacherId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    collegeName: varchar("college_name", { length: 191 }).notNull(),
    startDate: datetime("start_date", { mode: "string", fsp: 3 }).notNull(),
    endDate: datetime("end_date", { mode: "string", fsp: 3 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      teachersQualificationQualificationId: primaryKey({
        columns: [table.qualificationId],
        name: "TeachersQualification_qualification_id",
      }),
    };
  }
);

export const student = mysqlTable(
  "Student",
  {
    studentId: varchar("student_id", { length: 191 }).notNull(),
    firstName: varchar("first_name", { length: 191 }).notNull(),
    lastName: varchar("last_name", { length: 191 }).notNull(),
    dob: datetime("dob", { mode: "string", fsp: 3 }).notNull(),
    email: varchar("email", { length: 191 }),
    phoneNumber: varchar("phone_number", { length: 191 }).notNull(),
    aadharNumber: varchar("aadhar_number", { length: 191 }).notNull(),
    address: varchar("address", { length: 191 }),
    sex: varchar("sex", { length: 191 }).notNull(),
    primaryLanguage: varchar("primary_language", { length: 191 }).notNull(),
    membershipStatus: varchar("membership_status", { length: 100 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      studentStudentId: primaryKey({
        columns: [table.studentId],
        name: "Student_student_id",
      }),
      studentEmailKey: unique("Student_email_key").on(table.email),
    };
  }
);

export const studentStayDuration = mysqlTable(
  "StudentStayDuration",
  {
    stayId: varchar("stay_id", { length: 191 }).notNull(),
    studentId: varchar("student_id", { length: 191 })
      .notNull()
      .references(() => student.studentId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    joiningDate: datetime("joining_date", { mode: "string", fsp: 3 }).notNull(),
    leavingDate: datetime("leaving_date", { mode: "string", fsp: 3 }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      studentStayDurationStayId: primaryKey({
        columns: [table.stayId],
        name: "StudentStayDuration_stay_id",
      }),
    };
  }
);

export const subject = mysqlTable(
  "Subject",
  {
    subjectId: varchar("subject_id", { length: 191 }).notNull(),
    subjectName: varchar("subject_name", { length: 191 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    trashed: boolean("trashed").notNull().default(false),
  },
  (table) => {
    return {
      subjectSubjectId: primaryKey({
        columns: [table.subjectId],
        name: "Subject_subject_id",
      }),
    };
  }
);

export const subjectTeachers = mysqlTable(
  "SubjectTeachers",
  {
    subjectId: varchar("subject_id", { length: 191 })
      .notNull()
      .references(() => subject.subjectId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    teacherId: varchar("teacher_id", { length: 191 })
      .notNull()
      .references(() => teacher.teacherId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      subjectTeachersSubjectIdTeacherId: primaryKey({
        columns: [table.subjectId, table.teacherId],
        name: "SubjectTeachers_subject_id_teacher_id",
      }),
    };
  }
);

export const syllabus = mysqlTable(
  "Syllabus",
  {
    syllabusId: varchar("syllabus_id", { length: 191 }).notNull(),
    subjectId: varchar("subject_id", { length: 191 }).notNull(),
    syllabusName: varchar("syllabus_name", { length: 191 }).notNull(),
    class: varchar("class", { length: 191 }).notNull(),
    board: mysqlEnum("board", ["CBSE", "ICSE", "TBSE", "Other"]).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      syllabusSyllabusId: primaryKey({
        columns: [table.syllabusId],
        name: "Syllabus_syllabus_id",
      }),
    };
  }
);

export const syllabusTopic = mysqlTable(
  "SyllabusTopic",
  {
    syllabusId: varchar("syllabus_id", { length: 191 })
      .notNull()
      .references(() => syllabus.syllabusId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    topicId: varchar("topic_id", { length: 191 })
      .notNull()
      .references(() => topic.topicId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      syllabusTopicSyllabusIdTopicId: primaryKey({
        columns: [table.syllabusId, table.topicId],
        name: "SyllabusTopic_syllabus_id_topic_id",
      }),
    };
  }
);

export const teacher = mysqlTable(
  "Teacher",
  {
    teacherId: varchar("teacher_id", { length: 191 }).notNull(),
    firstName: varchar("first_name", { length: 191 }).notNull(),
    lastName: varchar("last_name", { length: 191 }).notNull(),
    dob: datetime("dob", { mode: "string", fsp: 3 }).notNull(),
    email: varchar("email", { length: 191 }),
    phoneNumber: varchar("phone_number", { length: 191 }).notNull(),
    address: varchar("address", { length: 191 }),
    sex: varchar("sex", { length: 191 }).notNull(),
    primaryLanguage: varchar("primary_language", { length: 191 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    salary: double("salary").notNull(),
    membershipStatus: varchar("membership_status", { length: 100 }).notNull(),
  },
  (table) => {
    return {
      teacherTeacherId: primaryKey({
        columns: [table.teacherId],
        name: "Teacher_teacher_id",
      }),
      teacherEmailKey: unique("Teacher_email_key").on(table.email),
      teacherPhoneNumberKey: unique("Teacher_phone_number_key").on(
        table.phoneNumber
      ),
    };
  }
);

export const teacherStayDuration = mysqlTable(
  "TeacherStayDuration",
  {
    stayId: varchar("stay_id", { length: 191 }).notNull(),
    teacherId: varchar("teacher_id", { length: 191 })
      .notNull()
      .references(() => teacher.teacherId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    joiningDate: datetime("joining_date", { mode: "string", fsp: 3 }).notNull(),
    leavingDate: datetime("leaving_date", { mode: "string", fsp: 3 }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      teacherStayDurationStayId: primaryKey({
        columns: [table.stayId],
        name: "TeacherStayDuration_stay_id",
      }),
    };
  }
);

export const topic = mysqlTable(
  "Topic",
  {
    topicId: varchar("topic_id", { length: 191 }).notNull(),
    syllabusId: varchar("syllabus_id", { length: 191 }).notNull(),
    topicName: varchar("topic_name", { length: 191 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      topicTopicId: primaryKey({
        columns: [table.topicId],
        name: "Topic_topic_id",
      }),
    };
  }
);

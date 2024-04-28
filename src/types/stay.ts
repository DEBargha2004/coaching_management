export type StudentJoiningInfo = {
  createdAt: string;
  studentId: string;
  stayId: string;
  joiningDate: string;
  leavingDate: string | null;
};

export type TeacherJoiningInfo = {
  createdAt: string;
  teacherId: string;
  stayId: string;
  joiningDate: string;
  leavingDate: string | null;
};

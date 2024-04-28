export type StudentFullInfo = {
  createdAt: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string | null;
  phoneNumber: string;
  aadharNumber: string;
  address: string | null;
  sex: string;
  primaryLanguage: string;
  membershipStatus: string;
  parentalInfo: {
    parentId: string;
    relation: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string | null;
  }[];
};

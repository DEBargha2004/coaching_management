type IdType =
  | "book"
  | "batch"
  | "teacher"
  | "student"
  | "subject"
  | "timing"
  | "group"
  | "qualification"
  | "parent";
type IdList = Record<IdType, string>;

export const id_prefix: IdList = {
  batch: "bch_",
  book: "bk_",
  group: "grp_",
  parent: "prnt_",
  qualification: "qual_",
  student: "std_",
  subject: "sub_",
  teacher: "tch_",
  timing: "tim_",
};

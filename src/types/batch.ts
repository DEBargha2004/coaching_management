export type Teacher = {
  teacher_id: string;
  first_name: string;
  last_name: string;
  sex: string;
};

export type Batch = {
  batch_id: string;
  batch_name: string | null;
  created_at: string | null;
  teachers: Teacher[];
  students_count: number;
  description?: string | null;
  medium?: string | null;
};

export type BatchTimings_Student = {
  timing_id: string;
  batch_info: {
    batch_id: string;
    batch_name: string;
  };
  subject_info: {
    subject_id: string;
    subject_name: string;
  };
  teacher_info: {
    teacher_id: string;
    first_name: string;
    last_name: string;
  };
  day_index: number;
  start_time: string;
  end_time: string;
};

export type BatchTiming_Teacher = {
  timing_id: string;
  batch_info: {
    batch_id: string;
    batch_name: string;
  };
  start_time: string;
  end_time: string;
  day_index: number;
  subject_info: {
    subject_id: string;
    subject_name: string;
  };
};

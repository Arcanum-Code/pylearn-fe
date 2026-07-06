export interface LecturerQuizBlank {
  blank_id: string;
  keyword: string;
  start_index: number;
  end_index: number;
}

export interface LecturerQuizQuestion {
  question_id: string;
  question_text: string;
  key_answer_text: string;
  sequence_order: number;
  blanks: LecturerQuizBlank[];
}

export interface LecturerGatingMaterial {
  material_id: string;
  title: string;
  sequence: number;
}

export interface LecturerQuizDetail {
  quiz_id: string;
  group_id: string;
  level: number;
  title: string;
  status: "draft" | "published";
  pass_threshold: number;
  can_publish?: boolean;
  questions: LecturerQuizQuestion[];
  gating_materials: LecturerGatingMaterial[];
}

export interface LecturerQuizListItem {
  quiz_id: string;
  level: number;
  title: string;
  status: "draft" | "published";
  question_count: number;
}

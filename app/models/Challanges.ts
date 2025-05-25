export type Alternative = {
  alternative_id: number;
  answer: string;
};

export type Challange = {
  challenge_id: number;
  question: string;
  points: number;
  alternatives: Alternative[];
};

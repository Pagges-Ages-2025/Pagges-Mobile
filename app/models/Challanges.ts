export type Alternatives = {
    alternative_id: number;
    answer: string;
};

export type Challanges = {
    challenge_id: number;
    question: string;
    points: number;
    alternatives: Alternatives[]
}

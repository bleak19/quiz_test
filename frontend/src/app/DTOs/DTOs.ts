import { timeInterval } from "rxjs";

export interface Category{
    id : number;
    name : string;
}

export interface TestForUser
{
    id : number;
    name : string;
    questions : QuestionForUser[];
    timeLimit : number;
}

export interface NewQuestion{
    categoryId: number;
    text : string;
    answers : Answer[];
}

export interface Answer{
    text : string;
    isCorrect : boolean;
}

export interface AnswerForUser{
    id : number;
    text : string;
    isSelected : boolean;
}

export interface QuestionForUser{
    id : number;
    categoryId : number
    text : string;
    answers: AnswerForUser[];
}

export interface AnswerDto {
  text: string;
  isCorrect: boolean;
}

export interface QuestionDto {
  id: number;
  text: string;
  categoryId: number;
  answers: AnswerDto[];
}

export interface TestPreview {
  categoryId: number;
  testName: string;
  timeLimit: number;
  questions: QuestionDto[];
}

export interface SaveTestRequest {
  categoryId: number;
  testName: string;
  duration: number;
  questionIds: number[];
}

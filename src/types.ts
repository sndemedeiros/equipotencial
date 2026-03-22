export type Screen = 
  | 'home' 
  | 'objectives' 
  | 'theory' 
  | 'materials' 
  | 'procedures' 
  | 'map' 
  | 'calculation' 
  | 'questions' 
  | 'about';

export interface Point {
  x: number;
  y: number;
  color: string;
  type: 'pencil' | 'point';
}

export interface DrawingPath {
  points: Point[];
  color: string;
  width: number;
  isEraser?: boolean;
}

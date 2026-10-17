export interface Note {
  id: number;
  title: string;
  content: string;
}

export type NoteInput = Pick<Note, 'title' | 'content'>;

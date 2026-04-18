export interface Comment {
    id: string;
    projectId: string;
    authorName: string;
    authorEmail: string;
    body: string;
    approved: boolean;
    createdAt: Date;
  }
  
  export interface CommentFormData {
    authorName: string;
    authorEmail: string;
    body: string;
  }
export interface Tag {
    id: string;
    name: string;
    color: string;
  }
  
  export interface GalleryImage {
    id: string;
    projectId: string;
    url: string;
    caption: string | null;
    position: number;
  }
  
  export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    stack: string[];
    overview: string;
    architecture: string;
    ciCd: string;
    observability: string;
    failureScenarios: string[];
    githubUrl: string;
    demoUrl: string | null;
    featured: boolean;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ProjectWithRelations extends Project {
    tags: Tag[];
    gallery: GalleryImage[];
    commentCount: number;
    userHasLiked?: boolean;
  }
  
  // Used in admin form
  export interface ProjectFormData {
    title: string;
    slug: string;
    description: string;
    stack: string;         // comma-separated, split on save
    overview: string;
    architecture: string;
    ciCd: string;
    observability: string;
    failureScenarios: string; // newline-separated, split on save
    githubUrl: string;
    demoUrl: string;
    featured: boolean;
    tagIds: string[];
  }
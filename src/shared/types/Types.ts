export interface CourseType {
    id: string,
    title: string,
    description: string,
    creationDate: string,
    duration: number,
    authors: string[]
  }
  
  export interface AuthorType {
    id: string,
    name: string
  }
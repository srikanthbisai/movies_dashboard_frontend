//app/types/index.ts
export type Movie = {
    _id: string
    title: string
    userId: string
    cast: Array<CastMember>,
    createdAt: string 

  }
  
  export type CastMember = {
    id: string 
    name: string
    email: string
    phone: string
    place: string
  }
  
  export type User = {
    id: string
    name: string
    email?: string
  }
  
  export type AuthContextType = {
    user: User | null
    login: (token: string, userData: User) => void
    logout: () => void
  }


  export interface TMDBMovie {
    id: number;
    title: string;
    vote_average: number;
    vote_count: number;
    poster_path: string;
  }
  
  export interface UserMovie {
    _id: string;
    title: string;
    cast: {
      name: string;
      email: string;
      phone: string;
      place: string;
    }[];
    createdAt: string;
  }
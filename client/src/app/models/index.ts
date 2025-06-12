// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   token: string;
// }
// export interface DiseasePrediction {
//   disease: string;
//   confidence: number;
// }
// export interface ApiResponse<T> {
//   data: T;
//   message: string;
//   success: boolean;
// }





// src/app/models/index.ts

export interface Suggestion {
  disease:    string;
  confidence: string;   // "97%"
}

export interface DiseaseResponse {
  suggestions:   Suggestion[];
  all_diseases:  string[];
}

// Your existing Auth/User models stay unchanged
export interface User {
  id:     string;
  name:   string;
  email:  string;
  token:  string;
}
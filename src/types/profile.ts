export interface IProfile {
  _id?: string;
  fullName: string;
  professionalTitle: string;
  email: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  defaultCv?: string;
  defaultCvName?: string;
  bio?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProfileFormData {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  defaultCv?: string;
  defaultCvName?: string;
  bio?: string;
}

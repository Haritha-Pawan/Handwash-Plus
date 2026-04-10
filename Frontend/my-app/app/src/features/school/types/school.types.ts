export interface SchoolLocation {
  lat: number;
  lng: number;
}

export interface SchoolCreator {
  id: string;
  name?: string;
}

export interface School {
  id: string;
  _id?: string;
  name: string;
  address: string;
  district: string;
  city: string;
  lat?: number;
  lng?: number;
  location?: SchoolLocation;
  createdBy?: SchoolCreator | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetSchoolsResponse {
  success: boolean;
  message?: string;
  data: School[];
}
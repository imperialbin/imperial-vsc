export interface ImperialAPIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AcceptableSettings {
  apiToken: string;
  longURLs: boolean;
  shortURLs: boolean;
  imageEmbed: boolean;
  expiration: string | null;
  encrypted: boolean;
  password?: string;
}

export interface Document {
  id: string;
  content: string;
  creator: User;
  views: number;
  links: {
    raw: string;
    formatted: string;
  };
  timestamps: {
    creation: number;
    expiration: number;
  };
  settings: {
    language: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    image_embed: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    instant_delete: boolean;
    encrypted: boolean;
    password: null | string;
    public: boolean;
    editors: User[];
  };
}

export interface User {
  id: number;
  documents_made: number;
  username: string;
  icon: string;
  flags: 0;
}

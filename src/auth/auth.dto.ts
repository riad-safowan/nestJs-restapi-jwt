export type TokenModel = {
  access_token: string;
  refresh_token: string;
};

export type SignInResponse = {
  id: number;
  first_name: string;
  last_name: string;
  image_url: string;
  email: string;
  access_token: string;
  refresh_token: string;
};

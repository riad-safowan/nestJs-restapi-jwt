export type PostRequest = {
  text: string;
};

export type PostResponse = {
  id: number;
  text: string;
  user_id: number;
  user_name: string;
  user_image_url?: string;
  created_at: Date;
  updated_at: Date;
  image_url?: string;
  likes: number;
  comments: number;
  is_liked: boolean;
};

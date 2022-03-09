import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

export type BaseResponse = {
  data: any;
  status: number;
  message: string;
};

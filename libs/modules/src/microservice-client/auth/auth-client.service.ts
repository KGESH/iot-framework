import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { IApiClient } from '../adapter';

@Injectable()
export class AuthClientService implements IApiClient {
  constructor(private readonly authApiClient: HttpService) {}

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(this.authApiClient.get<T>(url, config)).then(
      (res) => res.data
    );
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return lastValueFrom(this.authApiClient.post<T>(url, data, config)).then(
      (res) => res.data
    );
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(this.authApiClient.delete<T>(url, config)).then(
      (res) => res.data
    );
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(this.authApiClient.patch<T>(url, data, config)).then(
      (res) => res.data
    );
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(this.authApiClient.put<T>(url, data, config)).then(
      (res) => res.data
    );
  }
}

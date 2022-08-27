import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { IApiClient } from '../adapter';

@Injectable()
export class DeviceClientService implements IApiClient {
  constructor(private readonly deviceApiClient: HttpService) {}

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(this.deviceApiClient.get<T>(url, config)).then(
      (res) => res.data
    );
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return lastValueFrom(this.deviceApiClient.post<T>(url, data, config)).then(
      (res) => res.data
    );
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(this.deviceApiClient.delete<T>(url, config)).then(
      (res) => res.data
    );
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(this.deviceApiClient.patch<T>(url, data, config)).then(
      (res) => res.data
    );
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(this.deviceApiClient.put<T>(url, data, config)).then(
      (res) => res.data
    );
  }
}

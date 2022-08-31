import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseEntity<T> {
  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string;

  @ApiProperty()
  readonly data: T;

  private constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static OK(): ResponseEntity<null> {
    return new ResponseEntity<null>(HttpStatus.OK, null, null);
  }

  static OK_WITH<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.OK, null, data);
  }

  static ERROR(): ResponseEntity<null> {
    return new ResponseEntity<null>(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error!', null);
  }

  static ERROR_WITH(message: string, code: HttpStatus): ResponseEntity<null> {
    return new ResponseEntity<null>(code, message, null);
  }

  static ERROR_WITH_DATA<T>(message: string, code: HttpStatus, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(code, message, data);
  }
}

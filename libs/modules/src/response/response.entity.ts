import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T> {
  private constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly data: T
  ) {}

  static OK(): ResponseEntity<null> {
    return new ResponseEntity<null>(HttpStatus.OK, null, null);
  }

  static OK_WITH<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.OK, null, data);
  }

  static ERROR(): ResponseEntity<null> {
    return new ResponseEntity<null>(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Server error!',
      null
    );
  }

  static ERROR_WITH(message: string, code: HttpStatus): ResponseEntity<null> {
    return new ResponseEntity<null>(code, message, null);
  }

  static ERROR_WITH_DATA<T>(
    message: string,
    code: HttpStatus,
    data: T
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(code, message, data);
  }
}

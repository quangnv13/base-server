import { PipeTransform, Injectable } from '@nestjs/common';
@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: any) {
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }
}

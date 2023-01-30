import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';

@Injectable()
export class GeneratorService {
  public uuid(): string {
    return uuid();
  }

  public fileName(ext: string): string {
    return this.uuid() + '.' + ext;
  }

  public generateRandomHash(size: number): string {
    let hash = '';
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < size; i++) {
      hash += possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length),
      );
    }

    return hash;
  }
}

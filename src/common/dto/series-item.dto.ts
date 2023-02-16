export class SeriesItemDto {
  name: string;

  data: number[];

  constructor(name: string, data: number[]) {
    this.name = name;
    this.data = data;
  }
}

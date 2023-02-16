import type { SeriesItemDto } from '../../../common/dto/series-item.dto';
import type { SubmissionByCategoryDto } from '../../../common/dto/submission-by-category.dto';

export class StatisticsDto {
  weeklySubmissions: SeriesItemDto[];

  submissions: number;

  students: number;

  submissionsByCategory: SubmissionByCategoryDto[];
}

import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SeasonLabel } from "../../shared/models/enum/SeasonLabel";
import { TaskLabel } from "../../tasks/tasks.config";

export class SubscribeHanaNewsletterDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(SeasonLabel)
  @IsNotEmpty()
  season: SeasonLabel;

  @IsEnum(TaskLabel)
  @IsNotEmpty()
  taskLabel: TaskLabel;
}

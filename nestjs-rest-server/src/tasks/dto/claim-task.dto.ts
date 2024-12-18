import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { SeasonLabel } from "../../shared/models/enum/SeasonLabel";
import { TaskLabel } from "../tasks.config";
import { Type } from "class-transformer";
import { SocialProvider } from "../../shared/models/enum/SocialProvider";

class BaseFeature {
  kind: "hana_subscribe" | "link_social";
}

export class SubscribeHanaTaskDetailsDto extends BaseFeature {
  kind = "hana_subscribe" as const;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class LinkSocialTaskDetailsDto extends BaseFeature {
  kind = "link_social" as const;

  @IsNotEmpty()
  @IsEnum(SocialProvider)
  provider: SocialProvider;
}

export class ClaimTaskDto {
  @IsEnum(SeasonLabel)
  @IsNotEmpty()
  season: SeasonLabel;

  @IsEnum(TaskLabel)
  @IsNotEmpty()
  taskLabel: TaskLabel;

  @IsOptional()
  @ValidateNested()
  @Type(() => BaseFeature, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "kind",
      subTypes: [
        { value: SubscribeHanaTaskDetailsDto, name: "hana_subscribe" },
        { value: LinkSocialTaskDetailsDto, name: "link_social" },
      ],
    },
  })
  details?: SubscribeHanaTaskDetailsDto | LinkSocialTaskDetailsDto;
}

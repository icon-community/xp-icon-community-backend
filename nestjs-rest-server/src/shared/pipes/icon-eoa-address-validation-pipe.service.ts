import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { isEoaAddress } from "../utils/validate-util";

@Injectable()
export class IconEoaAddressValidationPipe implements PipeTransform {
  async transform(value: string): Promise<unknown> {
    if (!isEoaAddress(value)) {
      throw new BadRequestException("Address is not a valid Icon EOA address");
    }
    return value;
  }
}

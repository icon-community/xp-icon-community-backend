import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { isEoaAddress, isStellarAddress, isEvmAddress } from "../utils/validate-util";

@Injectable()
export class AddressValidationPipe implements PipeTransform {
  async transform(value: string): Promise<unknown> {
    if (!isEoaAddress(value) && !isEvmAddress(value) && !isStellarAddress(value)) {
      throw new BadRequestException("Address is not a valid Icon EOA or EVM address");
    }

    return value;
  }
}

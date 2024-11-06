import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { isEoaAddress, isStellarAddress } from "../utils/validate-util";
import { isEthereumAddress } from "class-validator";

@Injectable()
export class AddressValidationPipe implements PipeTransform {
  async transform(value: string): Promise<unknown> {
    if (!isEoaAddress(value) && !isEthereumAddress(value) && !isStellarAddress(value)) {
      throw new BadRequestException("Address is not a valid Icon EOA or EVM address");
    }

    return value;
  }
}

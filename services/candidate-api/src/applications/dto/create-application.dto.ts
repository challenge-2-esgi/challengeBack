import { IsDefined, IsNotEmpty } from "class-validator";

export class CreateApplicationDto {
    @IsDefined()
    @IsNotEmpty()
    userId: string

    @IsDefined()
    @IsNotEmpty()
    offerId: string

    @IsDefined()
    @IsNotEmpty()
    motivation: string

    @IsDefined()
    @IsNotEmpty()
    cv: string
}

import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export class CreateApplicationDto {
    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    userId: string

    @IsDefined()
    @IsNotEmpty()
    @IsUUID()
    offerId: string

    @IsDefined()
    @IsNotEmpty()
    motivation: string

    @IsDefined()
    @IsNotEmpty()
    cv: string
}

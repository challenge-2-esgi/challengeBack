import { IsDefined, IsNotEmpty } from "class-validator"

export class CreateBookmarkDto {
    @IsDefined()
    @IsNotEmpty()
    offerId: string

    @IsDefined()
    @IsNotEmpty()
    userId: string
}

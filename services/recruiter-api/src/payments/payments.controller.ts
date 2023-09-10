import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  RawBodyRequest,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout')
  createCheckout(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.paymentsService.createCheckout(createCheckoutDto);
  }

  @Post('webhook')
  stripeWebHooks(@Req() req, @Res() res: RawBodyRequest<Request>) {
    return this.paymentsService.stripeWebHooks(req, res);
  }
}

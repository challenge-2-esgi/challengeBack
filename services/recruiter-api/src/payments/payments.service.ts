import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_API_KEY'), {
      apiVersion: '2023-08-16',
    });
  }

  async createCheckout(createCheckoutDto: CreateCheckoutDto) {
    const URL_FRONT = "https://www.main-bvxea6i-tazckxp2c3272.fr-4.platformsh.site" // this.configService.get('URL_FRONT');

    try {
      const prices = await this.stripe.prices.list();

      const price = prices?.data.filter((price) => {
        return price.id == createCheckoutDto.priceId;
      });

      const session = await this.stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        line_items: [
          {
            price: price[0].id,
            quantity: 1,
          },
        ],
        metadata: {
          companyId: createCheckoutDto.companyId,
        },
        mode: 'subscription',
        success_url: `${URL_FRONT}/myOffers`,
        cancel_url: `${URL_FRONT}/myOffers`,
      });

      return session.url;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('An error occured');
    }
  }

  async stripeWebHooks(req, res) {
    let event;
    const ENDPOINT_SECRET = this.configService.get('ENDPOINT_SECRET');

    const signature = req.headers['stripe-signature'];

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        ENDPOINT_SECRET,
      );
    } catch (err) {
      console.log('Webhook signature verif failed.', err.message);
      return res.sendStatus(400);
    }

    let subscription;
    let status;

    console.log('event.type', event.type);
    switch (event.type) {
      case 'checkout.session.completed':
        subscription = event.data.object;
        status = subscription.status;

        const company = event.data.object.metadata.companyId;

        const subscriptionEndDate = new Date();
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

        const updateData = {
          subscribed: true,
          subscriptionEndDate: subscriptionEndDate,
        } as Prisma.CompanyUpdateInput;

        console.log('company', company);
        await this.prisma.company.update({
          where: {
            id: company,
          },
          data: updateData,
        });

        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`customer.subscription.deleted is ${status}.`);
        break;
      case 'customer.subscription.created':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`customer.subscription.created is ${subscription}.`);
        break;
      case 'customer.subscription.updated':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`customer.subscription.updated is ${status}.`);
        break;
      default:
        console.log(`other is ${event.type}.`);
    }

    return {};
  }
}

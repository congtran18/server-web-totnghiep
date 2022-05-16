import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Post()
    async create(@Body() checkoutDto: CheckoutDto): Promise<any> {
        return this.stripeService.create(checkoutDto);
    }

    /**
     * Order fulfillment
     * https://stripe.com/docs/payments/checkout/fulfill-orders
     * @param request 
     * @param response 
     * @returns 
     */
    @Post('webhook')
    async webhook(@Req() request: Request, @Res() response: Response): Promise<any> {


        const payload = request['rawBody'];
        const sig = request.headers['stripe-signature'];

        console.log("vo day nek")

        let event: Stripe.Event;

        if (sig) {

            try {
                event = this.stripeService.stripe.webhooks.constructEvent(payload, sig, 'whsec_nab1ZyXFmD1k9JXDqbvge2EJqYljuFwc' || "");
            } catch (err: any) {
                return response.status(HttpStatus.FORBIDDEN).send(`Webhook Error: ${err?.message}`);
            }

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;

                // Fulfill the purchase...
                this.stripeService.fulfill(session);
            }
        }

        // Handle the checkout.session.completed even

        response.status(HttpStatus.OK).send();

    }

    @Get()
    findAll() {
        return this.stripeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.stripeService.findOne(id);
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { CheckoutOrderDto } from './dto/checkout-order.dto';
import { CheckoutCourseDto } from './dto/checkout-course.dto';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Post('order')
    async createCheckoutOrder(@Body() checkoutOrderDto: CheckoutOrderDto): Promise<any> {
        return this.stripeService.createCheckoutOrder(checkoutOrderDto);
    }

    @Post('course')
    async createCheckoutCourse(@Body() checkoutCourseDto: CheckoutCourseDto): Promise<any> {
        return this.stripeService.createCheckoutCourse(checkoutCourseDto);
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

        let event: Stripe.Event;

        if (sig) {

            try {
                event = this.stripeService.stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
            } catch (err: any) {
                return response.status(HttpStatus.FORBIDDEN).send(`Webhook Error: ${err?.message}`);
            }


            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                const result = session?.metadata
                // Fulfill the purchase...
                if (result) {
                    if (result.idProduct) {
                        this.stripeService.fulfillOrder(session);
                    } else {
                        this.stripeService.fulfillCourse(session);
                    }

                }
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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stripe } from 'stripe';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { Order } from '../order/schemas/order.schema';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class StripeService {
    private readonly _stripe: Stripe;

    private redirect_url = process.env.HOST || "";

    get stripe() {
        return this._stripe;
    }

    constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {
        this._stripe = new Stripe(process.env.STRIPE_TEST_KEY || "", { apiVersion: '2020-08-27' });
    }

    async create(checkoutDto: CheckoutDto) {
        const { items, email } = checkoutDto;

        const transformedItems = items.map((item) => ({
            description: item.category,
            quantity: item.quantity,
            price_data: {
                currency: 'usd',
                unit_amount: Math.round(item.cost * 100),
                product_data: {
                    name: item.realname,
                    images: [item.mainImage],
                },
            },
        }));

        const session = await this._stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA', 'AU', 'PH', 'VN'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'usd',
                        },
                        display_name: 'Free shipping',
                        //Delivers between 5-7 business days
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        }
                    }
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 1500,
                            currency: 'usd',
                        },
                        display_name: 'Next day air',
                        //Delivers in exactly 1 business day
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 1,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 1,
                            },
                        }
                    }
                },
            ],
            metadata: {
                realname: JSON.stringify(items.map((item) => item.realname)),
                mainImage: JSON.stringify(items.map((item) => item.mainImage)),
                type: JSON.stringify(items.map((item) => item.type)),
                category: JSON.stringify(items.map((item) => item.category)),
            },
            line_items: transformedItems,
            mode: 'payment',
            success_url: this.redirect_url.concat('/success'),
            cancel_url: this.redirect_url.concat('/error'),
        });

        return { id: session.id };
    }

    async findAll() {
        return this.orderModel.find().exec();
    }

    async findOne(id: string) {
        return this.orderModel
            .findById({ _id: id })
            .exec();
    }

    async fulfill(session: Stripe.Checkout.Session) {
        const expanded_session = await this._stripe.checkout.sessions.retrieve(
            session.id,
            {
                expand: ['customer', 'line_items'],
            }
        );

        var items: any

        if (expanded_session) {

            var customer = expanded_session.customer_details;
            if (expanded_session.line_items) {
                items = expanded_session.line_items.data;
            }

            var total_details = expanded_session.total_details
            var address = customer?.address
            var dataProduct = session?.metadata


            if (items && address && total_details && dataProduct) {
                const realname = dataProduct?.realname ? JSON.parse(dataProduct.realname) : ''
                const mainImage = dataProduct?.mainImage ? JSON.parse(dataProduct.mainImage) : ''
                const type = dataProduct?.type ? JSON.parse(dataProduct.type) : ''
                const category = dataProduct?.category ? JSON.parse(dataProduct.category) : ''
                const createOrderDto: CreateOrderDto = {
                    status: 'Hoàn thành',
                    user: customer?.email ? customer?.email : '',
                    totalPrice: expanded_session.amount_total || 0,
                    shippingPrice: total_details?.amount_shipping ? total_details?.amount_shipping : 0,
                    orderItems: items.map((item: any, index: number) => {
                        return {
                            realname: realname ? realname[index] : '',
                            mainImage: mainImage ? mainImage[index] : '',
                            type: type ? type[index] : '',
                            category: category ? category[index] : '',
                            subtotal: item.amount_total,
                            unit_price: item.price.unit_amount,
                            qty: item.quantity,
                        }
                    }),
                    address:
                    {
                        city: address?.city ? address?.city : "",
                        country: address?.country ? address?.country : "",
                        address: address?.line1 ? address?.line1 : "",
                        postal_code: address?.postal_code ? address?.postal_code : "",
                        state: address?.state ? address?.state : "",
                    },
                }
                const newOrder = new this.orderModel({ ...createOrderDto });
                const data = await newOrder.save();
                return;
            }

        }

    }

    remove(id: string) {
        return `This action removes a ${id} order`;
    }
}

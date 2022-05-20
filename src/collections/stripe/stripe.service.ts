import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stripe } from 'stripe';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { Order } from '../order/schemas/order.schema';
import { CheckoutOrderDto } from './dto/checkout-order.dto';
import { CheckoutCourseDto } from './dto/checkout-course.dto';

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

    async createCheckoutOrder(checkoutOrderDto: CheckoutOrderDto) {
        const { items, email } = checkoutOrderDto;

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
                idProduct: JSON.stringify(items.map((item) => item.idProduct)),
            },
            line_items: transformedItems,
            mode: 'payment',
            success_url: this.redirect_url.concat('/success'),
            cancel_url: this.redirect_url.concat('/error'),
        });

        return { id: session.id };
    }

    async createCheckoutCourse(checkoutCourseDto: CheckoutCourseDto) {
        const { type , cost, email } = checkoutCourseDto;

        const transformedItems = [{
            description: "Khóa học",
            quantity: 1,
            price_data: {
                currency: 'usd',
                unit_amount: cost,
                product_data: {
                    name: type,
                    images: ["https://topicanative.edu.vn/wp-content/uploads/2020/06/hoc-tieng-anh-online-o-dau-hieu-qua-2.jpg"],
                },
            },
        }];

        const session = await this._stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            metadata: {
                type: type,
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

    async fulfillCourse(session: Stripe.Checkout.Session) {
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
                const idProducts = dataProduct?.idProduct ? JSON.parse(dataProduct.idProduct) : ''
                const createOrderDto: CreateOrderDto = {
                    status: 'Hoàn thành',
                    user: customer?.email ? customer?.email : '',
                    totalPrice: expanded_session.amount_total || 0,
                    shippingPrice: 0,
                    paymentMethod: "Khóa học",
                    typeCourse: dataProduct?.type ? dataProduct?.type : ''
                }
                const newOrder = new this.orderModel({ ...createOrderDto });
                const data = await newOrder.save();
                return;
            }

        }

    }

    async fulfillOrder(session: Stripe.Checkout.Session) {
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
                const idProducts = dataProduct?.idProduct ? JSON.parse(dataProduct.idProduct) : ''
                const createOrderDto: CreateOrderDto = {
                    status: 'Hoàn thành',
                    user: customer?.email ? customer?.email : '',
                    totalPrice: expanded_session.amount_total || 0,
                    shippingPrice: total_details?.amount_shipping ? total_details?.amount_shipping : 0,
                    paymentMethod: "Sách",
                    orderItems: items.map((item: any, index: number) => {
                        return {
                            productId: idProducts ? idProducts[index] : '',
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

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export class PaymentService {
  // Crear un payment link para una factura
  static async createPaymentLink(invoice: {
    number: string;
    total: number;
    description: string;
    clientEmail: string;
  }): Promise<{ url: string; id: string }> {
    try {
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Factura ${invoice.number}`,
                description: invoice.description,
              },
              unit_amount: Math.round(invoice.total * 100), // Stripe usa centavos
            },
            quantity: 1,
          },
        ],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/invoices/success?invoice=${invoice.number}`,
          },
        },
        metadata: {
          invoiceNumber: invoice.number,
          clientEmail: invoice.clientEmail,
        },
      });

      return {
        url: paymentLink.url,
        id: paymentLink.id,
      };
    } catch (error) {
      console.error('Stripe payment link creation error:', error);
      throw new Error('Error al crear el link de pago');
    }
  }

  // Crear una suscripción mensual
  static async createSubscription(
    customerId: string,
    priceId: string
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      console.error('Stripe subscription creation error:', error);
      throw new Error('Error al crear la suscripción');
    }
  }

  // Crear un cliente en Stripe
  static async createCustomer(data: {
    email: string;
    name: string;
    phone?: string;
  }): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
      });

      return customer;
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      throw new Error('Error al crear el cliente en Stripe');
    }
  }

  // Webhook handler para eventos de Stripe
  static async handleWebhook(
    rawBody: string,
    signature: string
  ): Promise<{ type: string; data: any }> {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          return {
            type: 'payment_succeeded',
            data: {
              invoiceNumber: paymentIntent.metadata.invoiceNumber,
              amount: paymentIntent.amount / 100,
              customerEmail: paymentIntent.receipt_email,
            },
          };

        case 'payment_intent.payment_failed':
          return {
            type: 'payment_failed',
            data: event.data.object,
          };

        case 'customer.subscription.created':
          return {
            type: 'subscription_created',
            data: event.data.object,
          };

        case 'customer.subscription.updated':
          return {
            type: 'subscription_updated',
            data: event.data.object,
          };

        default:
          return {
            type: 'unknown',
            data: event,
          };
      }
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw new Error('Error al procesar el webhook de Stripe');
    }
  }

  // Obtener balance de la cuenta
  static async getBalance(): Promise<{
    available: number;
    pending: number;
  }> {
    try {
      const balance = await stripe.balance.retrieve();
      
      const available = balance.available.reduce(
        (sum, item) => sum + item.amount,
        0
      ) / 100;
      
      const pending = balance.pending.reduce(
        (sum, item) => sum + item.amount,
        0
      ) / 100;

      return { available, pending };
    } catch (error) {
      console.error('Stripe balance error:', error);
      throw new Error('Error al obtener el balance');
    }
  }

  // Listar pagos recientes
  static async listRecentPayments(limit: number = 10): Promise<any[]> {
    try {
      const paymentIntents = await stripe.paymentIntents.list({
        limit,
      });

      return paymentIntents.data.map(pi => ({
        id: pi.id,
        amount: pi.amount / 100,
        status: pi.status,
        created: new Date(pi.created * 1000),
        customerEmail: pi.receipt_email,
        invoiceNumber: pi.metadata.invoiceNumber,
      }));
    } catch (error) {
      console.error('Stripe payments list error:', error);
      throw new Error('Error al listar pagos');
    }
  }
}

import { Body, Controller, Headers, Post } from "@nestjs/common";
import { validateOrThrow } from "../../common/validation/validate-or-throw";
import { paymentWebhookSchema, webhookHeadersSchema } from "./payments.schemas";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("webhook")
  handleWebhook(
    @Body() payload: unknown,
    @Headers("x-mtn-signature") signature?: string,
    @Headers("x-mtn-timestamp") timestamp?: string
  ) {
    const parsedPayload = validateOrThrow(
      paymentWebhookSchema,
      payload,
      "Invalid payment webhook payload."
    );
    const parsedHeaders = validateOrThrow(
      webhookHeadersSchema,
      { signature, timestamp },
      "Missing or invalid webhook security headers."
    );
    return this.paymentsService.handleWebhook(parsedPayload, parsedHeaders);
  }
}

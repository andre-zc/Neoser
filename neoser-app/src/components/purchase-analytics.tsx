"use client";

import { useEffect } from "react";
import { sendGaEventOnce } from "@/lib/analytics/ga4";
import { sendMetaEventOnce } from "@/lib/analytics/meta-pixel";

type Props = {
  transactionId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  provider: string;
};

export function PurchaseAnalytics({
  transactionId,
  courseId,
  courseTitle,
  amount,
  currency,
  provider,
}: Props) {
  useEffect(() => {
    sendGaEventOnce(`purchase_${transactionId}`, "purchase", {
      transaction_id: transactionId,
      affiliation: provider,
      value: amount,
      currency,
      items: [
        {
          item_id: courseId,
          item_name: courseTitle,
          price: amount,
          quantity: 1,
        },
      ],
    });
    // Meta recibe la conversion y el valor, pero no datos de la persona ni del curso.
    sendMetaEventOnce(`purchase_${transactionId}`, "Purchase", {
      value: amount,
      currency,
    });
  }, [amount, courseId, courseTitle, currency, provider, transactionId]);

  return null;
}

import { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { Spacing, Colors } from "../utils";

/* Wallet */

export const CARDS = [
  { card: require("./assets/card1.png") },
  { card: require("./assets/card2.png") },
  { card: require("./assets/card3.png") },
  { card: require("./assets/card4.png") },
  { card: require("./assets/card5.png") },
  { card: require("./assets/card6.png") },
];

export const WIDTH = Dimensions.get("window").width;
const PAGE_PADDING = 2 * Spacing.defaultMargin;

const RATIO = 228 / 362;
export const CARD_WIDTH = (WIDTH - PAGE_PADDING) * 0.8;
export const CARD_HEIGHT = CARD_WIDTH * RATIO;

export const CARD_MARGIN = 0;
export const EMPTY_OFFSET =
  (WIDTH - PAGE_PADDING - CARD_WIDTH - CARD_MARGIN) / 2;

export const SNAP_OFFSETS = CARDS.map(
  (_, index) => index * (CARD_WIDTH + CARD_MARGIN)
);

/* Installments */

interface SummaryContent {
  type: "content";
  data: Payment;
}

interface ShowAction {
  type: "action";
  title: string;
  onPress: () => void;
}

type PaymentRowViewState = SummaryContent | ShowAction;

export const usePayments = (payments: Payment[]) => {
  const [viewState, setViewState] = useState<PaymentRowViewState[]>([]);

  useEffect(() => {
    const createViewState = () => {
      const isAllPaid = payments.every((p) => p.status === "paid");
      const isAllOverdue = payments.every((p) => p.status === "overdue");
      const isAllUpcoming = payments.every((p) => p.status === "upcoming");
      if (isAllPaid || isAllOverdue || isAllUpcoming) {
        setViewState(payments.map((p) => ({ type: "content", data: p })));
        return;
      }

      // Find the first upcoming payment
      let firstUpcomingIndex = 0;
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];
        if (payment.status === "upcoming") {
          firstUpcomingIndex = i;
          break;
        }
      }

      // Not enough payment transactions to warrant showing the in-line 'Show more' action button
      if (firstUpcomingIndex < 5) {
        setViewState(payments.map((p) => ({ type: "content", data: p })));
        return;
      }

      const previousPayments: SummaryContent[] = payments
        .slice(1, firstUpcomingIndex)
        .map((p) => ({ type: "content", data: p }));

      const nextPayments: SummaryContent[] = payments
        .slice(firstUpcomingIndex)
        .map((p) => ({ type: "content", data: p }));

      // Create view state with the in-line 'Show more' action button
      let viewState: PaymentRowViewState[] = [];
      viewState.push({ type: "content", data: payments[0] });
      viewState.push({
        type: "action",
        title: "Show previous payments",
        onPress: () => {
          setViewState((prev) => {
            return [prev[0], ...previousPayments, ...prev.slice(2)];
          });
        },
      });
      viewState = [...viewState, ...nextPayments];
      setViewState(viewState);
    };

    createViewState();
  }, [payments]);

  return {
    viewState,
  };
};

type PaymentStatus = "paid" | "upcoming" | "overdue";
export interface Payment {
  paidDate: string;
  scheduledDate: string;
  cardTender: string;
  amount: number;
  status: PaymentStatus;
}

export const PAYMENTS: Payment[] = [
  {
    paidDate: "August 1, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "paid",
  },
  {
    paidDate: "August 1, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "paid",
  },
  {
    paidDate: "August 1, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "paid",
  },
  {
    paidDate: "August 1, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "paid",
  },
  {
    paidDate: "August 1, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "paid",
  },
  {
    paidDate: "August 1, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "Adjustment",
    amount: -1.22,
    status: "paid",
  },
  {
    paidDate: "August 9, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "overdue",
  },
  {
    paidDate: "August 12, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "upcoming",
  },
  {
    paidDate: "August 12, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "upcoming",
  },
  {
    paidDate: "August 12, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "upcoming",
  },
  {
    paidDate: "August 12, 2021",
    scheduledDate: "August 9, 2021",
    cardTender: "VISA 1234",
    amount: 165.63,
    status: "upcoming",
  },
];

export const amountColorForStatus: Record<PaymentStatus, string> = {
  paid: Colors.TextSubdued,
  upcoming: Colors.TextNeutral,
  overdue: Colors.TextCritical,
};

export const boxColorForStatus: Record<PaymentStatus, string> = {
  paid: Colors.IconSuccess,
  upcoming: Colors.IconSubdued,
  overdue: Colors.IconCritical,
};

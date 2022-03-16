import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import { Colors, Spacing } from "../utils";

export const CardWallet: React.FC = () => {
  return (
    <ScrollView
      style={{ backgroundColor: Colors.SurfaceBackground }}
      contentContainerStyle={{
        paddingHorizontal: Spacing.defaultMargin,
        paddingVertical: Spacing.defaultMargin,
      }}
    >
      <Installments />
    </ScrollView>
  );
};

const Installments = () => {
  return (
    <View>
      <Text style={{ fontSize: 30, fontWeight: "600", letterSpacing: 0.5 }}>
        Installments
      </Text>

      {/* Order Summary */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: Spacing.l,
        }}
      >
        <View>
          <Text style={{ fontWeight: "500", fontSize: 16, marginBottom: 5 }}>
            Order #12345
          </Text>
          <Text style={{ color: Colors.TextSubdued }}>Wazo Furniture</Text>
        </View>
        <Image
          source={{
            uri: "https://cdn.pixabay.com/photo/2016/09/16/15/56/manhattan-1674404_960_720.jpg",
          }}
          style={{ width: 60, height: 60, borderRadius: 10 }}
        />
      </View>

      {/* Payment progress bar */}
      <InstallmentProgress />

      {/* Payments */}
      <View style={{ marginVertical: Spacing.l }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: Spacing.m,
          }}
        >
          <Text style={{ fontWeight: "500", fontSize: 22, letterSpacing: 0.5 }}>
            Payments
          </Text>
          <Text
            style={{
              color: Colors.TextInteractive,
              fontSize: 18,
              fontWeight: "500",
            }}
          >
            Manage
          </Text>
        </View>

        {PAYMENTS.map((payment, index) => {
          return (
            <PaymentRow
              key={index}
              payment={payment}
              index={index}
              installmentCount={PAYMENTS.length}
            />
          );
        })}
      </View>

      {/* Loan details */}
      <View style={{ marginVertical: Spacing.l }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "500",
            letterSpacing: 0.5,
            marginBottom: Spacing.l,
          }}
        >
          Loan details
        </Text>
        <LoanDetailRow title="Loan ID" value="AA1A-B22B" />
        <LoanDetailRow title="Order total" value="$1,806.87" />
        <LoanDetailRow title="APR" value="10.00%" />
        <LoanDetailRow title="Total interest" value="$180.69" />
        <LoanDetailRow title="Total of payments" value="$1,987.56" />
      </View>
    </View>
  );
};

const InstallmentProgress = () => {
  const paidAmount = 496.89;
  const totalAmount = 1987.56;

  return (
    <View style={{ marginVertical: Spacing.l }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              color: Colors.TextOnSurfaceNeutral,
              fontSize: 16,
              marginBottom: 5,
            }}
          >
            Paid
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "500" }}>$496.89</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              color: Colors.TextOnSurfaceNeutral,
              fontSize: 16,
              marginBottom: 5,
            }}
          >
            Remaining
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "500" }}>$1,490.67</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 10,
          borderRadius: 2,
          marginVertical: Spacing.l,
          backgroundColor: Colors.BorderSubdued,
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 20,
            backgroundColor: Colors.IconSuccess,
          }}
        />
      </View>

      <View>
        <Text style={{ color: Colors.TextOnSurfaceNeutral, fontSize: 16 }}>
          $165.63 scheduled on August 9 · VISA 1234
        </Text>
        <Text
          style={{
            color: Colors.TextInteractive,
            marginTop: 8,
            fontWeight: "600",
          }}
        >
          View loan terms
        </Text>
      </View>
    </View>
  );
};

const PaymentRow = ({
  payment,
  index,
  installmentCount,
}: {
  payment: Payment;
  index: number;
  installmentCount: number;
}) => {
  const [size, setSize] = useState(0);

  let title;
  let subtitle;
  switch (payment.status) {
    case "paid":
      title = payment.paidDate;
      subtitle = `Paid with ${payment.cardTender}`;
      break;
    case "upcoming":
      title = payment.scheduledDate;
      subtitle = `Scheduled on ${payment.cardTender}`;
      break;
    case "overdue":
      title = payment.scheduledDate;
      subtitle = `Due 7 days ago`;
      break;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
      }}
      onLayout={(e) => {
        setSize(e.nativeEvent.layout.height);
      }}
    >
      {/* Box payment status indicator */}
      <View
        style={{
          marginRight: Spacing.l,
        }}
      >
        {index > 0 ? (
          <View
            style={{
              position: "absolute",
              bottom: 18,
              left: 9,
              height: size / 2 - 9,
              width: 1,
              backgroundColor: Colors.Border,
            }}
          />
        ) : null}
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 3,
            backgroundColor: boxColorForStatus[payment.status],
          }}
        />
        {index < installmentCount - 1 ? (
          <View
            style={{
              position: "absolute",
              top: 18,
              left: 9,
              height: size / 2 - 9,
              width: 1,
              backgroundColor: Colors.Border,
            }}
          />
        ) : null}
      </View>

      {/* Payment summary content */}
      <View
        style={{
          flexShrink: 1,
          //   backgroundColor: "pink",
        }}
      >
        <Text
          style={{
            color:
              payment.status === "overdue"
                ? Colors.TextCritical
                : Colors.TextNeutral,
            fontSize: 17,
            letterSpacing: 0.2,
            marginBottom: 5,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color:
              payment.status === "overdue"
                ? Colors.TextCritical
                : Colors.TextSubdued,
            fontSize: 15,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <View
        style={{
          flexGrow: 1,
          alignItems: "flex-end",
          //   backgroundColor: "orange",
        }}
      >
        <Text
          style={{
            color: amountColorForStatus[payment.status],
            fontWeight: payment.status === "paid" ? undefined : "500",
            fontSize: 17,
          }}
        >{`$${payment.amount}`}</Text>
      </View>
    </View>
  );
};

const LoanDetailRow = ({ title, value }: { title: string; value: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Spacing.m,
      }}
    >
      <Text style={{ color: Colors.TextSubdued, fontSize: 17 }}>{title}</Text>
      <Text style={{ fontWeight: "500", fontSize: 17 }}>{value}</Text>
    </View>
  );
};

type PaymentStatus = "paid" | "upcoming" | "overdue";
interface Payment {
  paidDate: string;
  scheduledDate: string;
  cardTender: string;
  amount: number;
  status: PaymentStatus;
}

const PAYMENTS: Payment[] = [
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
];

const amountColorForStatus: Record<PaymentStatus, string> = {
  paid: Colors.TextSubdued,
  upcoming: Colors.TextNeutral,
  overdue: Colors.TextCritical,
};

const boxColorForStatus: Record<PaymentStatus, string> = {
  paid: Colors.IconSuccess,
  upcoming: Colors.IconSubdued,
  overdue: Colors.IconCritical,
};

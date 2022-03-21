import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
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
      <CardCarousel />
      <Installments />
    </ScrollView>
  );
};

const CardCarousel = () => {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <View style={{ marginBottom: Spacing.l }}>
      <Text style={{ fontSize: 30, fontWeight: "600", letterSpacing: 0.5 }}>
        Cards
      </Text>
      <Animated.ScrollView
        style={{
          marginTop: Spacing.l,
          marginBottom: Spacing.xl,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToOffsets={SNAP_OFFSETS}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {CARDS.map((_, index) => {
          return <Card key={index} index={index} scrollX={scrollX} />;
        })}
      </Animated.ScrollView>
    </View>
  );
};

const CARDS = [
  { card: require("./assets/card1.png") },
  { card: require("./assets/card2.png") },
  { card: require("./assets/card3.png") },
  { card: require("./assets/card4.png") },
  { card: require("./assets/card5.png") },
  { card: require("./assets/card6.png") },
];

const WIDTH = Dimensions.get("window").width;
const PAGE_PADDING = 2 * Spacing.defaultMargin;

const RATIO = 228 / 362;
const CARD_WIDTH = (WIDTH - PAGE_PADDING) * 0.8;
const CARD_HEIGHT = CARD_WIDTH * RATIO;

const CARD_MARGIN = 0;
const EMPTY_OFFSET = (WIDTH - PAGE_PADDING - CARD_WIDTH - CARD_MARGIN) / 2;

const SNAP_OFFSETS = CARDS.map(
  (_, index) => index * (CARD_WIDTH + CARD_MARGIN)
);

const Card = ({
  index,
  scrollX,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const aStyle = useAnimatedStyle(() => {
    // Need to provide valid values for array boundaries (i.e. index=0 and index=length-1)
    // If we don't, then the app will crash since it will be interpolating an undefined range/value
    const inputRange = [
      index === 0 ? CARD_WIDTH * (index - 1) : SNAP_OFFSETS[index - 1],
      SNAP_OFFSETS[index],
      index === CARDS.length - 1
        ? CARD_WIDTH * (index + 1)
        : SNAP_OFFSETS[index + 1],
    ];

    const scale = 0.8;
    const translateX = (CARD_WIDTH - CARD_WIDTH * scale) / 2 + 30;
    const translateY = (CARD_HEIGHT - CARD_HEIGHT * scale) / 2 - 10;

    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            inputRange,
            [-translateX, 0, translateX],
            Extrapolate.CLAMP
          ),
        },
        {
          translateY: interpolate(
            scrollX.value,
            inputRange,
            [translateY, 0, translateY],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            [scale, 1, scale],
            Extrapolate.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolate.CLAMP
      ),
      zIndex: interpolate(
        scrollX.value,
        inputRange,
        [0, 2, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <Animated.View style={aStyle}>
      <Image
        source={CARDS[index].card}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          marginLeft: index === 0 ? EMPTY_OFFSET : 0,
          marginRight:
            index === CARDS.length - 1
              ? EMPTY_OFFSET + CARD_MARGIN
              : CARD_MARGIN,
        }}
      />
    </Animated.View>
  );
};

const Installments = () => {
  return (
    <View>
      <Text style={{ fontSize: 30, fontWeight: "600", letterSpacing: 0.5 }}>
        Installments
      </Text>
      <OrderSummary />
      <InstallmentProgress />
      <Payments />
      <LoanDetails />
    </View>
  );
};

const InstallmentProgress = () => {
  const progressWidth = useSharedValue(0);

  const paidAmount = 496.89;
  const totalAmount = 1987.56;
  const normalized = paidAmount / totalAmount;
  const progressBarWidth = WIDTH - 2 * Spacing.defaultMargin;
  const paidAmountBarWidth = normalized * progressBarWidth;
  const remainingAmountBarWidth =
    (1 - normalized) * progressBarWidth - Spacing.l;

  useEffect(() => {
    progressWidth.value = withDelay(
      800,
      withTiming(paidAmountBarWidth, { duration: 1000 })
    );
  }, [paidAmountBarWidth, progressWidth]);

  const progressIndicatorAStyle = useAnimatedStyle(() => {
    return {
      width: progressWidth.value,
    };
  });

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
          flexDirection: "row",
          alignItems: "center",
          height: 10,
          marginVertical: Spacing.l,
        }}
      >
        <View
          style={{
            width: paidAmountBarWidth,
            height: 10,
            borderRadius: 2,
            backgroundColor: Colors.BorderSubdued,
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                backgroundColor: Colors.IconSuccess,
              },
              progressIndicatorAStyle,
            ]}
          />
        </View>

        <View
          style={{
            width: remainingAmountBarWidth,
            height: 10,
            marginLeft: Spacing.l,
            backgroundColor: Colors.BorderSubdued,
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

const Payments = () => {
  const { viewState } = usePayments(PAYMENTS);

  return (
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
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          Manage
        </Text>
      </View>

      {viewState.map((state, index) => {
        let child;
        switch (state.type) {
          case "content": {
            child = (
              <PaymentRow
                payment={state.data}
                index={index}
                installmentCount={viewState.length}
              />
            );
            break;
          }
          case "action": {
            child = (
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10,
                  marginLeft: 2.5,
                }}
                onPress={state.onPress}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={15}
                  color={Colors.Border}
                />
                <Text
                  style={{
                    color: Colors.TextInteractive,
                    fontSize: 13,
                    marginLeft: 16,
                  }}
                >
                  {state.title}
                </Text>
              </Pressable>
            );
          }
        }
        return <React.Fragment key={index}>{child}</React.Fragment>;
      })}
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
      <View style={{ flexShrink: 1 }}>
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
      <View style={{ flexGrow: 1, alignItems: "flex-end" }}>
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

const OrderSummary = () => {
  return (
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
  );
};

const LoanDetails = () => {
  return (
    <View style={{ marginVertical: Spacing.s }}>
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

/* Models and Helpers */

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

const usePayments = (payments: Payment[]) => {
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

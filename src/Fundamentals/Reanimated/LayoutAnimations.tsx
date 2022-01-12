/**
 * In React Native, every component appears instantly whenever we add it to the render tree / component hierarchy.
 * Layout Animations allow us to animate:
 *  - component's appearance
 *  - component's disappearance
 *  - component's layout whenever it changes
 *
 * Common practice is during unmounting of a component - rather than simply disappearing in the next render cycle,
 * we can beautify this process using built-in Exiting Animations
 *
 * Let's work through a Todos app example, where we animate 'adding' and 'removing' a todo item
 */

import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  FlatList,
  FlatListProps,
} from "react-native";
import Animated, {
  Layout,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<string>>(FlatList);

export const LayoutAnimations_Todos: React.FC = () => {
  const [todos, setTodos] = useState<string[]>([]);

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      return (
        <Todo
          title={item}
          index={index}
          onDelete={(index) =>
            setTodos((todos) => {
              const filtered = todos.filter((_, i) => i !== index);
              return filtered;
            })
          }
          showDivider={index < todos.length - 1}
        />
      );
    },
    [todos.length]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 
    - There is a bug where using FlatList or Animated.FlatList is not causing layout transition property to not work properly
    - https://github.com/software-mansion/react-native-reanimated/issues/2703
    - Though on GitHub, some people are saying that it's working for them. I can only surmise that the difference 
    - in RN version v64 vs v66 might be the culprit, but who knows? 

      <AnimatedFlatList
        itemLayoutAnimation={Layout.springify()}
        contentContainerStyle={{ height: "100%" }}
        keyExtractor={(item, index) => item + index}
        data={todos}
        renderItem={renderItem}
      />
      */}

      <ScrollView>
        {todos.map((item, index) => {
          return (
            <Todo
              key={item}
              title={item}
              index={index}
              onDelete={(index) =>
                setTodos((todos) => {
                  const filtered = todos.filter((_, i) => i !== index);
                  return filtered;
                })
              }
              showDivider={index < todos.length - 1}
            />
          );
        })}
      </ScrollView>
      <Footer onAdd={(newTodo) => setTodos((todos) => [...todos, newTodo])} />
    </SafeAreaView>
  );
};

/**
 * This component is the MAIN part of Layout Animations!!
 */
const Todo = ({
  title,
  index,
  onDelete,
  showDivider,
}: {
  title: string;
  index: number;
  onDelete: (index: number) => void;
  showDivider: boolean;
}) => {
  const onPress = useCallback(() => {
    onDelete(index);
  }, [index, onDelete]);

  return (
    <Animated.View
      entering={SlideInLeft.delay(index * 50)}
      exiting={SlideOutLeft}
      layout={Layout.springify()}
    >
      <View style={styles.todoContainer}>
        <Text>{title}</Text>
        <Pressable style={styles.removeButton} onPress={onPress}>
          <Text style={{ color: "magenta" }}>Remove</Text>
        </Pressable>
      </View>
      {showDivider && <View style={styles.divider} />}
    </Animated.View>
  );
};

const Footer = ({ onAdd }: { onAdd: (todo: string) => void }) => {
  return (
    <View style={styles.footerContainer}>
      <Text>Add random new todo</Text>
      <Pressable
        onPress={() => onAdd(`New todo ${Math.floor(Math.random() * 100)}`)}
      >
        <Text style={{ color: "indigo" }}>Add</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  todoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(216, 192, 204, 0.8)",
  },
  removeButton: {
    flexGrow: 1,
    alignItems: "flex-end",
  },
  divider: {
    height: 1,
    backgroundColor: "#252525",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(203, 197, 200, 0.8)",
  },
});

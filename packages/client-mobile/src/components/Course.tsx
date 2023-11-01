import { View, Text, StyleSheet } from 'react-native';

type CourseProps = {
  name: string;
  duration: number;
  startingTime: string;
  endingTime: string;
};

const Course: React.FC<CourseProps> = ({
  name,
  duration,
  startingTime,
  endingTime,
}) => {
  const { container } = styles;

  return (
    <View style={container}>
      <Text>{name}</Text>
      <Text>{duration}</Text>
      <Text>{startingTime}</Text>
      <Text>{endingTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
  },
});

export default Course;

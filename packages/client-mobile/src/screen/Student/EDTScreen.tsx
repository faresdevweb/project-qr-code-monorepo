import { StyleSheet, Text, View } from 'react-native';
import { useStudent } from '../../../hooks/useStudent';
import { AuthStore } from '../../../store/auth';
import Course from '../../components/Course';

const EDTScreen = () => {
  const { tokenJWT } = AuthStore();
  const { edt } = useStudent(tokenJWT);

  const { header, coursesContainer } = styles;

  return (
    <View>
      <Text style={header}>Emploi du temps</Text>
      <View style={coursesContainer}>
        {edt &&
          edt.map((course: any) => {
            return (
              <Course
                key={course.id}
                name={course.name}
                duration={course.duration}
                startingTime={course.startTime}
                endingTime={course.endTime}
              />
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    marginTop: 10,
  },
  coursesContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default EDTScreen;

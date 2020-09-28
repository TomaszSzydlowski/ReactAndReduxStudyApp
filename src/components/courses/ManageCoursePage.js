import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loadCourses, saveCourses } from '../../redux/actions/courseActions';
import { loadAuthors } from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import CourseForm from './CourseForm';
import { newCourse } from '../../../tools/mockData';

function ManageCoursePage({ courses, authors, loadCourses, loadAuthors, saveCourse, history, ...props }) {
  const [ course, setCourse ] = useState({ ...props.course });
  const [ errors, setErrors ] = useState({});

  useEffect(
    () => {
      if (courses.length === 0) {
        loadCourses().catch((error) => {
          alert('Loading courses failed' + error);
        });
      } else {
        setCourse({ ...props.course });
      }

      if (authors.length === 0) {
        loadAuthors().catch((error) => {
          alert('Loading authors failed' + error);
        });
      }
    },
    [ props.course ]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse((prevCourse) => ({
      [name]: name === 'authorId' ? parseInt(value, 10) : value
    }));
  }

  function handleSave(event) {
    event.prevDefault();
    saveCourse(course).then(() => {
      history.push('/courses');
    });
  }

  return <CourseForm course={course} error={errors} authors={authors} onChange={handleChange} onSave={handleSave} />;
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveCourses: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

function getCourseBySlug(courses, slug) {
  return courses.find((course) => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
  const { slug } = ownProps.match.params;
  const course = slug && state.courses.length > 0 ? getCourseBySlug(state.courses, slug) : newCourse;
  return {
    course,
    courses: state.courses,
    authors: state.authors
  };
}

const mapDispatchToProps = {
  loadCourses,
  saveCourses,
  loadAuthors
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);

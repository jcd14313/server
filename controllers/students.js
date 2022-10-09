// Utils
const Utils = require("../utils");
const { validationResult } = require("express-validator");

// Model
const Student = require("../models/student-model");

exports.allStudents = async (req, res) => {
  try {
    const students = await Student.find();

    return res.status(200).json({
      success: true,
      hasError: false,
      students: students,
    });
  } catch (err) {
    return res.status(500).json({
      hasError: true,
      errors: err.message,
      success: false,
    });
  }
};

exports.getStudentByid = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    return res.status(200).json({
      success: true,
      hasError: false,
      student: student,
    });
  } catch (err) {
    return res.status(500).json({
      hasError: true,
      errors: err.message,
      success: false,
    });
  }
};

exports.createStudent = async (req, res) => {
  const { id, firstName, lastName, email, dob } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const arrErr = Utils.FormatErrors(errors);
    return res
      .status(400)
      .json({ hasError: true, errors: arrErr, success: false });
  }

  const data = {
    id,
    firstName,
    lastName,
    email,
    dob,
  };

  try {
    const student = new Student(data);
    const saveStudent = await student.save();
    return res.status(200).json({
      message: "Student successfully save!",
      success: true,
      hasError: false,
      student: saveStudent,
    });
  } catch (err) {
    return res.status(500).json({
      hasError: true,
      errors: err.message,
      success: false,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(400).json({
        hasError: true,
        errors: "Student doesn't exist",
        success: false,
      });
    }
    Object.assign(student, req.body);
    const updatedStudent = await student.save();
    return res.status(200).json({
      message: "Student successfully updated!",
      success: true,
      hasError: false,
      student: updatedStudent,
    });
  } catch (err) {
    return res.status(500).json({
      hasError: true,
      errors: err.message,
      success: false,
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(400).json({
        hasError: true,
        errors: "Student doesn't exist",
        success: false,
      });
    }
    await student.remove();
    return res.status(200).json({
      message: "Student successfully deleted!",
      success: true,
      hasError: false,
    });
  } catch (err) {
    return res.status(500).json({
      hasError: true,
      errors: err.message,
      success: false,
    });
  }
};

// Generates human-readable IDs
const generateStudentId = (regNumber, className) => {
  const year = new Date().getFullYear().toString().slice(-2);
  return `STU${year}${className}${regNumber.slice(-4).toUpperCase()}`;
};

const generateEmployeeId = (role, name) => {
  const prefix = role === 'teacher' ? 'TCH' : 'MGT';
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${year}${rand}`;
};

module.exports = { generateStudentId, generateEmployeeId };

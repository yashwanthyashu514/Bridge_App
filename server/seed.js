require('dotenv').config();
const mongoose = require('mongoose');

// Models
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const Attendance = require('./models/Attendance');
const Calendar = require('./models/Calendar');
const Fees = require('./models/Fees');
const Marks = require('./models/Marks');
const Timetable = require('./models/Timetable');

const MONGO_URI = process.env.MONGO_URI;

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        // 1. Clear existing data
        console.log('Clearing old data...');
        await User.deleteMany({});
        await Announcement.deleteMany({});
        await Attendance.deleteMany({});
        await Calendar.deleteMany({});
        await Fees.deleteMany({});
        await Marks.deleteMany({});
        await Timetable.deleteMany({});

        // 2. Create Users
        console.log('Creating Users...');
        
        // Admin
        const admin = await User.create({
            name: 'Principal Office',
            email: 'college@gmail.com',
            password: 'college@123',
            role: 'admin'
        });

        // Teachers
        const teachers = await User.create([
            {
                name: 'Dr. Ramesh Kumar',
                email: 'ramesh@teacher.com',
                password: 'password123',
                role: 'teacher',
                designation: 'HOD Physics',
                subject: 'Physics',
                employeeId: 'TCH001',
                assignedClass: '12',
                isClassTeacher: true
            },
            {
                name: 'Mrs. Anita Sharma',
                email: 'anita@teacher.com',
                password: 'password123',
                role: 'teacher',
                designation: 'Senior Lecturer',
                subject: 'Mathematics',
                employeeId: 'TCH002',
                assignedClass: '11',
                isClassTeacher: true
            }
        ]);

        // Students
        const students = await User.create([
            {
                name: 'Aditya Singh',
                email: 'aditya@student.com',
                password: 'password123',
                role: 'student',
                regNumber: 'REG2024001',
                class: '12',
                section: 'A',
                gender: 'Male',
                studentId: 'STU2024001',
                status: 'approved',
                parentMobile: '9876543210',
                parentWhatsapp: '9876543210'
            },
            {
                name: 'Priya Verma',
                email: 'priya@student.com',
                password: 'password123',
                role: 'student',
                regNumber: 'REG2024002',
                class: '12',
                section: 'A',
                gender: 'Female',
                studentId: 'STU2024002',
                status: 'approved',
                parentMobile: '9876543211',
                parentWhatsapp: '9876543211'
            },
            {
                name: 'Rahul Dravid',
                email: 'rahul@student.com',
                password: 'password123',
                role: 'student',
                regNumber: 'REG2024003',
                class: '11',
                section: 'B',
                gender: 'Male',
                studentId: 'STU2024003',
                status: 'approved',
                parentMobile: '9876543212',
                parentWhatsapp: '9876543212'
            }
        ]);

        // 3. Announcements
        console.log('Creating Announcements...');
        await Announcement.create([
            {
                title: 'Final Examination Dates',
                description: 'The final examinations for Class 11 and 12 will begin from March 15th, 2024. Detailed timetable is attached.',
                sendTo: ['student', 'parent', 'teacher'],
                createdByRole: 'admin'
            },
            {
                title: 'Cultural Fest 2024',
                description: 'Join us for the annual cultural fest on Friday. Various competitions will be held.',
                sendTo: ['student'],
                createdByRole: 'admin'
            }
        ]);

        // 4. Attendance
        console.log('Creating Attendance...');
        await Attendance.create([
            {
                date: '2024-05-13',
                period: '1',
                session: 'AM',
                class: '12',
                subject: 'Physics',
                teacherId: teachers[0]._id,
                records: [
                    { studentId: students[0]._id, status: 'present' },
                    { studentId: students[1]._id, status: 'absent' }
                ]
            }
        ]);

        // 5. Marks
        console.log('Creating Marks...');
        await Marks.create([
            {
                examName: 'Mid-Term Exam',
                subject: 'Physics',
                class: '12',
                teacherId: teachers[0]._id,
                entries: [
                    { studentId: students[0]._id, marks: 85, maxMarks: 100 },
                    { studentId: students[1]._id, marks: 78, maxMarks: 100 }
                ]
            }
        ]);

        // 6. Fees
        console.log('Creating Fees...');
        await Fees.create([
            {
                studentId: students[0]._id,
                totalFees: 50000,
                paid: 35000,
                balance: 15000,
                history: [
                    { amount: 20000, date: new Date('2024-01-10'), method: 'Online' },
                    { amount: 15000, date: new Date('2024-02-05'), method: 'Cash' }
                ]
            },
            {
                studentId: students[1]._id,
                totalFees: 50000,
                paid: 50000,
                balance: 0,
                status: 'paid'
            }
        ]);

        // 7. Timetable
        console.log('Creating Timetables...');
        await Timetable.create([
            {
                class: '12',
                day: 'Monday',
                slots: [
                    { period: '1', startTime: '09:00', endTime: '10:00', subject: 'Physics', teacherId: teachers[0]._id },
                    { period: '2', startTime: '10:00', endTime: '11:00', subject: 'Mathematics', teacherId: teachers[1]._id }
                ]
            }
        ]);

        // 8. Calendar
        console.log('Creating Calendar Events...');
        await Calendar.create([
            {
                title: 'Republic Day',
                date: new Date('2024-01-26'),
                type: 'holiday',
                description: 'National Holiday'
            },
            {
                title: 'Science Exhibition',
                date: new Date('2024-02-15'),
                type: 'event',
                description: 'Inter-college science competition'
            }
        ]);

        console.log('Database successfully seeded with demo data!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();

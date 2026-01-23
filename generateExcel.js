const ExcelJs = require('exceljs');
const path = require('path');

async function createExcel() {
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
        { header: 'FirstName', key: 'firstName', width: 15 },
        { header: 'LastName', key: 'lastName', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Gender', key: 'gender', width: 10 },
        { header: 'Mobile', key: 'mobile', width: 15 },
        { header: 'DateOfBirth', key: 'dateOfBirth', width: 15 },
        { header: 'Subjects', key: 'subjects', width: 20 },
        { header: 'Hobbies', key: 'hobbies', width: 15 },
        { header: 'Address', key: 'address', width: 30 },
        { header: 'State', key: 'state', width: 15 },
        { header: 'City', key: 'city', width: 15 }
    ];

    worksheet.addRow({
        firstName: 'Alice',
        lastName: 'Wonderland',
        email: 'alice@example.com',
        gender: 'Female',
        mobile: '1234567890',
        dateOfBirth: '15 Mar 2000',
        subjects: 'Maths, English',
        hobbies: 'Reading, Music',
        address: '123 Rabbit Hole',
        state: 'NCR',
        city: 'Delhi'
    });

    worksheet.addRow({
        firstName: 'Bob',
        lastName: 'Builder',
        email: 'bob@example.com',
        gender: 'Male',
        mobile: '9876543210',
        dateOfBirth: '20 Oct 1995',
        subjects: 'Physics, Chemistry',
        hobbies: 'Sports',
        address: '456 Construction Site',
        state: 'Uttar Pradesh',
        city: 'Agra'
    });

    const filePath = path.join(__dirname, 'data', 'formData.xlsx');
    await workbook.xlsx.writeFile(filePath);
    console.log(`Excel file created at ${filePath}`);
}

createExcel();

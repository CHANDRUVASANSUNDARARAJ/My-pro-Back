/*
 * Trinom Digital Pvt Ltd ("COMPANY") CONFIDENTIAL                             *
 * Copyright (c) 2023 Trinom Digital Pvt Ltd, All rights reserved              *
 *                                                                             *
 * NOTICE:  All information contained herein is, and remains the property      *
 * of COMPANY. The intellectual and technical concepts contained herein are    *
 * proprietary to COMPANY and may be covered by Indian and Foreign Patents,    *
 * patents in process, and are protected by trade secret or copyright law.     *
 * Dissemination of this information or reproduction of this material is       *
 * strictly forbidden unless prior written permission is obtained from         *
 * COMPANY. Access to the source code contained herein is hereby forbidden     *
 * to anyone except current COMPANY employees, managers or contractors who     *
 * have executed Confidentiality and Non-disclosure agreements explicitly      *
 * covering such access.                                                       *
 *                                                                             *
 * The copyright notice above does not evidence any actual or intended         *
 * publication or disclosure of this source code, which includes               *
 * information that is confidential and/or proprietary, and is a trade secret, *
 * of COMPANY. ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC            *
 * PERFORMANCE, OR PUBLIC DISPLAY OF OR THROUGH USE OF THIS SOURCE CODE        *
 * WITHOUT THE EXPRESS WRITTEN CONSENT OF COMPANY IS STRICTLY PROHIBITED,      *
 * AND IN VIOLATION OF APPLICABLE LAWS AND INTERNATIONAL TREATIES. THE         *
 * RECEIPT OR POSSESSION OF THIS SOURCE CODE AND/OR RELATED INFORMATION DOES   *
 * NOT CONVEY OR IMPLY ANY RIGHTS TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS     *
 * CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT MAY DESCRIBE,    *
 * IN WHOLE OR IN PART.                                                        *
 *                                                                             *
 * File: \app.js                                                               *
 * Project: back                                                               *
 * Created Date: Thursday, December 14th 2023, 11:22:43 pm                     *
 * Author:  CHANDRUVASAN S <chandruvasan@codestax.ai>                          *
 * -----                                                                       *
 * Last Modified: December 15th 2023, 12:18:03 am                              *
 * Modified By:  CHANDRUVASAN S                                                *
 * -----                                                                       *
 * Any app that can be written in JavaScript,                                  *
 *     will eventually be written in JavaScript !!                             *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date         By  Comments                                                   *
 * --------------------------------------------------------------------------- *
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Add this line
const AWS = require('aws-sdk');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json()); // Add this line

// Simulated in-memory database (replace with DynamoDB in a real project)
const students = [];

// Configure AWS SDK with DynamoDB endpoint
AWS.config.update({
  region: 'localhost',
  endpoint: 'http://localhost:8003',
  accessKeyId: '123456789', // Replace with your DynamoDB Local access key
  secretAccessKey: '123456789' // Replace with your DynamoDB Local secret key
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Endpoint to register a student
app.post('/api/register', async (req, res) => {
  console.log(req.body);
  const newStudent = req.body;
  console.log(typeof(req.body.Student_ID));
  students.push(newStudent);
  // Save the student data to DynamoDB
  const params = {
    TableName: 'Student_Table1', // Use the correct table name
    Item: newStudent,
  };

  try {
    await dynamoDB.put(params).promise();
    console.log('New student registered:', newStudent);
    res.json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Error registering student in DynamoDB', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get all registered students
app.get('/api/students', async (req, res) => {
  try {
    const scanResult = await dynamoDB.scan({ TableName: 'Student_Details' }).promise(); // Use the correct table name
    const studentList = scanResult.Items;
    res.json(studentList);
  } catch (error) {
    console.error('Error fetching students from DynamoDB', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new endpoint to get all registered students
app.get('/api/registeredStudents', async (req, res) => {
    try {
      const scanResult = await dynamoDB.scan({ TableName: 'Student_Table1' }).promise();
      const studentList = scanResult.Items;
      res.json(studentList);
    } catch (error) {
      console.error('Error fetching registered students from DynamoDB', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

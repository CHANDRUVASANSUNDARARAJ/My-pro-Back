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
 * File: \scantable.js                                                         *
 * Project: back                                                               *
 * Created Date: Friday, December 15th 2023, 1:56:07 pm                        *
 * Author:  CHANDRUVASAN S <chandruvasan@codestax.ai>                          *
 * -----                                                                       *
 * Last Modified:                                                              *
 * Modified By:                                                                *
 * -----                                                                       *
 * Any app that can be written in JavaScript,                                  *
 *     will eventually be written in JavaScript !!                             *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date         By  Comments                                                   *
 * --------------------------------------------------------------------------- *
 */

const express = require('express');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

// Set the region to 'localhost' and port to 8000 for DynamoDB Local
AWS.config.update({
  region: 'localhost',
  endpoint: 'http://localhost:8003',
  accessKeyId: '123456789', // Replace with your DynamoDB Local access key
  secretAccessKey: '123456789' // Replace with your DynamoDB Local secret key
});

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB();

// Specify the table name
const tableName = 'Student_Table1';

// Define the scan parameters
const scanParams = {
  TableName: tableName
};

// API endpoint to scan the DynamoDB table
app.get('/api/scanTable', (req, res) => {
  dynamodb.scan(scanParams, (err, data) => {
    if (err) {
      console.error('Unable to scan table. Error JSON:', JSON.stringify(err, null, 2));
      res.status(500).json({ error: 'Unable to scan table.' });
    } else {
      console.log('Scan succeeded. Data:', JSON.stringify(data.Items, null, 2));
      // Send the data in JSON format with indentation for beautification
      res.json({ data: JSON.parse(JSON.stringify(data.Items, null, 2)) });
    }
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

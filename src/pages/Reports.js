import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Reports = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    axios.get('/reports/sales/daily')
      .then(res => setReport(res.data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Daily Sales Report</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>₹{r.totalSales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;

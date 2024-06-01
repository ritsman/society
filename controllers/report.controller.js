import { pool } from "../mysql/mysql.js";

export const getSql = async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).send("start_date and end_date are required.");
  }

  const query = "SELECT * FROM your_table WHERE date_column BETWEEN ? AND ?";

  const values = [startDate, endDate];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }

    res.json(results);
  });
};

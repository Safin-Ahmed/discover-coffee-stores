import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (!id) return res.json({ message: "Coffee store id is required" });
      const records = await findRecordByFilter(id);
      if (records.length != 0) {
        const record = records[0];
        const calculateVoting = parseInt(record.voting) + parseInt(1);

        // Update a Record
        const updateRecord = await table.update([
          {
            id: record.recordId,
            fields: {
              voting: calculateVoting,
            },
          },
        ]);

        if (updateRecord) {
          const minifiedRecord = getMinifiedRecords(updateRecord);
          res.json({ minifiedRecord });
        }
      } else {
        res.json({ message: "Coffee store id doesn't exist", id });
      }
    } catch (e) {
      res.status(500).json({ message: "Error upvoting coffee store", e });
    }
  }
};

export default favouriteCoffeeStoreById;

import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

console.log({ table });

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
    try {
      if (!id) {
        return res.status(400).json({ message: "Id is missing" });
      }
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        return res.json(records);
      } else {
        // Create a record
        if (id && name) {
          const createRecords = await table.create([
            {
              fields: {
                id,
                name,
                address,
                neighbourhood,
                voting,
                imgUrl,
              },
            },
          ]);

          const records = getMinifiedRecords(createRecords);
          res.json({ records });
        } else {
          res.status(400);
          res.json({ message: "Id or name is missing" });
        }
      }
    } catch (e) {
      console.error("Error finding store", e);
      res.status(500);
      res.json({ message: "Error finding store", e });
    }
  }
};
export default createCoffeeStore;

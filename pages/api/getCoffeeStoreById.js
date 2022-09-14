import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      return res.json({ message: "id is missing!" });
    }
    const records = await findRecordByFilter(id);

    if (records.length !== 0) {
      res.json(records);
    } else {
      res.json({ message: `id could not be found` });
    }
    res.json({ message: `id is created ${id}` });
  } catch (e) {
    res.status(500).json({ message: "Something Went Wrong", error: e });
  }
};

export default getCoffeeStoreById;

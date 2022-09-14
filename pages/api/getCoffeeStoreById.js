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
      return res.json(records);
    } else {
      return res.json({ message: `id could not be found` });
    }
  } catch (e) {
    return res.status(500).json({ message: "Something Went Wrong", error: e });
  }
};

export default getCoffeeStoreById;

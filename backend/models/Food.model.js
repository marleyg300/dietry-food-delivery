import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  nutritional_value: { type: String, required: true },
  ingredients: { type: [String], required: true },
  dietary_restrictions: {
    type: String,
    enum: [
      "Hypertension",
      "Diabetes",
      "Lactose Intolerance",
      "Vegan",
      "High Protein Diet",
      "Anti Inflammatory Diet",
      "Celiac Disease",
      "Renal Diet",
      "Ulcers Diet",
    ],
    required: true,
  },
  type: {
    type: String,
    enum: ["breakfast", "lunch", "supper", "snack"],
    required: true,
  },
});

const Food = mongoose.model("Food", foodSchema);
export default Food;

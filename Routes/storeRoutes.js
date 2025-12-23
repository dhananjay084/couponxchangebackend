import express from "express";
import {
  createStore,
  getStores,
  updateStore,
  deleteStore,
  getStoreById
} from "../Controllers/storeController.js";

const router = express.Router();

router.route("/")
  .post(createStore)
  .get(getStores);

router.route("/:id")
.get(getStoreById) // Add this line
  .put(updateStore)
  .delete(deleteStore);

export default router;

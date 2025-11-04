import express from "express";
import {
  createStore,
  getStores,
  updateStore,
  deleteStore,
} from "../Controllers/storeController.js";

const router = express.Router();

router.route("/")
  .post(createStore)
  .get(getStores);

router.route("/:id")
  .put(updateStore)
  .delete(deleteStore);

export default router;

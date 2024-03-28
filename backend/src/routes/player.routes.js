import { Router } from "express";
import { registerPlayer,loginPlayer , addPokemon , getDeck} from "../controllers/player.controller.js";
const router=Router();

router.post("/register",registerPlayer);
router.post("/login", loginPlayer);
router.post("/add-to-party", addPokemon);
router.post("/get-pokemon-info" , getDeck)

export default router;
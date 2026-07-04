// src/services/noteService.js
import { createCollectionService } from "./firestoreService";
import { COLLECTIONS } from "../utils/constants";

export const noteService = createCollectionService(COLLECTIONS.NOTES);

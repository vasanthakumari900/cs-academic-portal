// src/services/feedbackService.js
import { createCollectionService } from "./firestoreService";
import { COLLECTIONS } from "../utils/constants";

export const feedbackService = createCollectionService(COLLECTIONS.PLACEMENT_FEEDBACK);
